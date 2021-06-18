import React, { Component } from 'react';
import './Category.css';
import Server from './Server.js'
import axios from 'axios'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { withRouter, Route, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { SelectButton } from 'primereact/selectbutton';
import { ToggleButton } from 'primereact/togglebutton';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

import Header1 from './Header1.js'
import Footer from './Footer.js'
import ShowProduct from './ShowProduct.js'
import { Sidebar } from 'primereact/sidebar';
import { ListBox } from 'primereact/listbox';


import Header2 from './Header2.js'
const justifyTemplate = (option) => {
    return <i className={option.icon}></i>;
}
class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.getProducts = this.getProducts.bind(this);
        this.toast = React.createRef();
        this.onHide = this.onHide.bind(this);
        this.state = {
            id: this.props.location.search.split("&cat=")[1] ? this.props.location.search.split("id=")[1].split("&cat")[0] : this.props.location.search.split("id=")[1],
            cat: this.props.location.search.split("&cat=")[1] ? this.props.location.search.split("&cat=")[1] : 'All',
            GridData: [],
            layout: 'list',
            PId: null,
            Exist: false,
            goToLogin:false,
            CartItems: [],
            AllowSale: true,
            loading:1,
            SortOptions: [{ name: 'جدیدترین', value: 1 }, { name: 'ارزانترین', value: 2 }, { name: 'گرانترین', value: 3 }, { name: 'سریعترین ارسال', value: 4 }],
            layoutList : [
                            {icon: 'fas fa-th', value: 'grid'},
                            {icon: 'fas fa-th-list', value: 'list'}
                        ],
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }
        this.itemTemplate = this.itemTemplate.bind(this);

    }
    componentDidMount() {
        this.setState({
            loading:true
        })
        this.getPics();

    }
    getPics(l, type) {
        let that = this;
        axios.post(this.state.url + 'getPics', {})
          .then(response => {
            response.data.result.map(function (item, index) {
              
              if (item.name == "file13"){
                that.setState({
                  loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
                })
              }
                  
            })
            this.getSettings();      
        })
          .catch(error => {
            this.getSettings();      
        })
    
    }
    getSettings() {
        let that = this;
        that.Server.send("AdminApi/getSettings", {}, function (response) {

            if (response.data.result) {
                that.setState({
                    ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
                    SaleFromMultiShops: response.data.result[0] ? response.data.result[0].SaleFromMultiShops : false
                })
            }
            axios.post(that.state.url + 'checktoken', {
                token: localStorage.getItem("api_token")
            }).then(response => {

                that.setState({
                    UId: response.data.authData.userId
                })
                that.getProducts({ Exist: false ,first:true});
            }).catch(error => {
                that.getProducts({ Exist: false ,first:true});
            })
        }, function (error) {
        })


    }
    getProducts(p) {

        let that = this;
        let param = {
            id: this.state.id,
            token: localStorage.getItem("api_token"),
            Exist: p.Exist,
            UId: this.state.UId,
            Sort: p.Sort
        };
        let SCallBack = function (response) {

            let category_ids = [];
            for (let i = 0; i < response.data.result.length; i++) {
                category_ids.push(response.data.result[i].category_id)
            }
            category_ids = category_ids.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            })
            let shop = response.data.extra ? response.data.extra.shop[0] : null;
            if (response.data.extra.shop) {
                let extra = response.data.extra;
                let OpenedTime = (extra && extra.shop[0].OpenedTime) ? (extra.shop[0].OpenedTime[extra.WeekDay] ? extra.shop[0].OpenedTime[extra.WeekDay]["day" + (parseInt(extra.WeekDay) + 1)] : null) : null;
                let Time1 = "00:00";
                let Time2 = "24:00";
                let Time3 = "00:00";
                let Time4 = "24:00";
                if (OpenedTime) {
                    Time1 = (OpenedTime && OpenedTime[0]) ? OpenedTime[0] : "00:00";
                    Time2 = (OpenedTime && OpenedTime[1]) ? OpenedTime[1] : "24:00";
                    Time3 = (OpenedTime && OpenedTime[2]) ? OpenedTime[2] : "00:00";
                    Time4 = (OpenedTime && OpenedTime[3]) ? OpenedTime[3] : "24:00";
                }
                let PeykInfo;
                if (extra) {
                    const SellerInfo = extra.shop;
                    const UserInfo = extra.user;
                    const CatInfo = extra.category;
                    PeykInfo = [{ city: SellerInfo[0]?.city, subCity: SellerInfo[0]?.subCity, SelectedSubCities: SellerInfo[0]?.SelectedSubCities, SendToCity: SellerInfo[0]?.SendToCity, SendToState: SellerInfo[0]?.SendToState, SendToCountry: SellerInfo[0]?.SendToCountry, SendToNearCity: SellerInfo[0]?.SendToNearCity, FreeInExpensive: SellerInfo[0]?.FreeInExpensive },
                    {},
                    { city: UserInfo[0]?.city, subCity: UserInfo[0]?.subCity }];

                }
                that.setState({
                    GridDataOriginal: response.data.result,
                    GridData: response.data.result,
                    shop: shop,
                    PrepareTime: that.state.ProductBase ? '' : response.data.extra.shop[0].PrepareTime,
                    Time1: Time1,
                    Time2: Time2,
                    Time3: Time3,
                    Time4: Time4,
                    ShopIsOpen: extra.shop[0].Opened,
                    PeykInfo: PeykInfo,
                    InTime: ((Time1 <= extra.Time && extra.Time <= Time2) || (Time3 <= extra.Time && extra.Time <= Time4))
                })
            } else {
                that.setState({
                    GridDataOriginal: response.data.result,
                    GridData: response.data.result,
                    shop: shop
                })
            }

            if (!that.state.ShopIsOpen && p.first) {
                that.toast.current.show({ severity: 'error', summary: 'فروشگاه بسته است', detail: <div>امکان خرید از این فروشگاه وجود ندارد</div>, life: 8000 });
            }
            if (!that.state.InTime && p.first) {
                if ((that.state.Time1 == "00:00" && that.state.Time2 == "00:00") && (that.state.Time3 == "00:00" && that.state.Time4 == "00:00")) {
                    that.toast.current.show({ severity: 'warn', summary: 'فروشگاه بسته است', life: 8000 });
                }

                else if (that.state.Time1 && (that.state.Time3 == "00:00" && that.state.Time4 == "00:00")) {
                    that.toast.current.show({
                        severity: 'warn', summary: 'فروشگاه بسته است', detail: <div>ساعت کار امروز فروشگاه <br />
                    صبح  از ساعت {that.state.Time1} تا ساعت {that.state.Time2}
                        </div>, life: 8000
                    });
                }
                else if (that.state.Time3 && (that.state.Time1 == "00:00" && that.state.Time2 == "00:00")) {
                    that.toast.current.show({
                        severity: 'warn', summary: 'فروشگاه بسته است', detail: <div>ساعت کار امروز فروشگاه <br />
                     عصر  از ساعت {that.state.Time3} تا ساعت {that.state.Time4}
                        </div>, life: 8000
                    });
                }
                else if (that.state.Time1 && that.state.Time3) {
                    that.toast.current.show({
                        severity: 'warn', summary: 'فروشگاه بسته است', detail: <div>ساعت کار امروز فروشگاه <br />
                    صبح  از ساعت {that.state.Time1} تا ساعت {that.state.Time2}  <br /> عصر  از ساعت {that.state.Time3} تا ساعت {that.state.Time4}
                        </div>, life: 8000
                    });
                }

            }
            
            that.getCats(category_ids)
        };
        let ECallBack = function (error) {
            alert(error)
        }
        this.Server.send("MainApi/GetProductsPerShop", param, SCallBack, ECallBack)
    }
    getCats(cats) {
        let that = this;
        let param = {
            MultiCats: cats,
            getSubCat: 1

        };
        let SCallBack = function (response) {
            let cats = [{ label: 'منوی اصلی', value: 'All' }];
            for (let i = 0; i < response.data.result.length > 0; i++) {
                let item = response.data.result[i];
                cats.push({
                    label: item.name,
                    value: item._id
                })
            }
            that.setState({
                cats: cats,
                loading:0
            })
            if(that.state.cat){
                that.changeCatList({value:that.state.cat});
            }
        };
        let ECallBack = function (error) {

            console.log(error)
        }
        this.Server.send("MainApi/GetCategory", param, SCallBack, ECallBack)
    }
    getCartItems(product) {
        let that = this;
        if(!this.state.UId){
            this.setState({
                goToLogin:true
            })
        }
        let param = {
            UId: this.state.UId,
            levelOfUser: this.state.levelOfUser

        };
        let SCallBack = function (response) {
            let SellerId = that.state.id;
            let sellerName = "";
            let CartNumber = 0;
            for (let i = 0; i < response.data.result.length; i++) {
                CartNumber += parseInt(response.data.result[i].number);

                if (response.data.result[i].Seller && response.data.result[i].Seller.length > 0 && SellerId != response.data.result[i].Seller[0]._id) {
                    SellerId = null;
                    sellerName = response.data.result[i].Seller[0].name;
                }
            }
            that.setState({
                CartItems: response.data.result,
                CartNumber: CartNumber
            })
            if (SellerId && product) {
                that.SendToCart(product);
            } else if (product) {
                that.setState({
                    notAllow: true
                })
            }
            that.props.dispatch({
                type: 'LoginTrueUser',
                CartNumber: that.state.CartNumber,
                off: that.props.off,
                credit: that.props.credit != "undefined" ? that.props.credit : 0
            })


        };
        let ECallBack = function (error) {

            console.log(error)
        }
        this.Server.send("MainApi/getCartPerId", param, SCallBack, ECallBack)
    }
    roundPrice(price) {
        return price.toString();
        if (price == 0)
            return price;
        price = parseInt(price).toString();
        let C = "500";
        let S = 3;
        if (price.length <= 5) {
            C = "100";
            S = 2;
        }
        if (price.length <= 4) {
            C = "100";
            S = 2;
        }
        let A = price.substr(price.length - S, S)
        if (A == C || A == "000" || A == "00")
            return price;
        if (parseInt(A) > parseInt(C)) {
            let B = parseInt(A) - parseInt(C);
            return (parseInt(price) - B + parseInt(C)).toString();
        } else {
            let B = parseInt(C) - parseInt(A);
            return (parseInt(price) + B).toString();
        }
    }
    SendToCart(product, number) {
        let that = this;

        let userLocation = 0;
        let PeykInfo = this.state.PeykInfo;
        if (!PeykInfo[2].city || !PeykInfo[2].subCity) {
            that.toast.current.show({ severity: 'warn', summary: 'عدم امکان خرید', detail: <div><span>آدرس خود را ثبت کنید</span><br /><br /><Link to={`${process.env.PUBLIC_URL}/User?Active=5`} style={{ textDecoration: 'none', color: '#333' }}>ویرایش آدرس</Link></div>, life: 8000 });
            return;
        }
        if (PeykInfo[2].subCity == PeykInfo[0].subCity)
            userLocation = 1;
        else if (PeykInfo[0].SelectedSubCities && PeykInfo[0].SelectedSubCities.indexOf(PeykInfo[2].subCity) > -1)
            userLocation = 2;
        else if (PeykInfo[2].city == PeykInfo[0].city)
            userLocation = 3;
        else
            userLocation = 4;
        if ((userLocation == 4 && !PeykInfo[0].SendToCountry) || (userLocation == 3 && !PeykInfo[0].SendToState) || (userLocation == 2 && !PeykInfo[0].SendToNearCity) || (userLocation == 1 && !PeykInfo[0].SendToCity)) {
            //alert("امکان خرید این محصول با توجه به آدرس محل سکونت شما وجود ندارد");
            that.toast.current.show({ severity: 'warn', summary: 'عدم امکان خرید', detail: <div><span>امکان خرید این محصول با توجه به آدرس محل سکونت شما وجود ندارد</span><br /><br /><Link to={`${process.env.PUBLIC_URL}/User?Active=5`} style={{ textDecoration: 'none', color: '#333' }}>ویرایش آدرس</Link></div>, life: 8000 });

            return;
        }
        PeykInfo[2].userLocation = userLocation;
        let param = {
            category_id: product.category_id,
            PDId: product._id,
            PId: (product.product && product.product.length > 0) ? product.product[0]._id : product._id,
            Number: number || 1,
            UId: that.state.UId,
            Price: (this.roundPrice(product.price - ((product.price * ((!that.state.NoOff ? parseInt(that.props.off) : 0) + product.off)) / 100))),
            Status: "0",
            Type: "insert",
            token: localStorage.getItem("api_token"),
            SellerId: that.state.id,
            IsSeveralShop: 1,
            PeykInfo: this.state.PeykInfo
        };
        let SCallBack = function (response) {
            that.getCartItems();
        };
        let ECallBack = function (error) {
        }

        that.Server.send("MainApi/ManageCart", param, SCallBack, ECallBack)



    }
    onHide(event) {
        this.setState({ selectedProduct: null });
    }
    openSideBar(product) {

        this.setState({ visibleSideBar: true });
        if (!this.state.SaleFromMultiShops) {
            this.getCartItems(product);
            return;
        } else {
            this.SendToCart(product);
        }

    }
    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    changeCart(number, product_id, user_id) {
        let that = this;

        if (this.state.pleaseWait)
            return;
        this.setState({
            pleaseWait: true
        })
        this.debounce(
            axios.post(this.state.url + 'checktoken', {
                token: localStorage.getItem("api_token")
            })
                .then(response => {
                    let param = {
                        product_id: product_id,
                        user_id: this.state.UId,
                        number: number == "0" ? "0" : number
                    };
                    let SCallBack = function (response) {

                        that.setState({
                            pleaseWait: false
                        })
                        that.getCartItems();

                    };
                    let ECallBack = function (error) {
                        that.setState({
                            pleaseWait: false
                        })
                        console.log(error)
                    }
                    that.Server.send("MainApi/changeCart", param, SCallBack, ECallBack)

                }).catch(error => {
                    that.setState({
                        pleaseWait: false
                    })
                    console.log(error)
                }), 1000)


    }
    itemTemplate(car, layout) {
        if (layout === 'grid' && car) {
            let pic = (car.fileUploaded && car.fileUploaded.split("public")[1]) ? this.state.absoluteUrl + car.fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            return (
                <div className="col-12 col-lg-3 col-md-4 col-sm-6" style={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <div className="product-grid-item card" style={{ padding: 10, minHeight: 400 }} onClick={() => {
                        if (!this.state.ProductBase) {
                            this.setState({
                                selectedProduct: true,
                                curentProduct: car
                            })
                        }
                    }} >
                        {!this.state.ProductBase && car.number > 0 && this.state.ShopIsOpen && this.state.InTime &&
                            <span className="fa fa-plus-circle text-success" onClick={(e) => { this.openSideBar(car); e.stopPropagation(); }} style={{ fontSize: 30, position: 'absolute', top: 5, right: 5, cursor: 'pointer', zIndex: 5 }}></span>
                        }
                        <div className="product-grid-item-content YekanBakhFaMedium">
                            <img src={pic} alt={car.title} style={{ height: 150, borderRadius: 15 }} />
                            <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'right', marginTop: 30, height: 50 }}>{car.title}</div>
                        </div>
                        <div className="product-grid-item-bottom" style={{ marginTop: 10, marginBottom: 10, textAlign: 'left' }}>
                            {(this.state.UId || !car.ShowPriceAftLogin) &&
                                <div>
                                    {car.number > 0 ?
                                        <div style={{ textAlign: 'left' }}>

                                            {
                                                car.number > 0 && (parseInt(this.props.off) + car.off) > "0" ?
                                                    <div>
                                                        <div className="car-subtitle oldPrice_cat  iranyekanwebmedium" style={{ paddingTop: 5, marginTop: 25, marginLeft: 45, fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(car.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div><br />
                                                        <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 'auto', left: 0 }} >{this.persianNumber(((!car.NoOff ? parseInt(this.props.off) : 0) + car.off))} %</div>
                                                    </div>
                                                    :
                                                    <div style={{ height: 66 }}>
                                                    </div>

                                            }
                                            <div className="product-price YekanBakhFaBold" style={{ fontSize: 20 }} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off) : 0) + car.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                        </div>
                                        :
                                        <div style={{ textAlign: 'center' }}><div style={{ height: 70 }}>
                                        </div><span className="iranyekanwebmedium" style={{ fontSize: 16, marginTop: 10, color: 'red' }}>ناموجود</span></div>

                                    }


                                </div>
                            }
                            <br />
                        </div>
                        <div style={{ position: 'absolute', bottom: 15, width: '100%', left: 0 }}>
                            {this.state.ProductBase &&
                                <Link className="p-button-info btn-warning " to={`${process.env.PUBLIC_URL}/products?id=${(car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id}`} href="#" style={{ padding: 10, marginTop: 10, width: '85%', fontFamily: 'YekanBakhFaBold' }}>
                                    مشاهده جزئیات / خرید
                                </Link>
                            }
                        </div>
                    </div>
                </div>

            );
        } else if (car) {
            let pic = (car.fileUploaded && car.fileUploaded.split("public")[1]) ? this.state.absoluteUrl + car.fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            return (
                <div className="col-12 col-lg-12 col-md-12 col-sm-12" style={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <div className="product-grid-item card" style={{ padding: 10 }} onClick={() => {
                        if (!this.state.ProductBase) {
                            this.setState({
                                selectedProduct: true,
                                curentProduct: car
                            })
                        }
                    }} >
                        <div className="row">
                        {!this.state.ProductBase && car.number > 0 && this.state.ShopIsOpen && this.state.InTime &&
                            <span className="fa fa-plus-circle text-success" onClick={(e) => { this.openSideBar(car); e.stopPropagation(); }} style={{ fontSize: 30, position: 'absolute', top: 5, right: 5, cursor: 'pointer', zIndex: 5 }}></span>
                        }
                        <div className="col-lg-6 col-12 product-grid-item-content YekanBakhFaMedium">
                            <img src={pic} alt={car.title} style={{ height: 150, borderRadius: 15 }} />
                            {(this.state.UId || !car.ShowPriceAftLogin) &&
                                <div>
                                    {car.number > 0 ?
                                        <div style={{ textAlign: 'center' }}>

                                            {
                                                car.number > 0 && (parseInt(this.props.off) + car.off) > "0" ?
                                                    <div>
                                                        <div className="car-subtitle  iranyekanwebmedium" style={{ paddingTop: 5,textDecoration:'line-through', marginTop: 25, marginLeft: 45, fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(car.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div><br />
                                                        <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 'auto', left: 0 }} >{this.persianNumber(((!car.NoOff ? parseInt(this.props.off) : 0) + car.off))} %</div>
                                                    </div>
                                                    :
                                                    <div style={{ height: 66 }}>
                                                    </div>

                                            }
                                            <div className="product-price YekanBakhFaBold" style={{ fontSize: 20 }} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off) : 0) + car.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                        </div>
                                        :
                                        <div style={{ textAlign: 'center' }}><div style={{ height: 70 }}>
                                        </div><span className="iranyekanwebmedium" style={{ fontSize: 16, marginTop: 10, color: 'red' }}>ناموجود</span></div>

                                    }


                                </div>
                            }
                        </div>
                        <div className="col-lg-6 col-12 product-grid-item-bottom" style={{ marginTop: 10, marginBottom: 10, textAlign: 'left' }}>
                        <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'center', marginTop: 30}}>{car.title}</div>
                        {car.subTitle != '' && car.subTitle !='-' &&
                            <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'center', marginTop: 30}}>{car.subTitle}</div>
                        }
                        {car.desc != '' && car.desc !='-' &&
                            <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'center', marginTop: 30}}>{car.desc}</div>
                        }
                        <div style={{ width: '100%', textAlign:'center',marginTop:20 }}>
                            {this.state.ProductBase &&
                                <Link className="p-button-info btn-warning " to={`${process.env.PUBLIC_URL}/products?id=${(car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id}`} href="#" style={{ padding: 10, marginTop: 10, width: '85%', fontFamily: 'YekanBakhFaBold' }}>
                                    مشاهده جزئیات / خرید
                            </Link>

                            }
                        </div>
                        </div>
                        
                        </div>
                        
                    </div>
                </div>

            );
            
        }else {
            return (
                <div></div>
            )

        }
    }
    GoToProduct(id) {
        this.setState({
            PId: id
        })
    }
    persianNumber(input) {
        var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
        var string = (input + '').split('');
        var count = string.length;
        var num;
        for (var i = 0; i <= count; i++) {
            num = string[i];
            if (persian[num]) {
                string[i] = persian[num];
            }
        }
        return string.join('');
    }
    changeCatList(e) {
        this.setState({ cat: e.value });
        let GridData = this.state.GridDataOriginal;
        e.value = e.value ? e.value : 'All';
        if (e.value != 'All') {
            GridData = GridData.filter(function (value, index, array) {
                return (value.category_id == e.value);
            });
        }

        this.setState({
            GridData: GridData
        })
        //window.scrollTo(0, 0);
    }
    render() {
        if (this.state.PId) {
            return <Redirect to={"/products?id=" + this.state.PId} />;
        }
        if (this.state.goToLogin) {
            return <Redirect to={"/login"} />;
        }
        return (

            <div>
                <Header1 />
                <Header2 />
                <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                {( this.state.shop && !this.state.loading ) ?
                    <div className="row justify-content-center firstInPage" style={{ direction: 'rtl', minHeight: 600 }}>
                        {this.state.shop &&
                            <div style={{ position: 'relative', marginBottom: 30 }}>
                                <div>
                                    {this.state.shop.SpecialPic ?
                                        <img src={this.state.absoluteUrl + this.state.shop.SpecialPic.split("public")[1]} style={{ marginTop: 30, marginBottom: 50, maxHeight: 450, width: '100%' }} />
                                        :
                                        <img src={require('../public/bg-seller.png')} style={{ marginTop: 30, marginBottom: 30, marginBottom: 50, maxHeight: 450, width: '100%' }} />

                                    }
                                    <div style={{ position: 'absolute', display: 'flex', bottom: 0, alignItems: 'center', backgroundColor: '#fff', width: '100%', height: 50, justifyContent: 'space-between' }} >
                                        {this.state.shop.logo &&
                                            <img src={this.state.absoluteUrl + this.state.shop.logo.split("public")[1]} className="d-sm-block d-none" style={{ position: 'absolute', top: -85, width: 160, height: 160, right: 20 }} />
                                        }
                                        <div className="yekan" style={{ width: 30 }}>

                                        </div>

                                        <div className="yekan" style={{ fontSize: 16, padding: 5 }}>
                                            {this.state.shop.address}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="col-lg-10 col-md-12">
                            <div className="row">
                                <div className="col-lg-3 col-12 mb-5" style={{ backgroundColor: '#fff' }}>
                                    <div className="row" style={{ padding: 5, marginTop: 20 }}>
                                        <div className="col-12" >
                                            {
                                                this.state.shop &&
                                                <div>
                                                    <p style={{ fontSize: 26, textAlign: 'center', marginTop: 30, color: '#fff', backgroundColor: '#00bfd6', minHeight: 100, padding: 24 }} className="yekan">
                                                       {this.state.shop.name}
                                                    </p>
                                                    <p dangerouslySetInnerHTML={{ __html: this.state.shop.about }} style={{ display: 'none' }}>

                                                    </p>
                                                    <div style={{textAlign:'right',maginTop:10,marginBottom:10}}>

                                                    <SelectButton  value={this.state.layout} itemTemplate={justifyTemplate} options={this.state.layoutList} onChange={(e) => this.setState({layout:e.value})} />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-evenly', border: '1px solid #eee', borderRadius: 5, padding: 5 }} >
                                                        <InputSwitch checked={this.state.Exist} onChange={(e) => {
                                                            this.setState({
                                                                Exist: e.value
                                                            });
                                                            this.getProducts({ Exist: e.value });
                                                        }
                                                        } />
                                                        <label className="yekan">
                                                            فقط کالاهای موجود
                                                    </label>
                                                    </div>

                                                    <div style={{ marginTop: 10, border: '1px solid #eee', borderRadius: 5, padding: 5, textAlign: 'right' }} >
                                                        <p className="yekan">مرتب سازی بر اساس : </p>
                                                        <SelectButton optionLabel="name" optionValue="value" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} value={this.state.Sort} options={this.state.SortOptions} onChange={(e) => {
                                                            this.setState({ Sort: e.value });
                                                            this.getProducts({ Exist: this.state.Exist, Sort: e.value })

                                                        }}
                                                        ></SelectButton>
                                                    </div>


                                                    <ListBox value={this.state.cat} style={{ borderColor: '#ececec', textAlign: 'right', fontFamily: 'YekanBakhFaBold', marginTop: 50,maxHeight:400,overflow:'auto' }} options={this.state.cats} onChange={(e) => { this.changeCatList(e) }} />




                                                </div>

                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-12 bs-row">
                                    {this.state.GridData.length > 0 ?
                                        <DataView value={this.state.GridData} className="row" layout={this.state.layout}  rows={10000} itemTemplate={this.itemTemplate}></DataView>
                                        :
                                        <div>
                                            <p className="iranyekanwebmedium" style={{ textAlign: 'center', fontSize: 35, padding: 100, backgroundColor: '#fff' }}>کالایی جهت نمایش وجود ندارد. <i className="fal fa-frown" style={{ marginRight: 20, fontSize: 36 }}></i></p>


                                        </div>
                                    }

                                </div>
                            </div>

                        </div>

                    </div>
                    :
                    <div style={{ zIndex: 10000 }} >
                    <p style={{ textAlign: 'center' }}>
                        
                        <img src={this.state.loading_pic}  />
                    </p>
            
                    </div>
                }
                <Dialog visible={this.state.selectedProduct} onHide={this.onHide}  maximizable={false} maximized={false}>
                    <ShowProduct data={this.state.curentProduct} />
                </Dialog>
                <Dialog header="عدم امکان خرید" visible={this.state.notAllow} position='top' modal style={{ width: '50vw' }} onHide={() => this.setState({ notAllow: false })}
                    draggable={false} resizable={false} baseZIndex={1000}>
                    <p className="iranyekanwebmedium" style={{ fontSize: 22, textAlign: 'center', color: 'red' }}>
                        در هر سفارش تنها می توانید از یک فروشگاه خرید نمایید
                    </p>
                    <p className="iranyekanwebmedium" style={{ fontSize: 20, textAlign: 'center' }}>
                        در صورت تمایل برای خرید از این فروشگاه سبد خرید خود را خالی کنید
                    </p>
                </Dialog>
                <Sidebar visible={this.state.visibleSideBar} onHide={() => this.setState({ visibleSideBar: false })}>

                    {this.state.CartItems.length > 0 &&
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <i className="fal fa-shopping-cart mr-4 mr-1 text-danger" style={{ fontSize: 50, marginTop: 20, marginBottom: 20 }} /><br />
                            </div>
                            {this.state.CartItems.map((item, index) => {
                                return (
                                    <div className="row" style={{ border: '1px solid #eee', marginBottom: 10 }}>
                                        <div className="col-12" style={{ textAlign: 'right' }}>
                                            <label className="iranyekanwebmedium" style={{ fontSize: 14 }}>{item.products[0]?.title}</label>
                                            {item.products[0].subTitle != '' && item.products[0].subTitle !='-' &&
                                                <label className="iranyekanwebmedium" style={{ fontSize: 11 }}>{item.products[0]?.subTitle}</label>
                                            }
                                        </div>

                                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eee' }}>
                                            <span className="fa fa-minus-circle text-danger" onClick={(e) => { this.changeCart(parseInt(item.number) - 1, item.product_detail_id || item.product_id); }} style={{ fontSize: 15, cursor: 'pointer' }}></span>
                                            <div><span className="iranyekanwebmedium">تعداد : </span><label className="iranyekanwebmedium">{item.number}</label></div>
                                            <span className="fa fa-plus-circle text-success" onClick={(e) => { this.changeCart(parseInt(item.number) + 1, item.product_detail_id || item.product_id); }} style={{ fontSize: 15, cursor: 'pointer' }}></span>

                                        </div>
                                        <div className="col-6" style={{ textAlign: 'center' }}>
                                            <span className="iranyekanwebmedium">قیمت واحد : </span>  <label className="iranyekanwebmedium">{item.products[0]?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</label>
                                        </div>
                                        <div className="col-6" style={{ textAlign: 'center' }}>
                                            <span className="iranyekanwebmedium">قیمت کل : </span> <label className="iranyekanwebmedium">{(parseInt(item.products[0]?.price) * parseInt(item.number)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</label>
                                        </div>
                                    </div>
                                )

                            })
                            }
                        </div>
                    }
                    {this.state.AllowSale && this.state.CartItems && this.state.CartItems.length > 0 ?
                        <div style={{ textAlign: 'center', marginTop: 50 }}>
                            <Link to={`${process.env.PUBLIC_URL}/cart`} className="btn btn-success iranyekanwebmedium">ادامه فرآیند خرید</Link>
                        </div>
                        :
                        <div style={{ marginTop: 150, textAlign: 'center' }}>
                            <p className="iranyekanwebmedium" style={{ fontSize: 25 }}>سبد خرید خالی است</p>
                        </div>
                    }
                </Sidebar>
                {!this.state.loading &&
                <Footer />
                }
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        CartNumber: state.CartNumber,
        off: state.off,
        credit: state.credit
    }
}
export default withRouter(
    connect(mapStateToProps)(Shop)
);
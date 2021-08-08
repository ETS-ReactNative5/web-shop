import React, { Component } from 'react';
import './Category.css';
import Server from './Server.js'
import axios from 'axios'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { BrowserRouter, Link, withRouter, Redirect } from 'react-router-dom'
import Header from './Header.js'
import Header1 from './Header1.js'
import CartBox from './CartBox.js'

import { connect } from 'react-redux';
import Footer from './Footer.js'
import { SelectButton } from 'primereact/selectbutton';
import { ToggleButton } from 'primereact/togglebutton';
import {InputSwitch} from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.onHide = this.onHide.bind(this);

        this.Server = new Server();
        this.state = {
            myTag: this.props.location.search.split("tag=")[1],
            GridData: [],
            productsDetailArray:[],
            layout: 'list',
            loading:1,
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }

        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                this.setState({
                    UId: response.data.authData.userId,
                    levelOfUser: response.data.authData.levelOfUser
                })
                this.getPics();
            })
            .catch(error => {
                this.getPics();
            })
    }
    onHide(event) {
        this.setState({ VisibleDialog: null });
    }
    GoToShop(url,productsDetail,products){
		if(productsDetail && productsDetail.length > 1){
			this.setState({
				productsDetailArray:productsDetail,
				productsDetailArrayRef:products,
				VisibleDialog:true
			})
			
		}else{
			this.setState({
				ShopLink:url
			})
		}
		
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
          that.getProducts();
		}, function (error) {
		})
	
	
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
    getProducts(p) {
        let that = this;
        let param = {
            tag: this.state.myTag,
            Exist:p,
            token: localStorage.getItem("api_token")
        };
        let SCallBack = function (response) {
            let res = response.data.result;
            that.setState({
                GridData: response.data.result,
                loading:0
            })
        };
        let ECallBack = function (error) {
            console.log(error)
        }
        this.Server.send("MainApi/GetProductsPerTag", param, SCallBack, ECallBack)
    }
    roundPrice(price) {
        return price.toString();;
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
    componentWillReceiveProps(nextProps) {
        if ((nextProps.location.search && nextProps.location.search.split("id=")[1] != this.state.id) || (!nextProps.location.search && this.state.id)) {
            window.location.reload();
        }
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
    itemTemplate(car, layout) {
        if (layout === 'list' && car) {
            let pic = car.fileUploaded.split("public")[1] ? this.state.absoluteUrl + car.fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            return (
                <div className="col-12 col-lg-3 col-md-4 col-sm-6" style={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <div className="product-grid-item card" style={{ padding: 10 }} >
                        <div className="product-grid-item-content YekanBakhFaMedium">
                            <img src={pic} alt={car.title} style={{ height: 150, borderRadius: 15 }} />
                            <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'center',fontSize:'large', marginTop: 10, height: 50,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{car.title}</div>
                            {car.subTitle && car.subTitle != "-" && car.subTitle != "." &&
                                <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'right', height: 50,whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden' }}>
                                    {car.subTitle}
                                 </div>
                            }

                        </div>
                        <div className="product-grid-item-bottom" style={{ textAlign: 'left' }}>
                            {(this.state.UId || !car.ShowPriceAftLogin) &&
                                <div style={{position:'relative'}}>
                                    {car.number > 0 ?
                                        <div style={{ textAlign: 'left' }}>

                                            {
                                                car.number > 0 && (parseInt(this.props.off||0) + car.off) > "0" ?
                                                    <div>
                                                        <div className="car-subtitle oldPrice_cat  iranyekanwebmedium" style={{ paddingTop: 5, marginTop: 25, marginLeft: 45, fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(car.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div><br />
                                                        <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 'auto', left: 0 }} >{this.persianNumber(((!car.NoOff ? parseInt(this.props.off||0) : 0) + car.off))} %</div>
                                                    </div>
                                                    :
                                                    <div>
                                                    </div>

                                            }
                                            <div className="product-price YekanBakhFaBold" style={{ fontSize: 20 }} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off||0) : 0) + car.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                        </div>
                                        :
                                        <div style={{ textAlign: 'center' }}><span className="iranyekanwebmedium" style={{ fontSize: 16, marginTop: 10, color: 'red' }}>ناموجود</span></div>

                                    }


                                </div>
                            }
                            <br />
                        </div>


                        <div style={{ textAlign: 'right' }}><i className="fas fa-id-card-alt" style={{ paddingRight: 8, paddingLeft: 8, fontSize: 16 }} ></i><span className="iranyekanwebmedium">فروشنده:</span> <span className="YekanBakhFaBold">{car.Seller[0]?.name}</span></div>
                        {this.state.ProductBase ?
                            <div style={{ textAlign: 'right' }}><i className="fas fa-truck" style={{ paddingRight: 8, paddingLeft: 8, fontSize: 16 }} ></i><span className="YekanBakhFaBold">زمان ارسال: {this.persianNumber(car.PrepareTime || "3")} روز کاری</span></div>
                        :
                            <div style={{ textAlign: 'right' }}><i className="fas fa-truck" style={{ paddingRight: 8, paddingLeft: 8, fontSize: 16 }} ></i><span className="YekanBakhFaBold">زمان ارسال: {this.persianNumber(car.Seller && car.Seller[0] && car.Seller[0].PrepareTime || "30")} دقیقه پس از پرداخت</span></div>
                        }
                        <div style={{marginTop:20}}>
                            {this.state.ProductBase ?
                            <Link className="p-button-success YekanBakhFaBold" to={`${process.env.PUBLIC_URL}/products?id=${(car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id}`} href="#" style={{ padding: 6, marginTop: 10, width: '85%',backgroundColor:'#EEE',borderRadius:5,color:'#000' }}>
                                مشاهده جزئیات / خرید

                            </Link>
                            :
                            <button className="p-button-success YekanBakhFaBold" onClick={()=>{this.GoToShop('Shops?id='+((car.Seller && car.Seller.length > 0) ? car.Seller[0]._id : '')+''+'&cat='+car.category_id+'',car.product_detail,car)}} style={{ textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5,backgroundColor:'#EEE',borderRadius:5 }}>
                               مشاهده جزئیات / خرید

                            </button>
                            }

                        </div>
                    </div>
                    
                </div>

            );
        } else {
            return (
                <div></div>
            )

        }
    }
    GoToProduct(id, title) {
        this.setState({
            PId: id,
            title: title
        })
    }
    render() {
        if (this.state.PId) {
            return <Redirect to={"/products?name=" + this.state.title + "&id=" + this.state.PId} />;
        }
        if (this.state.ShopLink) {
			return <Redirect to={this.state.ShopLink} push={true} />;
		}
        return (

            <div>
                <Header />

                <Header1 />
                {!this.state.loading ?
                    <div className="row justify-content-center firstInPage  p-md-5 p-3" style={{  minHeight: 600 }}>

                        <div className="col-lg-10 DataViewNoBorder bs-row">

                            <div>
                                <div style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-between', borderRadius: 5, marginBottom: 5, padding: 20 }} className="row iranyekanwebmedium">
                                    <div className="col-lg-2 col-sm-4 col-12  mt-md-0 mt-3" style={{ textAlign: 'center' }}></div>
                                    <div className="col-lg-7 col-md-6 col-12 mt-md-0 mt-5" className="mt-md-0 mt-5">
                                        <SelectButton optionLabel="name" optionValue="value" style={{ textAlign: 'right', direction: 'ltr',display:'flex',justifyContent:'space-around',flexWrap:'wrap' }} value={this.state.Sort} options={this.state.SortOptions} onChange={(e) => {
                                            this.setState({ Sort: e.value });
                                            this.getProducts(this.state.Exist)

                                        }}
                                        ></SelectButton>
                                    </div>
                                    <div className="col-lg-3 col-sm-12 col-12  mt-md-0 mt-5" style={{border:'1px solid #eee',borderRadius:5}}>
                                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-evenly',borderRadius:5,padding:5}} >

                                        <InputSwitch  checked={this.state.Exist} onChange={(e) => {
                                            this.setState({
                                                Exist: e.value
                                            });
                                            this.getProducts(e.value);
                                        }
                                        } />
                                    <label className="yekan" style={{marginBottom:0}}>
                                            فقط کالاهای موجود
                                    </label>
                                    </div>    

                                    </div>

                                </div>
                                {this.state.GridData.length > 0 && this.state.EmptyCat != 0 ?
                                    <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={12} itemTemplate={this.itemTemplate}></DataView>
                                    :
                                    <div>
                                        {this.state.EmptyCat == 0 ?
                                            <p className="iranyekanwebmedium" style={{ textAlign: 'center', fontSize: 35, padding: 100, backgroundColor: '#fff' }}>کالایی جهت نمایش وجود ندارد. <i className="fal fa-frown" style={{ marginRight: 20, fontSize: 36 }}></i></p>
                                            :
                                            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                                                <ProgressSpinner style={{paddingTop:150}}/>
                                            </div>

                                        }
                                    </div>
                                }
                            </div>


                        </div>
            <Dialog visible={this.state.VisibleDialog} onHide={this.onHide}  maximized={true}>
				{this.state.productsDetailArrayRef &&	
					<div  className="iranyekanwebmedium" style={{textAlign:'center',fontSize:25,marginBottom:35}}><span className="iranyekanwebmedium text-danger" > {this.state.productsDetailArrayRef.title} </span> را میتوانید از فروشگاههای زیر بخرید</div>
				}
				<div className="row" style={{marginBottom:50,display:'flex',flexDirection:'column',alignItems:'center'}}>

					{this.state.productsDetailArray.map((item, index) => {
						let Seller =null;
						for(let i=0; i < this.state.productsDetailArrayRef.Seller.length; i++){
							if(this.state.productsDetailArrayRef.Seller[i]._id  ==  item.SellerId){
								Seller = this.state.productsDetailArrayRef.Seller[i];
							}
						}
						let price = 0;
						if(item.number > 0)
							price = this.persianNumber(this.roundPrice((item.price - (item.price * ((!item.NoOff ? parseInt(this.props.off||0) : 0) + item.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
						let img = (Seller.logo && Seller.logo.split("public")[1]) ? this.state.absoluteUrl + Seller.logo.split("public")[1] : this.state.absoluteUrl + 'nophoto.png'
						return(
								<div className="col-lg-6 col-md-4 col-12" style={{textAlign:'center'}} >
									<button onClick={()=>{this.GoToShop('Shops?id='+Seller._id+''+'&cat='+this.state.productsDetailArrayRef.category_id)}} disabled={item.number == 0} style={{ background:'#fff',display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
									<img src={img} style={{maxHeight:200}} />
									<div  className="iranyekanwebmedium">{Seller.name}</div>
                                    {item.number > 0 &&
									    <div className="iranyekanwebmedium text-primary" style={{marginTop:20}}>قیمت در فروشگاه : {price} تومان</div>
                                    }
									</button>
									
								</div>
							
						)

					})
					}
					</div>
                </Dialog>
                <div style={{height:50}} />
                <CartBox />
                    </div>
                :
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                    <ProgressSpinner style={{paddingTop:150}}/>
                </div>
                }
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        username: state.username,
        password: state.password,
        ip: state.ip,
        account: state.account,
        place: state.place,
        fullname: state.fullname,
        mobile: state.mobile,
        LoginAnia:state.LoginAnia
    }
}
export default withRouter(
    connect(mapStateToProps)(Tag)
);
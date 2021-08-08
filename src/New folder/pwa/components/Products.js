import React, { useRef  } from 'react';
import Server from './Server.js'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import Header from './Header.js'
import { TabView, TabPanel } from 'primereact/tabview';
import { Panel } from 'primereact/panel';
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import './Products.css'
import CatList from './CatList.js'
import ShopList from './ShopList.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import Cities from './Cities.js'
import { Button } from 'primereact/button';

import { Tag } from 'primereact/tag';

import CartBox from './CartBox.js'
import { Rating } from 'primereact/rating';
import { ImageWithZoom, Slide, Slider, CarouselProvider } from 'pure-react-carousel';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

const params5 = {
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
    },
    loop: 1,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
    },
    pagination: {
        el: '.swiper-pagination'
    }
}
class Products extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.SendToCart = this.SendToCart.bind(this);
        this.SendComment = this.SendComment.bind(this);
        this.myRef = React.createRef()   // Create a ref object 
        this.toast =  React.createRef();

        this.state = {
            id: this.props.location.search.split("id=")[1],
            Haraj: this.props.location.search.split("Haraj=")[1],
            UId: null,
            title: '',
            subtitle: '',
            desc: '',
            pic1: '',
            pic2: '',
            pic3: '',
            pic4: '',
            pic5: '',
            price: 0,
            originalPrice: 0,
            ShowPriceAftLogin: false,
            off: 0,
            rating: 0,
            ratingText: "بدون امتیاز",
            number: 1,
            reqNumber: 1,
            GoToCart: false,
            GotoLogin: false,
            SellerName: '',
            SellerId: null,
            Comments: [],
            CommentText: null,
            CommentLimit: 5,
            CommentSkip: 0,
            HasError: {},
            CommentCount: 0,
            lastCommentCount: 0,
            AlertInShowComment: {},
            GridData: [],
            day: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            visibleDialog: false,
            DialogPic: null,
            SameData: [],
            MainShopInfo:[],
            PeykInfo:[],
            ShowDescLimit:false,
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }

        


    }
    getMainShopInfo(){
        let that = this;
        let param = {
            main: true
        };
        
        let SCallBack = function (response) {
            that.setState({
                MainShopInfo:response.data.result
            })
            that.getComment();

        };

        let ECallBack = function (error) {

        }
        that.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
    }
    getPics(l, type) {
        let that = this;
        this.setState({
            loading:true
        })
        axios.post(this.state.url + 'getPics', {})
          .then(response => {
            response.data.result.map(function (item, index) {
              
              if (item.name == "file13"){
                that.setState({
                  loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]
                })
              }
                  
            })
            this.getSettings();      
        })
          .catch(error => {
            this.getSettings();      
        })
    
      }
    componentDidMount() {
        document.getElementsByTagName("body")[0].scrollTo(0, 0);
        this.getPics();
    }
    getProduct(){
        let that = this;
        let param = {
            id: null,
            token: localStorage.getItem("api_token")
        };
        if (this.state.Haraj) {
            let that = this;

            let SCallBack = function (response) {
                var HarajDate = response.data.result[0].HarajDate,
                    ExpireDate = response.data.result[0].ExpireDate,
                    TodayDate = response.data.extra ? response.data.extra.TodayDate : null;


                if (ExpireDate >= TodayDate) {
                    that.setState({
                        GridData: response.data.result
                    })
                    var x = setInterval(function () {
                        var distance = new Date(response.data.result[0].ExpireDate + " 23:59:59") - new Date(new moment().locale('fa').format("jYYYY/jMM/jDD HH:mm:ss"));
                        var day = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // Display the result in the element with id="demo"
                        if (hours == 0 && minutes == 0 && seconds <= 1)
                            window.location.reload();
                        that.setState({
                            hours: hours,
                            minutes: minutes,
                            seconds: seconds
                        })

                        // If the count down is finished, write some text
                        if (distance < 0) {
                            that.setState({
                                GridData: []
                            })
                            clearInterval(x);
                            //document.getElementById("demo").innerHTML = "EXPIRED";
                        }
                    }, 1000);
                }
                that.getComment();

            };
            let ECallBack = function (error) {
                // alert(error)
            }
            this.Server.send("MainApi/GetProductsPerCat", param, SCallBack, ECallBack)
            return;
        }

        let SCallBack = function (response) {
            let res = response.data.result;
            let extra = response.data.extra;
            let OpenedTime= (extra && extra.Seller[0].OpenedTime) ? (extra.Seller[0].OpenedTime[extra.WeekDay] ? extra.Seller[0].OpenedTime[extra.WeekDay]["day"+(parseInt(extra.WeekDay)+1)] : null ) : null;
            let Time1 ="00:00";
            let Time2 ="24:00";
            let Time3 ="00:00";
            let Time4 ="24:00";
            if(OpenedTime){
                Time1 = (OpenedTime && OpenedTime[0]) ? OpenedTime[0] : "00:00";
                Time2 = (OpenedTime && OpenedTime[1]) ? OpenedTime[1] : "24:00";
                Time3 = (OpenedTime && OpenedTime[2]) ? OpenedTime[2] : "00:00";
                Time4 = (OpenedTime && OpenedTime[3]) ? OpenedTime[3] : "24:00";
            }
            if(extra){
                const SellerInfo = extra.Seller;
                const UserInfo = [extra.user];
                const CatInfo = extra.category;
                let PeykInfo = [{city:SellerInfo[0]?.city,subCity:SellerInfo[0]?.subCity,SelectedSubCities:SellerInfo[0]?.SelectedSubCities,SendToCity:SellerInfo[0]?.SendToCity,SendToState:SellerInfo[0]?.SendToState,SendToCountry:SellerInfo[0]?.SendToCountry,SendToNearCity:SellerInfo[0]?.SendToNearCity,FreeInExpensive:SellerInfo[0]?.FreeInExpensive},
                {CumputeByNumberInPeyk:CatInfo[0]?.CumputeByNumberInPeyk,MergeableInPeyk:CatInfo[0]?.MergeableInPeyk,SendToCity:CatInfo[0]?.SendToCity,SendToCountry:CatInfo[0]?.SendToCountry,SendToNearCity:CatInfo[0]?.SendToNearCity,SendToState:CatInfo[0]?.SendToState  },
                {city:UserInfo[0]?.city,subCity:UserInfo[0]?.subCity }];
                that.setState({
                    PeykInfo:PeykInfo
                })
                
            }
            
            res.map((v, i) => {
                that.setState({
                    id: v._id,
                    IsSeveralShop: response.data.extra ? response.data.extra.IsSeveralShop : 0,
                    title: v.title,
                    subtitle: v.subTitle,
                    Spec: v.Spec,
                    desc: v.desc,
                    rating: response.data.extra.raiting[0] ? response.data.extra.raiting[0].point : 0,
                    pic1: v.fileUploaded ? that.state.absoluteUrl + v.fileUploaded.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
                    pic2: v.fileUploaded1 ? that.state.absoluteUrl + v.fileUploaded1.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
                    pic3: v.fileUploaded2 ? that.state.absoluteUrl + v.fileUploaded2.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
                    pic4: v.fileUploaded3 ? that.state.absoluteUrl + v.fileUploaded3.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
                    pic5: v.fileUploaded4 ? that.state.absoluteUrl + v.fileUploaded4.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
                    price: v.price,
                    originalPrice: v.price,
                    ShowPriceAftLogin: v.ShowPriceAftLogin,
                    off: v.off,
                    NoOff: v.NoOff,
                    number: v.number,
                    ProductId: v.product_id,
                    CatId:v.category_id,
                    SellerName: response.data.extra.Seller[0] ? response.data.extra.Seller[0].name : "",
                    SellerId: response.data.extra.Seller[0] ? response.data.extra.Seller[0]._id : "",
                    Tags: v.Tags,
                    PrepareTime:that.state.ProductBase ? v.PrepareTime : response.data.extra.Seller[0].PrepareTime ,
                    Time1:Time1,
                    Time2:Time2,
                    Time3:Time3,
                    Time4:Time4,
                    ShopIsOpen: extra.Seller[0].Opened,
                    InTime: ((Time1 <= extra.Time && extra.Time <=  Time2) || (Time3 <= extra.Time && extra.Time <=  Time4))
                })
                if (v.SelectedColors && v.SelectedColors.length > 0) {
                    let Colors = [];
                    for (let j = 0; j < v.SelectedColors.length; j++)
                        Colors.push({ "label": v.SelectedColors[j].desc||v.SelectedColors[j].name, "value": v.SelectedColors[j].value||v.SelectedColors[j].id, "priceChange": v.SelectedColors[j].priceChange||0 })
                    that.setState({
                        Colors: Colors/*,
                        Color: Colors[0].value*/
                    })
                }
                if (v.SelectedSize && v.SelectedSize.length > 0) {
                    let Sizes = [];
                    for (let j = 0; j < v.SelectedSize.length; j++)
                        Sizes.push({ "label": v.SelectedSize[j].desc||v.SelectedSize[j].name, "value": v.SelectedSize[j].value||v.SelectedSize[j].id, "priceChange": v.SelectedColors[j].priceChange||0 })
                    that.setState({
                        Sizes: Sizes/*,
                        Size: Sizes[0].value*/
                    })
                }
                var point = 0,
                    count = 0;
                v.points && v.points.map((o, j) => {
                    point = point + o.point;
                    count++;
                })
                that.setState({
                    /*rating:point/count,*/
                    ratingText: point == 0 ? "بدون امتیاز" : that.persianNumber((point / count).toFixed(2))  /*+ " از " + that.persianNumber(5)*/ + "    (" + that.persianNumber(count) + ")"
                })
            })
            that.getMainShopInfo();
            //that.getComment()

        };
        let ECallBack = function (error) {
            // alert(error)
        }
        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {

                this.setState({
                    UId: response.data.authData.userId
                })
                param = {
                    id: that.state.id,
                    UId: that.state.UId,
                    token: localStorage.getItem("api_token"),
                    levelOfUser: response.data.authData.levelOfUser
                };
                this.Server.send("MainApi/getProducts", param, SCallBack, ECallBack)
            })
            .catch(error => {
                param = {
                    id: that.state.id,
                    UId: that.state.UId,
                    token: localStorage.getItem("api_token")
                };
                this.Server.send("MainApi/getProducts", param, SCallBack, ECallBack)
            })
    }
    componentWillReceiveProps(nextProps) {
        if((nextProps.location.search && nextProps.location.search.split("id=")[1] != this.state.id) || (!nextProps.location.search && this.state.id) ){
            window.location.reload();
        }
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
    getComment(limit) {
        let that = this;
        this.setState({
            loading:false
        })
        let param = {
            ProductId: this.state.id,
            limit: limit || 5,
            All: 0
        };
        if (limit)
            this.setState({
                CommentCount: this.state.lastCommentCount
            })
        let SCallBack = function (response) {
            that.GetSameProducts();
            if (response.data.result.length == 0)
                that.setState({
                    AlertInShowComment: {
                        text: "نظری برای این محصول ثبت نشده است",
                        err: 0,
                    },

                })
            that.setState({
                lastCommentCount: response.data.result.length,
                Comments: response.data.result
            })
            that.myRef.current.scrollTo(0, 0)

        };

        let ECallBack = function (error) {

        }
        that.Server.send("MainApi/getComment", param, SCallBack, ECallBack)
    }
    GetSameProducts() {
        let that = this;
        let param = {
            ProductId: this.state.ProductId,
            UId: this.state.UId,
            token: this.state.token,
            levelOfUser: this.state.levelOfUser,
            SellerId: this.state.SellerId
        };
        let SCallBack = function (response) {
            that.setState({
                SameData: response.data.result
            })

        };

        let ECallBack = function (error) {

        }
        that.Server.send("MainApi/getSimilarProducts", param, SCallBack, ECallBack)
    }
    SendComment() {
        let that = this;

        if (!this.state.CommentText) {
            that.setState({
                HasError: {
                    text: "متن نظر خود را وارد کنید",
                    err: 1
                }
            })
            return;
        }

        axios.post(that.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                let param = {
                    CommentText: that.state.CommentText,
                    SellerId: that.state.SellerId,
                    ProductId: that.state.id,
                    UserId: response.data.authData.userId,
                    set: 1
                };
                let SCallBack = function (response) {
                    that.setState({
                        HasError: {
                            text: "نظر شما ثبت شد و پس از تایید نمایش می یابد",
                            err: 0
                        }
                    })
                };

                let ECallBack = function (error) {
                    that.setState({
                        HasError: {
                            text: "نظر شما ثبت نشد لطفا مجددا تلاش کنید",
                            err: 1
                        }
                    })
                }
                that.Server.send("MainApi/setOrUpdateComment", param, SCallBack, ECallBack)
            }).catch(error => {
                that.setState({
                    HasError: {
                        text: "برای ارسال نظر باید در سامانه وارد شوید",
                        err: 1
                    }
                })
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
          that.getProduct();

		}, function (error) {
		})
	
	
	  }
    SendToCart(PDId, PId, Number, UId, Price,Allow,CatId) {
        let that = this;
        if(!this.state.UId){
            this.setState({
                GotoLogin:1
            })
        }
        if(!this.state.SaleFromMultiShops && !Allow){
            this.getCartItems(PDId, PId, Number, UId, Price);
            return;
        }
        if(!this.state.ShopIsOpen){
            that.toast.current.show({severity: 'error', summary: 'فروشگاه بسته است', detail: <div className="YekanBakhFaBold">امکان خرید از این فروشگاه وجود ندارد</div>, life: 8000});
            return;
        }
        if(!this.state.InTime){
            if((this.state.Time1=="00:00" && this.state.Time2=="00:00") && (this.state.Time3=="00:00" && this.state.Time4=="00:00")){
                that.toast.current.show({severity: 'warn', summary: 'فروشگاه بسته است', life: 8000});
            }
           
            else if(this.state.Time1 && (this.state.Time3=="00:00" && this.state.Time4=="00:00")){
                that.toast.current.show({severity: 'warn', summary: 'فروشگاه بسته است', detail: <div className="YekanBakhFaBold">ساعت کار امروز فروشگاه <br/>
                صبح  از ساعت {this.state.Time1} تا ساعت {this.state.Time2} 
            </div>, life: 8000});
            }
            else if(this.state.Time3 && (this.state.Time1=="00:00" && this.state.Time2=="00:00")){
                that.toast.current.show({severity: 'warn', summary: 'فروشگاه بسته است', detail: <div className="YekanBakhFaBold">ساعت کار امروز فروشگاه <br/>
                 عصر  از ساعت {this.state.Time3} تا ساعت {this.state.Time4}
            </div>, life: 8000});
            }
            else if(this.state.Time1 && this.state.Time3){
                that.toast.current.show({severity: 'warn', summary: 'فروشگاه بسته است', detail: <div className="YekanBakhFaBold">ساعت کار امروز فروشگاه <br/>
                صبح  از ساعت {this.state.Time1} تا ساعت {this.state.Time2}  <br/> عصر  از ساعت {this.state.Time3} تا ساعت {this.state.Time4}
                </div>, life: 8000});
            }
            
            return;
        }
        
        if(this.state.Colors && this.state.Colors.length > 0 && !this.state.Color){
            that.toast.current.show({severity: 'warn', summary: 'رنگ محصول', detail: <div className="YekanBakhFaBold">رنگ محصول را انتخاب کنید</div>, life: 8000});

            return;
        }
        if(this.state.Sizes && this.state.Sizes.length > 0 && !this.state.Size){
            that.toast.current.show({severity: 'warn', summary: 'اندازه محصول', detail: <div className="YekanBakhFaBold">اندازه محصول را انتخاب کنید</div>, life: 8000});

            return;
        }
        if (!this.state.IsSeveralShop)
            PId = PDId;
        this.setState({
            loading:true
        })    
        axios.post(that.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                let userLocation=0;
                let PeykInfo = that.state.PeykInfo;
                if(!PeykInfo[2].city || !PeykInfo[2].subCity)
                {
                    that.toast.current.show({severity: 'warn', summary: 'عدم امکان خرید', detail: <div className="YekanBakhFaBold"><span className="YekanBakhFaBold">آدرس خود را ثبت کنید</span><br/><br/></div>, life: 8000});
                    that.setState({
                        ShowDialog: true,
                        getAddress:true,
                        loading:false
                    })
                    return;
                }
                if(PeykInfo[2].subCity == PeykInfo[0].subCity)
                    userLocation=1;
                else if(PeykInfo[0].SelectedSubCities && PeykInfo[0].SelectedSubCities.indexOf(PeykInfo[2].subCity) > -1)
                    userLocation=2;
                else if(PeykInfo[2].city == PeykInfo[0].city)
                    userLocation=3;
                else
                    userLocation=4;
                if((userLocation==4 && !PeykInfo[0].SendToCountry) || (userLocation==3 && !PeykInfo[0].SendToState) || (userLocation==2 && !PeykInfo[0].SendToNearCity)|| (userLocation==1 && !PeykInfo[0].SendToCity)){
                    //alert("امکان خرید این محصول با توجه به آدرس محل سکونت شما وجود ندارد");
                    that.toast.current.show({severity: 'warn', summary: 'عدم امکان خرید', detail: <div className="YekanBakhFaBold"><span className="YekanBakhFaBold">امکان خرید این محصول با توجه به آدرس محل سکونت شما وجود ندارد</span><br/><br/><Link to={`${process.env.PUBLIC_URL}/User?ProductId=${that.state.id}`} style={{ textDecoration: 'none', color: '#333' }}>ویرایش آدرس</Link></div>, life: 8000});
                    that.setState({
                        getAddress:true,
                        loading:false
                    })
                    return;
                }    
                PeykInfo[2].userLocation=userLocation;
                let param = {
                    PeykInfo:PeykInfo,
                    PDId: PDId,
                    PId: PId,
                    Number: Number,
                    UId: response.data.authData.userId,
                    Price: Price,
                    Status: "0",
                    Type: "insert",
                    token: localStorage.getItem("api_token"),
                    SellerId: that.state.SellerId,
                    Color: this.state.Color,
                    Size: this.state.Size,
                    IsSeveralShop: this.state.IsSeveralShop
                };
                let SCallBack = function (response) {
                    that.setState({
                        loading:0
                    })
                    let res = response.data.result;
                    let { history } = that.props;

                    history.push({
                        pathname: '/cart'
                    })

                };
                let ECallBack = function (error) {

                    // alert(error)
                }
                that.Server.send("MainApi/ManageCart", param, SCallBack, ECallBack)

            }).catch(error => {
                
                console.log(error)
            })


    }
    getResponse(value) {
        this.setState({
          SelectedCity: value.SelectedCity,
          SelectedSubCity: value.SelectedSubCity
        })
     }
    getCartItems(PDId, PId, Number, UId, Price,Allow,CatId){
        let that=this;
        let param={
            UId : this.state.UId,
            levelOfUser:this.state.levelOfUser

            };
            let SCallBack = function(response){
                let SellerId = that.state.SellerId;
                let sellerName="";
                for(let i=0; i<response.data.result.length ; i++ ){
                    if(response.data.result[i].Seller && response.data.result[i].Seller.length > 0 && SellerId != response.data.result[i].Seller[0]._id){
                        SellerId =null;
                        sellerName = response.data.result[i].Seller[0].name;
                    }
                }
                if(!SellerId){
                    that.toast.current.show({severity: 'error', summary: 'عدم امکان خرید از چند فروشگاه', detail: <div>با توجه به محصولات موجود در سبد خرید شما در حال حاضر فقط می توانید از محصولات فروشگاه {sellerName} خرید کنید <br/>
                    <Link to={`${process.env.PUBLIC_URL}/Cart`} style={{ textDecoration: 'none', color: '#333' }}>ویرایش سبد خرید</Link>
                    </div>, life: 8000});

                }else{
                    that.SendToCart(PDId, PId, Number, UId, Price,true,CatId);

                }
                
            };
            let ECallBack = function(error){
              
                console.log(error)
            }
        this.Server.send("MainApi/getCartPerId",param,SCallBack,ECallBack)
    }
    changeRating(e) {
        this.setState({ rating: e.value });
        let that = this;
        axios.post(that.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                let param = {
                    userId: that.state.UId,
                    productId: that.state.id,
                    rating: that.state.rating
                };
                let SCallBack = function (response) {


                };
                let ECallBack = function (error) {

                }
                that.Server.send("MainApi/SetPoint", param, SCallBack, ECallBack)

            }).catch(error => {
                
                console.log(error)
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
    EditAddress(){
        let that = this;
         
        if(!this.props.mobile)
            return;
        let mobile = this.props.mobile.length > 10 ? this.props.mobile.substring(1) : this.props.mobile;

        let param = {
            username: mobile,
            city: that.state.SelectedCity,
            subCity: that.state.SelectedSubCity,
            address:that.state.Address
        };
        let SCallBack = function (response) {
            that.toast.current.show({ severity: 'success', summary: 'ویرایش آدرس', detail: <div className="YekanBakhFaMedium">آدرس با موفقیت ویرایش شد</div>, life: 8000 });
            that.getProduct();
            that.setState({
                ShowDialog:false,
                getAddress:false
            })

        };
        let ECallBack = function (error) {

        }
        that.Server.send("AdminApi/EditAddress", param, SCallBack, ECallBack)

    }
    render() {
        if (this.state.GotoLogin) {
            return <Redirect to={"/User?ProductId="+this.state.id+""} />;
        }
        return (
            <div ref={this.myRef}>
             <Toast ref={this.toast} position="top-right" style={{fontFamily:'YekanBakhFaBold',textAlign:'right'}} />

                <Header  ComponentName={this.state.title} small="1"/>
                

                {
                !this.state.loading ? 
                <div className="single_product firstInPage" style={{ direction: 'rtl' }} >

                    <div >
                            <div  style={{ padding: 20, borderRadius: 12 }}>

                            <div style={{ marginTop: 20 }} >
                            <Swiper {...params5} >
                                <div>
                                    <img src={this.state.pic1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', width: '100%' }} />
                                </div>
                                <div>
                                    <img src={this.state.pic2} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', width: '100%' }} />
                                </div>
                                <div>
                                    <img src={this.state.pic3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', width: '100%' }} />
                                </div>
                                <div>
                                    <img src={this.state.pic4} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', width: '100%' }} />
                                </div>
                                <div>
                                    <img src={this.state.pic5} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', width: '100%' }} />
                                </div>
                            </Swiper>
                        </div>


                                <div  >



                                    <div  >
                                        <div className="product_description" style={{textAlign:'right'}}>
                                            <div className="product_category YekanBakhFaBold" style={{ display: "none" }}>Laptops</div>
                                            <div className="product_name YekanBakhFaBold" style={{ textAlign: 'right' }}>{this.state.title} <br /> <div style={{ fontSize: 14, marginTop: 15, color: '#b5b5b5' }}>{this.state.subtitle}</div></div>


                                            {this.state.Colors && this.state.Colors.length > 0 &&
                                                <div style={{ textAlign: 'right' }} className="column">
                                                    <SelectButton style={{ textAlign: 'right', marginTop: 20 }} value={this.state.Color} options={this.state.Colors} onChange={(e) => {
                                                       let price = this.state.originalPrice;
                                                        for(let c of this.state.Colors){
                                                            if(c.value == e.value){
                                                                price = parseInt(price) + (parseInt(c.priceChange)||0);    
                                                            }
                                                        }
                                                        this.setState({ Color: e.value,price:price.toString() })
                                                
                                                }}></SelectButton>
                                                </div>
                                            }
                                            {this.state.Sizes && this.state.Sizes.length > 0 &&
                                                <div style={{ textAlign: 'right', marginTop: 20 }} className="column" >
                                                    <SelectButton value={this.state.Size} options={this.state.Sizes} onChange={(e) => {
                                                        let price = this.state.originalPrice;
                                                        for(let s of this.state.Sizes){
                                                            if(s.value == e.value){
                                                                price = parseInt(price) + (parseInt(s.priceChange)||0);    
                                                            }
                                                        }
                                                        this.setState({ Size: e.value,price:price.toString() })

                                                        }}
                                                    ></SelectButton>

                                                </div>
                                            }
                                            <div className={this.state.ShowDescLimit ? "" : "limitHeight"}>
                                                {this.state.desc != "-" &&
                                                <p className="iranyekanwebmedium " style={{ padding: "10px", textAlign: 'right', whiteSpace: 'pre-wrap',marginTop:30 }}>{this.state.desc}</p>
                                                }   
                                            </div>
                                            {this.state.desc && this.state.desc != "-" &&
                                            <div style={{cursor:'pointer',marginTop:20,color:'rgb(195 195 195)'}} className="iranyekanwebmedium " onClick={()=>this.setState({
                                                    ShowDescLimit:!this.state.ShowDescLimit
                                                })}>{!this.state.ShowDescLimit ? ' بیشتر... ' : ''}</div>
                                            }



                                        </div>
                                    </div>
                                    <div >

                                        <div  >
                                            {
                                                this.state.number > 0
                                                    ?
                                                    <div>
                                                        


                                                        <div className="product_text "><p className="YekanBakhFaBold" style={{ padding: "10px", textAlign: 'right' }}><span className="fa fa-star " style={{ marginLeft: 5, color: "#f18517" }}></span>{this.state.ratingText}</p></div>

                                                        <div className="product_text borderBottom" style={{ marginTop: 0 }}><p className="YekanBakhFaBold" style={{ padding: "10px", textAlign: 'right' }}><Rating value={this.state.rating} readonly={this.state.UId ? false : true} cancel={false} onChange={(e) => this.changeRating(e)}></Rating></p></div>

                                                        <div>
                                                        {this.state.SellerName && this.state.IsSeveralShop &&
                                                            <div className="product_text borderBottom" ><p className="YekanBakhFaBold" style={{ padding: "2px",margin:0, textAlign: 'right' }}> فروشنده : <Link to={`${process.env.PUBLIC_URL}/Shop?&name=${this.state.SellerName}&id=` + this.state.SellerId} className="title iranyekanwebmedium" ><span style={{ color: '#333', fontSize: 20 }}>{this.state.SellerName} </span></Link> </p></div>
                                                        }
                                                        {this.state.MainShopInfo.length >0  &&
                                                        <div>

                                                                <div className="product_text borderBottom" ><p className="YekanBakhFaBold" style={{ padding: "2px",margin:0, textAlign: 'right' }}><i className="fal fa-shipping-fast" style={{fontSize:21,color:'green',paddingLeft:7}}></i>آماده ارسال توسط <span style={{ color: '#333', fontSize: 20 }}>{this.state.MainShopInfo[0].name} </span></p></div>

                                                                <div className="product_text borderBottom" ><p className="YekanBakhFaBold" style={{ padding: "2px",margin:0, textAlign: 'right' }}><i className="fal fa-box-open" style={{fontSize:21,color:'green',paddingLeft:7}}></i>موجود در انبار فروشنده</p></div>
                                                                {this.state.ProductBase ?
                                                                <div className="product_text borderBottom" ><p className="YekanBakhFaBold" style={{ padding: "2px",margin:0, textAlign: 'right' }}><i className="fal fa-rocket" style={{fontSize:21,color:'green',paddingLeft:7}}></i>ارسال توسط <span style={{ color: '#333', fontSize: 20 }}>{this.state.MainShopInfo[0].name} </span>  تا <span style={{ color: '#333', fontSize: 20 }}>{this.state.PrepareTime||3} </span>روز کاری دیگر</p></div>
                                                                :
                                                                <div className="product_text borderBottom" ><p className="YekanBakhFaBold" style={{ padding: "2px",margin:0, textAlign: 'right' }}><i className="fal fa-rocket" style={{fontSize:21,color:'green',paddingLeft:7}}></i>ارسال توسط <span style={{ color: '#333', fontSize: 20 }}>{this.state.MainShopInfo[0].name} </span>  تا <span style={{ color: '#333', fontSize: 20 }}>{this.state.PrepareTime||30} </span> دقیقه پس از پرداخت </p></div>
                                                                }

                                                        </div>
                                                     
                                                        }
                                                        </div>


                                                        {
                                                            (this.state.UId || !this.state.ShowPriceAftLogin) ?
                                                                <div style={{marginTop:25}}>
                                                                    <div  style={{textAlign:'center',marginBottom:15,marginBottom:15}}>
                                                                        <InputNumber value={this.state.reqNumber} inputStyle={{borderRadius:0,padding:0,textAlign:'center',fontSize:20}} mode="decimal" showButtons onValueChange={(e) => this.setState({ reqNumber: e.value })} min={1} max={this.state.number} />

                                                                        </div>
                                                                    <div className="col-lg-8 col-12 " style={{textAlign:'center'}}>
                                                                    {
                                                                        ((!this.state.NoOff ? parseInt(this.props.off||0) : 0) + this.state.off) != "0" &&
                                                                        <div className="mt-lg-0 mt-4"> 
                                                                            {
                                                                                ((!this.state.NoOff ? parseInt(this.props.off||0) : 0) + this.state.off) > "0" &&
                                                                                <div className="product_price YekanBakhFaBold oldPrice_product" style={{  textAlign: 'center',textDecoration:'line-through' }}>{this.persianNumber(this.roundPrice(parseInt(this.state.price).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>
                                                                            }
                                                                            {this.state.price > 0 &&
                                                                                <div className="product_price YekanBakhFaBold" style={{  textAlign: 'center', fontSize: 25 }}>{this.persianNumber(this.roundPrice(parseInt(this.state.price - ((this.state.price * ((!this.state.NoOff ? parseInt(this.props.off||0) : 0) + this.state.off)) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                                                            }
                                                                        </div>
                                                                    }
                                                                    {
                                                                        ((!this.state.NoOff ? parseInt(this.props.off||0) : 0) + this.state.off) == "0" &&
                                                                        <div className="product_price YekanBakhFaBold mt-md-0 mt-4" style={{ textAlign: 'center', fontSize: 25 }}>{this.persianNumber(this.roundPrice(this.state.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                                                    }
                                                                    </div>
                                                                    
                                                                    <div className="button_container col-md-12 col-12 borderBottom " style={{marginTop:15}}>
                                                                        
                                                                        <div style={{width:'100%',textAlign:'center'}} >
                                                                        <Button type="button" style={{ marginBottom: 10, paddingTop: 10, paddingBottom: 10, paddingRight: 10, paddingLeft: 10,fontFamily:'YekanBakhFaMedium' }}  className="YekanBakhFaBold p-button-success" onClick={() => { this.SendToCart(this.state.id, this.state.ProductId, this.state.reqNumber, null, (this.roundPrice(this.state.price - ((this.state.price * ((!this.state.NoOff ? parseInt(this.props.off||0) : 0) + this.state.off)) / 100))),null,this.state.CatId) }}><span style={{float:'right'}} className="YekanBakhFaBold" ><i style={{fontSize:25}} className="fal fa-shopping-cart" /></span>  انتقال به سبد خرید</Button>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="borderBottom">

                                                                    <div className="button_container">
                                                                        <Button style={{ marginBottom: 40 }} className=" YekanBakhFaMedium p-button-success" onClick={() => { this.SendToCart(this.state.id, this.state.ProductId, this.state.reqNumber, null, null,null,this.state.CatId) }}>انتقال به سبد خرید</Button>
                                                                        <div className="product_fav"><i className="fas fa-heart"></i></div>
                                                                    </div>
                                                                </div>
                                                        }




                                                    </div>
                                                    :
                                                    <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center', marginBottom: 15, width: '100%' }} ><span className="iranyekanwebmedium product_no" style={{ fontSize: 20, marginTop: 10 }}>ناموجود</span> </div>

                                            }
                                        </div>

                                    </div>
                               
                              



                                </div>
                                {this.state.SameData.length > 0 &&
                                <div style={{backgroundColor: '#fff',padding:20,borderRadius:7,marginTop:50,border:'1px solid #dededed4'}}>
                                    <div>
                                        
                                            <div>
                                                <div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title YekanBakhFaBold" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ خرید این محصول از فروشندگان دیگر </span> </div>

                                                {this.state.SameData.map((item, index) => {
                                                    if(item.number > 0 ){
                                                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                                                        return (
                                                                <div className="row" style={{marginBottom:10}}>
                                                                    {(item.Seller && item.Seller[0] && item.Seller[0].name) &&
                                                                        <div className="col-lg-2 col-md-6 col-12">
                                                                            <div className="car-title yekan" style={{ textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>
                                                                               <span style={{ fontSize: 13, fontWeight: 'bold',display:'flex' }}><i className="fal fa-id-card-alt" style={{fontSize:20,color:'#000',paddingLeft:10}} /><span>{item.Seller[0].name}</span></span>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    <div className="col-lg-3 col-md-6 col-12">
                                                                    <div className="car-title yekan" style={{ textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>
                                                                                {this.state.ProductBase ?
                                                                               <span style={{ fontSize: 13, fontWeight: 'bold',display:'flex' }}><i className="fal fa-truck" style={{fontSize:20,color:'#000',paddingLeft:10}} /><span> ارسال توسط {this.state.MainShopInfo[0].name} تا {this.persianNumber(item.PrepareTime||"3")} کاری دیگر </span></span>
                                                                                    :
                                                                                    <span style={{ fontSize: 13, fontWeight: 'bold',display:'flex' }}><i className="fal fa-truck" style={{fontSize:20,color:'#000',paddingLeft:10}} /><span> ارسال توسط {this.state.MainShopInfo[0].name} تا {this.persianNumber(item.PrepareTime||"30")} دقیقه پس از پرداخت </span></span>
                                                                                }
                                                                               </div>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-6 col-12">
                                                                            <div className="car-title yekan" style={{ textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>
                                                                               <span style={{ fontSize: 13, fontWeight: 'bold',display:'flex' }}><i className="fal fa-umbrella" style={{fontSize:20,color:'#000',paddingLeft:10}} /><span> گارانتی اصالت و سلامت فیزیکی کالا </span></span>
                                                                            </div>
                                                                    </div>
                                                                    <div className="col-lg-2 col-md-6 col-12">
                                                                        {(this.state.UId || !item.ShowPriceAftLogin) &&
                                                                            <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>
                                                                                <span style={{ fontSize: 25, fontWeight: 'bold' }} >{this.persianNumber(this.roundPrice((item.price - (item.price * ((!item.NoOff ? parseInt(this.props.off||0) : 0) + item.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان </span>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className="col-lg-2 col-md-6 col-12" style={{textAlign:'center'}}>
                                                                    <Link  className="btn btn-outline-success iranyekanwebmedium" to={`${process.env.PUBLIC_URL}/Products?name=${item.title}&id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)}><span style={{float:'right'}} ></span>مشاهده جزئیات محصول</Link>
    
                                                                    </div>
    
    
    
    
                                                                </div>
    
    
    
    
                                                        )
                                                    }
                                                   
                                                })
                                                }
                                            </div>
                                       
                                    </div>
                                </div>
                                }
                                {(this.state.CatId && this.state.ProductBase) ? 
                                    <div style={{marginTop:20,display:'none'}}>
                                        <CatList _id={this.state.CatId} name="محصولات مرتبط" ProductBase={this.state.ProductBase}  paddingLeft="0" paddingRight="0" />

                                    </div>    
                                :
                                this.state.SellerId &&
                                    <div style={{marginTop:20,display:'none'}}>
                                        <ShopList _id={this.state.SellerId} name={this.state.SellerName} ProductBase={this.state.ProductBase}  paddingLeft="0" paddingRight="0" />
                                    </div>
                                
                                }

                                {this.state.Tags && this.state.Tags.length > 0 &&
                                <div style={{padding:0,backgroundColor:'#fff',textAlign:'right',borderRadius:5}}>
                                    <p className="iranyekanwebmedium" style={{borderBottom:'1px solid #eee'}}>برچسب های محصول</p>
                                    {this.state.Tags.map((v,i)=>{
                                        return(
                                            <Tag style={{marginLeft:10,marginBottom:10}} severity="info" >
                                            <Link to={`${process.env.PUBLIC_URL}/Tag?tag=${v._id}`} style={{ textDecoration: 'none', color: '#333' }}>

                                            <span className="iranyekanwebmedium" style={{color:'#fff',fontSize:15}}  >{v.title}</span>

                                            </Link>
                                            </Tag>
                                        )
                                    })}
                                </div>
                                }
                                <div style={{marginTop:30,marginBottom:50}} >
                                    <TabView renderActiveOnly={false} style={{ textAlign: 'right', direction: 'rtl' }} activeIndex={0}  >
                                        <TabPanel header="مشخصات" headerClassName="iranyekanwebmedium" rightIcon="fal fa-list">
                                            {this.state.Spec &&
                                                <div className="iranyekanwebmedium" style={{ padding: "10px", textAlign: 'right', marginTop: 20 }}>
                                                    <hr />
                                                    <div style={{ color: '#333', fontSize: 20 }}>مشخصات فنی</div>
                                                    <div style={{ color: '#333', fontSize: 14, marginBottom: 30 }} className="YekanBakhFaLight">{this.state.title}</div>
                                                    {this.state.Spec.map((v, i) => {
                                                        if (v.value && v.value != "-")
                                                            return (<p className="iranyekanwebmedium" style={{ display: 'flex', flexDirection: 'row',margin:5 }}><div className="YekanBakhFaBold" style={{ width: "30%", background: "#f2f2f2", padding: 10,fontSize:14 }}>{v.title}</div><div style={{ width: "5%" }}></div><div className="YekanBakhFaMedium" style={{ width: "65%", background: "#f2f2f2", padding: 10,whiteSpace:'pre-wrap',fontSize:14 }}>{v.value}</div></p>)
                                                    })
                                                    }
                                                </div>
                                            }
                                        </TabPanel>

                                        <TabPanel header="نظرات کاربران    " headerClassName="iranyekanwebmedium" rightIcon="fal fa-comments">
                                            {this.state.Comments.map((v, i) => {

                                                return (

                                                    <Panel header={v.user[0].name + "   .....   " + this.persianNumber(v.date)} className="iranyekanwebmedium" headerClassName="iranyekanwebmedium" style={{ textAlign: 'right', fontFamily: 'IRANiranyekanwebmedium' }}>
                                                        <p className="iranyekanwebmedium" style={{whiteSpace:'pre-line'}} >{v.CommentText}</p>
                                                    </Panel>
                                                )

                                            })

                                            }
                                            {this.state.lastCommentCount != this.state.CommentCount &&
                                                <span style={{ cursor: 'pointer', fontSize: 13, color: '#2557b3', marginRight: 3 }} className="iranyekanwebmedium" onClick={() => this.getComment(this.state.CommentLimit + 5)} >بیشتر</span>
                                            }
                                            {this.state.AlertInShowComment.text ?
                                                <p fade={false} color={this.state.AlertInShowComment.err ? "danger" : "success"} style={{ textAlign: "center" }} className="iranyekanwebmedium">
                                                    {this.state.AlertInShowComment.text}
                                                </p>
                                                : <p></p>
                                            }
                                        </TabPanel>
                                        <TabPanel header="ثبت نظر" rightIcon="fal fa-comment-plus" headerClassName="iranyekanwebmedium" style={{marginBottom:10}} >
                                            <form className="form-signin">
                                                <div >
                                                    <label className="iranyekanwebmedium" style={{ float: 'right' }}>نظر خود را درباره این محصول ثبت کنید</label>

                                                    <textarea className="form-control iranyekanwebmedium" style={{width:'100%'}} type="textarea" id="CommentText" value={this.state.CommentText} name="CommentText" onChange={(e) => this.setState({ CommentText: e.currentTarget.value })} required />
                                                </div>

                                                <Button style={{ marginLeft: 5, marginTop: 10,background:'#00bfd6',padding:'5px 30px 5px 30px',fontFamily:'YekanBakhFaMedium' }} className="YekanBakhFaMedium p-button-primary" onClick={this.SendComment}>ثبت نظر</Button>
                                            </form>
                                            <div>
                                                {this.state.HasError.text ?
                                                    <p color={this.state.HasError.err ? "danger" : "success"} style={{ textAlign: "center" }} className="iranyekanwebmedium">
                                                        {this.state.HasError.text}
                                                    </p>
                                                    : <p></p>
                                                }
                                            </div>
                                        </TabPanel>

                                    </TabView>

                                </div>
                            </div>
                            

                    </div>
                    <Dialog header="" visible={this.state.ShowDialog} maximized={true} onHide={() => {
                            this.setState({
                                ShowDialog: false,
                                getAddress:false
                            });
                        }
                        }>
                            {this.state.getAddress &&
                            <div>
                                <p className="YekanBakhFaMedium" style={{textAlign:'right'}} >آدرس خود را در سیستم ثبت کنید</p>
                               <Cities callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity} />
                               
                               
                               <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 25,marginTop:10 }}>آدرس کامل پستی</label>

                                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center', padding: 20 }}>

                                <textarea className="form-control YekanBakhFaMedium" autocomplete="off" style={{ borderRadius: 5, textAlign: 'right', width: '100%', height: 150,marginTop:20 }} type="number" id="Address" value={this.state.Address} name="Address" onChange={(e) => this.setState({ Address: e.target.value })} required />
                                </div>
                                <div className="button_container" style={{textAlign:'center'}}>
                                    <Button color="success" style={{ marginBottom: 40, fontFamily: 'YekanBakhFaMedium', padding: 5 }} className="YekanBakhFaMedium p-button-primary" onClick={() => { this.EditAddress() }}>ثبت آدرس</Button>
                                </div>
                            </div>

                            
                            }
                        </Dialog>
                </div>
                :
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                    <ProgressSpinner style={{paddingTop:150}}/>
                </div>
                }
                {!this.state.loading ? 
                
                <CartBox />  
                : 
                <div>

                </div>

                }
            </div>
            
        )
    }
}
function mapStateToProps(state) {        
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
    connect(mapStateToProps)(Products)
);
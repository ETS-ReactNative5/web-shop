import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect,Link} from 'react-router-dom'
import { Button,Alert } from 'reactstrap';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

import Server  from './../../Server.js'
import moment from 'moment-jalaali';
const params4 = {
 
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
  }
const params3 = {
    slidesPerView: 1,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
     effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 80,
        shadowScale: 0.94,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
      },
  }
const params1 = {
      slidesPerView: 5,
      spaceBetween: 50,
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
      },
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1024: {
          slidesPerView: 5,
          spaceBetween: 40
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        }
      }
}
const params2 = {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        1024: {
          centeredSlides: false,
          slidesPerView: 5,
          spaceBetween: 40
        },
        768: {
          centeredSlides: false,
          slidesPerView: 3,
          spaceBetween: 30
        },
        640: {
          centeredSlides: false,
          slidesPerView: 2,
          spaceBetween: 20
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        }
      }
    
}
const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  const responsiveOne = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
class MainBox2 extends React.Component {
    constructor(props){
        super(props)
        this.state={
            products : [],
            productsBestOff : [],
            BestShops:[],
            Newproducts: [{
                title :"",
                fileUploaded : "",
                subTitle : "",
                desc : ""
            },
            {
                title :"",
                fileUploaded : "",
                subTitle : "",
                desc : ""
            },
            {
                title :"",
                fileUploaded : "",
                subTitle : "",
                desc : ""
            }] ,
            UId:localStorage.getItem("UId_Users"),
            MaxObj:[],
            HsrajDate:moment(),
            GotoLogin:false,
            GotoCart:false,
            day:0,
            hours:0,
            minutes:0,
            seconds:0,
            absoluteUrl:'https://marketapi.sarvapps.ir/',
            url:  'https://marketapi.sarvapps.ir/MainApi/'/*
            absoluteUrl:'http://localhost:3000/',
            url: 'http://localhost:3000/MainApi/'*/
        }
        this.SendToCart = this.SendToCart.bind(this);
        this.bestsellingTemplate = this.bestsellingTemplate.bind(this);
        this.bestOffTemplate = this.bestOffTemplate.bind(this);
        this.HarajTemplate = this.HarajTemplate.bind(this);

        this.bestShopTemplate = this.bestShopTemplate.bind(this);

        
     



          

        this.getProducts(8,"bestselling");
        this.Server = new Server();
        

       

    }
    persianNumber(input){
		var persian = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
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
    
    bestOffTemplate(item){
        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1]
        return (
          
            <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
                <div className="p-grid p-nogutter" >
                    <div className="p-col-12" align="center" >
                    <img src={img} style={{height:80}}  alt="" />
                    </div>
                    <div className="p-col-12 car-data" style={{marginTop:10}}>
                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>

                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                        <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                        <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>

                        
                    </div>
                    {
                        item.off != "0" &&
                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>

                    }

                </div>
            </Link>
        )
    }
    HarajTemplate(item){
        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1]
        return (
            <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5,height:285}}>
                <div className="p-grid p-nogutter" >
                    <div className="p-col-12" align="center" >
                    <img src={img} style={{height:180}}  alt="" />
                    </div>
                    <div className="p-col-12 car-data">
                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:18}}>{item.title}</div>

                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{item.subTitle}</div>
                        <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                        <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>

                        
                    </div>
                    {
                        item.off != "0" &&
                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>

                    }
                    

                </div>
                </Link>
        )
    }
    bestsellingTemplate(item){
        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1]
        return (
            <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5,height:285}}>
                <div className="p-grid p-nogutter" >
                    <div className="p-col-12" align="center" >
                    <img src={img} style={{height:180}}  alt="" />
                    </div>
                    <div className="p-col-12 car-data">
                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:18}}>{item.title}</div>

                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{item.subTitle}</div>
                        <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                        <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>

                        
                    </div>
                    {
                        item.off != "0" &&
                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>

                    }

                </div>
                </Link>
        )
    }
    bestShopTemplate(item){
        if(item.fileUploaded)
            var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
        else
            var img ="http://siteapi.sarvapps.ir/nophoto.png"    
        return (
            <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5,height:285}}>
                <div className="p-grid p-nogutter" >
                    <div className="p-col-12" align="center" >
                    <img src={img} style={{height:180}}  alt="" />
                    </div>
                    <div className="p-col-12 car-data">
                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:18}}>{item.name}</div>

                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} >{item.subTitle}</div>

                        
                    </div>
                    {
                        item.off != "0" &&
                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{item.off} %</div>

                    }

                </div>
                </Link>
        )
    }
    
    getProducts(l,type){
        axios.post(this.state.url+'getProducts', {
            type: type,
            limit:l
        })
        .then(response => {
            /*let off=[];
            response.data.result.map(function(v,i){
                off[i]=parseInt(v.off);
            })
            let Max = Math.max(...off);
            let obj = null;
            response.data.result.map(function(v,i){
                if(v.off==Max)
                    obj=v;
            })*/
            if(!type){
                if(response.data.result[0]){
                var HarajDate = response.data.result[0].HarajDate,
                    TodayDate = response.data.TodayDate;

    
                if(HarajDate==TodayDate)    
                {  
                    var that=this;
                    var x = setInterval(function() {
                        var distance = new Date(response.data.result[0].HarajDate+" 23:59:59") - new Date(new moment().locale('fa').format("jYYYY/jMM/jDD HH:mm:ss"));

                        var day = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000); 
                      
                        // Display the result in the element with id="demo"
                        that.setState({
                            day:day,
                            hours:hours,
                            minutes:minutes,
                            seconds:seconds
                        })
                      
                        // If the count down is finished, write some text
                        if (distance < 0) {
                            that.setState({
                                MaxObj:[]
                            })
                          clearInterval(x);
                          //document.getElementById("demo").innerHTML = "EXPIRED";
                        }
                      }, 1000);
                  
                    
 
                    var maximg = this.state.absoluteUrl + response.data.result[0].fileUploaded.split("public")[1];
                    this.setState({
                        MaxObj:response.data.result,
                        maximg:maximg
                    })
                }
                }
                this.getProducts(3,"new")
            }else if(type == "bestselling"){
                this.getProducts(10,"bestOff");
                this.setState({
                    products:response.data.result.reverse()
                })

            }
            else if(type == "bestOff"){
                this.getProducts(0);
                this.setState({
                    productsBestOff:response.data.result.reverse() 
                })

            }
            else if(type == "new"){

                this.setState({
                    Newproducts:response.data.result
                })

            }
            
           
            
        })
        .catch(error => {
            console.log(error)
        })

    }
   
    SendToCart(PId,Number,UId,Price){
        let that = this;
        
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
                that.setState({
                    UId : response.data.authData.userId
                })
                let param={
                PId : PId,
                Number : Number,
                UId : response.data.authData.userId,
                Price : Price,
                Status:"0",
                Type:"insert",
                token: localStorage.getItem("api_token")
                };
                let SCallBack = function(response){
                    let res =response.data.result;
                    //alert(res)
                    /*let { history } = that.props;
                    history.push({
                        pathname: '/cart'
                    })*/
                    that.setState({
                        GotoCart:true
                    })
        
                };
                let ECallBack = function(error){
                    alert(error)
                }
                that.Server.send("MainApi/ManageCart",param,SCallBack,ECallBack)

        })
        .catch(error => {
            that.setState({
                GotoLogin:true
            })
            console.log(error)
        })

    }
    render(){
        let C= this.state.MaxObj.length==0 ? "col-lg-12 col-12" : "col-lg-8 col-12" ;
        const responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,   
                numScroll: 1
            }
        ];
        if (this.state.GotoLogin) {
            return <Redirect to={"/login"} push={true}/>;  
        }
        if (this.state.GotoCart) {
            return <Redirect to={"/cart"} push={true}/>;
        }
        return (
           <div className="row justify-content-center" >
                   
                    <div className="col-lg-3  col-12 Haraj pb-3" style={{background:'#fff'}}>
                        
                    {
                        
                   this.state.MaxObj.length !="0" && 
                  
                   <div className="owl-item" >

                    <div className="section-title " style={{marginLeft:0,marginRight:0,textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍ حراج روز </span><Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?Haraj=1`} style={{float: 'left',fontSize:15}} className="IRANYekan">مشاهده همه</Link></div>
                     

           <div className="owl-item deals_item">
               {this.state.MaxObj.length > 0 &&
           
        <Swiper {...params3}>
         {this.state.MaxObj.map((item,index) => {
         var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             return (
                 <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5,marginLeft:0}}>
                 <div className="p-grid p-nogutter" >
                    <div className="p-col-12 c-product-box__img" align="center" >
                        <img src={img}  alt="" />
                    </div>
                     <div className="p-col-12 car-data" style={{marginTop:10}}>
                         <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>
 
                         <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                         {
                         item.number > 0 
                         ?
                            <div>
                            <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#8e7b7b'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                            <div className="car-subtitle yekan" style={{textAlign:'center',marginBottom:15}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>
                            </div>
                         : 
                           <div>
                             <div className="car-subtitle yekan" style={{height:22}} ></div>

                            <div className="car-subtitle yekan" style={{textAlign:'center',marginBottom:15}} ><span className="yekan" style={{fontSize:14,marginTop:10,color:'red'}}>ناموجود</span> </div>
                            </div>
                         }
                         
                     </div>
                     {
                         item.off != "0" &&
                         <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>
 
                     }
 
                 </div>
             </Link>
 
             )
             })
         }
        </Swiper>



                    }
                                       <div className="deals_timer d-flex flex-row align-items-center justify-content-center" style={{marginTop:0}}>
                                           
                                           <div >
                                               <div className="deals_timer_box clearfix" data-target-time="" style={{marginTop:10}}>
                                                  
                                                   <div className="deals_timer_unit">
                                                       <div id="deals_timer1_hr" className="deals_timer_hr yekan" style={{fontSize:12}}>{this.state.hours != "0" ? this.persianNumber(this.state.hours) : ""}</div>
                                                       <span className="yekan" style={{fontSize:12}}>{this.state.hours != "0" ? "ساعت" : "" }</span>
                                                   </div>
                                                   <div className="deals_timer_unit">
                                                       <div id="deals_timer1_min" className="deals_timer_min yekan" style={{fontSize:12}}>{this.persianNumber(this.state.minutes)}</div>
                                                       <span className="yekan" style={{fontSize:12}}>دقیقه</span>
                                                   </div>
                                                   <div className="deals_timer_unit">
                                                       <div id="deals_timer1_sec" className="deals_timer_sec yekan" style={{fontSize:12}}>{this.persianNumber(this.state.seconds)}</div>
                                                       <span className="yekan" style={{fontSize:12}}>ثانیه</span>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                                   <div>

                                   </div>
                               
                                   </div>
                    } 
                        
                    </div>
   <div className="col-lg-9 col-12" style={{background:'#fff'}} >
   <div style={{marginLeft:0,marginRight:0,textAlign:'right',marginBottom: '1.5rem',marginTop: '1.5rem'}}
    ><span className="title yekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍  </span></div>

<Swiper {...params4}>
    
<div  style={{display:'none'}} >
<Link  to={`${process.env.PUBLIC_URL}/admin/Seller`} style={{textDecorationStyle:'none',color:'#333'}}>

<img src={require('../../../public/banner3.jpg')} style={{width:'100%',maxHeight: 500,minHeight:400}} />
  <div className="text yekan" style={{backgroundColor:'rgba(0,0,0,0.8)',color:'#fff'}}>فروشگاه خود را رایگان در <span style={{color:'yellow',fontSize:25}}>آنیا</span> بسازید</div>
  </Link>
</div>
{this.state.Newproducts[0] &&
        <div >
        <Link  to={`${process.env.PUBLIC_URL}/Products?id=`+this.state.Newproducts[0]._id} style={{textDecorationStyle:'none',color:'#333'}}>
        
        <img src={ this.state.Newproducts[0].fileUploaded != "" ? this.state.absoluteUrl + this.state.Newproducts[0].fileUploaded.split("public")[1] : this.state.absoluteUrl + "nophoto.png"} style={{width:'100%',maxHeight: 400,minHeight:300}} />
        <div className="text yekan" style={{backgroundColor:'rgba(0,0,0,0.8)',color:'#fff'}}>{this.state.Newproducts[0].title}</div>
        <div className="text yekan" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)',color: '#fff',height: '60%',width: '40%',marginLeft: 35,top: 0,fontSize:20}}>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[0].subTitle}</span>

        <br/>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[0].desc}</span>
        </div>

        </Link>
        </div>
 }
{this.state.Newproducts[1] &&
        <div >
        <Link  to={`${process.env.PUBLIC_URL}/Products?id=`+this.state.Newproducts[1]._id} style={{textDecorationStyle:'none',color:'#333'}}>

        <img src={ this.state.Newproducts[1].fileUploaded != "" ? this.state.absoluteUrl + this.state.Newproducts[1].fileUploaded.split("public")[1] : this.state.absoluteUrl + "nophoto.png"} style={{width:'100%',maxHeight: 400,minHeight:300}} />
        <div className="text yekan" style={{backgroundColor:'rgba(0,0,0,0.8)',color:'#fff'}}>{this.state.Newproducts[1].title}</div>
        <div className="text yekan" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)',color: '#fff',height: '60%',width: '40%',marginLeft: 35,top: 0,fontSize:20}}>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[1].subTitle}</span>

        <br/>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[1].desc}</span>
        </div>
        </Link>
        </div>
    }
{this.state.Newproducts[2] &&    
        <div>
        <Link  to={`${process.env.PUBLIC_URL}/Products?id=`+this.state.Newproducts[2]._id} style={{textDecorationStyle:'none',color:'#333'}}>
        
        <img src={ this.state.Newproducts[2].fileUploaded != "" ? this.state.absoluteUrl + this.state.Newproducts[2].fileUploaded.split("public")[1] : this.state.absoluteUrl + "nophoto.png"} style={{width:'100%',maxHeight: 400,minHeight:300}} />
        <div className="text yekan" style={{backgroundColor:'rgba(0,0,0,0.8)',color:'#fff'}}>
            {this.state.Newproducts[2].title}
        </div>
        <div className="text yekan" style={{backgroundColor: 'rgba(0, 0, 0, 0.4)',color: '#fff',height: '60%',width: '40%',marginLeft: 35,top: 0,fontSize:20}}>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[2].subTitle}</span>

        <br/>
        <span className="yekan" style={{fontSize:13}}>{this.state.Newproducts[2].desc}</span>
        </div>
        </Link>
        </div>
    }
  
</Swiper>


                    </div>
             
             <div className="col-lg-12 col-12"  style={{background:'#007bff',marginTop:20}} > 
             <div >
             <div className=" backgroundsvg" style={{direction:'rtl',paddingRight:0}}>
             {this.state.products.length > 0 && 
             <Swiper {...params2}>
                    <div style={{maxWidth:170}}>
                        <img src={require('../../../public/b6c724a0.png')} style={{width:170}} />
                    </div>
                        {this.state.products.map((item,index) => {
                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                            return (
                    
                        <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{padding:35,textDecorationStyle:'none',borderRadius:5,background:'#fff',color:'#333',maxWidth:250}}>
                            <div className="p-grid p-nogutter" >
                                <div className="p-col-12 c-product-box__img" align="center" >
                                <img src={img}  alt="" />
                                </div>
                                <div className="p-col-12 car-data" style={{marginTop:10}}>
                                    <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>

                                    <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                           {
                            item.number > 0 
                            ?
                            <div>
                                <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                    <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>
                            </div>
                         : 
                            <div>
                            <div className="car-subtitle yekan" style={{height:22}} ></div>

                            <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{fontSize:14,marginTop:10,color:'red'}}>ناموجود</span> </div>
                            
                            </div>
                         }
                                

                                    
                                </div>
                                {
                                    item.off != "0" &&
                                    <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>

                                }

                            </div>
                        </Link>
                
                            )
                            })
                        }
                   
                </Swiper>
                }
                </div>
                
                </div>
          
             
             
             
              </div>
              <div className="col-lg-12 col-12" style={{backgroundColor:'#fff',marginTop:20,marginBottom:20}}   > 
             <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍ محصولات پر تخفیف</span></div>
             {this.state.productsBestOff.length > 0 && 
             <Swiper {...params1} >
                    {this.state.productsBestOff.map((item,index) => {
                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                            return (
                                <div>
                                <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{padding:5,display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
                                <div className="p-grid p-nogutter" >
                                <div className="p-col-12 c-product-box__img" align="center" >
                                <img src={img}  alt="" />
                                </div>
                                    <div className="p-col-12 car-data" style={{marginTop:10}}>
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>
                
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                                        
                                        
                                        {
                                            item.number > 0 
                                            ?
                                            <div>
                                                <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                                <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>
                                        
                                            </div>
                                        : 
                                            <div>
                                             <div className="car-subtitle yekan" style={{height:22}} > </div>

                                            <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{fontSize:14,marginTop:10,color:'red'}}>ناموجود</span> </div>
                                            </div>
                                        }
                                        
                                    </div>
                                    {
                                        item.off != "0" &&
                                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>
                
                                    }
                
                                </div>
                            </Link>
                            </div>
                
                            )
                            })
                        }
                 </Swiper>
                }
             <div style={{display:'none'}} >
             <Carousel
                swipeable={true}
                draggable={false}
                showDots={false}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                >
                        {this.state.productsBestOff.map((item,index) => {
                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                            return (
                                <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} >
                                <div className="p-grid p-nogutter" >
                                    <div className="p-col-12" align="center" >
                                    <img src={img} style={{height:80}}  alt="" />
                                    </div>
                                    <div className="p-col-12 car-data" style={{marginTop:10}}>
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>
                
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                                        <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                        <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10}}>تومان</span> <span className="yekan" style={{fontSize:20}}>{this.persianNumber((item.price - ((item.price * item.off)/100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>
                
                                        
                                    </div>
                                    {
                                        item.off != "0" &&
                                        <div className="car-title yekan off" style={{position:'absolute',top:0}} >{this.persianNumber(item.off)} %</div>
                
                                    }
                
                                </div>
                            </Link>
                
                            )
                            })
                        }
                </Carousel>
                </div>   
            
            
            
              </div>
             
              </div>
       

        )
    }
}
export default withRouter(MainBox2);

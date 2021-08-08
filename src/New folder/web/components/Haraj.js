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

import './Header1.css'   
import Server  from './Server.js'
import moment from 'moment-jalaali';
import { Navbar,Dropdown,Nav,Icon,Sidenav,Toggle } from 'rsuite';

const params3 = {
    slidesPerView: 1,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
     
      pagination: {
        el: '.swiper-pagination'
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
        super(props);
        this.Server = new Server();

        this.state={
            
            UId:localStorage.getItem("UId_Users"),
            MaxObj:[],
            HsrajDate:moment(),
            
            day:0,
            hours:0,
            minutes:0,
            seconds:0,
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }


        
     



          

        this.getProducts()

       

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
    
    
    
    getProducts(){
        axios.post(this.state.url+'getProducts', {})
        .then(response => {
           
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
                        /*that.setState({
                            day:day,
                            hours:hours,
                            minutes:minutes,
                            seconds:seconds
                        })*/
                      
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

                
            
           
            
        })
        .catch(error => {
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
                   
          
                    <div className="col-lg-12  col-12 Haraj pb-3" style={{background:'#fff',marginTop:30}}>
                        
                        {
                            
                       this.state.MaxObj.length !="0" && 
            <div>          
            <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍ حراج روز</span></div>
  
               
            <Swiper {...params3}>
             {this.state.MaxObj.map((item,index) => {
             var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             var img1 = this.state.absoluteUrl + item.fileUploaded1.split("public")[1];
             var img2 = this.state.absoluteUrl + item.fileUploaded2.split("public")[1];
                 return (
                     <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{background:'#f7f7f7',display:'block',textDecorationStyle:'none',color:'#333',margin:5,padding:5,borderRadius:5,marginLeft:0}}>
                     <div className="row justify-content-center">
                     <div className="col-md-6 col-12">
                            <div className="row" >
                                {item.fileUploaded1 &&
                                <div className="col-md-3 d-md-block d-none">
                                <div style={{border:'1px solid #ccc',borderRadius:5,marginTop:40}}>
                                    <img src={img1}  alt="" style={{padding:10,height:150}} />
                                </div>
                                <div style={{border:'1px solid #ccc',borderRadius:5,marginTop:15}}>
                                    <img src={img2}  alt="" style={{padding:10,height:150}} />
                                </div>
                                

                                </div>
             }
                                <div className="col-md-8 col-12">
                                <img src={img}  alt="" style={{height:450,borderRadius:5}} />

                                </div>
                                
                            </div>

                        </div>
                         <div className="col-md-5 col-12" align="center" >

                            <div className="car-title yekan  mt-md-5" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>
                                
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
                                <div className="ellipsis yekan" style={{textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5,maxWidth:300,lineHeight:3,textDecoration:'none',height:143}} >{item.desc}</div>
                                <div className="row" style={{marginTop:50}}>
                                    <div className="col-md-6 col-12">
                                        
                                    {
                                        item.off != "0" &&
                                        <div style={{position:'relative'}}>
                                            <div className="car-title yekan off" style={{position:'absolute',top:-30,left:3}} > <span> % {this.persianNumber(item.off)} </span> </div>
                                        </div>
                                    } 
                                        
                                    <div className="deals_timer d-flex flex-row align-items-center justify-content-center" style={{marginTop:0}}>
                                               
                                               <div >
                                                   <div className="deals_timer_box clearfix" data-target-time="" style={{marginTop:10}}>
                                                      
                                                       <div className="deals_timer_unit">
                                                           <div id="deals_timer1_hr" className="deals_timer_hr yekan" style={{fontSize:25}}>{this.state.hours != "0" ? this.persianNumber(this.state.hours) : ""}</div>
                                                           <span className="yekan" style={{fontSize:14}}>{this.state.hours != "0" ? "ساعت" : "" }</span>
                                                       </div>
                                                       <div className="deals_timer_unit">
                                                           <div id="deals_timer1_min" className="deals_timer_min yekan" style={{fontSize:25}}>{this.persianNumber(this.state.minutes)}</div>
                                                           <span className="yekan" style={{fontSize:14}}>دقیقه</span>
                                                       </div>
                                                       <div className="deals_timer_unit">
                                                           <div id="deals_timer1_sec" className="deals_timer_sec yekan" style={{fontSize:25}}>{this.persianNumber(this.state.seconds)}</div>
                                                           <span className="yekan" style={{fontSize:14}}>ثانیه</span>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                    <Link  to={`${process.env.PUBLIC_URL}/Products?Haraj=1`}  >

                                    <button className="ps-btn mt-md-1 mt-4" style={{marginTop:8,outline:0}}><span className="yekan" style={{fontSize:12,outline:0}}> همه پیشنهادهای امروز</span></button>
                                    </Link>
                                    </div>
                                </div>
                                 
                                  
                            
                        </div>
                        
                        </div>
     
                 </Link>
     
                 )
                 })
             }
            </Swiper>
            </div>
            }
            </div>
            
              
             
              </div>

        )
    }
}
export default withRouter(MainBox2);

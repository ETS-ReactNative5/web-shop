import React, { Component } from 'react';
import axios from 'axios'  
import {withRouter , Route,Link,Redirect} from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext,ButtonFirst,ButtonLast } from 'pure-react-carousel';
import {
	isTablet,
	isMobileOnly,
	isBrowser
   } from "react-device-detect";
import Server  from './Server.js'
import Carousel from "react-multi-carousel";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import products from './Products'
import { connect } from 'react-redux';

const params = {
	slidesPerView: 5,
	spaceBetween: 5,
	loop:1,
	navigation: {
	    nextEl: '.swiper-button-next',
	    prevEl: '.swiper-button-prev'
	  },
	  breakpoints: {
		1024: {
		  slidesPerView: 5,
		  spaceBetween: 5
		},
		768: {
		  slidesPerView: 4,
		  spaceBetween: 5
		},
		640: {
		  slidesPerView: 2,
		  spaceBetween: 5
		},
		320: {
		  slidesPerView: 1,
		  spaceBetween: 0
		}
	   }
}
const params1 = {
	slidesPerView: 6,
	spaceBetween: 5,
	/*scrollbar: {
		el: '.swiper-scrollbar',
		hide: false,
	   },*/
	   autoplay: {
		delay: 2500
	   },
	  breakpoints: {
		1024: {
		  slidesPerView: 5,
		  spaceBetween: 5
		},
		768: {
		  slidesPerView: 4,
		  spaceBetween: 5
		},
		640: {
		  slidesPerView: 2,
		  spaceBetween: 5
		},
		320: {
		  slidesPerView: 1,
		  spaceBetween: 0
		}
	   }
}



class MainBox4 extends React.Component {
    constructor(props){
	   super(props); 
	   this.Server = new Server();

        this.state={
		products : [],
		id:null,
		UId:null,
		Cat:null,
		CatData2:[],
          CatData1:{},
          CatData4:{},
		CatData3:{},
		CatData4:{},
		BestShops:[],
		Brands:[],
		levelOfUser:null,
		absoluteUrl:this.Server.getAbsoluteUrl(),
		url:this.Server.getUrl()
	 }
	 this.GetBestShop = this.GetBestShop.bind(this);
	 this.GetBrands = this.GetBrands.bind(this);

	 
	 axios.post(this.state.url+'checktoken', {
          token: localStorage.getItem("api_token")
      })
      .then(response => {
		   axios.post(this.state.url+'getSettings', {
			token: localStorage.getItem("api_token")
		   })
		   .then(response => {
			this.setState({
			    isSeveralShop:response.data.result ? response.data.result.SeveralShop : false,
				ProductBase: response.data.result ? response.data.result.ProductBase : false

			})
		   })
		   .catch(error => {
			console.log(error)
		   })
              this.setState({
                  UId : response.data.authData.userId,
                  levelOfUser:response.data.authData.levelOfUser
              })
              this.GetBrands();
        })
        .catch(error => {
          this.GetBrands();
      })
	 
	 
    

    }
  
   roundPrice(price){
	return price.toString();
	if(price==0)
	    return price;
	price=parseInt(price).toString();
	let C="500";
	let S=3;
	if(price.length <= 5){
	    C="100";
	    S=2;
	}
	if(price.length <= 4){
	    C="100";
	    S=2;
	}
	let A = price.substr(price.length-S,S)
	if(A==C || A=="000" || A=="00")
	  return price;
	if(parseInt(A) > parseInt(C)){
	  let B=parseInt(A)-parseInt(C);
	  return (parseInt(price) - B + parseInt(C)).toString();
	}else{
	  let B = parseInt(C) - parseInt(A);
	  return (parseInt(price) + B).toString();
	}    
 
 
 }
   GetBestShop(){

	axios.post(this.state.url+'getShops', {
	    type: "best",
	    limit:3
	})
	.then(response => {
	    this.setState({
		   BestShops:response.data.result
	   })
	})
	.catch(error => {
	    console.log(error)
	})

   }
   GetBrands(){
	axios.post(this.state.url+'GetBrands', {
		showInSite: true
	})
	.then(response => {
	    this.setState({
		Brands:response.data.result
	   })
	})
	.catch(error => {
	    console.log(error)
	})

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
				  //alert(error)
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
	 if (this.state.id) {
		return <Redirect to={"/products?id="+this.state.id} push={true}/>;
	 }
	 if (this.state.GotoLogin) {
		return <Redirect to={"/login"} push={true}/>;
	 }
	 if (this.state.GotoCart) {
		return <Redirect to={"/cart"} push={true}/>;
	 }
      return (
		 <div style={{paddingLeft:20,paddingRight:20}}>
	
		<div className="row justify-content-center" style={{marginRight:15,marginLeft:15}} >
		{this.state.Brands.length > 0 && 
			<div className="col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20,borderRadius:20}}>
			
				<div className="section-title " style={{textAlign:'right'}}><span className="title iranyekanweblight" style={{fontSize:16,color:'gray',marginTop:10}} >{this.props.BrandTitle}</span></div>

				
				<Swiper {...params1}>
				{this.state.Brands.map((data) => {
				let img = data.logo ? this.state.absoluteUrl + data.logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png";
				
				return (

					<Link  to={data.address} style={{textAlign:'center'}} >

						<div style={{textAlign:'center'}}><img style={{maxwidth:300,borderRadius:15,marginBottom:15,height:100}} alt={data.name} src={img} /></div>
						<span style={{textAlign:'center'}} className="iranyekanweblight">{data.name}</span>
					</Link>  
					
				)
			})}
			</Swiper>
    			
			</div>
			}
			{this.state.BestShops.length > 0 && 
			<div className="col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20,borderRadius:20}}>
			
				<div className="section-title " style={{textAlign:'right'}}><span className="title iranyekanweblight" style={{fontSize:16,color:'gray',marginTop:10}} >‍‍‍‍‍‍‍ محبوب ترین فروشگاهها </span></div>

				
				<Swiper {...params1}>
				{this.state.BestShops.map((data) => {
				let img = data.logo ? this.state.absoluteUrl + data.logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png";
				
				return (

					<Link  to={`${process.env.PUBLIC_URL}/Shop?id=`+((data.product_detail && data.product_detail.length>0) ? data.product_detail[0]._id : data._id)} >

						<div style={{textAlign:'center'}}><img style={{width:110,borderRadius:15,marginBottom:15}} src={img} /></div>
						<div style={{textAlign:'center',display:'none'}} className="iranyekanweblight">{data.name}</div>
					</Link>  
					
				)
			})}
			</Swiper>
    			
			</div>
			}
			
			
			
			
				   
		</div>
		</div>
        )
    }
}
const mapStateToProps = (state) => {
	return{
		CartNumber : state.CartNumber,
		off : state.off
	}
   }
   export default withRouter(
	connect(mapStateToProps)(MainBox4)
   );
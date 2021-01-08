import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,Link,Redirect} from 'react-router-dom'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext,ButtonFirst,ButtonLast } from 'pure-react-carousel';
import {
	isTablet,
	isMobileOnly,
	isBrowser
   } from "react-device-detect";
import Server  from './../../Server.js'
import Carousel from "react-multi-carousel";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
const params = {
	slidesPerView: 5,
	spaceBetween: 50,
	navigation: {
	    nextEl: '.swiper-button-next',
	    prevEl: '.swiper-button-prev'
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
const params1 = {
	slidesPerView: 5,
	spaceBetween: 50,
	
	   autoplay: {
		delay: 2500,
		disableOnInteraction: false
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



class MainBox4 extends React.Component {
    constructor(props){
        super(props); 
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
		absoluteUrl:'https://marketapi.sarvapps.ir/',
		url:'https://marketapi.sarvapps.ir/MainApi/'
		/*absoluteUrl:'http://localhost:3000/',
		url:'http://localhost:3000/MainApi/'*/
	 }
	 this.SendToCart = this.SendToCart.bind(this);
	 this.CatTemplate = this.CatTemplate.bind(this);
	 this.GetBestShop = this.GetBestShop.bind(this);

	 
	 this.Server = new Server();
	 this.GetBestShop();
     
    

    }
    getCats(){
	let that = this;
		    let SCallBack = function(response){
			console.log(response.data.result)
			that.setState({
				Cat:response.data.result
			 })
			 that.getProductsPerCat(response.data.result[0],1)
	 
		    };
		    let ECallBack = function(error){
			   alert(error)
		    }
		    that.Server.send("MainApi/GetCategory",{},SCallBack,ECallBack)

	 
  
  
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
	   this.getCats();
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
   getProductsPerCat(param,lastIndex){
	let that = this;
	let SCallBack = function(response){
		let res = {
			name : param.name,                 
			id:  param._id,
			data : response.data.result    
		   }     
	 
		   switch(lastIndex){ 
			case 1 :{
			  that.setState({     
			    CatData1: res     
			  })   
	
			  break;
			}
			case 2 :{
			  that.setState({     
			    CatData2: res
			  })
			  break;
			}
			case 3 :{
			  that.setState({     
			    CatData3: res
			  })
			  break;
			}
			case 4 :{
			  that.setState({     
			    CatData4: res
			  })
			  break;      
			}
		   }
		   if(that.state.Cat[lastIndex])
		      that.getProductsPerCat(that.state.Cat[lastIndex],lastIndex+1);

	};
	let ECallBack = function(error){
	    alert(error)
	}
	that.Server.send("MainApi/GetProductsPerCat",{id:param._id,limit:4},SCallBack,ECallBack)
	   }
	CatTemplate(item){
		var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1]
		return (
		    <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5,height:285}}>
			   <div className="p-grid p-nogutter" style={{cursor:'pointer'}} >
				  <div className="p-col-12" align="center" >
				  <img src={img} style={{width:'90%',height:180}}  alt="" />
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
		 <div>
	
		<div className="row justify-content-center" style={{marginRight:15,marginLeft:15}} >
			{
			this.state.CatData1.data &&
		<div className="col-lg-12 col-md-12 col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20}}>
		<div className="section-title " style={{marginLeft:10,marginRight:10,textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:14,color:'gray'}} >‍‍‍‍‍‍‍ {this.state.CatData1.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?id=`+this.state.CatData1.id} className="title IRANYekan" style={{fontSize:13,float:'left'}}> ... بیشتر  </Link></div>
		<Swiper {...params}>
         {this.state.CatData1.data.map((item,index) => {
         var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             return (
			<Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
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
			
		

			</div>
			}

			<div className="col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20}}>
			
				<div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray',marginTop:10}} >‍‍‍‍‍‍‍ محبوب ترین فروشگاهها </span></div>

				{this.state.BestShops.length > 0 && 
				<Swiper {...params1}>
				{this.state.BestShops.map((data) => {
				let img = data.logo ? this.state.absoluteUrl + data.logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png";
				
				return (

					<Link  to={`${process.env.PUBLIC_URL}/Shop?id=`+data._id} >

						<div style={{textAlign:'center'}}><img style={{width:110,borderRadius:15,marginBottom:15}} src={img} /></div>
						<div style={{textAlign:'center',display:'none'}} className="yekan">{data.name}</div>
					</Link>  
					
				)
			})}
			</Swiper>
    			}
			</div>
			{
			this.state.CatData2.data &&
			<div className="col-lg-12 col-md-12 col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20}}>
				 <div className="section-title " style={{marginLeft:10,marginRight:10,textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:14,color:'gray'}} >‍‍‍‍‍‍‍ {this.state.CatData2.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?id=`+this.state.CatData2.id} className="title IRANYekan" style={{fontSize:13,float:'left'}}> ... بیشتر  </Link></div>
				 <Swiper {...params}>
         {this.state.CatData2.data.map((item,index) => {
         var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             return (
			<Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
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
			
		

			</div>
			}
			{
			this.state.CatData3.data &&
			<div className="col-lg-12 col-md-12 col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20}}>
				 <div className="section-title " style={{marginLeft:10,marginRight:10,textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:14,color:'gray'}} >‍‍‍‍‍‍‍ {this.state.CatData3.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?id=`+this.state.CatData3.id} className="title IRANYekan" style={{fontSize:13,float:'left'}}> ... بیشتر  </Link></div>
				 <Swiper {...params}>
         {this.state.CatData3.data.map((item,index) => {
         var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             return (
			<Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
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
                            : <div>
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
			
		

			</div>
			}
			{
			this.state.CatData4.data &&
			<div className="col-lg-12 col-md-12 col-12" style={{direction:'rtl',backgroundColor:'#fff',marginTop:20,marginBottom:20}}>
				 <div className="section-title " style={{marginLeft:10,marginRight:10,textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:14,color:'gray'}} >‍‍‍‍‍‍‍ {this.state.CatData4.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?id=`+this.state.CatData4.id} className="title IRANYekan" style={{fontSize:13,float:'left'}}> ... بیشتر  </Link></div>
				 <Swiper {...params}>
         {this.state.CatData4.data.map((item,index) => {
         var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
             return (
			<Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+item._id} style={{display:'block',textDecorationStyle:'none',color:'#333',border:"1px solid #cac1c1",margin:5,padding:5,borderRadius:5}}>
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
			
		

			</div>
			}
				   
		</div>
		</div>
        )
    }
}
export default MainBox4;
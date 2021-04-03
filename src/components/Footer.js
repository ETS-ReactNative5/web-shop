import React, { Component } from 'react';
import Server  from './Server.js'
import {BrowserRouter , Route,withRouter,Redirect,Link} from 'react-router-dom'
   
class Footer extends React.Component {
	constructor(props){
		super(props);
		this.Server = new Server();
		this.state = {
		  GridInfo:[],
		  GridBlogs:[],
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
		}
	 
		
	   }
	   componentDidMount(){
		let that = this;
		let param={
			main:true
		};
		that.setState({
			loading:1
		})
		let SCallBack = function(response){
			that.setState({
				GridInfo : response.data.result
			})
			that.getBlogs();
		};
		let ECallBack = function(error){
			that.setState({
			loading:0
			})
			console.log(error)
		}
		this.Server.send("AdminApi/ShopInformation",param,SCallBack,ECallBack)
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
	   getBlogs(){
		let that = this;
		let param={limit:5};
		that.setState({
			loading:1
		})
		let SCallBack = function(response){
			that.setState({
				GridBlogs : response.data.result
			})
		};
		let ECallBack = function(error){
			that.setState({
			loading:0
			})
			console.log(error)
		}
		this.Server.send("AdminApi/getBlogs",param,SCallBack,ECallBack)
	   }
    render(){
        return (
 			 <footer className="footer-area" style={{marginTop:20,paddingTop:40,paddingBottom:0}}>
				<div className="container">
					<div className="row">
						<div className="col-md-3 col-12 order-md-1 order-3" style={{borderLeft:'1px solid #e2e2e2'}}>
							  {this.state.GridInfo[0] &&
							     
								<p className="YekanBakhFaBold" style={{color:'green',textAlign:'center',fontSize:14,whiteSpace:'pre-wrap',lineHeight:2}}>
									<i className="fal fa-phone-plus" style={{color:'#333',display:'block',fontSize:40,marginBottom:20}}></i>
									{this.persianNumber(this.state.GridInfo[0].call)}
								</p>
    							  }
							  {this.state.GridInfo[0] &&
								<p className="YekanBakhFaBold" style={{textAlign:'right',fontSize:14,whiteSpace:'pre-wrap'}}>	
									<div>آدرس</div>
									{this.persianNumber(this.state.GridInfo[0].address)}
								</p>
    							  }
							
							<div>
								
							</div>
							
						</div>
						<div className="col-md-3 col-12 order-md-2 order-2" style={{borderLeft:'1px solid #e2e2e2'}}>
							{
								this.state.GridBlogs && this.state.GridBlogs.length > 0 &&
							<div>

							<p  className="YekanBakhFaBold" style={{textAlign:'right'}}><i className="fal fa-link"></i> آخرین مقالات</p>
							{
								this.state.GridBlogs.map(function(item,index){
									if(!item.FixPage){
										return (
											<Link  to={`${process.env.PUBLIC_URL}/Blogs?id=`+item._id} className="" target="_blank" href="#" style={{textDecoration:'none'}}>
												<p className="YekanBakhFaBold" style={{color:'#333',textAlign:'right',fontSize:12}}  >{item.title}</p>
											</Link>
										)
									}
									
								})
							}
							</div>
							
						}

							  
						</div>
						
						 
						<div className="col-md-6 col-12 order-md-3 order-1" style={{position:'relative'}}>
							{(this.state.GridInfo[0] && this.state.GridInfo[0].about) ?
							<div style={{overflow:'hidden'}}>	
								<p className="YekanBakhFaBold" style={{whiteSpace:'pre-wrap',textAlign:'justify',fontSize:13}}>
									<div className="row" style={{display:'none'}}>
										<div className="col-lg-8 col-12">
											<p style={{textAlign:'center'}} >
											{
												this.state.GridInfo[0]&&this.state.GridInfo[0].name &&
													<h2 className="YekanBakhFaMedium">{this.state.GridInfo[0].name}</h2>
											}
											</p>
										</div>
										<div className="col-lg-4 col-12">
											<div style={{textAlign:'center'}} >
												{
													this.state.GridInfo[0]&&this.state.GridInfo[0].logo &&
													<img  src={this.state.absoluteUrl+this.state.GridInfo[0].logo.split("public")[1]} style={{width : 160,borderRadius:15,padding:10}} name="pic3"  alt="" />
												}
											</div>
										</div>
									</div>
									<div dangerouslySetInnerHTML={{ __html: this.state.GridInfo[0].about}} >
									</div>
											
								</p>
							</div>
							:
							<div>

							</div>
    						}
						</div>
					</div>
					
				</div>
				<div style={{background:'#505050'}}>
					{this.state.GridInfo.length > 0 &&
					<div style={{textAlign:'center'}}>
						<p style={{margin:0}} className="yekan">استفاده از مطالب فروشگاه اینترنتی {this.state.GridInfo[0].name} فقط برای مقاصد غیرتجاری و با ذکر منبع بلامانع است. کلیه حقوق این سایت متعلق به {this.state.GridInfo[0].name} می‌باشد.</p>
					</div>
					
					}
					<div style={{textAlign:'center',paddingBottom:10}}>
							<p style={{margin:0}} className="yekan">طراحی و پیاده سازی توسط <a href="http://sarvapps.ir" target="_blank" style={{color:'#a9a9a9'}}>گروه نرم افزاری آنیا</a></p>
					</div>
				</div>
			</footer>


        )
    }
}
export default Footer;
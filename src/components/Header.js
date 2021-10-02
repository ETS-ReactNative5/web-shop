import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { Toast } from 'primereact/toast';

import ReactGA from 'react-ga';

import { Dialog } from 'primereact/dialog';

import Server from './Server.js'
import { FlexboxGrid } from 'rsuite';
/*
import {Autocomplete} from 'react-native-autocomplete-input'
   */
let Cound = 0;

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.op = React.createRef();
        this.CreateSubSystem = this.CreateSubSystem.bind(this);
		this.toast = React.createRef();

		this.Server = new Server();
		this.data = "dssddsdss"
		this.logout = this.logout.bind(this);
		this.state = {
			logout: false,
			GotoLogin: false,
			userId: null,
			searchText: '',
			name: "",
			brand: "",
			logo: "",
			selectedproductId: null,
			selectedCatId: null,
			top_image: '',  
			RegisterByMob: true,
			_id: [],
			img: [],
			desc: [],
			Count: -1,
			brandSuggestions: null,
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl(),
			isAdmin: 0
		}

		axios.post(this.state.url + 'checktoken', {
			token: localStorage.getItem("api_token")
		})
			.then(response => {
				this.setState({
					userId: response.data.authData.userId,
					name: response.data.authData.name,
					isAdmin: response.data.authData.level
				})
				
				axios.post(this.state.absoluteUrl + 'MainApi/getuserInformation', { user_id: response.data.authData.userId }).then(response => {

					axios.post(this.state.absoluteUrl + 'AdminApi/ShopInformation', { main: true }).then(response => {
						this.setState({
							logo: response.data.result[0].logo
						})
						this.getPics();
					}).catch(error => {
						console.log(error)
					})
				}).catch(error => {
					console.log(error)
				})
				

			})
			.catch(error => {
				axios.post(this.state.absoluteUrl + 'AdminApi/ShopInformation', { main: true }).then(response => {
					this.setState({
						logo: response.data.result[0].logo
					})
					this.getPics();
				}).catch(error => {
					console.log(error)
				})
			})
	}
	CreateSubSystem(){

		let param={
		  name : this.state.name,
		  latinName: this.state.latinName,
		  pass : this.state.pass,
		  mobile : this.state.mobile
		};  
		let that = this;
		let SCallBack = function(response){
		  localStorage.setItem("api_token","")
		  
		  if(response.data.error)
			that.toast.current.show({severity: 'error', summary: 'ایجاد زیر سیستم', detail: <div><span> {response.data.result}</span></div>, life: 8000});
		  else{
			that.toast.current.show({severity: 'success', summary: 'ایجاد زیر سیستم', detail: <div><span>زیر سیستم <span>{that.state.name}</span> با موفقیت ایجاد شد </span><br/><Link to={`${process.env.PUBLIC_URL}/Login`} style={{ textDecoration: 'none', color: '#333' }}>ورود به سیستم</Link></div>, life: 8000});
			that.setState({
			  VisibleDialog:false
			})
			
		  }
  
		  
  
		};
		let ECallBack = function(error){
		  that.toast.current.show({severity: 'error', summary: 'ایجاد زیر سیستم', detail: <div><span> اشکال در ثبت زیر سیستم</span></div>, life: 8000});
		}
		this.Server.send("AdminApi/CreateSubSystem",param,SCallBack,ECallBack)
  
	  }
	onSelect(event) {
		var _id = event.originalEvent.target.getAttribute("_id");
		var _catId = event.originalEvent.target.getAttribute("_catId")
		var _tagId = event.originalEvent.target.getAttribute("_tagId")
		ReactGA.event({
			category: 'Search',
			action: 'Search',
			label: 'Search'
		  });
		this.setState({
			brand: event.value.title
		})
		if (!_id && !_catId && !_tagId) {
			try {
				_id = event.originalEvent.target.nextElementSibling.nextElementSibling.children[0].getElementsByClassName("p-highlight")[0].getElementsByClassName("row")[0].getAttribute("_id");
				_catId = event.originalEvent.target.nextElementSibling.nextElementSibling.children[0].getElementsByClassName("p-highlight")[0].getElementsByClassName("row")[0].getAttribute("_catId");
				_tagId = event.originalEvent.target.nextElementSibling.nextElementSibling.children[0].getElementsByClassName("p-highlight")[0].getElementsByClassName("row")[0].getAttribute("_tagId");

			} catch (e) {

			}
		}
		if(_id){
			this.setState({ brand: event.value, selectedproductId: _id })

		}else if(_catId){
			this.setState({ brand: event.value, selectedCatId: _catId })

		}
		else if(_tagId){
			this.setState({ brand: event.value, selectedTagId: _tagId })
		}
		setTimeout(function () {
			window.location.reload();
		}, 0)
	}


	suggestBrands(event) {

		let that = this;
		this.setState({ brand: event.query, Count: 0 });
		axios.post(this.state.url + 'searchItems', {
			title: event.query
		})
			.then(response => {

				let brandSuggestions = []
				response.data.result.reverse().map(function (v, i) {

					brandSuggestions.push({ _id: ((v.product_detail && v.product_detail.length > 0) ? v.product_detail[0]._id : v._id),name:v.name,catId:v.name ? v._id : null,tagId:(!v.name && typeof v.subTitle == "undefined") ? v._id : null, title: v.title, subTitle: v.subTitle, desc: v.desc, img: v.fileUploaded })
				})

				that.setState({ brandSuggestions: brandSuggestions });


			})
			.catch(error => {
				console.log(error)
			})

	}
	itemTemplate(brand) {
		Cound = 0;
		if(!brand.catId){
			if(!brand.tagId){
			return (
				<div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
					<div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >
	
						<div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>{brand.desc &&
							<span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _id={brand._id} >
								<span style={{whiteSpace:'pre-wrap'}} _id={brand._id}>{brand.title}</span><br />
								<span style={{whiteSpace:'pre-wrap'}} _id={brand._id}>{brand.subTitle}</span>
							</span>
						}
						</div>
						<div _id={brand._id} className="col-4">{brand.img &&
							<img src={this.state.absoluteUrl + brand.img.split("public")[1]} style={{ width: 100, height: 100, minWidth: 100 }} _id={brand._id} />
						} </div>
					</div>
				</div>
			);
		  }else{

			return (
				<div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
					<div style={{ margin: '10px 10px 0 0' }} className="row" _tagId={brand.tagId} >
	
						<div className="col-12" _id={brand.tagId} style={{ textAlign: 'right' }}>
							<span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _tagId={brand.tagId} >
								
								<span _tagId={brand.tagId} style={{color:'#ccc'}}>مشاهده محصولات با برچسب  : </span><span style={{whiteSpace:'pre-wrap'}} _tagId={brand.tagId}>{brand.title}</span><br />
							</span>
						</div>
						
					</div>
				</div>
			);

		  }
		}else{
			return (
				<div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
					<div style={{ margin: '10px 10px 0 0' }} className="row" _catId={brand.catId} >
	
						<div className="col-12" _id={brand.catId} style={{ textAlign: 'right' }}>
							<span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _catId={brand.catId} >
								
								<span _catId={brand.catId} style={{color:'#ccc'}}>مشاهده دسته بندی : </span><span style={{whiteSpace:'pre-wrap'}} _catId={brand.catId}>{brand.name}</span><br />
							</span>
						</div>
						
					</div>
				</div>
			);
		}
		

	}

	Search(event) {
		return;

	}
	getPics(l, type) {
		let that = this;
	
		axios.post(this.state.url + 'getPics', {})
		  .then(response => {
			response.data.result.map(function (item, index) {
			  if (item.name == "file12" && item.fileUploaded){
				  that.setState({
					top_image: that.state.absoluteUrl + item.fileUploaded?.split("public")[1]
				  })
			  }
			
			that.getSettings();	  
			})
		  })
		  .catch(error => {
		  })
	
	  }
	  getSettings() {
		let that = this;
	
		that.Server.send("AdminApi/getSettings", {}, function (response) {
	
		  if (response.data.result) {
			that.setState({
			  RegisterByMob: response.data.result[0] ? response.data.result[0].RegisterByMob : false,
			  ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
			})
			window.CRISP_WEBSITE_ID = response.data.result[0] ? response.data.result[0].ChatId : '';
	
		  }
		}, function (error) {
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
	logout(e) {
		if (!this.state.userId) {
			this.setState({
				GotoLogin: true
			})
			return;
		}
		localStorage.setItem("api_token", "")
		localStorage.setItem("CartNumber", 0)
		this.props.dispatch({
			type: 'LoginTrueUser',
			userId: null,
			CartNumber: 0,
			off: 0
		})
		this.setState({
			userId: null,
			logout: true
		})
		window.location.reload();

	}

	render() {
		if (this.state.GotoLogin)
			return <Redirect to='/login' />;
		return (
			<div style={{ background: '#fff', paddingBottom: 10 }}>
				
				{this.state.top_image ?
				<div style={{ height: 35, padding: 5, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '50%', backgroundImage: `url(${this.state.top_image})` }} ></div>
				:
				<div ></div>
				}
				<div >
					<div className="row" style={{ direction: 'ltr', marginTop: 15, alignItems: 'center', marginLeft: 0, marginRight: 0,borderBottom:'1px solid #eee',padding:8 }}>
					{this.state.userId ?
						<div className="col-lg-8 col-12 order-lg-1 order-2 text-lg-left text-right">
							<div className="wishlist_cart d-flex flex-row align-items-center " style={{ justifyContent: 'flex-start' }}>
							
								<div className="cart_container d-flex flex-row align-items-baseline">
									<div className="cart_icon">
									</div>
									<div style={{ marginRight: 5, marginLeft: 5 }}>
									<Link to={`${process.env.PUBLIC_URL}/`} style={{fontSize: 14}} className="btn btn-warning btn-lg btn-block yekan">خانه</Link>

									</div>
									<div style={{ marginRight: 5, marginLeft: 5 }}>
										{this.state.isAdmin == "1" &&

											<Link to={`${process.env.PUBLIC_URL}/admin/admin`} style={{fontSize: 14}} className="btn btn-success btn-lg btn-block yekan">محیط کاربری</Link>
										}
									</div>
									<div style={{ marginRight: 5, marginLeft: 5 }}>
										<button className="btn btn-danger btn-lg btn-block yekan" style={{ whiteSpace: "nowrap",marginTop:20, fontSize: 14 }} onClick={this.logout} >خروج از سیستم</button>

									</div>
								</div>

							</div>
						</div>
						:
						<div className="col-lg-3 col-12 order-lg-1 order-2 text-lg-left text-right">
						{this.props.Company &&
                          <div style={{width:'100%',textAlign:'center',display:'flex',justifyContent:'space-evenly'}}>
                           <button className="btn btn-warning YekanBakhFaMedium" style={{marginTop:10,width:180}} onClick={()=>{this.setState({
                             VisibleDialog:true
                           })}}>

                             <span >عضویت رایگان !</span>
                           </button>
						   <Link to={`${process.env.PUBLIC_URL}/Login`} style={{ marginTop:10,width:180,textDecoration: 'none', fontSize: 16,fontStyle:'normal' }} className="btn btn-success YekanBakhFaMedium">ورود</Link>

                          </div>
                        }
						</div>
						}

						<div className={this.state.userId ? "col-lg-4 col-12 order-lg-3 order-1" : "col-lg-9 col-12 order-lg-3 order-1"}>
							<div className="text-lg-right text-center mr-lg-4 mr-0 ">
								{this.state.logo &&
									<div className="text-lg-right text-center" >

										<Link to={`${process.env.PUBLIC_URL}`}>
											<img src={this.state.absoluteUrl + this.state.logo.split("public")[1]} style={{maxHeight:65}} className="hvr-pulse-shrink" />
										</Link>
									</div>
								}
							</div>
						</div>
					</div>
					<Dialog visible={this.state.VisibleDialog} onHide={()=>{this.setState({ VisibleDialog: null });}}  style={{ width: '700px' }} maximizable={false} maximized={false}>
                  <div className="row">
                  <div className="col-12" style={{textAlign:'center',marginTop:15}}>
                  <p className="YekanBakhFaBold" style={{fontSize:18}}>پس از ساخت زیر سیستم بلافاصله امکان استفاده از امکانات آن برای شما فراهم خواهد شد</p>
                  </div>
                  <div className="col-12">
                    <div className="group">

                            <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="name" name="name" value={this.state.name} onChange={(event)=>{this.setState({name:event.target.value})}} required />
                            <label className="YekanBakhFaBold">نام مجموعه</label>
                    </div>
                    </div>

                    <div className="col-12">
                      <div className="group">
                              <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="latinName" name="latinName" value={this.state.latinName} onChange={(event)=>{this.setState({latinName:event.target.value})}} required />
                              <label className="YekanBakhFaBold">نام لاتین (آدرس صفحه اختصاصی شما با این نام شناخته میشود)</label>
                      </div>
                    </div>
                    
                    <div className="col-12">
                    <div className="group">
                        <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="mobile" name="mobile" value={this.state.mobile} onChange={(event)=>{this.setState({mobile:event.target.value})}} required />
                        <label className="YekanBakhFaBold">شماره موبایل (این شماره به عنوان نام کاربری شما در سایت در نظر گرفته می شود) </label>
                    </div>
                    
                    </div>
                    <div className="col-12">
                    <div className="group">
                            <input type="password" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="pass" name="pass" value={this.state.pass} onChange={(event)=>{this.setState({pass:event.target.value})}} required />
                            <label className="YekanBakhFaBold">رمز عبور</label>
                    </div>
                      </div>
                      <div className="col-12">
                      <button className="btn btn-info YekanBakhFaMedium" style={{marginTop:10}} onClick={this.CreateSubSystem}>ساخت </button>
                      </div>
                   
                  </div>
                </Dialog>
				<Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

				</div>

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
	connect(mapStateToProps)(Header)
);

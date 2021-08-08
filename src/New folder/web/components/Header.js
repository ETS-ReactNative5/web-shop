import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { OverlayPanel } from 'primereact/overlaypanel';

import ReactGA from 'react-ga';

import { AutoComplete } from 'primereact/autocomplete';

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
			  if (item.name == "file12")
				that.setState({
				  top_image: that.state.absoluteUrl + item.fileUploaded?.split("public")[1]
				})
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

		return (
			<div style={{ background: '#fff', paddingBottom: 10 }}>
				
				{this.state.top_image ?
				<div style={{ height: 35, padding: 5, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '50%', backgroundImage: `url(${this.state.top_image})` }} ></div>
				:
				<div ></div>
				}
				<div >
					<div className="row" style={{ direction: 'ltr', marginTop: 15, alignItems: 'center', marginLeft: 0, marginRight: 0,backgroundColor:'#eceff1',padding:8 }}>





					{this.state.userId &&
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
						}

						<div className={this.state.userId ? "col-lg-4 col-12 order-lg-3 order-1" : "col-lg-12 col-12 order-lg-3 order-1"}>
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

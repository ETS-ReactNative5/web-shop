import React, { useRef  } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { OverlayPanel } from 'primereact/overlaypanel';


import { AutoComplete } from 'primereact/autocomplete';

import Server from './Server.js'
/*
import {Autocomplete} from 'react-native-autocomplete-input'
   */
let Cound=0;  

class Header1 extends React.Component {
	constructor(props) {
		super(props);
        this.op =  React.createRef();

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
				this.props.dispatch({
					type: 'LoginTrueUser',
					CartNumber: localStorage.getItem("CartNumber"),
					off: localStorage.getItem("off")=="undefined" ? 0 : localStorage.getItem("off"),
					credit: localStorage.getItem("credit") == "undefined" ? 0 : localStorage.getItem("credit") 
				})
				axios.post(this.state.absoluteUrl + 'AdminApi/ShopInformation', { main: true }).then(response => {
					this.setState({
						logo: response.data.result[0].logo
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
				}).catch(error => {
					console.log(error)
				})
			})
	}
	
	onSelect(event) {
		var _id = event.originalEvent.target.getAttribute("_id");
		this.setState({
			brand:event.value.title
		  })
		if (!_id) {
			try {
				_id = event.originalEvent.target.nextElementSibling.nextElementSibling.children[0].getElementsByClassName("p-highlight")[0].getElementsByClassName("row")[0].getAttribute("_id");
			} catch (e) {

			}
		}

		this.setState({ brand: event.value, selectedproductId: _id })
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
				/*let title = [];
				let _id = [],
					img = [],
					desc = [],
					subTitle = [];
				response.data.result.map(function (v, i) {
					title.push(v.title);
					subTitle.push(v.subTitle);
					_id.push(((v.product_detail && v.product_detail.length > 0) ? v.product_detail[0]._id : v._id));
					img.push(v.fileUploaded);
					desc.push(v.desc);
				})*/
				let brandSuggestions = []
				response.data.result.map(function(v,i){
				  
				  brandSuggestions.push({_id:((v.product_detail && v.product_detail.length > 0) ? v.product_detail[0]._id : v._id),title:v.title,subTitle:v.subTitle,desc:v.desc,img:v.fileUploaded})
				})
				
				that.setState({brandSuggestions:brandSuggestions});
				//that.setState({ _id: _id, img: img, desc: desc, brandSuggestions: title, subTitle: subTitle });


			})
			.catch(error => {
				console.log(error)
			})

	}
	itemTemplate(brand) {
		Cound=0;
		return (
			<div className="p-clearfix" style={{ direction: 'rtl' }} >
				<div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >

					<div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>{brand.desc &&
						<span className="iranyekanwebregular" style={{ textAlign: 'right',overflow:'hidden' }} _id={brand._id} >
							<span _id={brand._id}>{brand.title}</span><br />
							<span _id={brand._id}>{brand.subTitle}</span>
						</span>
					}
					</div>
					<div _id={brand._id} className="col-4">{brand.img &&
						<img src={this.state.absoluteUrl +brand.img.split("public")[1]} style={{ width: 100, height: 100, minWidth: 100 }} _id={brand._id} />
					} </div>
				</div>
			</div>
		);

	}

	Search(event) {
		return;

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

		if (this.state.selectedproductId)
			return <Redirect to={"/products?id=" + this.state.selectedproductId} push={true} />;
		if (this.state.GotoLogin)
			return <Redirect to='/login' />;
		/*if (this.state.logout)
		 return <Redirect to='/' />; */
		return (
			<div style={{ background: '#fff', paddingBottom: 10 }}>
				<OverlayPanel ref={this.op} showCloseIcon dismissable>
					{this.state.name &&
										<p  className="yekan" style={{textAlign:'right'}} ><span>{this.state.name}</span></p>

					} 
					{(this.props.credit !="undefined" && this.props.credit !=0 && this.props.credit !=undefined) &&
					<p  className="yekan" ><span>موجودی اعتباری : </span><span>{this.props.credit ? this.persianNumber(this.props.credit.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : 0} تومان</span></p>
			 		}
					
					<Link to={`${process.env.PUBLIC_URL}/User`}><span className="yekan">مشاهده حساب کاربری</span> </Link> 
				</OverlayPanel>
					<div style={{height:35,padding:5,backgroundSize:'cover',backgroundRepeat:'no-repeat',backgroundPosition:'50%',backgroundImage:'url(https://dkstatics-public.digikala.com/digikala-adservice-banners/9521d61d337456b9c498ea05c7f54d76981faa19_1609858694.gif)'}} >
					</div>
				<div >
					<div className="row" style={{ direction: 'ltr', marginTop: 15, alignItems: 'center', marginLeft: 0, marginRight: 0 }}>


					



						<div className="col-lg-5 col-12 order-lg-1 order-2 text-lg-left text-right">
							<div className="wishlist_cart d-flex flex-row align-items-center " style={{ justifyContent: 'space-between' }}>

									<div className="cart_container d-flex flex-row align-items-center">
										<div className="cart_icon">
										</div>
										<div style={{marginRight:5,marginLeft:5}}>
											<Link to={`${process.env.PUBLIC_URL}/`}><i class="fal fa-home mr-md-4 mr-1" style={{fontSize: 22, color: '#716d6d' }} /></Link>
										</div>
										<div style={{marginRight:5,marginLeft:5}}>
											{this.state.userId &&
												<div>

													<span onClick={(e) => this.op.current.toggle(e)} to={`${process.env.PUBLIC_URL}/user?id=` + this.state.userId}><i class="fal fa-user ml-md-4 ml-2 mr-md-4 mr-2" style={{  fontSize: 22, color: '#716d6d',cursor:'pointer' }} /></span>

												</div>
											}
										</div>
										<div style={{marginRight:5,marginLeft:5}}>
											{this.state.isAdmin == "1" &&
												<Link to={`${process.env.PUBLIC_URL}/admin/admin`}><i class="fal fa-user-plus ml-md-4 mr-md-4 mr-2 ml-2" style={{fontSize: 25, color: '#20ad31' }} /></Link>
											}
										</div>

										{this.state.userId &&
											<div className="cart_content">
												<div className=" iranyekanwebregular"><Link to={`${process.env.PUBLIC_URL}/cart`}><i class="fal fa-shopping-cart mr-4 mr-1" style={{ fontSize: 22, color: '#3e2c29' }} /></Link></div>
												<div className="cart_count"><span className="iranyekanwebregular">
													{this.props.CartNumber && this.props.CartNumber != "undefined" &&
														this.persianNumber(this.props.CartNumber)
													}
												</span></div>
											</div>
										}
									</div>

								<div className="d-flex flex-row align-items-center" style={{justifyContent:'center',width:'calc(100% - 100px)'}}>

									<div className="wishlist_content">
										{this.state.userId ?
											<button className="btn btn-outline-danger iranyekanwebregular" style={{ whiteSpace: "nowrap", width: 100, fontSize: 12 }} onClick={this.logout} >خروج از سیستم</button>
											:
											<button className="btn btn-outline-info iranyekanwebregular" style={{ whiteSpace: "nowrap", fontSize: 12 }} onClick={this.logout} >ورود / ثبت نام <i className="fa fa-sign-in-alt" style={{ fontSize:7,paddingLeft:15,display:'none' }} /></button>
										}
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-5 col-12 order-lg-2 order-2 text-lg-left text-right" style={{ direction: 'rtl', visibility: this.props.HideSearch ? 'hidden' : 'visible' }}>
							<div >
								<div style={{ position: 'relative' }}>
									<AutoComplete placeholder="جستجو کنید ... " inputStyle={{ fontFamily: 'iranyekanwebregular', textAlign: 'right', fontSize: 16, borderColor: '#dedddd', background: '#eee',borderRadius:15,padding:7 }} style={{ width: '100%' }} onChange={(e) => this.setState({ brand: e.value })} itemTemplate={this.itemTemplate.bind(this)} value={this.state.brand} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />

								     <span style={{ position: 'absolute', left: '45px', top: '3px', fontSize:20,color:'#ccc' }}>|</span>		
									<i className="fal fa-search" style={{ position: 'absolute', left: '14px', top: '11px', fontSize:20 }} />
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-12 order-lg-3 order-1">
							<div className="text-lg-right text-center mr-lg-4 mr-0 ">
								{this.state.logo &&
									<div style={{ textAlign: 'center' }}>

										<Link to={`${process.env.PUBLIC_URL}`}>
											<img src={this.state.absoluteUrl + this.state.logo.split("public")[1]} className="hvr-pulse-shrink" />
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
	connect(mapStateToProps)(Header1)
);

import React, { Component } from 'react';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import Server from './Server.js'
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { connect } from 'react-redux';

const params = {
	slidesPerView: 5,
	spaceBetween: 5,
	loop: 1,
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



class CatList extends React.Component {
	constructor(props) {
		super(props);
		this.Server = new Server();

		this.state = {
			products: [],
			id: null,
			UId: null,
			Cat: null,
			CatData: [],
			levelOfUser: null,
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl()
		}






	}
	
	roundPrice(price) {
		return price.toString();
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
	
	componentDidMount(){
		this.getProductsPerCat({name:this.props.name,_id:this.props._id});  
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
	getProductsPerCat(param) {
		let that = this;
		let SCallBack = function (response) {
			let res = {
				name: param.name,
				id: param._id,
				data: response.data.result
			}

			that.setState({
				CatData: res
			})
		};
		let ECallBack = function (error) {
		}
		that.Server.send("MainApi/GetProductsPerCat", { id: param._id, limit: 10, getSubs: 1 }, SCallBack, ECallBack)
	}
	render() {
		if (this.state.id) {
			return <Redirect to={"/products?id=" + this.state.id} push={true} />;
		}
		return (
			<div className="col-12" style={{ paddingLeft: this.props.paddingLeft||20, paddingRight: this.props.paddingRight||20 }}>
				<div className="row justify-content-center" style={{ marginRight: 15, marginLeft: 15 }} >
					{this.state.CatData.data && this.state.CatData.data.length > 0 &&
						<div className="col-lg-12 col-md-12 col-12" style={{ direction: 'rtl', backgroundColor: '#fff', borderRadius: 10 }}>
							<div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ {this.state.CatData.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?getSubs=1&id=` + this.state.CatData.id} className="title iranyekanwebmedium" style={{ fontSize: 13, float: 'left', color: '#000', textDecoration: 'none' }}>    مشاهده محصولات  ...</Link></div>
							<Swiper {...params}>
								{this.state.CatData.data.map((item, index) => {
									var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
									return (
										<Link className="car-details " to={`${process.env.PUBLIC_URL}/Products?name=${item.title}&id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
											<div className="p-grid p-nogutter" >
												<div className="p-col-12 c-product-box__img" align="center" >
													<img src={img} alt="" />
												</div>
												<div className="p-col-12 car-data" style={{ marginTop: 10 }}>
													<div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>

													<div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
													{
														item.number > 0
															?
															<div>
																{(this.state.UId || !item.ShowPriceAftLogin) &&
																	<div>
																		{
																			((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
																				<div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
																				:
																				<div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696', height: 16 }} ></div>
																		}
																		<div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><span className="iranyekanweblight" style={{ float: 'left', fontSize: 11, marginTop: 10 }}>تومان</span> <span className="iranyekanweblight" style={{ fontSize: 20 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off + (!item.NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
																	</div>
																}
															</div>
															:
															(this.state.UId || !item.ShowPriceAftLogin) &&
															<div>

																<div className="car-subtitle yekan" style={{ height: 22 }} ></div>
																<div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><span className="iranyekanweblight" style={{ fontSize: 14, marginTop: 10, color: 'red' }}>ناموجود</span> </div>
															</div>
													}

												</div>
												{
													item.number > 0 && ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" &&
													<div className="car-title yekan off" style={{ position: 'absolute', top: 0 }} >{this.persianNumber(((!item.NoOff ? parseInt(this.props.off) : 0) + item.off))} %</div>

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
const mapStateToProps = (state) => {
	return {
		CartNumber: state.CartNumber,
		off: state.off
	}
}
export default withRouter(
	connect(mapStateToProps)(CatList)
);
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import Server from './Server.js'
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { connect } from 'react-redux';
import { Sidebar } from 'primereact/sidebar';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';

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
class CatList extends React.Component {
	constructor(props) {
		super(props);
		this.Server = new Server();
        this.itemTemplate = this.itemTemplate.bind(this);
		this.onHide = this.onHide.bind(this);

		this.state = {
			products: [],
			id: null,
			UId: this.props.UId,
			Cat: null,
			productsDetailArray:[],
			CatData: [],
			levelOfUser: null,
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl()
		}






	}
	onHide(event) {
        this.setState({ VisibleDialog: null });
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

	componentDidMount() {
		axios.post(this.state.url + 'checktoken', {
			token: localStorage.getItem("api_token")
		})
			.then(response => {
				this.setState({
					UId: response.data.authData.userId,
					levelOfUser: response.data.authData.levelOfUser
				})
				this.getProductsPerCat({ name: this.props.name, _id: this.props._id });
			})
			.catch(error => {
				this.getProductsPerCat({ name: this.props.name, _id: this.props._id });

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
		that.Server.send("MainApi/GetProductsPerCat", { id: param._id, limit: 10, getSubs: 1, levelOfUser: that.state.levelOfUser, Exist: true }, SCallBack, ECallBack)
	}
	itemTemplate(item, layout) {
		var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];

		return (
		<div  >
		<span className="fa fa-plus-circle text-info" style={{ top: 0, fontSize: 30, right: 30, cursor: 'pointer' }}
			onClick={() => {
				this.setState({
					displayProductComp: true
				})
			}} >
		</span>

		<div className="p-col-12 c-product-box__img" align="center" >
			<img src={img} alt="" />
		</div>
		<div className="p-col-12 car-data" style={{ marginTop: 10 }}>
			<div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>
			{item.subTitle && item.subTitle != "-" &&
				<div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
			}
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
		)
	}
	GoToShop(url,productsDetail,products){
		if(!this.props.ProductBase && productsDetail && productsDetail.length > 1){
			this.setState({
				productsDetailArray:productsDetail,
				productsDetailArrayRef:products,
				VisibleDialog:true
			})
			
		}else{
			this.setState({
				ShopLink:url
			})
		}
		
	}
	render() {

		if (this.state.id) {
			return <Redirect to={"/products?id=" + this.state.id} push={true} />;
		}
		if (this.state.ShopLink) {
			return <Redirect to={this.state.ShopLink} push={true} />;
		}
		let url = '';
		return (
			<div className="col-12" style={{ paddingLeft: this.props.paddingLeft || 20, paddingRight: this.props.paddingRight || 20, marginTop: 5, marginBottom: 5 }}>
				<div className="row justify-content-center" style={{ marginRight: 15, marginLeft: 15 }} >
					{this.state.CatData.data && this.state.CatData.data.length > 0 &&
						<div className="col-lg-12 col-md-12 col-12" style={{ direction: 'rtl', backgroundColor: '#fff', borderRadius: 10 }}>
							<div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ {this.state.CatData.name} </span> <Link to={`${process.env.PUBLIC_URL}/Category?getSubs=1&id=` + this.state.CatData.id} className="title iranyekanwebmedium" style={{ fontSize: 13, float: 'left', color: '#000', textDecoration: 'none' }}>    مشاهده محصولات  ...</Link></div>
							<Swiper {...params}>
								{this.state.CatData.data.map((item, index) => {
									var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                                    url = this.props.ProductBase ? 'Products?id='+((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)+'' : 'Shop?id='+((item.Seller && item.Seller.length > 0) ? item.Seller[0]._id : '')+'&cat='+item.category_id+'';
									//  url = 'Products?id='+((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)+'';
										
									return (
										
											<button className="car-details" onClick={()=>{this.GoToShop(url,item.product_detail,item)}} style={{ background:'#fff',display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
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
											</button>
											
									)
								})
								}
							</Swiper>


						</div>

						}



				</div>
				<Sidebar header="کسر از کیف پول " visible={this.state.displayProductComp} onHide={() => this.setState({ displayProductComp: false })} style={{ fontFamily: 'YekanBakhFaBold' }} >
					<products />
				</Sidebar>
				<Dialog visible={this.state.VisibleDialog} onHide={this.onHide} style={{ width: '60vw' }} maximizable={false} maximized={false}>
				{this.state.productsDetailArrayRef &&	
					<div  className="iranyekanweblight" style={{textAlign:'center',fontSize:25,marginBottom:35}}><span className="iranyekanweblight text-danger" > {this.state.productsDetailArrayRef.title} </span> را میتوانید از فروشگاههای زیر بخرید</div>
				}
				<div className="row">

					{this.state.productsDetailArray.map((item, index) => {
						let Seller =null;
						for(let i=0; i < this.state.productsDetailArrayRef.Seller.length; i++){
							if(this.state.productsDetailArrayRef.Seller[i]._id  ==  item.SellerId){
								Seller = this.state.productsDetailArrayRef.Seller[i];
							}
						}
						let price = 0;
						if(item.number > 0)
							price = this.persianNumber(this.roundPrice((item.price - (item.price * ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
						let img = (Seller.logo && Seller.logo.split("public")[1]) ? this.state.absoluteUrl + Seller.logo.split("public")[1] : this.state.absoluteUrl + 'nophoto.png'
						return(
								<div className="col-lg-3 col-md-4 col-12" style={{textAlign:'center'}} >
									<button onClick={()=>{this.GoToShop('Shop?id='+Seller._id+''+'&cat='+this.state.productsDetailArrayRef.category_id+'')}} disabled={item.number == 0} style={{ background:'#fff',display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
									<img src={img} />
									<div  className="iranyekanweblight">{Seller.name}</div>
									<div className="iranyekanweblight text-primary" style={{marginTop:20}}>قیمت در فروشگاه : {price} تومان</div>
									</button>
									
								</div>
							
						)

					})
					}
					</div>
                </Dialog>
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
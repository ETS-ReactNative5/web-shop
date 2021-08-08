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

class CatList extends React.Component {
	constructor(props) {
		super(props);
		this.Server = new Server();
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
	GoToProduct(item){
		if(!this.props.ProductBase && item.product_detail && item.product_detail.length > 1){
			this.setState({
				productsDetailArray:item.product_detail,
				productsDetailArrayRef:item,
				VisibleDialog:true
			})
			
		}else{
			let url = this.props.ProductBase ? 'Products?id='+((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)+'' : 'Shops?id='+((item.Seller && item.Seller.length > 0) ? item.Seller[0]._id : '')+'&cat='+item.category_id+'';

			this.GoToShop(url)
		}
		
	}
	GoToShop(url){
		
			this.setState({
				ShopLink:url
			})
		
	}
	render() {

		if (this.state.id) {
			return <Redirect to={"/products?id=" + this.state.id} push={true} />;
		}
		if (this.state.ShopLink) {
			return <Redirect to={this.state.ShopLink} push={true} />;
		}
		if (this.state.CatLink) {
			return <Redirect to={this.state.CatLink} push={true} />;
		}
		let url = '';
		let img = '';
		return (
			<div>
				{this.state.CatData.data && this.state.CatData.data.length > 0 &&
					<div style={{display:'flex',justifyContent:'space-between',flexDirection:'row-reverse',padding:5}}>
					<p style={{fontFamily:'YekanBakhFaMedium',textAlign:'right',marginRight:10,marginTop:5}}>{this.state.CatData.name}</p>
					<p className="YekanBakhFaMedium" style={{fontSize:11}} onClick={()=>{this.setState({
						CatLink:"/category?getSubs=1&&id="+this.state.CatData.id
					})}} >مشاهده همه</p>
						</div>
				}
				<div className="no-scroll-bar" style={{display:'flex',flexWrap:'nowrap',overflow:'auto',direction:'rtl'}} >
				{this.state.CatData.data && this.state.CatData.data.map((data) => {
					img = this.state.absoluteUrl + data.fileUploaded.split("public")[1];
					return(
						<div style={{border:'1px solid #eee',textAlign:'center',padding:10,position:'relative'}}>
							<button className="car-details" onClick={()=>{this.GoToProduct(data)}} style={{ background:'#fff',display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }} >
							<img src={img} alt="" style={{width:80,height:80,borderRadius:2}} />
							<div  style={{width:100,direction:'rtl'}} >
							<p style={{fontFamily:'YekanBakhFaMedium',color:'#000',fontSize:14,marginTop:25,marginBottom:10}} className="block-ellipsis">{data.title}</p>
							{(data.product_detail[0] && data.product_detail[0].price && data.product_detail[0].number > 0) ?
								<div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><div className="YekanBakhFaMedium" style={{ float: 'left', fontSize: 10, marginTop: 10,color:'#000' }}>تومان</div><br/> <div className="YekanBakhFaMedium" style={{ fontSize: 15,color:'#000' }}>{this.persianNumber(this.roundPrice((parseInt(data.product_detail[0].price) - ((parseInt(data.product_detail[0].price) * (parseInt(data.product_detail[0].off) + (!data.product_detail[0].NoOff ? parseInt(this.props.off||0) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</div> </div>
								:
								<div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><div className="YekanBakhFaMedium" style={{ float: 'left', fontSize: 10, marginTop: 10 }}></div><br/> <div className="YekanBakhFaMedium" style={{ fontSize: 15,color:'red' }}>ناموجود</div> </div>

							}
							{data.product_detail[0] && data.product_detail[0].off > 0 &&
								<p className="off YekanBakhFaMedium" >{this.persianNumber(data.product_detail[0].off)}%</p>
							}
							</div>
							</button>
						</div>
						
					)
				})}
			</div>

			<Dialog visible={this.state.VisibleDialog} onHide={this.onHide}  maximized={true} >
				{this.state.productsDetailArrayRef &&	
					<div  className="YekanBakhFaMedium" style={{textAlign:'center',fontSize:25,marginBottom:35}}><span className="YekanBakhFaMedium text-danger" > {this.state.productsDetailArrayRef.title} </span> را میتوانید از فروشگاههای زیر بخرید</div>
				}
				<div className="row" style={{marginBottom:50,display:'flex',flexDirection:'column',alignItems:'center'}}>

					{this.state.productsDetailArray.map((item, index) => {
						let Seller =null;
						for(let i=0; i < this.state.productsDetailArrayRef.Seller.length; i++){
							if(this.state.productsDetailArrayRef.Seller[i]._id  ==  item.SellerId){
								Seller = this.state.productsDetailArrayRef.Seller[i];
							}
						}
						let price = 0;
						if(item.number > 0)
							price = this.persianNumber(this.roundPrice((item.price - (item.price * ((!item.NoOff ? parseInt(this.props.off||0) : 0) + item.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
						let img = (Seller.logo && Seller.logo.split("public")[1]) ? this.state.absoluteUrl + Seller.logo.split("public")[1] : this.state.absoluteUrl + 'nophoto.png'
						return(
								<div className="col-lg-3 col-md-4 col-12" style={{textAlign:'center'}} >
									<button onClick={()=>{this.GoToShop('Shops?id='+Seller._id+''+'&cat='+this.state.productsDetailArrayRef.category_id+'')}} disabled={item.number == 0} style={{ background:'#fff',display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
									<img src={img} style={{maxHeight:200}} />
									<div  className="YekanBakhFaMedium">{Seller.name}</div>
									<div className="YekanBakhFaMedium text-primary" style={{marginTop:20}}>قیمت در فروشگاه : {price} تومان</div>
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
function mapStateToProps(state) {        
	return {
        username: state.username,
        password: state.password,
        ip: state.ip,
        account: state.account,
        place: state.place,
        fullname: state.fullname,
        mobile: state.mobile,
        LoginAnia:state.LoginAnia
    }
}
export default withRouter(
	connect(mapStateToProps)(CatList)
);
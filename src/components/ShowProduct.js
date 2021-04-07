import React, { Component } from 'react';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import Server from './Server.js'
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { connect } from 'react-redux';
import { Sidebar } from 'primereact/sidebar';
import { Carousel } from 'primereact/carousel';

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
		this.state = {
			product: {},
			id: null,
			UId: this.props.UId,
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

	componentDidMount() {
		this.setState({
			product: this.props.data,
			pic: this.state.absoluteUrl + this.props.data.fileUploaded.split("public")[1]
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

	render() {

		return (
			<div>
				<div className="row">
					<div className="col-12" style={{ textAlign: 'center' }}>
						<img src={this.state.pic} style={{ maxHeight: 400 }} name="pic" alt="" />

					</div>
					<div className="col-12" style={{ textAlign: 'right', marginTop: 15 }}>
						<p className="iranyekanwebmedium" style={{ fontSize: 30 }}>{this.state.product.title}</p>
						{this.state.product.desc && this.state.product.subTitle != "-" &&
							<p className="iranyekanwebmedium" style={{ fontSize: 15 }}>{this.state.product.subTitle}</p>
						}
						{this.state.product.desc && this.state.product.desc != "-" &&
							<p className="iranyekanwebmedium" style={{ fontSize: 12 }}>{this.state.product.desc}</p>
						}
						{
							((!this.state.NoOff ? parseInt(this.props.off) : 0) + this.state.product.off) > "0" &&
							<div className="product_price YekanBakhFaBold oldPrice_product" style={{ textAlign: 'center',maxWidth:150 }}>{this.persianNumber(this.roundPrice(parseInt(this.state.product.price).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>
						}
						{this.state.product.number > 0 && this.state.product.price > 0 &&
							<div className="product_price YekanBakhFaBold" style={{ marginTop: 50,color:'red', textAlign: 'right', fontSize: 25 }}>{this.persianNumber(this.roundPrice(parseInt(this.state.product.price - ((this.state.product.price * ((!this.state.NoOff ? parseInt(this.props.off) : 0) + this.state.product.off)) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

						}

					</div>
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
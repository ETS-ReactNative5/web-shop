import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import CatList from './CatList.js'

import './Header1.css'
import Server from './Server.js'
import moment from 'moment-jalaali';
import { connect } from 'react-redux';

class Photos extends React.Component {
	constructor(props) {
		super(props);
		this.Server = new Server();

		this.myRef = React.createRef()   // Create a ref object 
		this.state = {

			pic: null,
			loading: true,
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl()
		}

		axios.post(this.state.url + 'checktoken', {
			token: localStorage.getItem("api_token")
		})
			.then(response => {
				this.setState({
					UId: response.data.authData.userId,
					levelOfUser: response.data.authData.levelOfUser
				})
				this.getPics();
			})
			.catch(error => {
				this.getPics();
			})




	}

	getPics() {
		let that = this;

		axios.post(this.state.url + 'getPics', { condition: { name: that.props.name } })
			.then(response => {
				response.data.result.map(function (item, index) {
					that.setState({
						pic: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
						link: item.link,
						text: item.text
					})
				})
			})
			.catch(error => {
			})

	}
	render() {

		return (
			<div className={this.props.Class}>
				{this.state.link && this.state.link.indexOf("http") > -1 ?
					<a href={this.state.link6} href="#" target="_blank" style={{ textDecoration: 'none' }}>
						{this.state.text &&
							<p className="iranyekanwebmedium  p-md-2 , p-0" style={{ margin: 0, position: 'absolute', zIndex: 2, fontSize: 15, color: 'rgb(255 248 42)', backgroundColor: 'rgb(0 0 10 / 63%)', paddingBottom: 5, width: '100%', textAlign: 'right', boxShadow: 'rgb(185 185 185) 10px 10px 15px', bottom: 0, right: 0 }}>{this.state.text}</p>
						}
						<img src={this.state.pic} style={{width:this.props.width,height:this.props.height,paddingLeft:this.props.padding,paddingRight:this.props.padding,paddingTop:this.props.padding,paddingBottom:this.props.padding,borderRadius:this.props.borderRadius}} />
					</a>
					:
					<Link to={`${process.env.PUBLIC_URL}/` + this.state.link6} target="_blank" style={{ textDecoration: 'none' }}>
						{this.state.text &&
							<p className="iranyekanwebmedium  p-md-2 , p-0" style={{ margin: 0, position: 'absolute', zIndex: 2, fontSize: 15, color: 'rgb(255 248 42)', backgroundColor: 'rgb(0 0 10 / 63%)', paddingBottom: 5, width: '100%', textAlign: 'right', boxShadow: 'rgb(185 185 185) 10px 10px 15px', bottom: 0, right: 0 }}>{this.state.text}</p>
						}
						<img src={this.state.pic}  style={{width:this.props.width,height:this.props.height,paddingLeft:this.props.padding,paddingRight:this.props.padding,paddingTop:this.props.padding,paddingBottom:this.props.padding,borderRadius:this.props.borderRadius}} />
					</Link>
				}
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
	connect(mapStateToProps)(Photos)
);

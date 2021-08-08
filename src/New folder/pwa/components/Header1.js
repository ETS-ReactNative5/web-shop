import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import axios from 'axios'


import { AutoComplete } from 'primereact/autocomplete';

import Server from './Server.js'

let Cound = 0;

class Header1 extends React.Component {
	constructor(props) {
		super(props);
		this.op = React.createRef();

		this.Server = new Server();
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

	}

	onSelect(event) {
		var _id = event.originalEvent.target.getAttribute("_id");
		var _catId = event.originalEvent.target.getAttribute("_catId")
		var _tagId = event.originalEvent.target.getAttribute("_tagId")
		
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
					<div style={{ margin: '10px 10px 0 0',display:'flex',justifyContent:'space-between',alignItems:'center'  }} className="row" _id={brand._id} >
	
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
					<div style={{ margin: '10px 10px 0 0',display:'flex',justifyContent:'space-between',alignItems:'center'   }} className="row" _tagId={brand.tagId} >
	
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
					<div style={{ margin: '10px 10px 0 0',display:'flex',justifyContent:'space-between',alignItems:'center'  }} className="row" _catId={brand.catId} >
	
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

		if (this.state.selectedproductId)
			return <Redirect to={"/products?id=" + this.state.selectedproductId} push={true} />;
		if (this.state.selectedCatId)
			return <Redirect to={"/category?id=" + this.state.selectedCatId} push={true} />;
		if (this.state.selectedTagId)
			return <Redirect to={"/Tag?tag=" + this.state.selectedTagId} push={true} />;	
				
		
		return (
			<div style={{ background: '#fff', paddingBottom: 10 }}>
			
				<div className="row" >
				<div className="col-12">
								<div style={{ position: 'relative' }}>
									<AutoComplete placeholder="... جستجو کنید" inputStyle={{ width:'100%',fontFamily: 'YekanBakhFaMedium', textAlign: 'center', fontSize: 16, borderColor: '#dedddd', background: '#eee', padding: 7 }} style={{ width: '100%' }} onChange={(e) => this.setState({ brand: e.value })} itemTemplate={this.itemTemplate.bind(this)} value={this.state.brand} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />

								</div>
							</div>
				</div>

			</div>
		)
	}
}
const mapStateToProps = (state) => {
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
	connect(mapStateToProps)(Header1)
);

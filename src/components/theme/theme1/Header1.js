import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter,Redirect,Link} from 'react-router-dom'  
import axios from 'axios'  
import {AutoComplete} from 'primereact/autocomplete';

class Header1 extends React.Component {
    constructor(props){
        super(props); 
		this.data="dssddsdss"
		this.logout = this.logout.bind(this);
		this.state = {
			logout : false,
			GotoLogin:false,
			userId:null,
			searchText:'',
			name:"",
			brand:"",
			selectedproductId:null,
			_id:[],
			img:[],
			desc:[],
			Count:-1,
			brandSuggestions: null,
			absoluteUrl:'https://marketapi.sarvapps.ir/',
			url:'https://marketapi.sarvapps.ir/MainApi/'/*
			absoluteUrl:'http://localhost:3000/',
			url:'http://localhost:3000/MainApi/'*/
		}
		
		axios.post(this.state.url+'checktoken', {
			token: localStorage.getItem("api_token")
		})
		.then(response => {
			this.setState({
				userId : response.data.authData.userId,
				name : response.data.authData.name
			})
			this.props.dispatch({
				type: 'LoginTrueUser',    
				CartNumber:localStorage.getItem("CartNumber")
			})
			
		})
		.catch(error => {
			console.log(error)
		})
    }
    onSelect(event){
	this.setState({brand:event.value,selectedproductId:event.originalEvent.target.getAttribute("_id")})
	setTimeout(function(){
		window.location.reload();
	},0)
    }
    
    
    suggestBrands(event) {
	
	let that = this;    
	this.setState({brand: event.query});
	axios.post(this.state.url+'searchItems', {
		title: event.query
	}) 
	.then(response => {
		let title = [];
		let _id =[],
			img=[],
			desc=[]
		response.data.result.map(function(v,i){
			title.push(v.title);
			_id.push(v._id);
			img.push(v.fileUploaded);
			desc.push(v.desc);
		})
		
		that.setState({_id:_id,img:img ,desc:desc, Count:-1 , brandSuggestions: title });

		
	})
	.catch(error => {
		console.log(error)
	})
	
	 }
	 itemTemplate(brand) {
		this.state.Count++;
		return (
		    <div className="p-clearfix" >
			   <div style={{ margin: '10px 10px 0 0' }} className="row" _id={this.state._id[this.state.Count]} >
			   <div _id={this.state._id[this.state.Count]} className="col-lg-6">{this.state.img[this.state.Count] && 
			   <img src={this.state.absoluteUrl + this.state.img[this.state.Count].split("public")[1]} style={{width:100,height:100,minWidth:100}}  _id={this.state._id[this.state.Count]}  />
			   } </div>
			   <div className="col-lg-6" _id={this.state._id[this.state.Count]}>{this.state.desc[this.state.Count] && 
			   <span className="yekan" style={{textAlign:'right'}}  _id={this.state._id[this.state.Count]} >
			   <span _id={this.state._id[this.state.Count]}>{brand}</span><br />
			   <span _id={this.state._id[this.state.Count]}>{this.state.desc[this.state.Count].slice(0, 20)}</span> 
			   </span>
			   }
			   </div></div>
		    </div>
		);

	 }

    Search(event){
	    return;
	
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
	logout(e) {
		if(!this.state.userId){
			this.setState({
				GotoLogin : true
			})

			return;
		}
		localStorage.setItem("api_token","")
		localStorage.setItem("CartNumber",0)
		this.props.dispatch({
			type: 'LoginTrueUser',    
			userId:null,
			CartNumber:0
		})
		this.setState({
			userId:null,
			logout : true
		})
	}
   
    render(){
	if(this.state.selectedproductId)
		return <Redirect to={"/products?id="+this.state.selectedproductId} push={true} />;
	if (this.state.GotoLogin)
	 return <Redirect to='/login' />;
        return (
            <div dir="ltr" style={{background: '#fff'}} s_tyle={{position: 'fixed',top: 0,width: 100,zIndex: 50,background: '#fff',width:'100%',borderBottom:'1px solid #eee'}}>
        
			<div className="container">
				<div className="row" style={{marginTop:5}}>

					<div className="col-lg-2 col-12 order-1">
						<div style={{textAlign:'center',marginBottom:5}}>
							<div >

							<Link to={`${process.env.PUBLIC_URL}`}>
								<img src={require('../../../public/Ania.png')}  style={{width:75}}/>
							</Link>
							</div>
							<div style={{	}}><a href="/#/admin/Seller" className="yekan" style={{color:'#7b4b4b',backgroundColor:'#cacaca',borderRadius:12,paddingRight:5,paddingLeft:5,fontSize:11}}>فروش محصول در آنیا</a></div>
						</div>
					</div>
					<div className="col-lg-6 col-12 order-lg-2 order-2 text-lg-left text-right" style={{visibility:this.props.HideSearch?'hidden':'visible'}}>
							<div className="header_search_content">
								<div>
									<AutoComplete placeholder="نام کالای مورد نظر را جستجو کنید" inputStyle={{fontFamily:'yekan',textAlign:'right',fontSize:12}} style={{width:'100%'}}  itemTemplate={this.itemTemplate.bind(this)} value={this.state.brand} onSelect={(e) => this.onSelect(e)}  suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />
										<button type="submit" className="header_search_button trans_300" value="Submit" style={{display:'none'}}><img src="images/search.png" alt="" /></button>
								</div>
							</div>
					</div>

					<div className="col-lg-4 col-12 order-lg-3 order-3 text-lg-left text-right">
						<div className="wishlist_cart d-flex flex-row align-items-center justify-content-end">
									
							<div className="cart" >
								<div className="cart_container d-flex flex-row align-items-center justify-content-end">
									<div className="cart_icon">
									</div>
									<div >
										<Link to={`${process.env.PUBLIC_URL}/`}><i className="fa fa-home" style={{marginRight:20,fontSize:22,color:'#af7e7e'}} /></Link>
									</div>
									<div>
										{this.state.userId &&
											<Link to={`${process.env.PUBLIC_URL}/user?id=`+this.state.userId}><i className="fa fa-user" style={{marginRight:20,marginLeft:20,fontSize:22,color:'#716d6d'}} /></Link>
										}
									</div>
									
									<div className="cart_content">
										<div className=" yekan"><Link to={`${process.env.PUBLIC_URL}/cart`}><i className="fa fa-shopping-cart" style={{marginRight:20,fontSize:22,color:'#614d4d'}} /></Link></div>
										<div className="cart_count"><span>
										{this.props.CartNumber && this.props.CartNumber !="undefined" &&
											this.persianNumber(this.props.CartNumber)
										}
										</span></div>
									</div>
								</div>
								
							</div>
							<div className="wishlist d-flex flex-row align-items-center justify-content-end">
							
									<div className="wishlist_content">
										<button className="btn btn-info yekan" style={{whiteSpace:"nowrap",width:100,fontSize:12}} onClick={this.logout} >{this.state.userId ?  'خروج از سیستم' : 'ورود به سیستم' }</button>
									</div>
							</div>
						</div>
					</div>
				</div>
			</div>
	
			</div>
        )
    }
}
const mapStateToProps = (state) => {
	return{
	  CartNumber : state.CartNumber
	}
   }
   export default withRouter(
	connect(mapStateToProps)(Header1)
   );

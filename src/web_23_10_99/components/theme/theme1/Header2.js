import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,Link,Redirect} from 'react-router-dom'

class Header2 extends React.Component {
    constructor(props){
	   super(props); 
	   this.state={
		Obj:{},
		img:null,
		Cat:[],
		money:"",
		id:null,
		absuluteUrl:'https://marketapi.sarvapps.ir/', 
		url:'https://marketapi.sarvapps.ir/MainApi/' /*
		absuluteUrl:'http://localhost:3000/',
		url:'http://localhost:3000/MainApi/'*/
	   }
	   this.GoToProduct = this.GoToProduct.bind(this);

	   this.getCategory();
	   this.RefCats = React.createRef();

    }
    getProducts(){
	axios.post(this.state.url+'getProducts', {
	    type: 2
	})
	.then(response => {
		   var img = this.state.absuluteUrl + response.data.result[0].fileUploaded.split("public")[1];
		   this.setState({
			  Obj:response.data.result[0],
			  img:img,
			  money : response.data.money
		   })

	    
	})
	.catch(error => {
	    console.log(error)
	})

 }
 getCategory(){
	axios.post(this.state.url+'GetCategory')
	.then(response => {
		   this.setState({
			  Cat:response.data.result
		   })
		  // this.getProducts();


	    
	})
	.catch(error => {
	    console.log(error)
	})

 }
   GoToProduct(event){
	this.setState({
		id:event.currentTarget.id
	})
   }
    render(){
	   if (this.state.id) {
		  return <Redirect to={"/products?id="+this.state.id} push={true} />;
	   }
        return (
		<div dir="ltr" className="firstInPage" >
        <div className="row justify-content-center " > 
			<div className="col-12 " style={{backgroundColor:'#fff'}}  >	
        <nav className="main_nav">
			<div >
				<div className="row">
					<div className="col" style={{padding:0}}>
						
						<div className="main_nav_content d-flex flex-row" >

							

						<div className="main_nav_menu ml-auto">
								<ul className="standard_dropdown main_nav_dropdown">
									<li style={{display:'none'}}><Link to={`${process.env.PUBLIC_URL}/User`} className="yekan">محیط کاربری<i className="fas fa-chevron-down"></i></Link></li>
									
									<li><Link to={`${process.env.PUBLIC_URL}/admin/Seller`} className="yekan"> فروشگاه شما<i className="fas fa-chevron-down"></i></Link></li>
									<li><Link to={`${process.env.PUBLIC_URL}/cart`} className="yekan"> سبد خرید <i className="fas fa-chevron-down"></i></Link></li>
									<li><Link to={`${process.env.PUBLIC_URL}/Register`} className="yekan"> ثبت نام <i className="fas fa-chevron-down"></i></Link></li>
									<li><Link to={`${process.env.PUBLIC_URL}/`} className="yekan"> صفحه اصلی <i className="fas fa-chevron-down"></i></Link></li>
								</ul>
							</div>
							<div className="cat_menu_container">
								<div onClick={() => {  this.RefCats.current.style.display == "none" ? this.RefCats.current.style.display = "block" : this.RefCats.current.style.display = "none" }}  className="cat_menu_title d-flex flex-row align-items-center justify-content-start">
									<div className="cat_burger" style={{marignTop:5}}><span></span><span></span><span></span></div>
									<div className="cat_menu_text yekan">دسته بندی</div>
								</div>

								<ul ref={this.RefCats} className="cat_menu" style={{display:'none'}}>
									{
									this.state.Cat.map((v, i) => {
										let id = "/category?id="+v._id;
										return (
											<li className="yekan"><Link to={id} > {v.name} <i className="fas fa-chevron-right ml-auto"></i></Link></li>
										)
									})
									}
									</ul>
							</div>

						</div>
					</div>
				</div>
			</div>
			
		</nav>
		
</div>
</div>
			</div>
        )
    }
}
export default Header2;
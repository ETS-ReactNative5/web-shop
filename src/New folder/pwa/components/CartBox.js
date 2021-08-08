import React, { useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios'
import { Sidebar } from 'primereact/sidebar';
import { withRouter, Route, Link, Redirect } from 'react-router-dom'

import { Button } from 'primereact/button';
import Server from './Server.js'


class CartBox extends React.Component {
	constructor(props) {
		super(props);
		this.op = React.createRef();
		this.Server = new Server();
		this.state = {
			Exit:this.props.Exit,
			sideBar:0,
            CartNumber:0,
            Tel:"03145461354",
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl(),
		}

	}
	componentDidMount() {
        let that = this;

        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                this.getCartItems(response.data.authData.userId)
            })
            .catch(error => {
                console.log(error)
            })
    }
	  getCartItems(userId) {
        let that = this;

        this.setState({
            lastPrice: 0,
            orgLastPrice: 0,
            paykAmount: 0
        })
        let param = {
            UId: userId

        };
        let SCallBack = function (response) {
            let CartNumber = 0;
            response.data.result.map((res) => {
                
                CartNumber += parseInt(res.number);
                


            })
			that.setState({
				CartNumber:CartNumber
			})
            


        };
        let ECallBack = function (error) {
            that.setState({
                CartNumber: 0
            })
            console.log(error)
        }
        this.Server.send("MainApi/getCartPerId", param, SCallBack, ECallBack)
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
			<div style={{position:'fixed',zIndex:5000,width:'100%',bottom:0,direction:'ltr',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:'#f3f9ff',padding:10,height:this.props.height||'auto'}}>
                    <a style={{color:'red',width:'100%'}} href={"tel:"+this.state.Tel}>
                        <div className="iranyekanwebmedium " style={{width:'100%',direction:'rtl',textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center',height:40}}>
                        <i style={{fontSize:25}} className="fal fa-phone" />
                    </div>
                    </a> 
                    
                {(this.props.LoginAnia || this.props.username) ? 
                    <Link  to={`${process.env.PUBLIC_URL}/Home`} style={{width:'100%',borderLeft:'1px solid #e4e4e4'}} >
                        <div className="iranyekanwebmedium " style={{width:'100%',direction:'rtl',textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center',height:40}}>
                        <i style={{fontSize:25}} className="fal fa-home" />
                    </div>
                    </Link> 
                    :
                    <Link  to={`${process.env.PUBLIC_URL}/`} style={{width:'100%',borderLeft:'1px solid #e4e4e4'}} >
                        <div className="iranyekanwebmedium " style={{width:'100%',direction:'rtl',textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center',height:40}}>
                        <i style={{fontSize:25}} className="fal fa-home" />
                    </div>
                    </Link> 
                }
                {(this.props.LoginAnia || this.props.username) &&
                    <Link  to={`${process.env.PUBLIC_URL}/Cart`} style={{width:'100%',borderLeft:'1px solid #e4e4e4'}} >
                    <div className="iranyekanwebmedium " style={{width:'100%',direction:'rtl',textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center',height:40}}>
                    <i style={{fontSize:25}} className="fal fa-shopping-cart" />
                    <span style={{fontSize:25}} > ({this.state.CartNumber}) </span> 


                    </div>
                    </Link>  
                }     


                                

			</div>
		)

	}
}
function mapStateToProps(state) {        
	return {
	  username : state.username,
	  password : state.password,
	  ip : state.ip,
	  account:state.account,
	  place:state.place,
	  fullname : state.fullname,
	  mobile : state.mobile,
      LoginAnia:state.LoginAnia
	}
  }
  export default connect(mapStateToProps)(CartBox) 

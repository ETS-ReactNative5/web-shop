import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import axios from 'axios'

import { Button } from 'primereact/button';


import Server from './Server.js'


let Cound = 0;

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.op = React.createRef();
		this.Server = new Server();
		this.state = {
			Exit:this.props.Exit,
			small:this.props.small,
			login:false,
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl(),
		}

	}
	componentDidMount() {
		this.setState({
			credit : this.props.credit
		  })
		  axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
				this.setState({
					login:true
				})
				this.props.dispatch({
					type: 'LoginTrue',
					LoginAnia:this.props.username ? false : true,
					username: this.props.username,
					password: this.props.password,
					account: this.props.account,
					place: this.props.place,
					ip: this.props.ip,
					mobile: this.props.mobile ? this.props.mobile : (response.data.authData ? response.data.authData.username : null) ,
					fullname: this.props.fullname ? this.props.fullname : (response.data.authData ? (response.data.authData.name||response.data.authData.username):null),
				  })

                
            })
            .catch(error => {
                this.setState({
                  login:true
                })
            })
		 
	  }


	render() {
		if (this.state.GotoLogin) {
			return <Redirect to={"/"} />;
		}
		if (this.state.GotoPage) {
			return <Redirect to={this.state.GotoPage} />;
		}
		return (
			this.props.noBack ?
			<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:this.props.bgColor||'#ebdd25',paddingLeft:10,paddingRight:10,height:this.props.height||'auto'}}>
				
				
				<div style={{width:'40%',display:'none'}}>
				  <Button className="YekanBakhFaMedium p-button-primary" onClick={this.LoginPress} style={{ textAlign: 'center', borderRadius: 15, width: '80%' }}> 
				  <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 15 }} >خرید محصول</span> 
				  </Button>

				</div>

				
				<div style={{textAlign:'right',width:'100%'}}>
					<div className="YekanBakhFaMedium" style={{fontSize:14}}>  موجودی کیف پول مهر کارت :  {this.state.credit || 0} تومان</div> 
				</div>
				

			</div>
			:
			<div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',backgroundColor:this.props.bgColor||(localStorage.getItem("food") ? '#84f0af' : "#ebdd25"),paddingLeft:10,paddingRight:10,height:(this.props.height)}}>
				
				
				<div style={{width:40}}>
					{!this.props.close ?
				<span style={{padding:10}} className="fa fa-arrow-left" onClick={()=>{
					if(this.props.callback)
						this.props.callback({});
					if(this.state.Exit){
						this.setState({
							GotoLogin:1
						})
					}else{
						window.history.back();
					}
				}}></span>
				:
				<span style={{padding:5}} className="fas fa-window-close" onClick={()=>{
						if(this.props.callback)
							this.props.callback({});

						this.setState({
							GotoPage:'/Home'
						})
				}}></span>

			}
				</div>
				<div style={{textAlign:'right',width:'calc(100% - 40px)'}}>
					{this.state.login && !this.props.noName &&
						<div className="YekanBakhFaMedium" style={{borderBottom:this.props.ComponentName ? '1px solid #909090' : ""}}>
							{this.props.fullname||"کاربر مهمان"}
						</div>
					}
					
					<div className="YekanBakhFaMedium" style={{fontSize:16,direction:'rtl',display:'none',justifyContent:'space-around'}}> 
					
					{this.props.fullname &&
						<i className="fa fa-power-off" style={{color:'red'}} />
					}
					{this.props.fullname &&
						<i className="fa fa-user" style={{color:'success'}} />
					}
					
					</div>
					<div className="YekanBakhFaMedium" style={{fontSize:16,direction:'rtl'}}> {this.props.ComponentName}
					</div>
					 
				</div>
				

				
				

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
  export default connect(mapStateToProps)(Header) 

import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom'
import { Sidebar } from 'primereact/sidebar';

import { Button } from 'primereact/button';
import Server from './Server.js'


class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.op = React.createRef();
		this.Server = new Server();
		this.state = {
			Exit:this.props.Exit,
			sideBar:0,
			GridDataForms:[],
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl(),
		}

	}
	componentDidMount() {
		this.setState({
			credit : this.props.credit
		})
		this.GetForms();
	  }
	  GetForms() {
		let that = this;
		let param = {
		  token: localStorage.getItem("api_token"),
		  Active: true
		};
		this.setState({
		  loading: 1
		})
		let SCallBack = function (response) {
		  that.setState({
			GridDataForms: response.data.result
		  })
		  that.setState({
			loading: 0  
		  })
		};
		let ECallBack = function (error) {
		  that.setState({
			loading: 0
		  })
		}
		this.Server.send("AdminApi/GetForms", param, SCallBack, ECallBack)
	  }

	render() {
		
		return (
			<div style={{position:'relative',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:this.props.bgColor||'#ebdd25',padding:10,height:this.props.height||'auto'}}>
				
				<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
				<Link style={{display:'flex',flexDirection:'column',alignItems:'center',color:'#333'}} to={`${process.env.PUBLIC_URL}/Blogs`} >

					<i class="fas fa-bell"></i>
					<span style={{fontSize:12}}>اعلان</span>
					</Link>
				</div>
				<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
					<Link style={{display:'flex',flexDirection:'column',alignItems:'center',color:'#333'}} to={`${process.env.PUBLIC_URL}/Admin?account=${this.state.AccountNumber}`} >
						<i class="fas fa-users"></i>
						<span style={{fontSize:12}}>پذیرندگان</span>
					</Link>
				</div>
				<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
				<Link style={{display:'flex',flexDirection:'column',alignItems:'center',color:'#333'}} to={`${process.env.PUBLIC_URL}/QrCode?Type=&account=${this.state.AccountNumber}`} >
				<img src="./chart.gif" style={{position:'absolute',top:-20,width:50}} />
				<i class="fas fa-barcode-read" style={{fontSize:18,visibility:'hidden'}}></i>
				<span style={{fontSize:12}}>کدپرداز</span>
				</Link>
				</div>
				<div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
				<i class="fas fa-credit-card"></i>
				<span style={{fontSize:12}}>کیف پول</span>
				</div>
				<div style={{display:'flex',flexDirection:'column',alignItems:'center'}} onClick={()=>{this.setState({sideBar:1})}} >
				<i class="fas fa-bars"></i>
				<span style={{fontSize:12}}>سایر</span>
				</div>


				<Sidebar visible={this.state.sideBar} modal={false} onHide={() => this.setState({ sideBar: false })} position="right">
					<div style={{direction:'rtl'}}>
					<p  style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}><span style={{color:'red'}} >{this.props.fullname}</span> عزیز خوش آمدید</p>
					<hr style={{borderColor:'#ffffff3b'}} />
					{this.props.username && this.state.GridDataForms.map((item,index) => {
							return(
								<Link style={{display:'flex',flexDirection:'row',alignItems:'center',color:'#333',fontSize:19,backgroundColor:'#eee',padding:5,borderRadius:5}} to={`${process.env.PUBLIC_URL}/Form?number=${item.number}&name=${item.name}`} >
								<i className={item.icon} style={{marginLeft:8}} />

								<span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }}>{item.name}</span>
								</Link>
							)
						})
					}
					
					<Link style={{display:'flex',flexDirection:'row',alignItems:'center',color:'#333',fontSize:19,backgroundColor:'#eee',padding:5,borderRadius:5,marginTop:10}} to={`${process.env.PUBLIC_URL}/reqVam`} >
								<i className="fas fa-edit" style={{marginLeft:8}} />

								<span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }}>درخواست وام</span>
					</Link>
					
					<Link style={{display:'flex',flexDirection:'row',alignItems:'center',color:'#333',fontSize:19,backgroundColor:'#eee',padding:5,borderRadius:5,marginTop:10}} to={`${process.env.PUBLIC_URL}/reqVam?edit=1`} >
								<i className="fas fa-edit" style={{marginLeft:8}} />

								<span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }}>پیگیری وام</span>
					</Link>
					<Link style={{display:'flex',flexDirection:'row',alignItems:'center',color:'#333',fontSize:19,backgroundColor:'#eee',padding:5,borderRadius:5,marginTop:10}} to={`${process.env.PUBLIC_URL}/New`} >
								<i className="fas fa-edit" style={{marginLeft:8}} />

								<span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }}>افتتاح حساب</span>
					</Link>
					
					{this.props.username &&
					<Link style={{display:'flex',flexDirection:'row',alignItems:'center',color:'#fff',fontSize:19,backgroundColor:'red',padding:5,borderRadius:5,marginTop:10}} to={`${process.env.PUBLIC_URL}/ChangePass`} >
								<i className="fas fa-lock" style={{marginLeft:8}} />

								<span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }}>تغییر رمز عبور</span>
					</Link>
					
					}
					</div>
                </Sidebar>
				

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
	  mobile : state.mobile
	}
  }
  export default connect(mapStateToProps)(Footer) 

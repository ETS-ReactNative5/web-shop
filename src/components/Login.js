import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import { Button,Alert } from 'reactstrap';
import { connect } from 'react-redux';
import Server  from './Server.js'

import Header1  from './Header1.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
class Login extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();

    this.state={
      inputEmail:'',
      inputPassword:'',
      articles : [],
      name:'',
      AutenticatedUser:false,
      AutenticatedAdmin:false,
      HasError:false,
      loginState:true,
      ActiveSms:"none",
      STitle:'',
      registerState:false,
      changePassState:false,  
      SmsToken:null,
      url:this.Server.getUrl()
    }
    this.handleChangeinputEmail = this.handleChangeinputEmail.bind(this);
    this.get = this.get.bind(this);
    this.register = this.register.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getNewPass = this.getNewPass.bind(this);
    this.goToLogin = this.goToLogin.bind(this);    
    this.handleChangeinputPassword = this.handleChangeinputPassword.bind(this);
    
  }
  componentDidMount(){
    let that = this;
    axios.post(this.state.url+'checktoken', {
      token: localStorage.getItem("api_token_user")
    })
    .then(response => {
      this.getSetting();
    })
    .catch(error => {
      this.getSetting();
    })
      
    
  }
  getSetting(){
    let that = this;
    axios.post(this.state.url+'getSettings', {
      token: localStorage.getItem("api_token")
    })
    .then(response => {
      that.setState({
        ActiveSms:response.data.result ? response.data.result.ActiveSms : "none",
        STitle:response.data.result ? response.data.result.STitle : ""
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  register(){
    this.setState({
        registerState:true,
        loginState:false,
        changePassState:false
    })
  }
  goToLogin(){
    this.setState({
      registerState:false,
      loginState:true,
      changePassState:false
  })
  }
  getPassword(){
    this.setState({
      registerState:false,
      loginState:false,
      changePassState:true
  })
  }
  getNewPass(){
    axios.post(this.state.url+'GetNewPass' , {
      username: this.state.inputEmail
    }) 
    .then(response => {
      var text = response.data.result;
      if(isNaN(text)){
        this.setState({
          HasError:text
        })
        return;
      }
    if(this.state.ActiveSms=="none")
    return;
    if(this.state.ActiveSms=="smart"){
      axios.post(this.state.url+'sendsms_smartSms', {
        token: response.data.result.TokenKey,
        text: "رمز عبور جدید شما  : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید" + "\n" + this.state.STitle,
        mobileNo : this.state.inputEmail
      })
      .then(response => {
          console.log(response);
      
      })
      .catch(error => {
      })
    }else if(this.state.ActiveSms=="smsir"){
      axios.post(this.state.url+'GetSmsToken', {
      })
      .then(response => {
            
            this.setState({
              SmsToken:response.data.result.TokenKey
            })
            axios.post(this.state.url+'sendsms_SmsIr', {
              token: response.data.result.TokenKey,
              text: "رمز عبور جدید شما  : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید" + this.state.STitle,
              mobileNo : this.state.inputEmail
            })
            .then(response => {
                console.log(response);
            
            })
            .catch(error => {
             // alert(error);
             alert(error)
            })
        
        
      })
      .catch(error => {
        alert(error);
        console.log(error)
      })
    }  
    /*axios.post('https://RestfulSms.com/api/Token', {})
            .then(response => {
                  
                  this.setState({
                    SmsToken:response.data.TokenKey
                  })
                  axios.post(this.state.url+'sendsms_SmsIr', {
                    token: response.data.TokenKey,
                    text: "رمز عبور جدید شما در سامانه ی فروشگاهی سرو : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید",
                    mobileNo : this.state.inputEmail
                  })
                  .then(response => {
                      alert(response)
                  
                  })
                  .catch(error => {
                   // alert(error);
                    console.log(error)
                  })
              
              
            })
            .catch(error => {
              alert(error);
              console.log(error)
            })
        */
      }).catch(error => {
        alert(error);
        console.log(error)
      })
  }
  get(){
    this.setState({
      HasError:false
    })
    axios.post(this.state.url+'getuser', {
      username: this.state.inputEmail,
      password: this.state.inputPassword
    })
    .then(response => {
      debugger;
      if(!response.data.token){
        this.setState({
          HasError:response.data.result[0]
        })
        return;
      }
      this.setState({
        name : response.data.result[0].name
      })
      localStorage.setItem("api_token",response.data.token);
      
      this.props.dispatch({
        type: 'LoginTrueUser',    
        CartNumber:response.data.CartNumber,
        off:parseInt(response.data.off),
        credit:response.data.result ? response.data.result[0].credit : 0

      })
      if(response.data.result[0].level=="0")
        this.setState({
          AutenticatedUser : true
        })
      else
        this.setState({
          AutenticatedAdmin : true
        })  
      
    })
    .catch(error => {
      
      this.setState({
        HasError:"نام کاربری یا رمز عبور اشتباه است"
      })
      console.log(error)
    })
  }
  handleChangeinputEmail(event){
this.setState({inputEmail: event.target.value});
  }
  handleChangeinputPassword(event){
this.setState({inputPassword: event.target.value});
  }
    render(){
      if(this.state.registerState){
        return <Redirect to='/Register' />;

      }  
    if (this.state.AutenticatedUser == true) {
      return <Redirect to='/MainBox1'  Autenticated={this.state.AutenticatedUser}/>;

    }
    if (this.state.AutenticatedAdmin == true) {
      return <Redirect to='/admin/admin'  Autenticated={this.state.AutenticatedAdmin}/>;

    }
    if(!this.state.changePassState && this.state.loginState){
        return (
          <div>
              <Header1 /> 
              <Header2 /> 
          <div className="container p-md-5 p-3" style={{direction:'rtl',minHeight:600}}>
            <div className="row">
              <div className="col-sm-10 col-12 col-md-9 col-lg-7 mx-auto">
                <div className="card card-signin" style={{paddingTop:20,paddingBottom:40}} >
                  <div className="card-body">
                    <h5 className="card-title text-center iranyekanwebmedium">کاربران | ورود به محیط کاربری</h5>
                    <form className="form-signin">
                    <div className="group">
                          <input className="form-control iranyekanwebmedium" style={{textAlign:'center'}} type="text" id="inputEmail"  value={this.state.inputEmail} name="inputEmail" onChange={this.handleChangeinputEmail}   required  />
                          <label className="iranyekanwebmedium">نام کاربری</label>
                    </div>
                    <div className="group">
                          <input type="password" className="form-control iranyekanwebmedium" style={{textAlign:'center'}} id="inputPassword" name="inputPassword" value={this.state.inputPassword} onChange={this.handleChangeinputPassword} required />
                          <label className="iranyekanwebmedium">رمز عبور</label>
                    </div>
                    <Button style={{marginLeft:5,marginTop:10}} color="warning" className="iranyekanwebmedium"  onClick={this.get}>ورود</Button>
                  </form>
                  </div>  
                  {this.state.HasError ?
                  <Alert color="danger" style={{textAlign:"center"}} className="iranyekanwebmedium">
                    {this.state.HasError}
                  </Alert>
                  :<p></p>
                  }
                  <hr/>
                  <div className="row" style={{textAlign:'center'}}>
                      <div className="col-12 col-lg-6 col-md-6">
                        <Button style={{marginLeft:5,marginTop:10}} color="info" className="iranyekanwebmedium"  onClick={this.register}>ثبت نام</Button>
                      </div>
                      <div className="col-12 col-lg-6 col-md-6">
                        <Button style={{marginLeft:5,marginTop:10}} color="info" className="iranyekanwebmedium"  onClick={this.getPassword}>بازیابی رمز عبور</Button>
                      </div>
                    </div>
                </div>
                
              </div>
              
            </div>
          </div>
          <Footer /> 
          </div>

        )
    }
    if(this.state.changePassState && !this.state.loginState){ //بازیابی رمز عبور
      return (
        <div>
              <Header1 /> 
              <Header2 /> 
        <div className="container p-md-5 p-3" style={{direction:'rtl',minHeight:600}}>
          <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
              <div className="card card-signin" style={{padding:40}}>
                <div className="card-body">
                  <h5 className="card-title text-center iranyekanwebmedium">بازیابی رمز عبور</h5>
                  <form className="form-signin">
                  <div className="group">
                        <input className="form-control iranyekanwebmedium" type="text" id="inputEmail"  value={this.state.inputEmail} name="inputEmail" onChange={this.handleChangeinputEmail}   required  />
                        <label className="iranyekanwebmedium">شماره موبایل</label>
                  </div>
                <Button style={{marginLeft:5,marginTop:10}} color="primary" className="iranyekanwebmedium"  onClick={this.getNewPass}>دریافت رمز عبور</Button>
                </form>
                </div>  
                {this.state.HasError ?
                <Alert color="danger" style={{textAlign:"center"}} className="iranyekanwebmedium">
                  {this.state.HasError}
                </Alert>
                :<p></p>
                }
                <hr/>
                <div className="row">
                    <div className="col-8">
                      <Button style={{marginLeft:5,marginTop:10}} color="info" className="iranyekanwebmedium"  onClick={this.goToLogin}>ورود به محیط کاربری</Button>
                    </div>
                    
                  </div>
              </div>
              
            </div>
            
          </div>
        </div>
        <Footer /> 
        </div>

      )
  }
    }
}
const mapStateToProps = (state) => {
  return{
    CartNumber : state.CartNumber,
    off : state.off,
		credit:state.credit
  }
}
export default withRouter(
  connect(mapStateToProps)(Login)
);
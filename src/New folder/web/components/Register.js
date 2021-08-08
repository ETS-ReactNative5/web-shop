import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import { Button,Alert } from 'reactstrap';
import { connect } from 'react-redux';
import Header1  from './Header1.js'
import Server  from './Server.js'

import Footer  from './Footer.js' 
import Header2  from './Header2.js'
class Register extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();

    this.state={
      name:'',
      Mobile:this.props.Mobile||'',
      Password:'',
      Password2:'',
      company:'',
      address:'',
      mail:'',
      SecurityCode : '',
      AfterFirstStep : false,
      AfterFinalStep : false,
      SmsToken : null,
      ActiveSms:"none",
      url:this.Server.getUrl(),
      AccessAfterReg:0,
      RegSmsText:'',
      STitle:''


      
    }
    this.Register = this.Register.bind(this);
    this.handleChangeMobile = this.handleChangeMobile.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);

    
    this.handleChangeSecurityCode = this.handleChangeSecurityCode.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangePassword2 = this.handleChangePassword2.bind(this);

  }
  convertNum(str){
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
       arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
     
        if(typeof str === 'string')
        {
          for(var i=0; i<10; i++)
          {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
          }
        }
        return str;
  }
  componentDidMount(){
    let that = this;
    
      axios.post(this.state.url+'getSettings', {
        token: localStorage.getItem("api_token")
      })
      .then(response => {
        that.setState({
          ActiveSms:response.data.result ? response.data.result.ActiveSms : "none",
          AccessAfterReg:response.data.result ? response.data.result.AccessAfterReg : 0,
          RegSmsText:response.data.result ? response.data.result.RegSmsText : '',
          STitle:response.data.result ? response.data.result.STitle : ''
        })
      })
      .catch(error => {
        console.log(error)
      })
    
  }
  Register(){
    let mobile = this.convertNum(this.state.Mobile.trim());

    if(!this.state.AfterFirstStep){

      if(this.state.Password != this.state.Password2){
        this.setState({
          HasError:"رمز عبور و تکرار آن متفاوت است"
        })
        return;
      }
      axios.post(this.state.url+'Register' , {
        username: mobile,
        password: this.state.Password.trim(),
        name:this.state.name,
        company:this.state.company,
        address:this.state.address,
        mail:this.state.mail,
        Step: "1",
        AccessAfterReg:this.state.AccessAfterReg
      }) 
      .then(response => {
        if(response.data.result[0] && response.data.result[0].status=="1"){
          this.setState({
            HasError:"شماره موبایل وارد شده قبلا در سیستم ثبت شده است"
          })
          return;
        }
              this.setState({
                AfterFirstStep :true
              })  

            
              var SecCode = response.data.SecurityCode;
            
              if(this.state.ActiveSms=="smart"){
                axios.post(this.state.url+'sendsms_smartSms', {
                  token: response.data.result.TokenKey,
                  text: this.state.AccessAfterReg ? this.state.RegSmsText +"\n"+"کد  ثبت نام : " +SecCode+"\n"+this.state.STitle : this.state.RegSmsText +"\n" + "کد پیگیری ثبت نام : "+SecCode+"\n"+this.state.STitle,
                  mobileNo : mobile
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
                        text: this.state.AccessAfterReg ? this.state.RegSmsText +"\n"+"کد  ثبت نام : " +SecCode+"\n"+this.state.STitle : this.state.RegSmsText +"\n" + "کد پیگیری ثبت نام : "+SecCode+"\n"+this.state.STitle,
                        mobileNo : mobile
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
            
            

      })
      .catch(error => {
        alert(error);
        console.log(error)
      })

    }
    if(this.state.AfterFirstStep){
      if(this.state.SecurityCode == "" ){

        this.setState({
          HasError:"کد امنیتی پیامک شده را وارد کنید"
        })
        return;

      }
      
      axios.post(this.state.url+'Register',{
        username: mobile,
        password: this.state.Password,
        SecurityCode: this.state.SecurityCode,
        Step: "2"
      })
      .then(response => {
            if(response.data.msg){
              this.setState({
                HasError:response.data.msg
              })
              return;
            }
            axios.post(this.state.url+'Register', {
            username: mobile,
            password: this.state.Password,
            Step: "3"
          })
          .then(response => {
            localStorage.setItem("api_token",response.data.token);

            this.setState({
              AfterFinalStep : true
            })
            
      })
      .catch(error => {
        alert(error);
        console.log(error)
      })
      })
      .catch(error => {
        alert(error);
        console.log(error)
      })

    }
    
  }
  handleChangeName(event){
    this.setState({name: event.target.value});

  }
  handleChangeCompany(event){
    this.setState({company: event.target.value});
  }
  handleChangeMail(event){
    this.setState({mail: event.target.value});
  }
  handleChangeAddress(event){
    this.setState({address: event.target.value});
  }
  handleChangeMobile(event){
    this.setState({Mobile: event.target.value});
  }
  handleChangeSecurityCode(event){
    this.setState({SecurityCode: event.target.value});
  }
  handleChangePassword(event){
    this.setState({Password: event.target.value});
  }
  handleChangePassword2(event){
    this.setState({Password2: event.target.value});
  }
  render(){
    if (this.state.AfterFinalStep == true) {
      return <Redirect to='/MainShop'  />;

    }
        return (
    <div>
    <Header1 /> 
    <Header2 /> 
   <div className="container p-md-5 p-3" style={{direction:'rtl',minHeight:600}}>
    <div className="row">
      <div className="col-md-12 col-lg-9 mx-auto">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center yekan">ثبت نام کاربران</h5>
            <form className="form-signin">
           <div className="row" >
            
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input className="form-control yekan" type="text" id="Mobile"  value={this.state.Mobile} name="Mobile" onChange={this.handleChangeMobile}   required  />
                  <label className="yekan">شماره موبایل</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input className="form-control yekan" type="text" id="name"  value={this.state.Mobnameile} name="name" onChange={this.handleChangeName}  required   />
                  <label className="yekan">نام و نام خانوادگی</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input type="password" dir="ltr" className="form-control yekan" id="Password" name="Password" value={this.state.Password} onChange={this.handleChangePassword} required />
                  <label className="yekan">رمز عبور</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input type="password" dir="ltr" className="form-control yekan" id="Password2" name="Password2" value={this.state.Password2} onChange={this.handleChangePassword2} required />
                  <label>تکرار رمز عبور</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input className="form-control yekan" dir="ltr" type="text" id="mail"  value={this.state.mail} name="mail" onChange={this.handleChangeMail}   required  />
                  <label className="yekan">پست الکترونیکی</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input className="form-control yekan" type="text" id="company"  value={this.state.company} name="company" onChange={this.handleChangeCompany}  required   />
                  <label className="yekan">نام شرکت</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            <div className="group">
                  <input className="form-control yekan" type="text" id="address"  value={this.state.address} name="address" onChange={this.handleChangeAddress}  required   />
                  <label className="yekan">آدرس</label>
					  </div>
            </div>
            <div className="col-md-12 col-12" >
            {this.state.AfterFirstStep && this.state.AccessAfterReg==1 ?
            <div><div style={{textAlign:'right',marginRight:5}} >
              <label className="yekan" style={{textAlign: 'center',marginTop: 10}}>کد امنیتی پیامک شده را وارد کنید</label>
            </div>
            
            <div className="group">
                  <input className="form-control yekan" type="text" id="SecurityCode"  value={this.state.SecurityCode} name="SecurityCode" onChange={this.handleChangeSecurityCode}   required  />
                  <label className="yekan">کد امنیتی</label>
					  </div></div>
            
            : this.state.AfterFirstStep ?
            <div><div >
              <label className="yekan" style={{textAlign: 'center',marginTop: 10}}>اطلاعات شما در سیستم ثبت شد وضعیت ثبت نام از طریق پیامک به اطلاع شما خواهد رسید</label>
            </div>
            </div>
            :
            <div></div>  
            }
            </div>
            <div className="col-md-12 col-12" >
            {(!this.state.AfterFirstStep || this.state.AccessAfterReg==1) &&
            <Button style={{marginLeft:5,marginTop:10}} color="primary" className="yekan"  onClick={this.Register}>ثبت نام</Button>

            }
            </div>
            </div>
          </form>
          </div>  
          {this.state.HasError ?
          <Alert color="danger" style={{textAlign:"center"}} className="yekan">
            {this.state.HasError}
          </Alert>
          :<p></p>
          }
        </div>
      </div>
    </div>
  </div>
  <Footer /> 
  </div>
        )
  }
}
const mapStateToProps = (state) => {
  return{
    CartNumber : state.CartNumber,
  }
}
export default withRouter(
  connect(mapStateToProps)(Register)
);
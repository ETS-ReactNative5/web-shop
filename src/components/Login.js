import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import { Button,Alert } from 'reactstrap';
import { connect } from 'react-redux';
import Server  from './Server.js'
import { Toast } from 'primereact/toast';

import './Login.css';

import Header1  from './Header1.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
import Header  from './Header.js'


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
      AccessAfterReg:0,
      STitle:'',
      registerState:false,
      changePassState:false,  
      SmsToken:null,
      Step:0,
      url:this.Server.getUrl()
    }
    this.toast = React.createRef();

    this.handleChangeinputEmail = this.handleChangeinputEmail.bind(this);
    this.get = this.get.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getNewPass = this.getNewPass.bind(this);
    this.goToLogin = this.goToLogin.bind(this);    
    this.handleChangeinputPassword = this.handleChangeinputPassword.bind(this);
    this.handleChangeSecurityCode = this.handleChangeSecurityCode.bind(this);

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
        STitle:response.data.result ? response.data.result.STitle : "",
        AccessAfterReg:response.data.result ? response.data.result.AccessAfterReg : 0,
        RegSmsText:response.data.result ? response.data.result.RegSmsText : '',
        RegisterByMob: response.data.result ? response.data.result.RegisterByMob : false,
        System: response.data.result ? response.data.result.System : "shop"


      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  
  goToLogin(){
    this.setState({
      loginState:true,
      changePassState:false
  })
  }
  getPassword(){
    this.setState({
      Step:-1
  })
  }

  getNewPass(){
    if(!this.state.inputEmail || this.state.inputEmail == ""){
      this.toast.current.show({ severity: 'error', summary: <div> شماره تلفن همراه نمی تواند خالی باشد</div>, life: 8000 });
      return;
    }
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
        this.setState({
          Step:0
        })
      
      })
      .catch(error => {
      })
    }else if(this.state.ActiveSms=="smsir"){
            axios.post(this.state.url+'sendsms_SmsIr', {
              text: "رمز عبور جدید شما  : \n"+text+"\n در اولین فرصت رمز عبور خود را تغییر دهید" + this.state.STitle,
              mobileNo : this.state.inputEmail
            })
            .then(response => {
                this.setState({
                  Step:0
                })
                console.log(response);
            
            })
            .catch(error => {
             // alert(error);
             alert(error)
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
  Register(final){
    if(!this.state.inputEmail || this.state.inputEmail == ""){
      this.toast.current.show({ severity: 'error', summary: <div> شماره تلفن همراه نمی تواند خالی باشد</div>, life: 8000 });
      this.setState({
        Step:0
      })
      return;
    }
    if(this.state.Step==2){

      if(!this.state.RegisterByMob){
        this.setState({
          registerState:true
        })
        return;
      }
      axios.post(this.state.url+'Register' , {
        username: this.state.inputEmail.trim(),
        Step: "1",
        AccessAfterReg:this.state.AccessAfterReg
      }) 
      .then(response => {
        
             

            
              var SecCode = response.data.SecurityCode;
            
              if(this.state.ActiveSms=="smart"){
                axios.post(this.state.url+'sendsms_smartSms', {
                  token: response.data.result.TokenKey,
                  text: this.state.AccessAfterReg ? "کد ثبت نام : " +SecCode+"\n"+"این کد به عنوان رمز عبور شما در سیستم تعریف می شود"+"\n"+this.state.STitle : this.state.RegSmsText +"\n"+"این کد به عنوان رمز عبور شما در سیستم تعریف می شود"+"\n" + "کد پیگیری ثبت نام : "+SecCode+"\n"+this.state.STitle,
                  mobileNo : this.state.inputEmail.trim()
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
                        text: this.state.AccessAfterReg ? "کد  ثبت نام : " +SecCode+"\n"+"این کد به عنوان رمز عبور شما در سیستم تعریف می شود"+"\n"+this.state.STitle : this.state.RegSmsText +"\n" + "کد پیگیری ثبت نام : "+SecCode+"\n"+"این کد به عنوان رمز عبور شما در سیستم تعریف می شود"+"\n"+this.state.STitle,
                        mobileNo : this.state.inputEmail.trim()  
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
    if(this.state.Step == 3){
      
      
      axios.post(this.state.url+'Register',{
        username: this.state.inputEmail,
        password: this.state.SecurityCode,
        SecurityCode: this.state.SecurityCode,
        Step: "2"
      })
      .then(response => {
            if(response.data.msg){
              this.setState({
                Step:2,
                HasError:response.data.msg
              })
              return;
            }
            axios.post(this.state.url+'Register', {
            username: this.state.inputEmail,
            password: this.state.SecurityCode,
            Step: "3"
          })
          .then(response => {
            
            if(this.state.ActiveSms=="smart"){
              axios.post(this.state.url+'sendsms_smartSms', {
                token: response.data.result.TokenKey,
                text: this.state.RegSmsText+"\n"+this.state.STitle,
                mobileNo : this.state.inputEmail.trim()
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
                      text: this.state.RegSmsText+"\n"+this.state.STitle,
                      mobileNo : this.state.inputEmail.trim()  
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




            localStorage.setItem("api_token",response.data.token);
            this.props.dispatch({
              type: 'LoginTrueUser',    
              CartNumber:0,
              off:0,
              credit:0
      
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
  get(){
    if(this.state.Step=="-1"){
      this.getNewPass();
      return;
    }
    this.setState({
      HasError:false
    })
    if(!this.state.inputPassword && this.state.Step !=2){
      axios.post(this.state.url+'getuser', {
        username: this.state.inputEmail
      })
      .then(response => {
        
        
        if(response.data.result=="no" ){
          
          if(this.state.System =="shop"){
            this.setState({
              Step:2
            })
            this.Register();

          }else{
            this.setState({
              HasError:"نام کاربری نادرست است"
            })
          }
         
        }else{
          this.setState({
            Step:1
          })
        }
        
      })
      .catch(error => {
        if(this.state.System =="shop"){
          this.setState({
            Step:2
          })
          this.Register();
          console.log(error)
        }
        
      })
      
      return;

    }else if(this.state.Step ==2){
      if(this.state.SecurityCode == "" ){

        this.setState({
          HasError:"کد امنیتی پیامک شده را وارد کنید"
        })
        return;

      }
      this.setState({
        Step:3
      })  
      let that=this;
      setTimeout(function(){
        that.Register();

      },0)
      return;
    }
    axios.post(this.state.url+'getuser', {
      username: this.state.inputEmail,
      password: this.state.inputPassword
    })
    .then(response => {
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
        HasError:"رمز عبور اشتباه است"
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
  handleChangeSecurityCode(event){
    this.setState({SecurityCode: event.target.value});
  }
    render(){
      if(this.state.registerState){
        return <Redirect to='/Register' Mobile={this.state.mobileNo} />;

      }  
    if (this.state.AutenticatedUser == true) {
      return <Redirect to='/MainShop'  Autenticated={this.state.AutenticatedUser}/>;

    }
    if (this.state.AutenticatedAdmin == true) {
      return <Redirect to='/admin/admin'  Autenticated={this.state.AutenticatedAdmin}/>;

    }
    if(!this.state.changePassState && this.state.loginState){
        return (
          <div>
          {!this.props.noHeader && this.state.System == "shop" &&
              <Header1 /> 

          }
          {!this.props.noHeader && this.state.System == "shop" &&
              <Header2 /> 

          }

          {!this.props.noHeader && this.state.System != "shop" &&
              <Header /> 

          }
          <div className="mt-lg-5 mt-2" style={{direction:'rtl',minHeight:!this.props.noHeader ? 600 : 'auto'}}>
            <div className="row">
              <div className="col-sm-10 col-12 col-md-9 col-lg-12 mt-md-0 mt-5 mx-auto" style={{position:'relative'}}>
              <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                <div className={(this.props.noHeader) ? "card-signin2" : "card card-signin"} style={{paddingTop:20,paddingBottom:40}} >
                  <div className="card-body">
                    <div style={{display:'flex',justifyContent:'spaceBetween'}}>
                      <div>
                        {this.state.Step != 0 &&
                          <i className="fal fa-arrow-circle-right" style={{cursor:'pointer',fontSize:28}} onClick={()=>{this.setState({Step:0,inputPassword:"",HasError:0})}} />
                        }
                      </div>
                      <div>

                      </div>
                    </div>
                    {this.state.System != "shop" ?
                       <h5 className="card-title text-center YekanBakhFaBold" style={{marginTop:20}}>{this.state.Step =="-1" ? 'درخواست بازیابی رمز عبور' : 'ورود به محیط کاربری'}</h5>
                    :
                      <h5 className="card-title text-center YekanBakhFaBold" style={{marginTop:20}}>{this.state.Step =="-1" ? 'درخواست بازیابی رمز عبور' : 'ورود / ثبت نام'}</h5>
                    }
                    {(this.state.Step == "0" || this.state.Step=="-1") &&
                    <div >
                    {this.state.Step=="-1" &&
                    <div className="YekanBakhFaBold group" style={{textAlign:'right',color:'blueviolet'}} >
                      رمز عبور جدید به شماره تلفن همراه شما پیامک خواهد شد
                    </div>
                    }
                    <div className="group" style={{marginTop:45}}>
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="number" id="inputEmail"  value={this.state.inputEmail} name="inputEmail" onChange={this.handleChangeinputEmail}   required  />
                          <label className="YekanBakhFaBold">شماره موبایل</label>
                    </div>
                    </div>
                    }
                    {this.state.Step == "1" &&
                    <div><div className="group">
                          <input type="password" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="inputPassword" name="inputPassword" value={this.state.inputPassword} onChange={this.handleChangeinputPassword} required />
                          <label className="YekanBakhFaBold">رمز عبور</label>
                    </div>


                    <div>
                      <div onClick={this.getPassword} className="YekanBakhFaBold" style={{cursor:'pointer',textAlign:'right',marginTop:30,display:'flex',alignItems:'center',color:'blue'}}><span>بازیابی رمز عبور</span><i className="fal fa-arrow-left" style={{marginRight:7}}></i></div>
                    </div>
                    </div>
                   }
                   {this.state.Step == "2" &&
                    <div className="group">
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id="SecurityCode"  value={this.state.SecurityCode} name="SecurityCode" onChange={this.handleChangeSecurityCode}   required  />
                          <label className="YekanBakhFaBold">کد تایید </label>
                    </div>
                    }
                    <div style={{width:'100%'}}>
                    <button className="btn btn-success YekanBakhFaMedium" style={{marginTop:40,marginBottom:10,width:'100%'}} onClick={this.get}>{this.state.Step=="-1" ? 'بازیابی رمز عبور' : 'ورود'}</button>

                    </div>

                  </div>  
                  {this.state.HasError ?
                  <Alert color="danger" fade={false} isOpen={this.state.HasError} toggle={()=>{this.setState({HasError:0})}}   style={{textAlign:"center",margin:10}} className="YekanBakhFaBold">
                    {this.state.HasError}
                  </Alert>
                  :<p></p>
                  }
                  
                </div>
                
              </div>
              
            </div>
          </div>
          {!this.props.noFooter &&
            <Footer /> 
          }
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
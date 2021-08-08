import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header from './Header.js'
import CartBox from './CartBox.js'
import Cities from './Cities.js'

import { Link } from 'react-router-dom'
import MainBox3 from './MainBox3.js'
import Footer from './Footer.js'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './Cart.css'
import CatList from './CatList.js'
import { InputNumber } from 'primereact/inputnumber';

import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.toast = React.createRef();
        this.get = this.get.bind(this);
        this.getPassword = this.getPassword.bind(this);
        this.getNewPass = this.getNewPass.bind(this);
        this.goToLogin = this.goToLogin.bind(this);   
        this.state = {
            inputEmail:'',
            ShopId: this.props.location.search.split("ShopId=")[1],
            ProductId: this.props.location.search.split("ProductId=")[1],
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
            login:-1,
            registerState:false,
            changePassState:false,  
            SmsToken:null,
            Step:0,
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }


    }
    roundPrice(price) { 
        return price.toString();
        if (price == 0)
            return price;
        price = parseInt(price).toString();
        let C = "500";
        let S = 3;
        if (price.length <= 5) {
            C = "100";
            S = 2;
        }
        if (price.length <= 4) {
            C = "100";
            S = 2;
        }
        let A = price.substr(price.length - S, S)
        if (A == C || A == "000" || A == "00")
            return price;
        if (parseInt(A) > parseInt(C)) {
            let B = parseInt(A) - parseInt(C);
            return (parseInt(price) - B + parseInt(C)).toString();
        } else {
            let B = parseInt(C) - parseInt(A);
            return (parseInt(price) + B).toString();
        }


    }
    getHeaderResponse(){
        this.setState({
            WaitingPayment: 0
        })
    }
    componentDidMount() {
        let that = this;
        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                
                this.setState({
                    userId: response.data.authData.userId,
                    login:0
                }) 
                this.getSetting();

                
            })
            .catch(error => {
                this.setState({
                  login:1
                })
                this.getSetting();
            })
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
    EditAddress() {
        let that = this;
        if (!this.props.mobile)
            return;
        let mobile = this.props.mobile.length > 10 ? this.props.mobile.substring(1) : this.props.mobile;

        let param = {
            username: mobile,
            city: that.state.SelectedCity,
            subCity: that.state.SelectedSubCity,
            address: that.state.NewAddress
        };
        let SCallBack = function (response) {
            if(that.toast.current)
              that.toast.current.show({ severity: 'success', summary: 'ویرایش آدرس', detail: <div className="YekanBakhFaMedium">آدرس با موفقیت ویرایش شد</div>, life: 8000 });
            that.setState({
                ShowDialog: false,
                getAddress: false,
                Address: that.state.NewAddress,
                GooToPage : that.state.ProductId ? '/products?id='+that.state.ProductId+'' : (that.state.ShopId ? '/Shops?id='+that.state.ShopId+'' : '')
            })

            

        };
        let ECallBack = function (error) {

        }
        that.Server.send("AdminApi/EditAddress", param, SCallBack, ECallBack)

    }
    getResponse(value) {
        this.setState({
            SelectedCity: value.SelectedCity,
            SelectedSubCity: value.SelectedSubCity
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
        RegisterByMob: response.data.result ? response.data.result.RegisterByMob : false

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
    this.setState({
      loading:1,
      HasError:null
    })
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
          loading:0,
          Step:0,
          inputPassword:''
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
                  loading:0,
                  Step:0,
                  inputPassword:''
                })
                console.log(response);
            
            })
            .catch(error => {
             // alert(error);
             this.setState({
               loading:0
             })
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
        this.setState({
          loading:0
        })
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
      this.setState({
        loading:1
      })
      axios.post(this.state.url+'Register' , {
        username: this.state.inputEmail.trim(),
        Step: "1",
        AccessAfterReg:this.state.AccessAfterReg
      }) 
      .then(response => {
            this.setState({
              loading:0
            })
             

            
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
      
      this.setState({
        loading:1
      })
      axios.post(this.state.url+'Register',{
        username: this.state.inputEmail,
        password: this.state.SecurityCode,
        SecurityCode: this.state.SecurityCode,
        Step: "2"
      })
      .then(response => {
            this.setState({
              loading:0
            })
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
        this.setState({
          loading:0
        })
        alert(error);
        console.log(error)
      })
      })
      .catch(error => {
        this.setState({
          loading:0
        })
        alert(error);
        console.log(error)
      })

    }
    
  }
  get(){
    this.setState({
      loading:1
    })
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
        
        this.setState({
          Step:response.data.result=="yes" ? 1 : 2,
          loading:0
        })
        if(response.data.result=="no" ){
          this.Register();
        }
      })
      .catch(error => {
        this.setState({
          Step:2,
          loading:0
        })
        this.Register();
        console.log(error)
      })
      
      return;

    }else if(this.state.Step ==2){
      if(this.state.SecurityCode == "" ){

        this.setState({
          HasError:"کد امنیتی پیامک شده را وارد کنید",
          loading:0
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
          HasError:response.data.result[0],
          loading:0
        })
        return;
      }
      this.setState({
        name : response.data.result[0].name,
        loading:0
      })
      localStorage.setItem("api_token",response.data.token);
      this.props.dispatch({
        type: 'LoginTrue',
        LoginAnia:true,
        username: null,
        password: this.state.inputPassword,
        mobile:this.state.inputEmail,
        fullname:response.data.result[0].name||response.data.result[0].username
      })
      this.setState({
        GotoHome: true
      })  
       
      
    })
    .catch(error => {
      
      this.setState({
        HasError:"نام کاربری یا رمز عبور اشتباه است",
        loading:0
      })
      console.log(error)
    })
  }

    render() {
      
      if (this.state.GotoHome && !localStorage.getItem("food")) {
        return <Redirect to={"/MainBox"} />;
      }
      if (this.state.GotoHome && localStorage.getItem("food")) {
        return <Redirect to={"/MainBox?food=1"} />;
      }
      if (this.state.GooToPage) {
        return <Redirect to={this.state.GooToPage} />;
      }

      
      
        return (
           !this.state.loading ?
            <div>

                <Header callback={this.getHeaderResponse.bind(this)} ComponentName="مشخصات کاربری" small="1" />
                {this.state.login == 1 ? 
                <div>
                  <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />

                  <div className="container p-md-5 p-3" style={{direction:'rtl',minHeight:600}}>
            <div className="row">
              <div className="col-sm-10 col-12 col-md-9 col-lg-7 mt-md-0 mt-5 mx-auto" style={{position:'relative'}}>

                <div style={{paddingTop:20,paddingBottom:40}} >
                  <div className="card-body" style={{padding:10}}>
                    <div style={{display:'flex',justifyContent:'spaceBetween'}}>
                      <div>
                        {this.state.Step != 0 &&
                          <i className="fal fa-arrow-circle-right" style={{cursor:'pointer',fontSize:28}} onClick={()=>{this.setState({Step:0,inputPassword:"",HasError:0})}} />
                        }
                      </div>
                      <div>

                      </div>
                    </div>
                    <h5 className="card-title text-center YekanBakhFaMedium" style={{marginTop:20,fontSize:32,textAlign:'center'}}>{this.state.Step =="-1" ? 'درخواست بازیابی رمز عبور' : 'ورود / ثبت نام'}</h5>
                    {(this.state.Step == "0" || this.state.Step=="-1") &&
                    <div >
                    {this.state.Step=="-1" &&
                    <div className="YekanBakhFaMedium group" style={{textAlign:'right',color:'blueviolet'}} >
                      رمز عبور جدید به شماره تلفن همراه شما پیامک خواهد شد
                    </div>
                    }
                    <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center' }}>
                            <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} id="inputEmail" value={this.state.inputEmail} name="inputEmail" onChange={(event) => { 
                                this.setState({ inputEmail: event.target.value }) }} required />
                            <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>تلفن همراه</label>
                    </div>
                    
                    </div>
                    }
                    {this.state.Step == "1" &&
                    <div>
                    <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center' }}>
                            <input className="form-control YekanBakhFaMedium" autocomplete="off" type="password" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} id="inputPassword" value={this.state.inputPassword} name="inputPassword" onChange={(event) => { 
                                this.setState({ inputPassword: event.target.value }) }} required />
                            <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>رمز عبور</label>
                    </div>


                    <div>
                      <div onClick={this.getPassword} className="YekanBakhFaMedium" style={{cursor:'pointer',textAlign:'right',marginTop:30,display:'flex',alignItems:'center',color:'blue'}}><span>بازیابی رمز عبور</span><i className="fal fa-arrow-left" style={{marginRight:7}}></i></div>
                    </div>
                    </div>
                   }
                   {this.state.Step == "2" &&
                   <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center' }}>
                   <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} id="SecurityCode" value={this.state.SecurityCode} name="SecurityCode" onChange={(event) => { 
                       this.setState({ SecurityCode: event.target.value }) }} required />
                   <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>کد تایید</label>
                   </div>
                    }
                    <div style={{width:'100%',textAlign:'center',marginTop:80}}>
                    <Button style={{ fontFamily: 'YekanBakhFaMedium',padding:9 }} label={this.state.Step=="-1" ? 'بازیابی رمز عبور' : 'ورود به سیستم'}   className="btn btn-success" onClick={this.get} autoFocus />


                    </div>

                  </div>  
                  {this.state.HasError ?
                   <p style={{color:'red',textAlign:'center',fontFamily: 'YekanBakhFaMedium'}}>
                    {this.state.HasError}
                   </p> 
                  :<p></p>
                  }
                  
                </div>
                
              </div>
              
            </div>
          </div>
                </div>
              
                :
                this.state.login == -1 ?
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                        <ProgressSpinner style={{paddingTop:150}}/>
                    </div>
                    :
                <div style={{padding:10}}>
                  <div>
                        <p className="YekanBakhFaMedium" style={{ textAlign: 'right' }} >آدرس خود را در سیستم ثبت کنید</p>
                        <Cities callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity} />


                        <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 25,marginTop:15 }}>آدرس کامل پستی</label>

                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center', padding: 20 }}>

                            <textarea className="form-control YekanBakhFaMedium" autocomplete="off" style={{ borderRadius: 5, textAlign: 'right', width: '100%', height: 150, marginTop: 20 }} type="number" id="NewAddress" value={this.state.NewAddress} name="NewAddress" onChange={(e) => this.setState({ NewAddress: e.target.value })} required />
                        </div>
                        <div className="button_container" style={{ textAlign: 'center' }}>
                            <Button color="success" style={{ marginBottom: 40, fontFamily: 'YekanBakhFaMedium', padding: 5 }} className="YekanBakhFaMedium p-button-primary" onClick={() => { this.EditAddress() }}>ثبت آدرس</Button>
                        </div>
                    </div>
                
                </div>

                }

                
                
            </div>
            
            :
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                <ProgressSpinner style={{paddingTop:150}}/>
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
        mobile: state.mobile
    }
}
export default withRouter(
    connect(mapStateToProps)(Cart)
);
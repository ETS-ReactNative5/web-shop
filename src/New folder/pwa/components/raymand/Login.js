import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux';
import Server from '../Server.js'
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { withRouter, Redirect, Link } from 'react-router-dom'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.toast = React.createRef();

    this.Server = new Server();
    this.LoginPress = this.LoginPress.bind(this);
    this.state = {
      username: '',
      ip: 'https://ansar24.com',
      AbsoluteIp: 'ansar24.com',
      placeSet: '',
      Address: '',
      Logo: '',
      Tel: '',
      place: "1280",
      ShowLoading:false,
      showWebElements:false,
      chacheVersion:2,
      url: this.Server.getUrl(0)

    }

  }

  componentDidMount() {
    if(!document.referrer.includes('android-app://')){
      this.setState({
        showWebElements:true
      })
    }
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
  LoginAnia(){
    let that = this;
    localStorage.removeItem("food");
    let username = this.convertNum(this.state.username);
    let password = this.convertNum(this.state.password);
    if(!username){
      return;
    }
    this.setState({
      ShowLoading: true
    })
    let SCallBack = function (response) {
      if(!response.data.token){
        that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">پارامترهای ورودی صحیح نیست</div>, life: 4000 });

        return;
      }
      localStorage.setItem("api_token",response.data.token);
      that.props.dispatch({
        type: 'LoginTrue',
        LoginAnia:true,
        username: null,
        password: password,
        mobile:username,
        fullname: response.data.result[0].name || username,
      })
      that.setState({
        GotoHome: true
      })  
    };
    let ECallBack = function (error) {
      
      that.setState({
        HasError:"رمز عبور اشتباه است"
      })
      console.log(error)
    }
    this.Server.send("MainApi/getuser", {
      username: username,
      password: password
    }, SCallBack, ECallBack)

  }
  LoginPress(Again) {
    let that = this;
    localStorage.removeItem("food");
    let username = this.convertNum(this.state.username);
    let password = this.convertNum(this.state.password);
    if(!username){
      return;
    }
    if(username && username.length > 9){

      this.LoginAnia();
      return;
    }
    this.setState({
      ShowLoading: true
    })
    let SCallBack = function (response) {
      let name = "";
      let family = "";
      let mobile = "";
      if (response[0])
        response = response[0].children;
      else {
        that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">پارامترهای ورودی صحیح نیست</div>, life: 4000 });

        that.setState({
          ShowLoading: false
        })
        return;
      }
      //response = response[0].children;

      for (let i = 0; i < response.length; i++) {

        if (response[i].name == "Cust_Name") {
          if (response[i].value != "") {
            name = response[i].value;
          }
        }
        if (response[i].name == "Cust_Family") {
          if (response[i].value != "") {
            family = response[i].value;

          }
        }
        if (response[i].name == "Cust_Mobile") {
          if (response[i].value != "") {
            mobile = response[i].value;

          }
        }

        
        that.setState({
          fullname: name + " " + family,
          mobile:mobile
        })
      }
      if (family != "") {
        let SCallBack = function (response) {
          
          if (response)
            response = response[0].children;
          else {
            that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">پارامترهای ورودی صحیح نیست</div>, life: 4000 });
            
            return;
          }
          for (let i = 0; i < response.length; i++) {
            
            if (response[i].name == "A_Accx") {
              if (response[i].value != "")
                that.setState({
                  account: response[i].value
                })
            }


          }
          if (that.state.account) {
            that.Server.send("MainApi/getuser", {username:that.state.mobile,noPass:1,RaymandUser:username}, function (response) {
              localStorage.setItem("api_token",response.data.token);
              if(response.data.result && response.data.result.error){
                
                that.Server.send("MainApi/autoRegister", {username:that.state.mobile,password:password,address:that.state.Address,name:that.state.fullname,RaymandUser:username}, function (response) {
                  that.props.dispatch({
                    type: 'LoginTrue',
                    username: username,
                    password: password,
                    ip: that.state.ip,
                    account: that.state.account,
                    place: that.state.place,
                    placeName: that.state.Logo,
                    fullname: that.state.fullname,
                    Address: that.state.Address,
                    mobile:that.state.mobile
                  })
                  that.setState({
                    GotoHome: true
                  })
                }, function (error) {
                  
                })
              }else{
                that.props.dispatch({
                  type: 'LoginTrue',
                  username: username,
                  password: password,
                  ip: that.state.ip,
                  account: that.state.account,
                  place: that.state.place,
                  placeName: that.state.Logo,
                  fullname: that.state.fullname,
                  Address: that.state.Address,
                  mobile:that.state.mobile
                })

                that.setState({
                  GotoHome: true
                })
              }
              
            }, function (error) {
              that.setState({
                ShowLoading: false
              })
              alert(error)
            })
          }

        }
        let ECallBack = function (error) {
          that.setState({
            ShowLoading: false
          })
          alert(error)
        }
        var param = '{CommandNo : "31" , AccountNo: "' + username + '",Param1: "' + password + '" }';
        that.Server.sendRaymand("" + that.state.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack)
      }
    };
    let ECallBack = function (error) {
      that.setState({
        ShowLoading: false
      })

      alert(error)
    }

    var param = '{CommandNo : "151" , AccountNo: ' + username + ',Param1: ' + password + ' }';
    this.Server.sendRaymand("" + this.state.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack)
  }
  render() {
    if (this.state.GotoHome) {
      return <Redirect to={"/Home"} />;
    }
    return (
      
      <div class="bg1"style={{ textAlign: 'right', height: '100%',display:'flex',justifyContent:'center' }} >
        <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
        {!this.state.ShowLoading ? 
        <div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', height: 60, width: '75%', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '60%' }}>
              <img src="./icons/ansar_name.png" style={{ width: '100%' }} />

            </div>
            <div style={{ width: '25%' }}>
              <img src="./icons/ansar_logo.png" style={{ width: 40 }} />

            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', height: 'calc(100% - 100px)',marginTop:20 }}>
          <div style={{ width: '100%' }}>


            <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative' }}>
              <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '3px solid #fff', height: 40,fontSize:20 }} type="number" id="username" value={this.state.username} name="username" onChange={(e) => this.setState({ username: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>نام کاربری</label>
            </div>
            <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative' }}>
              <input className="form-control YekanBakhFaMedium" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '3px solid #fff', height: 40,fontSize:20 }} type="password" id="password" value={this.state.password} name="password" onChange={(e) => this.setState({ password: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>رمز عبور</label>
            </div>
            <div style={{ marginTop: 35, display: 'none', justifyContent: 'flex-end', width: '100%', position: 'relative', borderBottom: '3px solid #fff' }}>
              <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label YekanBakhFaMedium" style={{ paddingRight: 5, height: 30 }}> ذخیره نام کاربری</label>
              <Checkbox style={{ marginRight: 10 }} inputId="ShowPriceAftLogin" value={this.state.ShowPriceAftLogin} checked={this.state.ShowPriceAftLogin} onChange={e => this.setState({ ShowPriceAftLogin: e.checked })}></Checkbox>

            </div>

            <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button className="YekanBakhFaMedium p-button-primary" onClick={this.LoginPress} style={{ textAlign: 'center', borderRadius: 5,padding:8, width: '80%' }}> <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 21 }} >ورود</span> </Button>

            </div>
            <div style={{ marginTop: 16, display: 'none', justifyContent: 'center', width: '100%' }}>
              <Link className="YekanBakhFaMedium" to={`${process.env.PUBLIC_URL}/New`} style={{ background:"#797979",color:"#fff",textAlign: 'center', borderRadius: 5,opacity:0.9, width: '80%',padding:5 }}> <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 18 }} >درخواست افتتاح حساب</span> </Link>

            </div>
            {this.state.showWebElements &&
              <div style={{display:'flex',alignItems:'center',flexDirection:'column',marginTop:10}}>
              <a href="https://marketapi.sarvapps.ir//uploads/File-1627047802723.apk" style={{width:'80%',direction:'rtl',display:'flex',alignItems:'center',background:'rgb(179 245 131 / 38%)',marginTop:10}} >
              <div style={{width:100,textAlign:'center'}}>
              <i className="fab fa-android" style={{fontSize:30,color:'#1200ff'}} />  
              </div>
              <div>

              <span style={{color:'#1200ff'}}>نصب نسخه اندروید</span>
              </div>

              </a>
              <a href="https://aniashop.ir/#/Blogs/?id=60face3da8608a34c779abc5" target="_blank" style={{width:'80%',direction:'rtl',display:'flex',alignItems:'center',background:'rgb(179 245 131 / 38%)',marginTop:10}} >
              <div style={{width:100,textAlign:'center'}}>

              <i className="fab fa-apple" style={{fontSize:30,color:'#1200ff'}} />  
              </div>
              <div>

              <span style={{color:'#1200ff'}}>راهنمای نصب نسخه ios</span>

              </div>

              </a>

              </div>
            }

          </div>
          <div style={{ display: 'flex', flexWrap: 'nowrap',justifyContent:'center',width:'100%'}}>
            <div style={{ width: '33%', position: 'relative', maxHeight: 100,display:'none' }}>
            <a style={{color:'red',display:'none'}} href={"tel:+98"+this.state.Tel}>
              <img src="./icons/login_link2.png" style={{ height: 100 }} />
              <label style={{ position: 'absolute', right: '30%', top: '40px', fontSize: 14,color:'#000' }} className="YekanBakhFaMedium">تماس با ما</label>
            </a>
            <Link  style={{display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Travel?login=0`} >
              <img src="./icons/icon18.png?ver=1" style={{ height: 100 }} />
              <label style={{fontSize: 14,color:'#000' }} className="YekanBakhFaMedium">سفر</label>

            </Link>
            

             
            </div>
            <div style={{ width: '50%', position: 'relative', maxHeight: 100 }}>

            
            <a target="_blank" style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center',display:'none'}} href={"http://r-bank.ir/"+this.state.place} >
              <img src="./icons/login_link3.png" style={{ height: 40 }} />
              <label style={{ position: 'absolute', right: '25%', top: '40px', fontSize: 14,color:'#000' }} className="YekanBakhFaMedium">واریز به حساب</label>
            </a>
            <Link style={{display:'flex',flexDirection:'column',alignItems:'center'}}  to={`${process.env.PUBLIC_URL}/MainBox?food=1`} >
              <img src="./icons/aaaa2.png?ver=1" style={{ height: 40 }} />
              <label style={{fontSize: 21,marginTop:7,color:'#000' }} className="YekanBakhFaMedium">رستوران</label>

            </Link>

            </div>
           
            <div style={{ width: '50%', position: 'relative', maxHeight: 100 }}>
              <a target="_blank" style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center',display:'none'}} href='http://r-bank.ir/Customer/Customer/1280' >
                <img src="./icons/login_link1.png" style={{ height: 40 }} />
                <label style={{ position: 'absolute', right: '25%', top: '40px', fontSize: 14,color:'#000' }} className="YekanBakhFaMedium">افتتاح حساب</label>
              </a>
              <Link style={{display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/MainBox?aniashop=1`} >
              <img src="./icons/aaaa1.png?ver=1" style={{ height: 40 }} />
              <label style={{fontSize: 21,marginTop:7,color:'#000' }} className="YekanBakhFaMedium">خرید کالا</label>

            </Link>
            </div>

          </div>
          <div style={{display:'none'}}>
            <a href="https://www.instagram.com/ansar724_com" className="YekanBakhFaMedium " target="_blank" style={{color:'#000',display:'flex',justifyContent:'space-between'}} >
             <span> اطلاعیه شرایط پیش فروش خودرو در  <span  className="blink">صفحه اینستاگرام </span> ما</span> <i className="fab fa-instagram" style={{color:'red',marginLeft:5,fontSize:20}} />
            </a>
          
            </div>
          <div style={{ width: '100%', height: 40, backgroundColor: '#fff', position: 'fixed', bottom: 0 }}>
            <img src="./icons/raymand.png" style={{ height: 50, float: 'left' }} />

          </div>
        </div>
        </div>
        :
        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <ProgressSpinner style={{paddingTop:150}}/>
          
        </div>
      }
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
    placeName: state.Logo,
    fullname: state.fullname,
    Address: state.Address,
    mobile:state.mobile,
    LoginAnia:state.LoginAnia
  }
}
export default withRouter(
  connect(mapStateToProps)(Login)
);

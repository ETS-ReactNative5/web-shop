import React, { Component } from 'react';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';

import { ListBox } from 'primereact/listbox';

import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { Message } from 'primereact/message';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import './DataTableDemo.css';
import { Button } from 'reactstrap';
import { Fieldset } from 'primereact/fieldset';
import { SelectButton } from 'primereact/selectbutton';
import { Toast } from 'primereact/toast';

const placeFilters = [
  { label: 'بالا - راست', value: 'top-right' },
  { label: 'بالا - چپ', value: 'top-left' },

  { label: 'پایین-راست', value: 'bottom-right' },
  { label: 'پایین-چپ', value: 'bottom-left' }



];
const picFilters = [
  { label: <img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help.png' },
  { label: <img src='https://sarvapps.ir/chatFiles/help1.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help1.png' },

  { label: <img src='https://sarvapps.ir/chatFiles/help2.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help2.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help3.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help3.png' },
  { label: <img src='https://sarvapps.ir/chatFiles/help4.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help4.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help5.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help5.png' },
  { label: <img src='https://sarvapps.ir/chatFiles/help6.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help6.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help7.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help7.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help8.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help8.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help9.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help9.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help10.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help10.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help11.jpg' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help11.jpg' },
  { label: <img src='https://sarvapps.ir/chatFiles/help12.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help12.png' },
  { label: <img src='https://sarvapps.ir/chatFiles/help13.png' style={{width:45,height:45}} />, value: 'https://sarvapps.ir/chatFiles/help13.png' }





];

const picEffects =[
  { label: <div  ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: '' },
  { label: <div class='hvr-grow' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'animate__animated animate__bounce' },
  { label: <div class='hvr-shrink' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-shrink' },
  { label: <div class='hvr-pulse' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-pulse' },
  { label: <div class='hvr-pulse-grow' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-pulse-grow' },
  { label: <div class='hvr-pulse-shrink' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-pulse-shrink' },
  { label: <div class='hvr-push' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-push' },
  { label: <div class='hvr-pop' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-pop' },
  { label: <div class='hvr-bounce-in' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-bounce-in' },
  { label: <div class='hvr-bounce-out' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-bounce-out' },
  { label: <div class='hvr-rotate' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-rotate' },
  { label: <div class='hvr-grow-rotate' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-grow-rotate' },
  { label: <div class='hvr-float' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-float' },
  { label: <div class='hvr-sink' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-sink' },
  { label: <div class='hvr-bob' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-bob' },
  { label: <div class='hvr-hang' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-hang' },
  { label: <div class='hvr-skew' ><img src='https://sarvapps.ir/chatFiles/help.png' style={{width:45,height:45}} /></div>, value: 'hvr-skew' },

  
]

class Chat_Settings extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.SetSetting = this.SetSetting.bind(this)
    this.toast = React.createRef();
    this.FieldRef = React.createRef();

    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      Filter: '4',
      GridDataUsers: [],
      GridDataFactors: [],
      selectedFactor: null,
      newStatus: null,
      selectedId: null,
      statusDesc: null,
      UsersSelected:[],
      RegisterItems:[{
        label:"نام و نام خانوادگی",
        value:"name"
      },
      {
        label:"تلفن همراه",
        value:"mobile"
      },
      {
        label:"ایمیل",
        value:"mail"
      }],
      Users:[],
      SellerId: null,
      LastAmount: 0,
      LastCredit: 0,
      loading: 0,
      placeFilter:"bottom-right",
      picFilter:"https://sarvapps.ir/chatFiles/help.png",
      topText:"سوالی دارید ؟ \n با ما صحبت کنید ...",
      placeHolder:"پیام خود را بنویسید",
      isMainShop: 0,
      showProductStatus: 0,
      onBeforePrint: {},
      msg1:"",
      url: this.Server.getUrl()

    }



  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        SellerId: response.data.authData.shopId,
        UserId: response.data.authData.userId,
        name : response.data.authData.name
      })
     

      that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.SellerId }, function (response) {
        that.setState({
          isMainShop: response.data.result[0]?.main,
          tokenId: response.data.result[0]?.tokenId,
          codeForHead:"<script src='https://sarvapps.ir/fgEmojiPicker.js'></script><script src='https://sarvapps.ir/socket.io.js'></script><script src='https://sarvapps.ir/ania_chat.js'></script><link rel='stylesheet' href='https://sarvapps.ir/animate.min' /><link rel='stylesheet' href='https://sarvapps.ir/ania_chat.css' /><script>(function () {window.AniaChatId='"+response.data.result[0]?.tokenId+"';window.AniaChatInit()})()</script>",

        })
        that.getSettings();


      }, function (error) {

        that.getSettings();
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  GetUsers() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      shopId:this.state.SellerId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let FieldList = [];
      for (let i = 0; i < response.data.result.length; i++) {
        FieldList.push({ name: response.data.result[i].name||response.data.result[i].username, value: response.data.result[i].username })
      }
      
      that.setState({
        Users: FieldList,
        loading: 0
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/getuserByShop", param, SCallBack, ECallBack)



  }
  SetSetting(){
    let that=this;
    that.setState({
      loading: 1
    })
    that.Server.send("ChatApi/chatSettings", {AniaChatId:this.state.tokenId,placeFilter:this.state.placeFilter,picFilter:this.state.picFilter,picEffect:this.state.picEffect,topText:this.state.topText,placeHolder:this.state.placeHolder,SendSms:this.state.SendSms,SendSmsTo:this.state.UsersSelected,RegisterItem:this.state.RegisterItem,forceRegister:this.state.forceRegister}, function (response) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({severity: 'success', summary: 'پیغام موفقیت', detail: <div><span>عملیات با موفقیت انجام شد</span></div>, life: 8000});


    }, function (error) {
      that.setState({
        loading: 0
      })

    })
  }
  getChatSetting(){
    let that=this;
    that.setState({
      loading: 1
    })
    that.Server.send("ChatApi/chatSettings", {AniaChatId:this.state.tokenId,get:1}, function (response) {
      that.setState({
        loading: 0

      })
      if(response.data.result[0]){
        that.setState({
          loading: 0,
          topText:response.data.result[0].topText,
          placeHolder:response.data.result[0].placeHolder,
          picFilter:response.data.result[0].picFilter,
          picEffect:response.data.result[0].picEffect||'',
          placeFilter:response.data.result[0].placeFilter,
          UsersSelected:response.data.result[0].SendSmsTo,
          forceRegister:response.data.result[0].forceRegister,
          RegisterItem:response.data.result[0].RegisterItem,
          SendSms:response.data.result[0].SendSms
  
        })
      }
      that.GetUsers();


    }, function (error) {
      that.setState({
        loading: 0
      })

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

  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        let resp = response.data.result[0];
        that.setState({
          CreditSupport: resp.CreditSupport,
          ActiveSms: response.data.result ? resp.ActiveSms : "none",
          STitle: response.data.result ? resp.STitle : "",
          AccessAfterReg: response.data.result ? resp.AccessAfterReg : 0,
          RegSmsText: response.data.result ? resp.RegSmsText : '',
          System: response.data.result ? resp.System : '',
          
        })
      }
      that.getChatSetting();



    }, function (error) {
      that.setState({
        loading: 0
      })

    })


  }

  render() {

    return (
      <div style={{ direction: 'rtl' }}>
        

        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">
        <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

          
          
          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>
          {this.state.System == "company" && this.state.tokenId &&
              <div>

              <Fieldset legend="شخصی سازی" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%' }}>
                <div className="row">
                  <div className="col-lg-12">
                    <div >

                      <label className="yekan">محل نمایش</label>
                      <SelectButton value={this.state.placeFilter} options={placeFilters} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { this.setState({ placeFilter: e.value||"top-right" });  }}></SelectButton>

                    </div>
                  </div>
                  <div className="col-lg-12" style={{marginTop:50}}>
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.topText} name="topText" onChange={(event) => this.setState({ topText: event.target.value })} required="true" ></textarea>
                      <label className="yekan">متن بالای جعبه گفتگو</label>

                    </div>
                  </div>
                  <div className="col-lg-12" style={{marginTop:20}}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.placeHolder} name="placeHolder" onChange={(event) => this.setState({ placeHolder: event.target.value })} required="true" />
                      <label className="yekan">متن پیشفرض جعبه متن</label>

                    </div>
                  </div>
                  <div className="col-lg-12" style={{marginTop:20}}>
                    <div >

                      <label className="yekan">انتخاب تصویر</label>
                      <SelectButton value={this.state.picFilter} options={picFilters} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { this.setState({ picFilter: e.value||"https://sarvapps.ir/chatFiles/help.png" });  }}></SelectButton>

                    </div>
                  </div>
                  <div className="col-lg-6" style={{marginTop:50}}>

                    <div >

                      <select className="custom-select yekan"  value={this.state.picEffect} name="picEffect" onChange={(event)=>{this.setState({ picEffect: event.target.value })}} >
                      <option selected="">بدون افکت - افکت نمایش</option>
                      <option value="animate__animated animate__bounce">bounce</option>
                      <option value="animate__animated animate__heartBeat">heartBeat</option>
                      <option value="animate__animated animate__rubberBand">rubberBand</option>
                      <option value="animate__animated animate__backInDown">backInDown</option>
                      <option value="animate__animated animate__backInUp">backInUp</option>
                      <option value="animate__animated animate__slideOutUp">slideOutUp</option>
                      <option value="animate__animated animate__slideInRight">slideInRight</option>
                      <option value="animate__animated animate__zoomIn">zoomIn</option>
                      <option value="animate__animated animate__zoomOutUp">zoomOutUp</option>
                      <option value="animate__animated animate__lightSpeedInRight">lightSpeedInRight</option>
                      <option value="animate__animated animate__rotateInDownRight">rotateInDownRight</option>

                     </select>
                    </div>
                    
                  </div>
                  <div className="col-lg-6">
                    <img src='https://sarvapps.ir/chatFiles/help.png' class={this.state.picEffect} style={{width:45,height:45,marginTop:40}} />

                  </div>
                  <div className="col-lg-12" style={{marginTop:20}}>
                    <div className="group">

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'normal' }}>
                          <Checkbox inputId="forceRegister" value={this.state.forceRegister} checked={this.state.forceRegister} onChange={e => this.setState({ forceRegister: e.checked})}></Checkbox>
                          <label className="yekan" style={{marginRight:10}}>قبل از شروع گفتگو ثبت نام از کاربر انجام شود</label>
                      </div>
  
                    </div>
                    {this.state.forceRegister && 
                    <div className="col-lg-12">
                    <div >
                    <label className="yekan" style={{marginRight:10}}>فیلدهای ثبت نام</label>

                      <ListBox value={this.state.RegisterItem} options={this.state.RegisterItems} multiple  onChange={(event) => this.setState({ RegisterItem: event.value })} />
                     </div>
                    </div>
                  }

                  </div>

                  <div className="col-lg-12" style={{marginTop:50}}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.SetSetting}>ثبت اطلاعات</Button>
                </div>
                  
                </div>
                </Fieldset>


                <Fieldset legend="پیامک" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%' }}>
                <div className="row">
                  
                  <div className="col-lg-12">
                    <div className="group" style={{display:'flex',alignItems:'center'}}>
                    <Checkbox inputId="IsTitle" value={this.state.SendSms} checked={this.state.SendSms} onChange={e => this.setState({ SendSms: e.checked })} style={{ marginBottom: 10 }}></Checkbox>
                    <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 40 }}>دریافت پیامک شروع گفتگو توسط کاربر</label>
                    </div>
                  </div>
                  {this.state.SendSms && 
                    <div className="col-lg-12">
                    <div className="group">
                    <MultiSelect value={this.state.UsersSelected} optionLabel="name" style={{ width: '100%' }} optionValue="value" options={this.state.Users} onChange={(event) => {


                      this.setState({ UsersSelected: event.value })

                      }} />
                                       </div>
                    </div>
                  }

                  <div className="col-lg-12" style={{marginTop:50}}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.SetSetting}>ثبت اطلاعات</Button>
                </div>
                  
                </div>
                </Fieldset>
                
                </div>
               
          }
          </div>

          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>
          {this.state.System == "company" && this.state.tokenId &&
              <div>

              <Fieldset legend="تنظیم دستی سیستم چت" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%' }}>
              <div  style={{marginBottom:50}}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" disabled type="text" value={this.state.tokenId} name="tokenId" onChange={(event) => this.setState({ tokenId: event.target.value })} required="true" />
                      <label className="yekan">توکن</label>

                    </div>
                  </div>
                <div>
                  <p className="iranyekanweblight" style={{textAlign:'right'}}>کد زیر را در بخش head صفحه html قرار دهید</p>
                  <textarea style={{width:'100%'}} disabled={true} className="form-control iranyekanweblight">
                    {this.state.codeForHead}
                  </textarea>
                </div>
               
                </Fieldset>
                <Fieldset legend=" تنظیم آنیاچت در فریمورکها" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%',display:'none' }}>
                <div>
                  
                </div>
                </Fieldset>
                </div>
               
          }
          </div>


        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Chat_Settings)
);

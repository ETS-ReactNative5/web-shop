import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import Chat_Settings from './Chat_Settings.js'
import { Toast } from 'primereact/toast';


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

class MoneyManagement extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.Payment = this.Payment.bind(this);
    this.toast = React.createRef();

    this.state = {
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      address: null,
      name: null,
      SmsNum:0,
      showInSite: true,
      BrandId: null,
      Message: null,
      Amount:0,
      ChatExpireDate:"wait",
      CrmExpireDate:"wait",
      logoTemp: '',
      currentImage: '',
      GridDataComponents: [],
      selectedId: null,
      loading: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(0)
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
        let  AccSystem= response.data.result[0].system;
        let ChatExpireDate=0,
            CrmExpireDate=0;
        if(AccSystem && AccSystem.length > 0){
           ChatExpireDate =  AccSystem[0] ? (AccSystem[0].ExpireDate_C - new Date().setDate(new Date().getDate()))/86400000 : 0
           CrmExpireDate =  AccSystem[1] ? (AccSystem[1].ExpireDate_C - new Date().setDate(new Date().getDate()))/86400000 : 0

        }
        let chat=false;
        let crm=false;
        if(AccSystem[0] && AccSystem[0].name=="chat")
          chat = true;
        if(AccSystem[1] && AccSystem[1].name=="crm")
          crm=true;
        that.setState({
          chat:!crm ? chat : false,
          crm:crm,
          hideChat: (crm && CrmExpireDate > 0) ? true :false,
          ChatExpireDate:Math.ceil(ChatExpireDate),
          CrmExpireDate:Math.ceil(CrmExpireDate),
          isMainShop: response.data.result[0].main,
          tokenId: response.data.result[0].tokenId,
          SmsAmount:response.data.result[0].SmsNum||0

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
          ActiveSms: resp ? resp.ActiveSms : "none",
          ActiveBank: resp ? resp.ActiveBank : "none",
          AccessAfterReg: resp ? resp.AccessAfterReg : 0,
          RegSmsText: resp ? resp.RegSmsText : '',
          System: resp ? resp.System : '',
          
        })
      }
      that.getChatSetting();



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
          SendSms:response.data.result[0].SendSms
  
        })
      }


    }, function (error) {
      that.setState({
        loading: 0
      })

    })
  }
  Payment(type) {
    let that = this;
    
                let url = that.state.ActiveBank == "z" ? this.state.url + 'panelPayment' : this.state.url + 'panelPayment2';
                let param = {
                    type:type,
                    SmsNum: parseInt(this.state.SmsNum),
                    panelType: this.state.crm ? "crm" : "chat",
                    mounth: parseInt(this.state.mounth),
                    SellerId: this.state.SellerId
                }
                if(!this.state.mounth && type=="panel"){
                  that.toast.current.show({severity: 'warn', summary: 'هشدار', detail: <div><span>تعداد ماه را انتخاب کنید</span></div>, life: 8000});
                  return;
                }
                if(!this.state.SmsNum && type=="sms"){
                  that.toast.current.show({severity: 'warn', summary: 'هشدار', detail: <div><span>تعداد پیامک را انتخاب کنید</span></div>, life: 8000});
                  return;
                }
                
                this.setState({
                  loading:1
                })
                axios.post(url, param)
                    .then(response => {
                        that.setState({
                            loading:0
                        })
                        if (that.state.ActiveBank != "none") {
                            let res;
                            if (that.state.ActiveBank == "p") {
                                res = response.data.result ? response.data.result.SalePaymentRequestResult : {};
                                if (res.Token > 0 && res.Status == "0") {
                                    window.location = "https://pec.shaparak.ir/NewIPG/?token=" + res.Token;
                                } else {
                                    this.toast.current.show({ severity: 'error', summary: <div> {res.Message} <br />برای اتمام پرداخت می توانید در زمان دیگری مراجعه کنید یا از پشتیبان سیستم راهنمایی بخواهید</div>, life: 8000 });
                                }
                            } else if (that.state.ActiveBank == "z") {
                                res = response.data.result;
                                window.location = res;
                            }
                        } 

                    }).catch(error => {
                        console.log(error)
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

          <div className="col-12" style={{ background: '#fff' }}>
            <Panel header="خلاصه وضعیت" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              {this.state.ChatExpireDate != "wait" &&
                <div>
                    {this.state.chat ?
                      <div>
                      {this.state.ChatExpireDate > 0 ?
                        <div>
                              <i class="fa fa-check-circle" aria-hidden="true" style={{color:"green",fontSize:25}}></i>
                              <span style={{marginRight:25,fontSize:32,color:"green"}}>فعال</span>
                          </div>
                        :
                        <div>
                              <i class="fa fa-check-circle" aria-hidden="true" style={{color:"red",fontSize:25}}></i>
                              <span style={{marginRight:25,fontSize:32,color:"red"}}>غیر فعال</span>
                          </div>
                      }

                      <h2 style={{marginTop:30}}>زمان باقیمانده : {this.state.ChatExpireDate} روز</h2>
                      </div>
                    :
                      <div>
                      {this.state.CrmExpireDate > 0 ?
                        <div>
                              <i class="fa fa-check-circle" aria-hidden="true" style={{color:"green",fontSize:25}}></i>
                              <span style={{marginRight:25,fontSize:32,color:"green"}}>فعال</span>
                          </div>
                        :
                        <div>
                              <i class="fa fa-check-circle" aria-hidden="true" style={{color:"red",fontSize:25}}></i>
                              <span style={{marginRight:25,fontSize:32,color:"red"}}>غیر فعال</span>
                          </div>
                      }

                      <h2 style={{marginTop:30}}>زمان باقیمانده : {this.state.CrmExpireDate} روز</h2>
                      </div>
                    }

                    
                    <div className="row" >
                              <div className="col-md-12 col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end',height:32 }}>

                                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline' }}>
                                    <Checkbox inputId="chat" value={this.state.chat} checked={this.state.chat} onChange={e => this.setState({ chat: e.checked ,crm:!e.checked,mounth:"",Amount:0,AmountTemp:"0"})}></Checkbox>
                                    <label htmlFor="chat" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>چت آنلاین</label>
                                    </div>
  
                                  </div>
                                  
                                  
                                  <div className="col-md-12 col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',height:32 }}>
                                    <Checkbox inputId="crm" value={this.state.crm} checked={this.state.crm} onChange={e => this.setState({ crm: e.checked,hideChat:e.checked,chat:!e.checked,mounth:"",Amount:0,AmountTemp:"0" })}></Checkbox>
                                    <label htmlFor="crm" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>سامانه crm</label>
                                  </div>
                                  
                                    <div className="col-lg-2 col-md-4 col-12" >
                                    <select className="custom-select yekan" style={{ marginTop: 10 }} value={this.state.mounth} name="mounth" onChange={(event)=>{
                                      let m = parseInt(event.target.value||0);
                                      let Amount = 0;
                                      if(this.state.chat){
                                        Amount = m == 1 ? m*45000 : m*42000;

                                      }else{
                                        Amount = m == 1 ? m*220000 : m*215000;

                                      }
                                      this.setState({ mounth: event.target.value,Amount:Amount,AmountTemp:Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") });}} >
                                      <option selected="" value="0">انتخاب کنید</option>
                                      <option value="1">یک ماه</option>
                                      <option value="2">دو ماه</option>
                                      <option value="3">سه ماه</option>
                                    </select>

                                    </div>
                                    <div className="col-lg-3 col-md-4 col-12" >
                                    <Button style={{ marginLeft: 5, marginTop: 10,direction: 'rtl' }} color="success" className="yekan" onClick={()=>this.Payment("panel")}><span>ارتقا پنل</span><span>( {this.state.AmountTemp} تومان)</span></Button>

                                    </div>
                                    </div>
                   

                </div>
              }
              
            </Panel>
            <Panel header="اعتبار پیامک" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              {this.state.SendSms  ?
                <div>
                    <div className="row" >
                                    <div className="col-12 yekan"  style={{marginBottom:25,marginTop:25}} >
                                      تعداد پیامک : {this.state.SmsAmount}
                                    </div>
                                    <div className="col-lg-2 col-md-4 col-12" >
                                        <div>
                                            <input className="form-control YekanBakhFaBold" placeholder="تعداد پیامک" autoComplete="off" type="text" value={this.state.SmsNum} name="SmsNum" onChange={(event) => { this.setState({ SmsNum: event.target.value }) }} required="true" style={{direction:'rtl'}} />
                                        </div>

                                    </div>
                                    <div className="col-lg-3 col-md-4 col-12" >
                                        <Button style={{ marginLeft: 5 }} color="success" className="yekan" onClick={()=>this.Payment("sms")}>افزایش موجودی</Button>

                                    </div>
                                    </div>

                </div>
                :
                <div>
                    
                    <h2 style={{marginRight:25,fontSize:32,color:"red",marginTop:25}} className="yekan">امکان ارسال پیامک فعال نیست</h2>

                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="success" className="yekan" onClick={()=>{this.setState({changeSetting:true})}}>فعال سازی ارسال پیامک</Button>

                </div>
              }
              
            </Panel>
           
          </div>

        </div>
        <Dialog header="" visible={this.state.changeSetting} maximized={true} onHide={() => {
                    this.setState({
                      changeSetting: false
                    });
                    this.getChatSetting();
                }
                }>

                    <Chat_Settings />

                </Dialog>

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
  connect(mapStateToProps)(MoneyManagement)
);

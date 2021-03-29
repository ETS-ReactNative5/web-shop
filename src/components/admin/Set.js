import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel'; import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { FlexboxGrid, Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { RadioButton } from 'primereact/radiobutton';
import { Fieldset } from 'primereact/fieldset';

class Set extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,

      GridDataNavs: [],
      newStatus: null,
      selectedId: null,
      statusDesc: null,
      userId: null,
      LastAmount: 0,
      NavId: null,
      HTitle: null,
      HLink: null,
      HOrder: null,
      HOrders: null,
      SelectedHOrder: null,
      ActiveBank: null,
      ActiveSms: null,
      Template: 1,
      ParsianTerminal: '',
      ParsianPin: '',
      ZarinPalCode: '',
      SmartNumber: '',
      SmartUser: '',
      SmartPass: '',
      SmsIrNumber: '',
      SmsIrUser: '',
      SmsIrPass: '',
      AccessAfterReg: false,
      ShowProductsInTable: false,
      RegisterByMob:false,
      SeveralShop: false,
      SaleFromMultiShops:false,
      ProductBase:false,
      CreditSupport: false,
      STitle: '',
      Tags: '',
      ChatId:'',
      FactorChangeSmsText: '',
      UserChangeSmsText: '',
      RegSmsText: ''


    }
    this.SetNav = this.SetNav.bind(this);
    this.getNav = this.getNav.bind(this);



  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    let SCallBack = function (response) {
      that.setState({
        userId: response.data.authData.userId
      })

      that.getNav();

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getNav() {
    let that = this;

    that.Server.send("AdminApi/getNavs", {}, function (response) {
      that.getSettings();
      var result = [];
      that.setState({
        loading: 0
      })
      var orders = [];
      response.data.result.map(function (v, i) {
        result.push({
          _id: v._id,
          title: v.title,
          link: v.link,
          order: v.order,
          HOrders: orders.push(v.order)

        })
      })
      that.setState({
        GridDataNavs: result,
        HOrders: orders

      })
    }, function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    })


  }
  SetNav() {
    let that = this;
    if (isNaN(this.state.HOrder)) {
      Alert.info('ترتیب نمایش نمی تواند غیر عددی باشد', 5000);
      return;
    }
    if (that.state.HOrders.includes(that.state.HOrder) && this.state.SelectedHOrder != that.state.HOrder) {
      Alert.info('ترتیب نمایش تکراری است', 5000);
      return;
    }
    let param = {
      token: localStorage.getItem("api_token"),
      title: this.state.HTitle,
      link: this.state.HLink,
      order: this.state.HOrder,
      NavId: this.state.NavId
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.getNav();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetNavs", param, SCallBack, ECallBack)
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
        that.setState({
          ZarinPalCode: response.data.result[0].ZarinPalCode,
          ParsianPin: response.data.result[0].ParsianPin,
          ParsianTerminal: response.data.result[0].ParsianTerminal,
          ActiveBank: response.data.result[0].ActiveBank,
          SmsIrNumber: response.data.result[0].SmsIrNumber,
          SmsIrUser: response.data.result[0].SmsIrUser,
          SmsIrPass: response.data.result[0].SmsIrPass,
          SmartNumber: response.data.result[0].SmartNumber,
          SmartUser: response.data.result[0].SmartUser,
          SmartPass: response.data.result[0].SmartPass,
          ActiveSms: response.data.result[0].ActiveSms,
          AccessAfterReg: response.data.result[0].AccessAfterReg,
          ShowProductsInTable: response.data.result[0].ShowProductsInTable,
          RegisterByMob: response.data.result[0].RegisterByMob,
          SeveralShop: response.data.result[0].SeveralShop,
          SaleFromMultiShops:response.data.result[0].SaleFromMultiShops,
          ProductBase:response.data.result[0].ProductBase,
          CreditSupport: response.data.result[0].CreditSupport,
          STitle: response.data.result[0].STitle,
          Tags: response.data.result[0].Tags,
          ChatId: response.data.result[0].ChatId,
          FactorChangeSmsText: response.data.result[0].FactorChangeSmsText,
          UserChangeSmsText: response.data.result[0].UserChangeSmsText,
          RegSmsText: response.data.result[0].RegSmsText,
          Template: response.data.result[0].Template
        })
      }

    }, function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    })


  }
  setSettings(type) {
    let that = this;
    let param = {};
    if (type == "bank") {
      param = {
        updateQuery: {
          ZarinPalCode: this.state.ZarinPalCode,
          ParsianPin: this.state.ParsianPin,
          ParsianTerminal: this.state.ParsianTerminal,
          ActiveBank: this.state.ActiveBank
        }
      };
    } else if (type == "sms") {
      param = {
        updateQuery: {
          SmsIrNumber: this.state.SmsIrNumber,
          SmsIrUser: this.state.SmsIrUser,
          SmsIrPass: this.state.SmsIrPass,
          SmartNumber: this.state.SmartNumber,
          SmartUser: this.state.SmartUser,
          SmartPass: this.state.SmartPass,
          ActiveSms: this.state.ActiveSms
        }
      };
    } else {
      param = {
        updateQuery: {
          AccessAfterReg: this.state.AccessAfterReg,
          ShowProductsInTable: this.state.ShowProductsInTable,
          RegisterByMob: this.state.RegisterByMob,
          SeveralShop: this.state.SeveralShop,
          SaleFromMultiShops:this.state.SaleFromMultiShops,
          ProductBase:this.state.ProductBase,
          CreditSupport: this.state.CreditSupport,
          STitle: this.state.STitle,
          Tags: this.state.Tags,
          ChatId: this.state.ChatId,
          FactorChangeSmsText: this.state.FactorChangeSmsText,
          UserChangeSmsText: this.state.UserChangeSmsText,
          RegSmsText: this.state.RegSmsText,
          Template: this.state.Template
        }
      };
    }

    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.getNav();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/setSettings", param, SCallBack, ECallBack)
  }


  selectedNavsChange(e) {
    this.setState({
      NavId: e._id,
      HTitle: e.title,
      HLink: e.link,
      HOrder: e.order,
      SelectedHOrder: e.order
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

          <div className=" col-12" style={{ marginTop: 20, background: '#fff' }}>
            <Panel header="تنظیمات سیستم" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <div className="row" >
                <div className="col-12" style={{display:'none'}} >
                  <div className="row">
                      <div className="col-lg-3 col-md-5 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="1" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="Template" onChange={(e) => this.setState({ Template: e.value })} checked={this.state.Template === '1'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">قالب مبتنی بر محصول</label>
                      </div>
                      <div className="col-lg-6 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="2" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="Template" onChange={(e) => this.setState({ Template: e.value })} checked={this.state.Template === '2'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">قالب مبتنی بر فروشگاه</label>
                      </div>
                  </div>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ SeveralShop: e.checked })} checked={this.state.SeveralShop}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>استفاده از امکانات چند فروشگاهی - برای تغییر این فیلد لازم است با طراحان سیستم هماهنگی شود</label>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ ProductBase: e.checked })} checked={this.state.ProductBase}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>خرید بر پایه محصول</label>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ SaleFromMultiShops: e.checked })} checked={this.state.SaleFromMultiShops}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>امکان خرید همزمان از چند فروشگاه وجود دارد</label>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ CreditSupport: e.checked })} checked={this.state.CreditSupport}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>ویژگی های مربوط به خرید اقساطی و اعتباری فعال باشد</label>

                </div>

                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ AccessAfterReg: e.checked })} checked={this.state.AccessAfterReg}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>پس از ثبت نام امکان دسترسی بلافاصله به سیستم وجود داشته باشد</label>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ ShowProductsInTable: e.checked })} checked={this.state.ShowProductsInTable}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>نمایش جدولی محصولات در فرم ثبت محصول</label>

                </div>
                <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ RegisterByMob: e.checked })} checked={this.state.RegisterByMob}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }}>ثبت نام تنها از طریق ثبت شماره موبایل انجام شود</label>

                </div>
                <div className="col-12" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.STitle} name="STitle" onChange={(event) => this.setState({ STitle: event.target.value })} required="true" />
                    <label className="yekan">عنوان فروشگاه (در عنوان سایت و پیامک ها و آلارم ها استفاده می شود)</label>
                  </div>
                </div>
                <div className="col-12" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Tags} name="Tags" onChange={(event) => this.setState({ Tags: event.target.value })} required="true" />
                    <label className="yekan">متاتگ ها (تگ ها را با کاما از هم جدا کنید)</label>
                  </div>
                </div>
                <div className="col-12" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.RegSmsText} name="RegSmsText" onChange={(event) => this.setState({ RegSmsText: event.target.value })} required="true" />
                    <label className="yekan">متن پیامک پس از اتمام ثبت نام</label>
                  </div>
                </div>
                <div className="col-12" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.UserChangeSmsText} name="UserChangeSmsText" onChange={(event) => this.setState({ UserChangeSmsText: event.target.value })} required="true" />
                    <label className="yekan">متن پیامک پس از تغییر وضعیت حساب کاربر</label>
                  </div>
                </div>
                <div className="col-12" style={{ display: 'none' }}>
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.FactorChangeSmsText} name="FactorChangeSmsText" onChange={(event) => this.setState({ FactorChangeSmsText: event.target.value })} required="true" />
                    <label className="yekan">متن پیامک پس از تغییر وضعیت سفارش</label>
                  </div>
                </div>
                <div className="col-12" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.ChatId} name="ChatId" onChange={(event) => this.setState({ ChatId: event.target.value })} required="true" />
                    <label className="yekan">شناسه کاربری سیستم چت (CRISP_WEBSITE_ID)</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={() => this.setSettings()}>ثبت اطلاعات</Button>
                </div>
              </div>
            </Panel>

            <Panel header="تنظیمات درگاه پرداخت" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                <TabPanel header="تنظیمات کلی" headerStyle={{ fontFamily: 'yekan' }}>
                  <Fieldset legend="درگاه فعال" className="yekan" style={{ fontFamily: 'yekan' }}>
                    <div className="row">
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="none" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveBank" onChange={(e) => this.setState({ ActiveBank: e.value })} checked={this.state.ActiveBank === 'none'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">امکان خرید آنلاین ندارد</label>
                      </div>
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="p" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveBank" onChange={(e) => this.setState({ ActiveBank: e.value })} checked={this.state.ActiveBank === 'p'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">پارسیان</label>
                      </div>
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="z" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveBank" onChange={(e) => this.setState({ ActiveBank: e.value })} checked={this.state.ActiveBank === 'z'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">زرین پال</label>
                      </div>
                    </div>
                  </Fieldset>


                </TabPanel>
                <TabPanel header="درگاه پارسیان" headerStyle={{ fontFamily: 'yekan' }}>
                  <div className="row">
                    <div className="col-lg-6 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.ParsianPin} name="ParsianPin" onChange={(event) => this.setState({ ParsianPin: event.target.value })} required="true" />
                        <label className="yekan">PIN</label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.ParsianTerminal} name="ParsianTerminal" onChange={(event) => this.setState({ ParsianTerminal: event.target.value })} required="true" />
                        <label className="yekan">Terminal</label>
                      </div>
                    </div>

                  </div>
                </TabPanel>
                <TabPanel header="درگاه زرین پال" headerStyle={{ fontFamily: 'yekan' }}>
                  <div className="row">
                    <div className="col-lg-12 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.ZarinPalCode} name="ZarinPalCode" onChange={(event) => this.setState({ ZarinPalCode: event.target.value })} required="true" />
                        <label className="yekan">کد درگاه</label>
                      </div>
                    </div>


                  </div>
                </TabPanel>
              </TabView>
              <div className="row">
                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={() => this.setSettings("bank")}>ثبت اطلاعات</Button>
                </div>
              </div>

            </Panel>
            <Panel header="تنظیمات پنل پیامک" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <TabView activeIndex={this.state.activeIndex1} onTabChange={(e) => this.setState({ activeIndex1: e.index })}>
                <TabPanel header="تنظیمات کلی" headerStyle={{ fontFamily: 'yekan' }}>
                  <Fieldset legend="پنل فعال" className="yekan" style={{ fontFamily: 'yekan' }}>
                    <div className="row">
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="none" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveSms" onChange={(e) => this.setState({ ActiveSms: e.value })} checked={this.state.ActiveSms === 'none'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">غیر فعال</label>
                      </div>
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="smsir" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveSms" onChange={(e) => this.setState({ ActiveSms: e.value })} checked={this.state.ActiveSms === 'smsir'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">Sms.ir</label>
                      </div>
                      <div className="col-lg-4 col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                        <RadioButton value="smart" style={{ textAlign: "center", fontSize: 18 }} className="yekan" name="ActiveSms" onChange={(e) => this.setState({ ActiveSms: e.value })} checked={this.state.ActiveSms === 'smart'} />
                        <label style={{ textAlign: "center", fontSize: 18 }} className="yekan">smartsms.ir</label>
                      </div>
                    </div>
                  </Fieldset>


                </TabPanel>
                <TabPanel header="smartsms.ir" headerStyle={{ fontFamily: 'yekan' }}>
                  <div className="row">

                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmartNumber} name="SmartNumber" onChange={(event) => this.setState({ SmartNumber: event.target.value })} required="true" />
                        <label className="yekan">number</label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmartUser} name="SmartUser" onChange={(event) => this.setState({ SmartUser: event.target.value })} required="true" />
                        <label className="yekan">username</label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmartPass} name="SmartPass" onChange={(event) => this.setState({ SmartPass: event.target.value })} required="true" />
                        <label className="yekan">password</label>
                      </div>
                    </div>

                  </div>
                </TabPanel>
                <TabPanel header="sms.ir" headerStyle={{ fontFamily: 'yekan' }}>
                  <div className="row">

                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmsIrNumber} name="SmsIrNumber" onChange={(event) => this.setState({ SmsIrNumber: event.target.value })} required="true" />
                        <label className="yekan">number</label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmsIrUser} name="SmsIrUser" onChange={(event) => this.setState({ SmsIrUser: event.target.value })} required="true" />
                        <label className="yekan">username</label>
                      </div>
                    </div>
                    <div className="col-lg-4 col-12" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SmsIrPass} name="SmsIrPass" onChange={(event) => this.setState({ SmsIrPass: event.target.value })} required="true" />
                        <label className="yekan">password</label>
                      </div>
                    </div>

                  </div>
                </TabPanel>
              </TabView>
              <div className="row">
                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={() => this.setSettings("sms")}>ثبت اطلاعات</Button>
                </div>
              </div>
            </Panel>
            <Panel header="NavBar" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <div className="row">
                <div className="col-lg-6" style={{ marginTop: 10 }}>
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.HTitle} name="HTitle" onChange={(event) => this.setState({ HTitle: event.target.value })} required="true" />
                    <label className="yekan">عنوان</label>
                  </div>
                </div>
                <div className="col-lg-6" style={{ marginTop: 10 }}>
                  <div className="group">

                    <input className="form-control yekan" dir={"ltr"} autoComplete="off" type="text" value={this.state.HLink} name="HLink" onChange={(event) => this.setState({ HLink: event.target.value })} required="true" />
                    <label className="yekan">لینک</label>

                  </div>
                </div>
                <div className="col-lg-6" style={{ marginTop: 10 }}>
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.HOrder} name="HOrder" onChange={(event) => this.setState({ HOrder: event.target.value })} required="true" />
                    <label className="yekan">ترتیب نمایش</label>

                  </div>
                </div>





                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.SetNav}>ثبت اطلاعات</Button>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="warning" onClick={() => {
                    this.setState({
                      HTitle: '',
                      HLink: '',
                      HOrder: '',
                      NavId: null
                    })
                  }}>پاک کردن</Button>

                </div>

                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  {
                    this.state.Message &&
                    <Alert color={this.state.Message.type} style={{ textAlign: "center", fontSize: 18 }} className="yekan">
                      {this.state.Message.text}
                    </Alert>
                  }

                </div>

              </div>
              <DataTable responsive value={this.state.GridDataNavs} selectionMode="single" selection={this.state.NavId} onSelectionChange={e => this.selectedNavsChange(e.value)}>
                <Column field="title" header="عنوان" className="yekan" style={{ textAlign: "center" }} />
                <Column field="link" header="لینک" className="yekan" style={{ textAlign: "center" }} />
                <Column field="order" header="ترتیب نمایش" className="yekan" style={{ textAlign: "center" }} />
              </DataTable>
            </Panel>
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
  connect(mapStateToProps)(Set)
);

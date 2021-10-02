import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
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
import { MultiSelect } from 'primereact/multiselect';
import { Fieldset } from 'primereact/fieldset';

class AppSettings extends React.Component {
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
      FirstPageCats:[],
      NavId: null,
      HTitle: null,
      HLink: null,
      HOrder: null,
      HOrders: null,
      SelectedHOrder: null,
      ActiveBank: null,
      SaleByCheque:false,
      ActiveSms: null,
      Template: 1,
      Theme:1,
      ColorTheme:"saga-blue",
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
      AlarmIfExistProduct:false,
      AllowSubSystem:false,
      AllowRegister:false,
      Raymand:false,
      SeveralShop: false,
      System:"",
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

      that.getSettings();

    };
    let ECallBack = function (error) {
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
        that.setState({
          ZarinPalCode: response.data.result[0].ZarinPalCode,
          ParsianPin: response.data.result[0].ParsianPin,
          ParsianTerminal: response.data.result[0].ParsianTerminal,
          ActiveBank: response.data.result[0].ActiveBank,
          SaleByCheque: response.data.result[0].SaleByCheque,
          ChequeCommission : response.data.result[0].ChequeInfo?.ChequeCommission,
          MaxChequeMounth: response.data.result[0].ChequeInfo?.MaxChequeMounth,
          MaxCheque : response.data.result[0].ChequeInfo?.MaxCheque,
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
          AlarmIfExistProduct: response.data.result[0].AlarmIfExistProduct,
          AllowSubSystem:response.data.result[0].AllowSubSystem,
          AllowRegister:response.data.result[0].AllowRegister,
          Raymand: response.data.result[0].Raymand,
          SeveralShop: response.data.result[0].SeveralShop,
          System:response.data.result[0].System,
          SaleFromMultiShops:response.data.result[0].SaleFromMultiShops,
          ProductBase:response.data.result[0].ProductBase,
          CreditSupport: response.data.result[0].CreditSupport,
          STitle: response.data.result[0].STitle,
          Tags: response.data.result[0].Tags,
          ChatId: response.data.result[0].ChatId,
          FactorChangeSmsText: response.data.result[0].FactorChangeSmsText,
          UserChangeSmsText: response.data.result[0].UserChangeSmsText,
          RegSmsText: response.data.result[0].RegSmsText,
          Template: response.data.result[0].Template,
          Theme: response.data.result[0].Theme,
          ColorTheme: response.data.result[0].ColorTheme||"saga-blue"
        })
      }
      that.GetCategory();

    }, function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    })


  }
  getAppSettings(){
    let that = this;
    that.setState({
      loading: 1
    })
    debugger;
    that.Server.send("AdminApi/getAppSettings", {}, function (response) {
      if(response.data.result[0]){
        
        that.setState({
            loading: 0,
            FirstPageCats:response.data.result[0].FirstPageCats
          })
      }  
      
      

    }, function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    })

  }
  setAppSettings(type) {
    let that = this;
    let param = {};
    if(this.state.loading)
      return;
    param = {
        updateQuery: {
          FirstPageCats: this.state.FirstPageCats
        }
    };

    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);  
    }
    this.Server.send("AdminApi/setAppSettings", param, SCallBack, ECallBack)
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
  GetCategory() {
    let that = this;
    debugger;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let Cats = [];
      Cats = response.data.result;
      

      that.setState({
        CategoryList: Cats,
        loading: 0

      })
      that.getAppSettings();
     



    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetCategory", param, SCallBack, ECallBack)



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

          <div className=" col-12" style={{ background: '#fff' }}>
            <Panel header="تنظیمات محیط برنامه موبایل" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <div className="row" >
               
                    <div className="col-lg-12">
                    <div>تعدادی از محصولات دسته بندی های زیر در صفحه اول اپ نمایش می یابند</div>
                    <MultiSelect filter value={this.state.FirstPageCats} optionLabel="name" style={{width:'100%'}} optionValue="_id" options={this.state.CategoryList} onChange={(event) => { 
                          
                          this.setState({ FirstPageCats:event.value }) 
                          
                        }} />
                   
                    </div>
             
              </div>
              <div className="row">
                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={() => this.setAppSettings()}>ثبت اطلاعات</Button>
                </div>
              </div>
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
  connect(mapStateToProps)(AppSettings)
);

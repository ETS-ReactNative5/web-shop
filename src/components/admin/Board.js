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
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ComponentToPrint } from './../ComponentToPrint.js';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import GoogleMapReact from 'google-map-react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import './DataTableDemo.css';
import Charts from '.././Charts.js'


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
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
      SellerId: null,
      LastAmount: 0,
      LastCredit: 0,
      loading: 0,
      isMainShop: 0,
      showProductStatus: 0,
      onBeforePrint: {},
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
      debugger;
      that.setState({
        SellerId: response.data.authData.shopId,
        UserId: response.data.authData.userId,
        name : response.data.authData.name
      })
     

      that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.SellerId }, function (response) {
        that.setState({
          isMainShop: response.data.result[0].main
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
          RegSmsText: response.data.result ? resp.RegSmsText : ''
        })
      }
      that.GetFactors();



    }, function (error) {
      that.setState({
        loading: 0
      })

    })


  }
  GetFactors(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: 'All',
      SellerId: this.state.SellerId,
      isMainShop: this.state.isMainShop
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      let NewFactors =0;
      let NokFactors = 0;
      let CancelByCustomer = 0;
      let CancelBySeller = 0;
      let Canceled = 0;
      let PreparForSend = 0;
      let Sended = 0 ;
      let Get = 0;
      let Ended = 0;
      let Cache = 0;
      let InPlace = 0;
      let reqBack = 0;
      let Back = 0; 
      response.data.result.result.map(function (v, i) {
        /*v.Amount = !v.Amount ? "0" : v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.Credit = !v.Credit ? "0" : v.Credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.paykAmount = !v.paykAmount ? "0" : v.paykAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.finalAmount = !v.finalAmount ? "0" : v.finalAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");*/

        if (v.status == "1")
          NewFactors++;
        if (v.status == "-1")
          Canceled++;
        if (v.status == "0")
          NokFactors++
        if (v.status == "2")
          PreparForSend++;
        if (v.status == "3")
          Sended++;
        if (v.status == "4")
          Get++;
        if (v.status == "5")
          Ended++;
        if (v.status == "-2")
          reqBack++;
        if (v.status == "-3")
          Back++;  
        if (v.InPlace && (v.status == "5" || v.status == "4" || v.status == "3" || v.status == "2" ||  v.status == "1"))
          InPlace++;
        else if(!v.InPlace && (v.status == "5" || v.status == "4" || v.status == "3" || v.status == "2" ||  v.status == "1"))
          Cache++;
        


      })
      let FactorStatusDate = [Canceled, reqBack,Back,NokFactors,NewFactors,PreparForSend,Sended,Get,Ended];
      let FactorStatusLabels = ["لغو شده", "درخواست مرجوعی","مرجوع شده","ناموفق","ثبت شده","آماده ارسال","ارسال شده","تحویل شده","تسویه شده"];

      
      that.setState({
        FactorStatusLabel: 'نمودار فاکتورهای ثبت شده ',
        FactorStatusDate:FactorStatusDate,
        FactorStatusLabels:FactorStatusLabels,
        GridDataFactors: response.data.result.result
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors", param, SCallBack, ECallBack)
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

          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>
          {this.state.FactorStatusDate &&
            <Charts data={this.state.FactorStatusDate} labels={this.state.FactorStatusLabels} label={this.state.FactorStatusLabel}  backgroundColor={['#d23e3e','#62d23e','#0d2904','#3c2acc','#94a21e','#f1b42b','#cd94d8','#d23e3e','#2adad2','#e4d8bd']} type="bar" />
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
  connect(mapStateToProps)(Board)
);

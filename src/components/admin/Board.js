import React, { Component } from 'react';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { Message } from 'primereact/message';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import './DataTableDemo.css';
import Charts from '.././Charts.js'
import { Fieldset } from 'primereact/fieldset';


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
      msg1:"",
      url: this.Server.getUrl()

    }



  }
  GetUsers() {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      let NewUsers = 0;
      let managers = 0;
      let SiteUsers = 0 ;
      let ActiveUsers = 0;
      let NotActiveUsers = 0;
      response.data.result.map(function (v, i) {
        if (v.level == "0" && (v.status=="0" && v.levelOfUser == -1 || v.levelOfUser == null))
          NewUsers++;
        if (v.level == "0"){
          v.level = "کاربر";
          SiteUsers++;
        }
        else{
          v.level = "مدیر";
          managers++;
        }
        if (v.status == "1"){
          ActiveUsers++;
          v.status = "فعال"

        }
        else{
          NotActiveUsers++;
          v.status = "غیر فعال";
        }
      })
      that.setState({
        GridDataUsers: response.data.result,
        NewUsers: NewUsers,
        managers: managers,
        SiteUsers: SiteUsers,
        ActiveUsers:ActiveUsers,
        NotActiveUsers: NotActiveUsers,
        msg1:<div style={{display:'flex',justifyContent:'space-between',padding:20,marginTop:10,flexWrap:'wrap',textAlign:'right'}} className="yekan alert-info"><div style={{width:'100%',marginBottom:10}}><span>خلاصه وضعیت کاربران</span></div><div><span>کاربران : </span><span>{SiteUsers}</span></div><div><span>مدیران : </span><span>{managers}</span></div><div><span>کاربران فعال : </span><span>{ActiveUsers}</span></div><div><span>کاربران غیر فعال : </span><span>{NewUsers}</span></div></div>
      })
      if(that.state.System == "shop")
        that.GetFactors();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getuser", param, SCallBack, ECallBack)
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
          isMainShop: response.data.result[0].main,
          tokenId: response.data.result[0].tokenId,
          codeForHead:"<script src='https://sarvapps.ir/ania_chat.js'></script><link rel='stylesheet' href='https://sarvapps.ir/ania_chat.css' /><script>window.AniaChatId='"+response.data.result[0].tokenId+"';window.AniaChatInit()</script>",

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
          RegSmsText: response.data.result ? resp.RegSmsText : '',
          System: response.data.result ? resp.System : '',
          
        })
      }
      that.GetUsers();



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
      let Canceled_p = 0;
      let PreparForSend_p = 0;
      let Sended_p = 0 ;
      let Get_p = 0;
      let Ended_p = 0;
      let NewFactors_p = 0;
      let NokFactors_p = 0;
      let reqBack_p = 0;
      let Back_p = 0; 
      response.data.result.result.map(function (v, i) {

        /*v.Amount = !v.Amount ? "0" : v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.Credit = !v.Credit ? "0" : v.Credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.paykAmount = !v.paykAmount ? "0" : v.paykAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.finalAmount = !v.finalAmount ? "0" : v.finalAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");*/

        if (v.status == "1"){
          NewFactors++;
          NewFactors_p+=v.finalAmount||0;

        }
        if (v.status == "-1"){
          Canceled++;
          Canceled_p+=v.finalAmount||0;


        }
        if (v.status == "0"){
          NokFactors++
          NokFactors_p+=v.finalAmount||0;


        }
        if (v.status == "2"){
          PreparForSend++;
          PreparForSend_p+=v.finalAmount||0;


        }
        if (v.status == "3"){
          Sended++;
          Sended_p+=v.finalAmount||0;


        }
        if (v.status == "4"){
          Get++;
          Get_p+=v.finalAmount||0;


        }
        if (v.status == "5"){
          Ended++;
          Ended_p+=v.finalAmount||0;

        }
        if (v.status == "-2"){
          reqBack++;
          reqBack_p+=v.finalAmount||0;
        }
        if (v.status == "-3"){
          Back++;  
          Back_p+=v.finalAmount||0;
        }
        if (v.InPlace && (v.status == "5" || v.status == "4" || v.status == "3" || v.status == "2" ||  v.status == "1"))
          InPlace++;
        else if(!v.InPlace && (v.status == "5" || v.status == "4" || v.status == "3" || v.status == "2" ||  v.status == "1"))
          Cache++;
        


      })
      let Success = Get_p+Ended_p+Sended_p+PreparForSend_p+NewFactors_p;
      let inCurrent = Get_p+Sended_p+PreparForSend_p+NewFactors_p;

      let FactorStatusDate = [Canceled, reqBack,Back,NokFactors,NewFactors,PreparForSend,Sended,Get,Ended];
      let FactorStatusLabels = ["لغو شده", "درخواست مرجوعی","مرجوع شده","ناموفق","ثبت شده","آماده ارسال","ارسال شده","تحویل شده","تسویه شده"];

      
      that.setState({
        FactorStatusLabel: 'تعداد فاکتورها ',
        FactorStatusDate:FactorStatusDate,
        FactorStatusLabels:FactorStatusLabels,
        GridDataFactors: response.data.result.result,
        msg2:<div style={{display:'flex',justifyContent:'space-between',padding:20,marginTop:10,flexWrap:'wrap',textAlign:'right'}} className="yekan alert-success"><div style={{width:'100%',marginBottom:10}}><span>خلاصه وضعیت فروش</span></div><div style={{width:'50%'}}><span>تسویه شده : </span><span>{Ended_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div><div style={{width:'50%'}}><span>تحویل شده : </span><span>{Get_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div><div><span>ارسال شده : </span><span>{Sended_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div><div style={{width:'50%'}}><span>آماده ارسال : </span><span>{PreparForSend_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان </span></div><div style={{width:'50%'}}> <span>ثبت شده : </span><span>{NewFactors_p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div><div style={{width:'100%',color:'green',fontSize:18,marginTop:10}}><span> سفارشات جاری سیستم : </span><span>{inCurrent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div><div style={{width:'100%',color:'green',fontSize:25,marginTop:20}}><span>مجموع کل سفارشات  : </span><span style={{color:'red'}}>{Success.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</span></div>  </div>

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

              {this.state.msg1 &&
                <Fieldset legend="خلاصه وضعیت کاربران" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%' }}>

                <div className="col-12">
                  {this.state.msg1}
                </div>
              </Fieldset>
              }
              </div>
              <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>

                {this.state.msg2 &&
                  <Fieldset legend="خلاصه وضعیت سفارشات" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan',width:'100%' }}>

                  <div className="col-12">
                    {this.state.msg2}
                  </div>
                  </Fieldset>

                }
                </div>
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

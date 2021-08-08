import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux';
import Server from '../Server.js'
import Header from '../Header.js'
import { SelectButton } from 'primereact/selectbutton';
import { ToggleButton } from 'primereact/togglebutton';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';


import { Button } from 'primereact/button';
import moment from 'moment-jalaali';

import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { ProgressSpinner } from 'primereact/progressspinner';

const params5 = {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  loop: 1,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },
  pagination: {
    el: '.swiper-pagination'
  }
}

class Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()   // Create a ref object
    this.Server = new Server();
    this.SetReserve = this.SetReserve.bind(this);
    this.toast = React.createRef();


    localStorage.removeItem("food");
    this.state = {
      activePage: 1,
      TransferAccount: "2045800",
      CurrentTab: 1,
      showDiv: 0,
      credit: 0,
      number: this.props.location.search.split("number=")[1],
      Price: 0,
      userReservedItem: [],
      userChecked: [],
      mounth: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
      key: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "toelve"],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()
    }


  }

  componentDidMount() {
    /*if(this.props.username != "5" && this.props.username != "2" && this.props.username != "423" && this.props.username != "358"){
      this.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">پردازش در حال پیاده سازی است</div>, life: 4000 });
      return;
    }*/
    let m = moment();
    let CYear = m.jYear();
    let CMounth = m.jMonth() + 1;
    let CDay = m.jDate();
    this.setState({
      CYear: CYear,
      CMounth: CMounth,
      CDay: CDay,
      UserMobile: localStorage.getItem("UserMobile") || "",
      username: this.props.username || localStorage.getItem("UserMobile") || "",
      UserFullName: localStorage.getItem("UserFullName") || ""

    })
    this.GetReserve();
  }

  GetReserve() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      number: this.state.number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        GridDataReserve: response.data.result[0],
        IsConfirm: response.data.result[0].confirm
      })
      that.setState({
        loading: 0
      })
      that.GetReserveDetails()
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserve", param, SCallBack, ECallBack)
  }

  GetReserveDetails() {
    let that = this;
    let param = {
      number: this.state.number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let Mounth = {
        one: [],
        two: [],
        three: [],
        four: [],
        five: [],
        six: [],
        seven: [],
        eight: [],
        nine: [],
        ten: [],
        eleven: [],
        toelve: []
      };
      let currentUserReserved = 0;
      let userReservedItem = [];
      let userChecked = [];
      let RemainPayment = false;
      let week = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه"]
      for (let item of response.data.result) {
        if (item.username && item.username == that.state.username && item.checked) {
          item.old = 1;
          userReservedItem.push(item)
          userChecked.push(item);
          if (!that.state.IsConfirm || (item.UserConfirmed && item.SystemConfirmed))
            currentUserReserved++;
          if (that.state.IsConfirm && item.SystemConfirmed && !item.UserConfirmed) {
            RemainPayment = true;
          }
        }
        let index = parseInt(item.day.split("_")[1]) - 1
        item.Mounth = that.state.mounth[index];
        item.MounthNum = parseInt(item.day.split("_")[1]);
        item.Day = item.day.split("_")[2];
        item.Year = item.day.split("_")[0];
        item.price = item.price || that.state.GridDataReserve.price;
        item.value = item.day;
        item.label = item.Day + "\n" + week[item.weekName];
        item.week = week[item.weekName];
        if (item.MounthNum == 1)
          Mounth.one.push(item)
        if (item.MounthNum == 2)
          Mounth.two.push(item)
        if (item.MounthNum == 3)
          Mounth.three.push(item)
        if (item.MounthNum == 4)
          Mounth.four.push(item)
        if (item.MounthNum == 5)
          Mounth.five.push(item)
        if (item.MounthNum == 6)
          Mounth.six.push(item)
        if (item.MounthNum == 7)
          Mounth.seven.push(item)
        if (item.MounthNum == 8)
          Mounth.eight.push(item)
        if (item.MounthNum == 9)
          Mounth.nine.push(item)
        if (item.MounthNum == 10)
          Mounth.ten.push(item)
        if (item.MounthNum == 11)
          Mounth.eleven.push(item)
        if (item.MounthNum == 12)
          Mounth.toelve.push(item)
      }
      let showDiv = 0;
      if (Mounth.toelve.length > 0)
        showDiv = 11
      if (Mounth.eleven.length > 0)
        showDiv = 10
      if (Mounth.ten.length > 0)
        showDiv = 9
      if (Mounth.nine.length > 0)
        showDiv = 8
      if (Mounth.eight.length > 0)
        showDiv = 7
      if (Mounth.seven.length > 0)
        showDiv = 6
      if (Mounth.six.length > 0)
        showDiv = 5
      if (Mounth.five.length > 0)
        showDiv = 4
      if (Mounth.four.length > 0)
        showDiv = 3
      if (Mounth.three.length > 0)
        showDiv = 2
      if (Mounth.two.length > 0)
        showDiv = 1
      if (Mounth.one.length > 0)
        showDiv = 0
      that.setState({
        loading: 0,
        TableRecords: response.data.result,
        showDiv: showDiv,
        Mounth: Mounth,
        Allow: currentUserReserved < that.state.GridDataReserve.maxDay,
        userReservedItem: userReservedItem,
        checkedCount: userChecked.length,
        userChecked: userChecked,
        RemainPayment: RemainPayment
      })
      that.GetAccounts();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserveDetails", param, SCallBack, ECallBack)
  }
  GetAccounts(RefreshVam) {
    let that = this;
    if (!this.props.username)
      return;
    let SCallBack = function (response) {

      let data = [];
      let resp = [];
      for (let i = 0; i < response.length; i++) {
        resp[i] = response[i].children;

      }
      for (let i = 0; i < resp.length; i++) {
        for (let j = 0; j < resp[i].length; j++) {
          if (resp[i][j].name == "A_Kind") {
            if (resp[i][j].value == "5")
              data.push(resp[i])
          }

        }
      }
      let AccList = [];
      for (let i = 0; i < data.length; i++) {
        AccList[i] = { value: data[i][1].value, label: data[i][3].value + "(" + data[i][1].value + ")" }
      }
      that.setState({
        AccList: AccList,
        AccountNumber: AccList.length > 1 ? null : AccList[0].value,
        ShowLoading: false
      })

    }
    let ECallBack = function (error) {
      that.setState({
        ShowLoading: false
      })
    }

    var param = '{CommandNo : "3" , AccountNo: "' + that.props.account + '",Param1: "' + that.props.password + '" }';
    let ip = that.props.ip || "https://ansar24.com";
    that.setState({
      ShowLoading: true
    })
    that.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack)
  }

  SetReserve(verify, end) {
    let that = this;
    let days = [];
    let Price = 0;
    if (this.state.ShowLoading)
      return;

    let extra = "";
    let SystemConfirmed = false;
    let Count = 0;
    for (let i = 0; i < this.state.userChecked.length; i++) {
      if (this.state.userChecked[i].old != "1") {
        Count++;
        Price += parseInt(this.state.userChecked[i].price)
        days.push(this.state.userChecked[i].day)
        extra += this.state.userChecked[i].Day + " " + this.state.userChecked[i].Mounth + " " + this.state.userChecked[i].Year + "\n";
      } else {
        if (this.state.userChecked[i].SystemConfirmed && !this.state.userChecked[i].UserConfirmed) {
          Count++
          SystemConfirmed = true;
          Price += parseInt(this.state.userChecked[i].price)
          days.push(this.state.userChecked[i].day)
          extra += this.state.userChecked[i].Day + " " + this.state.userChecked[i].Mounth + " " + this.state.userChecked[i].Year + "\n";
        }
      }

    }

    if (!Count) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">حداقل یک روز را انتخاب کنید</div>, life: 4000 });
      return;
    }

    /*
    if(!this.props.username)
      return;*/
    if (!verify) {
      this.setState({
        SystemConfirmed: SystemConfirmed,
        Price: Price,
        ReserveDialog: 1
      })
      return;
    }  
    if ((!this.state.AccountNumber && this.props.username) && (!this.state.IsConfirm || SystemConfirmed)) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">حساب خود را انتخاب کنید</div>, life: 4000 });
      return;
    }
    if (!this.props.username && !this.state.UserMobile) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">شماره تلفن همراه را وارد کنید</div>, life: 4000 });
      return;
    }
    if (this.state.UserMobile) {
      localStorage.setItem("UserMobile", this.state.UserMobile);
      localStorage.setItem("UserFullName", this.state.UserFullName);


    }
    if (!end && (!that.state.IsConfirm || SystemConfirmed)) {
      if(that.props.username)
        that.Transfer();
      else
        that.savePayment(null, 0);
      return;
    }
    let param = {
      token: localStorage.getItem("api_token"),
      number: this.state.number,
      price: this.state.Price,
      extra: extra,
      days: days,
      username: this.state.username,
      mobile: (this.props.mobile && this.props.mobile.length > 10) ? this.props.mobile.substring(1) : (this.props.mobile || this.state.UserMobile),
      account: this.props.account,
      checked: true,
      name: this.props.fullname,
      type: this.state.GridDataReserve.name,
      IsConfirm: this.state.IsConfirm,
      UserConfirmed: SystemConfirmed,
      SystemConfirmed: SystemConfirmed,
      managerMobile: this.state.GridDataReserve.managerMobile

    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      that.setState({
        loading: 0,
        ReserveDialog: 0
      })
      that.GetReserve();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/ReserveForUser", param, SCallBack, ECallBack)
  }
  Transfer() {
    let that = this;
    let ip = that.props.ip || "https://ansar24.com";

    if (!this.state.AfterSend) {
      let SCallBack = function (response) {


        let resp = [];
        for (let i = 0; i < response.length; i++) {
          resp[i] = response[i].children;

        }
        if (resp[0][0].name == "ERROR") {
          that.setState({
            AccDialog: false
          })
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

          return;
        }
        that.setState({
          ticketNo: resp[0][0] ? resp[0][0].value : '',
          AfterSend: true
        })
        that.savePayment(null, 0);

      }
      let ECallBack = function (error) {
        that.setState({
          ShowLoading: false
        })
      }
      that.setState({
        ShowLoading: true
      })

      let amount = this.state.Price.toString().replace(/,/g, "");
      let Param1 = this.state.TransferAccount + ";" + amount + ";";
      var param = '{CommandNo : "72" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + Param1 + '" }';

      that.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

    }
    if (this.state.AfterSend) {
      let SCallBack = function (response) {


        let resp = [];
        for (let i = 0; i < response.length; i++) {
          resp[i] = response[i].children;

        }
        if (resp[0][0] && resp[0][0].name == "ERROR" || !resp[0][1]) {
          that.setState({
            AccDialog: false
          })
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

          return;
        }

        that.setState({
          SanadNumber: resp[0][0] ? resp[0][0].value : '',
          ResidNumber: resp[0][1] ? resp[0][1].value : '',
          AccDialog: false,
          RefId: resp[0][1] ? resp[0][1].value : ''
        })
        that.savePayment(1, 1);

        that.toast.current.show({
          severity: 'success', summary: <div className="YekanBakhFaMedium">پرداخت انجام شد</div>, detail: <div className="YekanBakhFaMedium">
            <div>سند : {resp[0][0] ? resp[0][0].value : ''}</div>
            <div>رسید تراکنش : {resp[0][1] ? resp[0][1].value : ''}</div>
          </div>, life: 4000
        });



      }
      let ECallBack = function (error) {
        that.setState({
          ShowLoading: false
        })
      }
      that.setState({
        AfterSend: false,
        ShowLoading: true
      })
      var FDesLocalChanged = "رزرو اتاق";
      let amount = this.state.Price.toString().replace(/,/g, "");
      var Param1 = this.props.username + ';' + this.state.AccountNumber + ';' + this.state.TransferAccount + ";" + amount + ";" + FDesLocalChanged + ";;;0;0;;";
      var param = '{CommandNo : "73" , AccountNo: "' + that.state.ticketNo + '",Param1: "' + Param1 + '" }';
      that.Server.sendRaymand("" + that.props.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

    }


  }
  Payment() {
    let that = this;

     


    let url = this.state.url + 'payment3';
    let param = {
      Amount: parseInt(this.state.Price),
      username:this.state.username
    }

   

    axios.post(url, param)
      .then(response => {
            let res;
            res = response.data.result ? response.data.result.SalePaymentRequestResult : {};
            if (res.Token > 0 && res.Status == "0") {
              window.location = "https://pec.shaparak.ir/NewIPG/?token=" + res.Token;
            } else {
              this.toast.current.show({ severity: 'error', summary: <div> {res.Message} <br />برای اتمام خرید در زمان دیگری مراجعه کنید یا از طریق حساب صندوق پرداخت کنید</div>, life: 8000 });
            }
          
        

      }).catch(error => {
        console.log(error)
      })





  }
  savePayment(edit, status) {
    let that = this;
    that.setState({
      ShowLoading: true
    })
    that.Server.send("MainApi/extraPayment", {
      username: this.props.mobile || this.state.UserMobile,
      RaymandAcc: this.state.AccountNumber,
      scoreName:"reserve_villa",
      RaymandId: this.props.account,
      Amount: this.state.Price,
      type: 3,
      desc: 'رزرو اتاق ' + this.state.Operator + ',' + this.state.Price,
      status: status,
      edit: edit,
      reqTime: this.state.reqTime,
      reqDate: this.state.reqDate,
      RefId: this.state.RefId
    }, function (response) {
      that.setState({
        reqDate: response.data.reqDate,
        reqTime: response.data.reqTime,
        ShowLoading: false
      })
      if (!edit) {
        if(that.props.username)
          that.Transfer();
        else
          that.Payment();
      } else {
        that.SetReserve(1, 1);
      }

    }, function (error) {
      that.setState({
        ShowLoading: 0
      })
    })
  }

  render() {

    if (this.state.page) {
      return <Redirect to={this.state.page} />;
    }
    return (
      <div style={{ height: '100%' }}>
        <Header ComponentName="رزرو ویلا" />
        <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
        {!this.state.Allow && this.state.showDiv != 0 &&
          <div style={{ backgroundColor: '#ff6f6f', color: '#fff', marginTop: 10 }}>

            <div>
              <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}>سهیه رزرو اکانت شما به پایان رسیده است</div>
            </div>

            <div>
              {this.state.IsConfirm && this.state.userReservedItem[0] && !this.state.userReservedItem[0].SystemConfirmed ?
                <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}> درخواست شما برای تاریخ های زیر ثبت شده است</div>
                :
                <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}> تاریخ های زیر برای شما ثبت شده است</div>
              }
              {this.state.userReservedItem.map((item, index) => {
                return (
                  <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}>{item.day} <i style={{ color: 'green', fontSize: 11, marginLeft: 10 }} className="fas fa-check" /></div>
                )
              })}
              {this.state.IsConfirm && this.state.userReservedItem[0] && !this.state.userReservedItem[0].SystemConfirmed &&
                <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}> لطفا تا دریافت نتیجه درخواست منتظر باشید</div>

              }
            </div>

          </div>

        }
        {this.state.showDiv != 0 && this.state.IsConfirm && this.state.userReservedItem.length > 0 &&
          <div style={{ backgroundColor: '#eee', color: '#000', marginTop: 10 }}>

            <div>
              <div className="YekanBakhFaMedium" style={{ textAlign: 'center' }}>درخواست شما برای تاریخ های زیر ثبت شده است</div>
            </div>

            <div style={{ paddingLeft: 5, paddingRight: 5 }}>

              {this.state.userReservedItem.map((item, index) => {
                return (
                  item.SystemConfirmed ?
                    <div>
                      <div className="YekanBakhFaMedium" style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}> {item.UserConfirmed ?
                        <span style={{ color: '#00d200', width: '30%', textAlign: 'left', fontSize: 13, border: '1px solid #ccc' }}>پرداخت شده</span>
                        :
                        <span style={{ color: 'red', width: '30%', textAlign: 'left', fontSize: 13, border: '1px solid #ccc' }}>پرداخت نشده</span>
                      }
                        <span style={{ color: '#00d200', width: '40%', textAlign: 'right', fontSize: 13, border: '1px solid #ccc' }}>تایید شده توسط سیستم</span>
                        <span style={{ width: '30%', textAlign: 'right', fontSize: 13, border: '1px solid #ccc' }}>{item.day.replaceAll("_", "/")}</span>

                      </div>

                    </div>
                    :
                    <div className="YekanBakhFaMedium" style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'red', width: '30%', textAlign: 'left', fontSize: 13, border: '1px solid #ccc' }}></span>
                      <span style={{ color: 'blue', width: '40%', textAlign: 'right', fontSize: 13, border: '1px solid #ccc' }}>منتظر تایید سیستم</span>
                      <span style={{ width: '30%', textAlign: 'right', fontSize: 13, border: '1px solid #ccc' }}>{item.day.replaceAll("_", "/")}</span> </div>

                )
              })}

            </div>

          </div>

        }
        <Dialog header="تایید رزرو" visible={this.state.ReserveDialog} maximized={true} onHide={() => {
          this.setState({
            ReserveDialog: false
          });
        }}
        >
          {!this.state.ShowLoading ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} >
              {this.props.username ?
                <div>
                  <div>
                    <span className="YekanBakhFaMedium">نام : </span> <span className="YekanBakhFaMedium">{this.props.fullname}</span>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <span className="YekanBakhFaMedium">تلفن تماس : </span> <span className="YekanBakhFaMedium">{this.props.mobile}</span>
                  </div>
                </div>
                :
                <div style={{ width: '100%', marginBottom: 50 }}>
                  <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative' }}>
                    <input className="form-control YekanBakhFaMedium" autocomplete="off" disabled={this.state.SystemConfirmed} style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid #000', height: 40 }} type="text" id="UserFullName" value={this.state.UserFullName} name="UserFullName" onChange={(e) => this.setState({ UserFullName: e.target.value })} required />
                    <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>نام و نام خانوادگی</label>
                  </div>
                  <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative' }}>
                    <input className="form-control YekanBakhFaMedium" autocomplete="off" disabled={this.state.SystemConfirmed} style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid #000', height: 40 }} type="number" id="UserMobile" value={this.state.UserMobile} name="UserMobile" onChange={(e) => this.setState({ UserMobile: e.target.value })} required />
                    <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>تلفن همراه</label>
                  </div>
                </div>
              }
              {this.state.GridDataReserve &&
                <div style={{ marginBottom: 20 }}>
                  <span className="YekanBakhFaMedium">رزرو </span> <span className="YekanBakhFaMedium">{this.state.GridDataReserve.name}</span>
                </div>
              }

              {this.state.userChecked.map((item, index) => {
                if (item.old != "1" || (item.SystemConfirmed && !item.UserConfirmed)) {
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', direction: 'rtl' }}>
                      <div className="YekanBakhFaMedium" style={{ width: '50%', border: '1px solid #eee', padding: 5 }}>{item.Day} {item.Mounth} {item.Year}</div>
                      <div className="YekanBakhFaMedium" style={{ width: '50%', border: '1px solid #eee', padding: 5 }}>{item.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال</div>

                    </div>
                  )
                }

              })}

              <p className="YekanBakhFaMedium" style={{ direction: 'rtl', fontSize: 20, color: '#440707' }} > مبلغ قابل پرداخت : {this.state.Price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال</p>
              {(!this.state.IsConfirm || this.state.SystemConfirmed) &&
                <div style={{width:'100%',textAlign:'center'}}>
                  {this.state.AccList && this.state.AccList.length > 0 &&
                    <Dropdown style={{ width: '90%', textAlign: 'right' }} value={this.state.AccountNumber} options={this.state.AccList} onChange={(e) => this.setState({ AccountNumber: e.value, AccDialog: false })} placeholder="حساب خود را انتخاب کنید" />
                  }
                  {this.state.AccountNumber &&
                    <p className="YekanBakhFaMedium" style={{ direction: 'rtl' }} > برداشت از حساب {this.state.AccountNumber}</p>
                  }
                </div>
              }
              <Button info rounded style={{ marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10, textAlign: 'center' }} onClick={() => this.SetReserve(1)}>
                {(!this.state.IsConfirm || this.state.SystemConfirmed) ?
                  <span style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, width: '100%' }}>پرداخت و تایید</span>

                  :
                  <span style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, width: '100%' }}>درخواست رزرو</span>

                }
              </Button>
            </div>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <ProgressSpinner style={{ paddingTop: 150 }} />
            </div>

          }


        </Dialog>

        {!this.state.ShowLoading ?
          <div>
            <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', marginTop: 20 }} >
              <div style={{ width: '95%' }}>
                {this.state.GridDataReserve &&
                  <Swiper {...params5} >
                    <div>
                      <img src={this.state.absoluteUrl + (this.state.GridDataReserve.pic ? this.state.GridDataReserve.pic?.split("public")[1] : 'nophoto.png')} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', maxHeight: 170, width: '100%' }} />

                    </div>
                    <div>
                      <img src={this.state.absoluteUrl + (this.state.GridDataReserve.extraPic1 ? this.state.GridDataReserve.extraPic1?.split("public")[1] : 'nophoto.png')} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', maxHeight: 170, width: '100%' }} />

                    </div>
                    <div>
                      <img src={this.state.absoluteUrl + (this.state.GridDataReserve.extraPic2 ? this.state.GridDataReserve.extraPic2?.split("public")[1] : 'nophoto.png')} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', maxHeight: 170, width: '100%' }} />

                    </div>
                    <div>
                      <img src={this.state.absoluteUrl + (this.state.GridDataReserve.extraPic3 ? this.state.GridDataReserve.extraPic3?.split("public")[1] : 'nophoto.png')} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', maxHeight: 170, width: '100%' }} />

                    </div>
                    <div>
                      <img src={this.state.absoluteUrl + (this.state.GridDataReserve.extraPic4 ? this.state.GridDataReserve.extraPic4?.split("public")[1] : 'nophoto.png')} style={{ borderRadius: 12, whiteSpace: 'pre-wrap', maxHeight: 170, width: '100%' }} />

                    </div>
                  </Swiper>
                }

              </div>
            </div>
            {this.state.GridDataReserve &&
              <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <div className="YekanBakhFaMedium" style={{ marginTop: 20, textAlign: 'center', fontSize: 22 }}>
                  {this.state.GridDataReserve.name}
                </div>
                <div className="YekanBakhFaMedium" style={{ marginTop: 20, textAlign: 'right', whiteSpace: 'pre-wrap', padding: 5, direction: 'rtl' }}>
                  {this.state.GridDataReserve.desc}
                </div>
                <div className="YekanBakhFaMedium" style={{ marginTop: 20, textAlign: 'right', fontSize: 18, direction: 'rtl', marginRight: 10 }}>
                  <span> حداکثر تعداد شب اقامت :  </span> <span>    {this.state.GridDataReserve.maxDay}  شب   </span>
                </div>
              </div>

            }
            <div className="no-scroll-bar" style={{ display: 'inline', flexWrap: 'wrap', overflow: 'auto', direction: 'rtl' }} >
              {this.state.mounth.map((item, index) => {

                let key = this.state.key[index];
                let prev = index - 1;
                let next = index + 1;
                return (
                  this.state.Mounth && this.state.showDiv == index &&
                  <div style={{ border: '1px solid #eee', textAlign: 'center', padding: 10, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }} >
                      {index != 0 ?
                        <div><i class="fas fa-angle-double-right" onClick={() => {
                          this.setState({
                            showDiv: prev
                          })
                        }} /></div>
                        :
                        <div><i /></div>
                      }
                      <div><p className="YekanBakhFaMedium" style={{ textAlign: 'center' }}>{this.state.mounth[index]}</p>
                      </div>
                      {index != 11 ?
                        <div><i class="fas fa-angle-double-left" onClick={() => {
                          this.setState({
                            showDiv: next
                          })
                        }} /></div>
                        :
                        <div><i /></div>
                      }
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {this.state.Mounth[key] && this.state.Mounth[key].length > 0 && this.state.Mounth[key].map((item, index) => {
                        return (
                          <ToggleButton style={{ width: '25%', direction: 'rtl', color: (item.weekName == "5" || item.free) ? "red" : "#000" }} checked={item.checked} disabled={(item.checked && !item.userChecked) || (!this.state.Allow) || (this.state.CYear == item.Year && this.state.CMounth == item.MounthNum && this.state.CDay > item.Day) || (this.state.CYear == item.Year && this.state.CMounth > item.MounthNum) || this.state.CYear > item.Year || (this.state.IsConfirm && this.state.RemainPayment)} offLabel={item.label} onLabel={item.label} onChange={(e) => {
                            let checkedCount = this.state.checkedCount || 0;
                            if (parseInt(this.state.GridDataReserve.maxDay) <= checkedCount && e.value)
                              return;
                            item.checked = e.value
                            item.userChecked = e.value;
                            checkedCount = e.value ? checkedCount + 1 : checkedCount - 1;
                            let userChecked = this.state.userChecked;
                            if (e.value)
                              userChecked.push(item);
                            else {
                              userChecked.splice(userChecked.indexOf(item), 1)
                            }

                            this.setState({
                              checkedCount: checkedCount,
                              userChecked: userChecked
                            })
                          }
                          } />
                        )

                      })}


                    </div>
                  </div>

                )
              })}
              {this.state.GridDataReserve &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button info rounded style={{ marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10, textAlign: 'center' }} onClick={() => this.SetReserve()}>
                    <span style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, width: '100%' }}>ادامه</span>
                  </Button>
                </div>
              }


            </div>


          </div>
          :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <ProgressSpinner style={{ paddingTop: 150 }} />
          </div>
        }



      </div>
    );
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
export default connect(mapStateToProps)(Reserve)


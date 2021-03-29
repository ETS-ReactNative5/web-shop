import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Server from './Server.js';
import queryString from 'query-string';
import Header1 from './Header1.js';
import Footer from './Footer.js';
import Header2 from './Header2.js';
import { ComponentToPrint } from './ComponentToPrint.js';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { Button } from 'primereact/button';

class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.state = {
      refId: '',
      InMobileApp: "0",
      url: this.Server.getUrl(),
      x: 1

    }

    //})
  }
  componentDidMount() {
    const value = queryString.parse(this.props.location.search);
    let refId = value.refId;
    if (refId || refId == "-1") {
      this.setState({
        refId: refId,
        InMobileApp: value.InMobileApp == "1" ? "1" : "0"
      });
      if (refId && refId != -1) {

        axios.post(this.state.url + 'getuserInformation', {
          token: localStorage.getItem("api_token"),
          user_id: value.userId

        })
          .then(response => {
            let credit = response.data.result[0].credit;
            this.setState({
              username: response.data.result[0].username
            });
            this.props.dispatch({
              type: 'LoginTrueUser',
              CartNumber: 0,
              credit: credit
            });
            this.GetFactors();


          })
          .catch(error => {

          });

      }
      return;
    }
    let Authority = value.Authority,
      Amount = value.Amount,
      Status = value.Status,
      _id = value._id,
      userId = value.userId;
    this.setState({
      InMobileApp: value.InMobileApp == "undefined" ? "0" : value.InMobileApp
    });
    if (Status == "NOK") {
      this.setState({
        refId: -1,
      });
      return;
    }
    var that = this;
    //axios.post(this.state.url+'checktoken', {
    // token: userId
    //})
    //.then(response1 => {    

    axios.post(that.state.url + 'verification', {
      Amount: Amount,
      Authority: Authority,
      _id: _id,
      userId: userId
    })
      .then(response => {
        if (response.data.result) {
          axios.post(this.state.url + 'getuserInformation', {
            token: localStorage.getItem("api_token"),
            user_id: userId,
            project: { "user.password": 0, "user.address": 0, "user.company": 0, "user.username": 0 }

          })
            .then(response => {
              let credit = response.data.result[0].credit;
              that.props.dispatch({
                type: 'LoginTrueUser',
                CartNumber: 0,
                credit: credit,
                off: this.props.off
              });
              that.setState({
                refId: response.data.result,
                userId: userId
              });
              if (that.state.ActiveSms == "smart") {
                axios.post(that.state.url + 'sendsms_smartSms', {
                  token: response.data.result.TokenKey,
                  text: "ثبت سفارش با موفقیت انجام شد " +
                     "شماره پیگیری سفارش : " + refId + "\n" +
                     "" + "\n" + "سفارش شما در سریع ترین زمان پردازش و ارسال خواهد شد" + "\n" + "از خرید شما سپاسگزاریم" + "\n" + that.state.STitle,
                  mobileNo: that.state.username.trim()
                })
                  .then(response => {
                    console.log(response);

                  })
                  .catch(error => {
                  });
              } else if (that.state.ActiveSms == "smsir") {
                axios.post(that.state.url + 'GetSmsToken', {
                })
                  .then(response => {

                    that.setState({
                      SmsToken: response.data.result.TokenKey
                    });
                    axios.post(that.state.url + 'sendsms_SmsIr', {
                      token: response.data.result.TokenKey,
                      text: "ثبت سفارش با موفقیت انجام شد " +
                        "شماره پیگیری سفارش : " + refId + "\n" +
                         "\n" + "سفارش شما در سریع ترین زمان پردازش و ارسال خواهد شد" + "\n" + "از خرید شما سپاسگزاریم" + "\n" + that.state.STitle,
                      mobileNo: that.state.username.trim()
                    })
                      .then(response => {
                        console.log(response);

                      })
                      .catch(error => {
                        // alert(error);
                        alert(error);
                      });


                  })
                  .catch(error => {
                    alert(error);
                    console.log(error);
                  });
              }
            })
            .catch(error => {

            });

          /*let param={
            refId : response.data.result,
            username : null,
            Amount : Amount
          };
          let SCallBack = function(response){
            };
          let ECallBack = function(error){
                alert(error)
          }
          this.Server.send("MainApi/SetFactor",param,SCallBack,ECallBack)*/

        }

      }).catch(error => {
        // alert(error);
        that.setState({
          refId: -1,
        });
        console.log(error);
      });


  }
  GetFactors() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      refId: this.state.refId
    };
    this.setState({
      loading: 1
    });
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      });
      /*let NewFactors = 0;
      response.data.result.result.map(function (v, i) {
        v.Amount = !v.Amount ? "0" : v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.Credit = !v.Credit ? "0" : v.Credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if (v.status == "1")
          NewFactors++;
        if (v.status == "-2")
          v.statusDesc = "لغو محصول توسط فروشنده"
        if (v.status == "-2")
          v.statusDesc = "درخواست لغو توسط خریدار"
        if (v.status == "-1")
          v.statusDesc = "لغو شده"
        if (v.status == "0")
          v.statusDesc = "ناموفق"
        if (v.status == "1")
          v.statusDesc = "ثبت شده"
        if (v.status == "2")
          v.statusDesc = "آماده ارسال"
        if (v.status == "3")
          v.statusDesc = "ارسال شده"
        if (v.status == "4")
          v.statusDesc = "پایان"
        if (v.status == "5")
          v.statusDesc = "تسویه شده"
        if (v.userData && v.userData[0]) {
          v.name = v.userData[0].name;
          v.company = v.userData[0].company;
        }
        v.delete = <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => that.EditFactor(v._id, null, null, "del")}></i>
        v.print =
          <ReactToPrint
            content={() => that.componentRef}
          >
            <PrintContextConsumer>
              {({ handlePrint }) => (
                <i className="far fa-print" onClick={()=>{
                  that.setState({
                    printParam: v
                  })
                  setTimeout(function(){
                    handlePrint();

                  },0)
                }} style={{ cursor: 'pointer' }} aria-hidden="true"></i>
              )}
            </PrintContextConsumer>
          </ReactToPrint>
      })*/
      that.setState({
        GridDataFactors: response.data.result[0]
      })
      that.getSetting();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      });
      console.log(error);
    };
    this.Server.send("MainApi/getFactors", param, SCallBack, ECallBack);
  }
  getSetting() {
    let that = this;
    axios.post(this.state.url + 'getSettings', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        that.setState({
          ActiveSms: response.data.result ? response.data.result.ActiveSms : "none",
          STitle: response.data.result ? response.data.result.STitle : "",
          AccessAfterReg: response.data.result ? response.data.result.AccessAfterReg : 0,
          RegSmsText: response.data.result ? response.data.result.RegSmsText : ''

        })
        setTimeout(function () {
          if (that.state.ActiveSms == "smart") {
            axios.post(that.state.url + 'sendsms_smartSms', {
              token: response.data.result.TokenKey,
              text: "سفارش شما با موفقیت ثبت شد " + "\n" + "سفارش شما در سریع ترین زمان پردازش و ارسال خواهد شد" + "\n" + "از خرید شما سپاسگزاریم",
              mobileNo: that.state.username.trim()
            })
              .then(response => {
                console.log(response);

              })
              .catch(error => {
              })
          } else if (that.state.ActiveSms == "smsir") {
            axios.post(that.state.url + 'GetSmsToken', {
            })
              .then(response => {

                that.setState({
                  SmsToken: response.data.result.TokenKey
                })
                axios.post(that.state.url + 'sendsms_SmsIr', {
                  token: response.data.result.TokenKey,
                  text: "سفارش شما با موفقیت ثبت شد " + "\n" + "سفارش شما در سریع ترین زمان پردازش و ارسال خواهد شد" + "\n" + "از خرید شما سپاسگزاریم",
                  mobileNo: that.state.username.trim()
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
        }, 0)

      })
      .catch(error => {
        console.log(error)
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
  CloseWindow() {
    window.close();
  }
  render() {
    return (
      <div>
        <Header1 />
        <Header2 />
        <div className="container" style={{ marginTop: 15, minHeight: 600 }}>
          <div className="row">
            <div className="col-lg-12 col-md-9 col-12 mx-auto">
              <div className="card" style={{ padding: 40 }}>
                <div className="alert alert-secondary" style={{ borderRadius: 20 }}>
                  {this.state.refId && this.state.refId != -1 &&
                    <div style={{ textAlign: "center", opacity: 1 }} className="YekanBakhFaBold alert text-secondary">
                      پرداخت با موفقیت انجام شد  <br />
                   </div>

                  }
                  {this.state.refId && this.state.refId != -1 ?
                    <div style={{ textAlign: "center", opacity: 1,display:'flex',alignItems:'center',flexDirection:'column' }} className="alert  YekanBakhFaBold">
                      <div>از خرید شما سپاسگزاریم</div><br />
                      <div style={{ fontSize: 21, color: '#fff',backgroundColor:'#24bf30',borderRadius:20,justifyContent:'center',padding:10 }} className="row"> <span className="col-12">رسید تراکنش: </span> <span className="col-12"> {this.persianNumber(this.state.refId)} </span> </div><br />
                      <div>محصولات خریداری شده به زودی آماده و به آدرس شما ارسال می شود</div>
                    </div>
                    :
                    this.state.refId != -1 ?
                      <div style={{ textAlign: "center", opacity: 1 }} className="YekanBakhFaBold alert alert-danger ">
                        در حال دریافت اطلاعات ....
                      </div>

                      : <div style={{ textAlign: "center", opacity: 1 }} className="YekanBakhFaBold alert alert-danger ">
                        پرداخت انجام نشد
                      </div>
                  }
                </div>

                {this.state.refId != -1 &&
                  <div className="row">
                    <div className="col-12">
                      <ComponentToPrint param={this.state.GridDataFactors} forUser="1" ref={el => (this.componentRef = el)} />
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-9">
                      <div  style={{marginTop:20}}>
                      <ReactToPrint
                        content={() => this.componentRef}
                      >
                        <PrintContextConsumer>
                          {({ handlePrint }) => (
                            

                            <Button label="چاپ فاکتور"  onClick={() => {

                              setTimeout(function () {
                                handlePrint();

                              }, 0)
                            }} style={{ cursor: 'pointer' }} aria-hidden="true"></Button>
                          )}
                        </PrintContextConsumer>
                      </ReactToPrint>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                  </div>
                }
                {this.state.InMobileApp == "0" &&
                  <div style={{ textAlign: "center", opacity: 1 }} className="YekanBakhFaBold alert">
                    <a href="http://aniashop.ir">بازگشت به صفحه اصلی سایت</a>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>

    )
  }
}
const mapStateToProps = (state) => {
  return {
    CartNumber: state.CartNumber,
    off: state.off,
    credit: state.credit
  }
}
export default withRouter(
  connect(mapStateToProps)(Invoice)
);
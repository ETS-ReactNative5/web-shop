import React from 'react';
import { connect } from "react-redux"
import Header from '../Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import Form from '../Form.js'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


import Server from '../Server.js'


class Club extends React.Component {

  constructor(props) {
    super(props);

    this.Server = new Server();


    this.state = {
      ShowLoading: true,
      userData: {},
      scoreLog: [],
      scoreRows: [],
      score: -1,
      AccountNumber: !this.props.shop ? this.props.location.search.split("account=")[1] : null,
      offRows: [],
      offRows_temp: [],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(),
      url2: this.Server.getUrl(1)

    }

  }

  ConvertNumToFarsi(text) {
    var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    if (!text)
      return text;
    return text.toString().replace(/[0-9]/g, function (w) {
      return id[+w]
    });
  }
  componentDidMount() {

    this.getuserInfo();
  }
  getScore() {
    let that = this;
    this.Server.send("MainApi/getScore", { username: this.state.userData.username }, function (response) {
      that.setState({
        ShowLoading: false,
        scoreData: response.data.result,
        score: response.data.result[0] ? response.data.result[0].score || 0 : 0
      })
      that.getScoreLog();

    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })
    this.setState({
      ShowLoading: true
    })
  }
  getuserInfo() {
    let that = this;
    this.Server.send("MainApi/getUserData", { Key: "username", mobile: this.props.mobile }, function (response) {
      that.setState({
        birthDay: response.data.result[0].birthDay,
        name: response.data.result[0].name,
        getUserData: !response.data.result[0].birthDay,
        ShowLoading: false,
        userData: response.data.result[0]
      })
      that.getScore();
    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })
    this.setState({
      getUserData: 0,
      ShowLoading: true
    })

  }
  getScoreLog() {
    let that = this;
    this.Server.send("MainApi/getScoreLog", { username: this.props.mobile }, function (response) {
      that.setState({
        scoreLog: response.data.result,
      })
      that.getScoreRows();
    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })


  }
  getScoreRows() {
    let that = this;
    this.Server.send("AdminApi/getScoreList", {}, function (response) {
      that.setState({
        scoreRows: response.data.result,
      })
      that.getOffRows();
    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })


  }
  getOffRows(temp) {
    let that = this;
    var username = this.props.mobile ? (this.props.mobile.charAt(0) == "0" ? this.props.mobile.substr(1) : this.props.mobile) : this.props.mobile;
    let condition = temp ? { $and: [{ all: true },{score:{ $gt: this.state.score} }, { usersList: { $not: { $elemMatch: { "username": username } } } }] } : { $and: [{ all: true },{score:{ $lte: this.state.score} }, { usersList: { $not: { $elemMatch: { "username": username } } } }] }
    this.Server.send("AdminApi/getOffsList", {
      condition: condition
    }, function (response) {

      if(temp)
        that.setState({
          offRows_temp: response.data.result,
        })
      else
      {
        that.setState({
          offRows: response.data.result,
        })
        that.getMyOffs();

      }  
    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })


  }
  getMyOffs() {
    let that = this;
    var username = this.props.mobile ? (this.props.mobile.charAt(0) == "0" ? this.props.mobile.substr(1) : this.props.mobile) : this.props.mobile;
    this.Server.send("AdminApi/getOffsList", {
      condition: { usersList: { $elemMatch: { "username": username }}}
    }, function (response) {
  
      that.setState({
        MyOffs: response.data.result,
      })
      that.getOffRows(1);

    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })


  }
  
  setReqOff() {
    let that = this;

    var username = this.props.mobile ? (this.props.mobile.charAt(0) == "0" ? this.props.mobile.substr(1) : this.props.mobile) : this.props.mobile;

    this.Server.send("AdminApi/setOffReq", {
      username: username,
      userTitle: this.props.fullname,
      lTitle: this.state.selectedOffCode,
      Amount: this.state.selectedOffAmount,
      score: this.state.selectedOffScore,
      _id: this.state.selectedOffId,
      ByUser: 1
    }, function (response) {
      that.setState({
        ShowDialog: false,
        ReportType: 0,
        DialogHeader: "",
        selectedOffAmount: 0,
        selectedOffScore:0,
        selectedOffCode: null,
        selectedOffTitle: null,
        err:false,

      });
      that.getScore();

    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })
  }
  getResponse() {

    this.getuserInfo();
  }
  selectOffRow(Amount, Code, Title, _id,Score) {
    this.setState({
      selectedOffAmount: Amount,
      selectedOffScore: Score,
      selectedOffCode: Code,
      selectedOffTitle: Title,
      selectedOffId: _id
    })
  }
  render() {

    return (
      !this.state.ShowLoading ?
        <div>
          <div>
            <Header credit={this.state.credit} noName={1} ComponentName="باشگاه مشتریان" />

          </div>
          <div>
            {this.state.getUserData ?
              <Form number="2" NoHeader="1" callback={this.getResponse.bind(this)} />
              :
              <div>
                <div style={{ display: 'flex', justifyContent: 'spaceBetween', alignItems: 'center', background: 'lavender', padding: 15 }}>
                  <div style={{ width: '70%', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'YekanBakhFaMedium' }}>{this.state.userData.name}</div>
                    <div style={{ fontFamily: 'YekanBakhFaMedium' }}>{this.state.userData.username}</div>
                    <Button info rounded style={{ fontFamily: 'YekanBakhFaMedium', padding: 4 }} onClick={() => this.setState({ getUserData: 1 })}>ویرایش اطلاعات</Button>
                  </div>
                  <div style={{ width: '30%' }}>
                    {this.state.userData.profile_pic ?

                      <img src={this.state.userData.profile_pic} style={{ height: 100 }} />
                      :
                      this.state.userData.gender == "زن" ?
                        <img src={this.state.absoluteUrl + 'nophoto-woman.png'} style={{ height: 100 }} />
                        :
                        <img src={this.state.absoluteUrl + 'nophoto-man.png'} style={{ height: 100 }} />



                    }
                  </div>

                </div>
                <div>
                  <p style={{ textAlign: 'center' }}><span>امتیاز شما : </span> <span style={{ fontSize: 30, paddingRight: 10 }}>{this.state.score == -1 ? "درحال محاسبه ..." : this.state.score}</span></p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }} >
                  
                  <div style={{ width: '50%', height: 100, marginTop: 10,textAlign:'center'  }}>
                    <Button style={{ background: 'transparent', border: 0, position: 'relative', width: 122, textAlign: 'left' }} onClick={() => this.setState({ ShowDialog: true, ReportType: 4, DialogHeader: "کدهای تخفیف من",DialogImg:"./icons/report-off.png?ver=1" })} >
                      <div style={{ background: '#fff', borderRadius: 7, width: '100%', height: '100%', color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <img src="./icons/report-off.png?ver=1" style={{ height: 70 }} />
                        <span className="YekanBakhFaMedium" style={{ fontSize: 13 }} >کدهای تخفیف من</span>
                      </div>
                    </Button>
                  </div>
                  <div style={{ width: '50%', height: 100, marginTop: 10,textAlign:'center' }}>
                    <Button style={{ background: 'transparent', border: 0, position: 'relative', width: 122, textAlign: 'left' }} onClick={() => this.setState({ ShowDialog: true, ReportType: 1, DialogHeader: "تبدیل به کد تخفیف",DialogImg:"./icons/discount_code.png?ver=1" })} >
                      <div style={{ background: '#fff', borderRadius: 7, width: '100%', height: '100%', color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <img src="./icons/discount_code.png?ver=1" style={{ height: 70 }} />
                        <span className="YekanBakhFaMedium" style={{ fontSize: 13 }} >تبدیل به کد تخفیف</span>
                      </div>
                    </Button>
                  </div>
                  <div style={{ width: '50%', height: 100, marginTop: 10,textAlign:'center'  }}>
                    <Button style={{ background: 'transparent', border: 0, position: 'relative', width: 122, textAlign: 'left' }} onClick={() => this.setState({ ShowDialog: true, ReportType: 2, DialogHeader: "گزارش تراکنش ها",DialogImg:"./icons/REPORT.png?ver=1" })} >
                      <div style={{ background: '#fff', borderRadius: 7, width: '100%', height: '100%', color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <img src="./icons/REPORT.png?ver=1" style={{ height: 70 }} />
                        <span className="YekanBakhFaMedium" style={{ fontSize: 13 }} >گزارش تراکنش ها</span>
                      </div>
                    </Button>
                  </div>
                  <div style={{ width: '50%', height: 100, marginTop: 10,textAlign:'center'  }}>
                    <Button style={{ background: 'transparent', border: 0, position: 'relative', width: 122, textAlign: 'left' }} onClick={() => this.setState({ ShowDialog: true, ReportType: 3, DialogHeader: "راههای دریافت امتیاز",DialogImg:"./icons/help.png?ver=1" })} >
                      <div style={{ background: '#fff', borderRadius: 7, width: '100%', height: '100%', color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <img src="./icons/help.png?ver=1" style={{ height: 70 }} />
                        <span className="YekanBakhFaMedium" style={{ fontSize: 13 }} >راههای دریافت امتیاز</span>
                      </div>
                    </Button>
                  </div>


                </div>
                <Dialog header={this.state.DialogHeader} visible={this.state.ShowDialog} maximized={true} onHide={() => {
                  this.setState({
                    ShowDialog: false,
                    ReportType: 0,
                    DialogHeader: "",
                    DialogImg:null,
                    selectedOffAmount: null,
                    selectedOffCode: null,
                    err:false,
                    selectedOffTitle: null
                  });
                }
                }>
                  <div style={{textAlign:'center'}}>
                  <img src={this.state.DialogImg} style={{ height: 70 }} />

                  </div>
                  {this.state.ReportType == 2 &&

                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, backgroundColor: '#cdd8df' }}>

                        <div style={{ width: '40%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>عنوان</span>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>امتیاز</span>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>تاریخ</span>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>ساعت</span>
                        </div>


                      </div>
                      {this.state.scoreLog && this.state.scoreLog.length > 0 && this.state.scoreLog.map((v, i) => {
                        return (
                          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: (i % 2 == 0) ? '#fff' : '#eee' }}>


                            <div style={{ width: '40%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.score_rows[0].fTitle}</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.score || '-'}</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.Date}</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.Time}</span>
                            </div>


                          </div>
                        )
                      })
                      }
                    </div>
                  }

                  {this.state.ReportType == 3 &&

                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, backgroundColor: '#cdd8df' }}>

                        <div style={{ width: '40%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>عنوان</span>
                        </div>
                        <div style={{ width: '25%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>امتیاز</span>
                        </div>
                        <div style={{ width: '35%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>به ازای خرید (تومان)</span>
                        </div>



                      </div>
                      {this.state.scoreRows && this.state.scoreRows.length > 0 && this.state.scoreRows.map((v, i) => {
                        return (
                          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: (i % 2 == 0) ? '#fff' : '#eee' }}>


                            <div style={{ width: '40%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.fTitle}</span>
                            </div>
                            <div style={{ width: '25%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.score}</span>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.for.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>



                          </div>
                        )
                      })
                      }
                    </div>
                  }
                  {this.state.ReportType == 4 &&

                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, backgroundColor: '#cdd8df' }}>

                        <div style={{ width: '40%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>عنوان</span>
                        </div>
                        <div style={{ width: '25%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>کد</span>
                        </div>
                        <div style={{ width: '35%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>مبلغ (تومان)</span>
                        </div>
                        <div style={{ width: '35%', textAlign: 'center' }}>
                          <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>وضعیت</span>
                        </div>



                      </div>
                      {this.state.MyOffs && this.state.MyOffs.length > 0 && this.state.MyOffs.map((v, i) => {
                        return (
                          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: (i % 2 == 0) ? '#fff' : '#eee' }}>


                            <div style={{ width: '40%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.fTitle}</span>
                            </div>
                            <div style={{ width: '25%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.lTitle}</span>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            </div>
                            <div style={{ width: '35%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.logs[0] ? (v.logs[0].used ? "استفاده شده" : "ثبت شده") : "نامشخص"}</span>
                            </div>



                          </div>
                        )
                      })
                      }
                    </div>
                    }
                  {this.state.ReportType == 1 &&

                    <div>
                      
                        <div>
                          <p style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 15, direction: 'rtl' }}>برای تبدیل امتیازات خود به کد تخفیف ردیف مورد نظر را انتخاب کنید</p>

                          <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, backgroundColor: '#cdd8df' }}>

                            <div style={{ width: '40%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>عنوان</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>کد</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>امتیاز لازم</span>
                            </div>
                            <div style={{ width: '20%', textAlign: 'center' }}>
                              <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium' }}>مبلغ</span>
                            </div>




                          </div>
                          {this.state.offRows && this.state.offRows.length > 0 && this.state.offRows.map((v, i) => {
                            return (
                              <div onClick={() => {this.setState({
                                err:false
                              });
                               this.selectOffRow(v.Amount, v.lTitle, v.fTitle, v._id,v.score)
                            }
                            } style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: (v.lTitle == this.state.selectedOffCode) ? "#badeba" : ((i % 2 == 0) ? '#fff' : '#eee') }}>


                                <div style={{ width: '40%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.fTitle}</span>
                                </div>
                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.lTitle}</span>
                                </div>
                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.score}</span>
                                </div>

                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>




                              </div>
                            )

                          })
                          }
                          {this.state.offRows_temp && this.state.offRows_temp.length > 0 && this.state.offRows_temp.map((v, i) => {
                            return (
                              <div onClick={() => {this.setState({err:true,selectedOffAmount:null,selectedOffCode:null})}} style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', backgroundColor: (v.lTitle == this.state.selectedOffCode) ? "#badeba" : ((i % 2 == 0) ? '#fff' : '#eee') }}>


                                <div style={{ width: '40%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.fTitle}</span>
                                </div>
                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.lTitle}</span>
                                </div>
                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.score}</span>
                                </div>

                                <div style={{ width: '20%', textAlign: 'center' }}>
                                  <span style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 12 }}>{v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                </div>




                              </div>
                            )

                          })
                          }




                          {this.state.selectedOffAmount &&
                            <div>
                              <div style={{ marginTop: 50 }}>
                                <p style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 17, direction: 'rtl' }}>{this.state.selectedOffTitle}</p>
                                <p style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 15, direction: 'rtl' }}> مبلغ تخفیف : {this.state.selectedOffAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>
                                <p style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 15, direction: 'rtl' }}> کد تخفیف  : {this.state.selectedOffCode}</p>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <Button info rounded style={{ fontFamily: 'YekanBakhFaMedium', padding: 4 }} onClick={() => this.setReqOff()}>ثبت نهایی</Button>

                              </div>
                            </div>
                          }
                          {this.state.err &&
                            <div>
                               <p style={{ textAlign: 'center', fontFamily: 'YekanBakhFaMedium', fontSize: 17, direction: 'rtl',color:'red' }}>امتیاز شما برای این درخواست کافی نیست</p>

                            </div>
                          }
                        </div>




                    </div>
                  }

                </Dialog>
              </div>

            }



          </div>
        </div>
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ProgressSpinner style={{ paddingTop: 150 }} />

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
export default connect(mapStateToProps)(Club)


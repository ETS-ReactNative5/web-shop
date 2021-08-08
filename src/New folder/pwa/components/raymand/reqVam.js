import React, { Component } from 'react';
import { connect } from "react-redux"
import Server from '../Server.js'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';

import Header from '../Header.js'
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import DatePicker from 'react-datepicker2';
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'

class reqVam extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.toast = React.createRef();
    this.itemTemplateLaon = this.itemTemplateLaon.bind(this);
    this.FileUpload = this.FileUpload.bind(this);

    this.GetAccounts();
    this.state = {
      edit: this.props.location.search.split("edit=")[1],
      basic: true,
      ButtonText: "ثبت درخواست",
      listViewData: [],
      Accounts: [],
      LaonAmount:"",
      ChequeNember: 0,
      ShowLoading: 1,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(),
      url2: this.Server.getUrl(1)

      

    };
  }
  itemTemplateLaon(car, layout) {
    if (layout === 'list' && car) {

      return (
        <div>
          <div className="row" style={{ alignItems: 'center', direction: 'rtl' }}>

            <div className="col-lg-12 col-md-6 col-12 YekanBakhFaLight" style={{ textAlign: 'right' }} >

              <div className="row" style={{ alignItems: 'center' }}>
                <div>
                  <span>وضعیت : </span>
                  <span className="col-lg-12 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                    {car.status == 0 &&
                      <span style={{ color: 'gray' }}>در حال بررسی</span>
                    }
                    {car.status == 1 &&
                      <span style={{ color: 'blue' }}>تایید اولیه</span>
                    }
                    {car.status == 2 &&
                      <span style={{ color: 'green' }}>تایید نهایی</span>
                    }
                    {car.status == -1 &&
                      <span style={{ color: 'red' }}>عدم تایید</span>
                    }
                  </span>
                </div>

                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                  <span style={{ color: '#b5b5b5' }}>تاریخ ثبت : </span><span>{car.RegDate}</span>
                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                  <span style={{ color: '#b5b5b5' }}>وام گیرنده: </span><span>{car.LaonName}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                  <span style={{ color: '#b5b5b5' }}>شماره حساب: </span><span>{car.LaonAcc}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                  <span style={{ color: '#b5b5b5' }}>شماره موبایل: </span><span>{car.LaonMobile}</span>

                </div>


                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                  <span style={{ color: '#b5b5b5' }}>مبلغ درخواستی : </span><span style={{ fontSize: 17 }}>{car.LaonAmount?.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال</span>

                </div>
                {car.needChange && car.status != 2 &&
                  <div className="col-lg-12 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10, color: 'red', padding: 10, borderRadius: 5, background: "whitesmoke" }}>
                    <div style={{ color: '#ccc' }}>درخواست شما نیاز به اصلاح دارد</div>
                    <div style={{ color: 'red', fontSize: 25 }}>{car.desc}</div>
                  </div>

                }





                {car.status == 1 &&
                  <div className="col-lg-12 col-12 YekanBakhFaMedium" style={{ textAlign: 'right', marginBottom: 10 }}>
                    <Button style={{ marginLeft: 5, marginTop: 10, padding: 12, fontFamily: 'YekanBakhFaMedium' }} color="primary" onClick={() => {
                      this.setState({
                        visibleLaonDialog: true,
                        selectedRow: car,
                        ChequeNember: Math.ceil(parseInt(car.LaonAmount) / 50000000)

                      })
                    }}>بارگزاری مدارک</Button>
                  </div>
                }



              </div>


              <br />
            </div>



          </div>

        </div>
      );
    } else {
      return (
        <div></div>
      )

    }
  }
  ConvertNumToFarsi(text) {
    if (!text)
      return text;
    var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return text.toString().replace(/[0-9]/g, function (w) {
      return id[+w]
    });
  }
  componentDidMount() {

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        this.setState({
          UId: response.data.authData.userId
        })
        this.GetAccounts();
      })
      .catch(error => {
        this.GetAccounts();

      })

  }
  GetAccounts(RefreshVam) {
    let that = this;

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
        AccDialog: AccList.length > 1 ? 1 : 0,
        LaonAcc: AccList[0].value,
        LaonName: that.props.fullname || "",
        LaonMobile: that.props.mobile || "",
        ShowLoading: false
      })
      if (that.state.edit) {
        that.GetLaons()
      }

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
  SetLaon() {
    let that = this;
    if (!this.state.LaonName) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">نام را وارد کنید</div>, life: 4000 });

      return
    }
    if (!this.state.LaonAcc) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div><div className="YekanBakhFaMedium">شماره حساب را وارد کنید</div><br /><Link to={`${process.env.PUBLIC_URL}/New`} style={{ textDecoration: 'none', color: '#333' }}>افتتاح حساب</Link></div>, life: 4000 });

      return
    }
    let LaonAmount = this.state.LaonAmount.toString().replace(/,/g, "");
    debugger;
    if (!LaonAmount || LaonAmount.length < 3 ) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">مبلغ درخواستی را به طور صحیح وارد کنید</div>, life: 4000 });

      return
    }
    that.setState({
      loading: 1,
      disableForm:true
    })
    let param = {
      token: localStorage.getItem("api_token"),
      LaonAmount: parseInt(LaonAmount),
      LaonName: this.state.LaonName,
      LaonAcc: this.state.LaonAcc,
      LaonMobile: this.state.LaonMobile,
      UId: this.state.UId
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات با موفقیت انجام شد</div>, life: 4000 });

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0,
        disableForm:false
      })
      that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات انجام نشد</div>, life: 4000 });

      console.log(error)
    }
    this.Server.send("AdminApi/SetLaon", param, SCallBack, ECallBack)


  }
  GetLaons() {
    let that = this;
    that.setState({
      loading: 1
    })
    let param = {UId:this.state.UId};
    let SCallBack = function (response) {
      that.setState({
        GridDataLaon: response.data.result,
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetLaon", param, SCallBack, ECallBack)

  }
  EditLaon() {
    let that = this;

    
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedRow._id,
      status: this.state.selectedRow.status,
      LaonMobile: this.state.selectedRow.LaonMobile,
      EditByAdmin: false
    };
    
    param["ChequeList"] = []
    for (let m = 0; m < parseInt(this.state.ChequeNember); m++) {
      param["ChequeList"].push({})
    }
    let FillInputs=0;
    for (let state in this.state) {
      if (state.indexOf("InCheque") > -1) {
        if (state.indexOf("InChequeDate_") > -1)
          param["ChequeList"][parseInt(state.split("_")[1])][state.split("_")[0]] = this.state[state]?.local("fa").format("jYYYY/jM/jD")
        else
          param["ChequeList"][parseInt(state.split("_")[1])][state.split("_")[0]] = this.state[state]?.toString().replace(/,/g, "");
        
        FillInputs++;
      }
    }
    debugger;

    if(FillInputs < (this.state.ChequeNember*7)){
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">همه ی موارد درخواستی را تکمیل نمایید</div>, life: 4000 });

      return;
    }
    that.setState({
      loading: 1,
      disableForm:true
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        visibleLaonDialog: null
      })
      that.GetLaons();
      that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات با موفقیت انجام شد</div>, life: 4000 });

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0,
        disableForm:false
      })
      that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات انجام نشد</div>, life: 4000 });
      console.log(error)
    }
    this.Server.send("AdminApi/EditLaon", param, SCallBack, ECallBack)


  }
  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage', e.target.files[0]);
    formData.append('ExtraFile', 1);
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = parseInt((loaded * 100) / total)
        this.setState({
            showLoadedCount: 1,
            disableForm:true,
            loadedCount: percent
        })
        if (percent == "100") {
            this.setState({
                disableForm:false,
                showLoadedCount: 0
            })
        }

    }
    };
    
    axios.post(this.state.url2 + 'uploadFile', formData, config)
      .then((response) => {
        this.setState({
          ["InChequeImg_" + name.split("_")[1]]: this.state.absoluteUrl + response.data.split("public")[1]

        })
      })
      .catch((error) => {
        alert(error);
      });
  }
  render() {

    return (
      !this.state.ShowLoading ?
        <div>
          <Header ComponentName={this.state.edit ? "پیگیری وام" : "درخواست وام"} />
          <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
          {!this.state.edit ?
            <div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', flexDirection: 'column', padding: 8 }} >
              
              <div>
                <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>درخواست وام خود را ثبت کنید</p>
                <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>مراحل دریافت وام از طریق پیامک به اطلاع شما خواهد رسید</p>

              </div>
              <div style={{ textAlign: 'right' }}>
                <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>شماره حساب</label>
                <InputText disabled={this.state.disableForm} value={this.state.LaonAcc} keyboardType="default" name="LaonAcc" onChange={(text) => {
                  this.setState({
                    LaonAcc: text.target.value
                  })
                }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

              </div>
              <div style={{ textAlign: 'right', marginTop: 15 }}>
                <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>تلفن همراه</label>

                <InputText disabled={this.state.disableForm} value={this.state.LaonMobile} keyboardType="default" placeholder="" name="LaonMobile" onChange={(text) => {
                  this.setState({
                    LaonMobile: text.target.value
                  })
                }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

              </div>
              <div style={{ textAlign: 'right', marginTop: 15 }}>
                <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>نام و نام خانوادگی</label>

                <InputText disabled={this.state.disableForm} value={this.state.LaonName} keyboardType="default" placeholder="" name="LaonName" onChange={(text) => {
                  this.setState({
                    LaonName: text.target.value
                  })
                }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

              </div>
              <div style={{ textAlign: 'right', marginTop: 15 }}>
                <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>(ریال) مبلغ درخواستی</label>

                <InputText disabled={this.state.disableForm} value={this.state.LaonAmount} keyboardType="default" placeholder="" name="LaonAmount" onChange={(text) => {
                  this.setState({
                    LaonAmount:text.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")

                  })
                }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

              </div>
              <div style={{ textAlign: 'center' }}>
                <Button className="YekanBakhFaMedium"  disabled={this.state.disableForm} style={{ marginTop: 50, padding: 12 }}>
                  <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17, fontFamily: 'YekanBakhFaMedium' }}  onClick={() => this.SetLaon()} >{this.state.ButtonText}</span>
                </Button>
              </div>
            </div>
            :
            <div>
              <p className="YekanBakhFaMedium" style={{ textAlign: 'center' }}>در این بخش می توانید درخواست های وام آنلاین خود را مشاهده کنید</p>
              <DataView value={this.state.GridDataLaon} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplateLaon}></DataView>

            </div>
          }

          <Dialog header="بارگزاری مدارک" visible={this.state.visibleLaonDialog} maximized={true} onHide={() => {
            this.setState({
              visibleLaonDialog: false,
              disableForm:false
            })
          }} maximizable={false}>
            <div>
              <div>
                
                {this.state.selectedRow && this.state.selectedRow.ChequeList && this.state.selectedRow.ChequeList.map((item, index) => {
                  return (
                    <div className="row" style={{ alignItems: 'center', backgroundColor: "aliceblue", display: 'flex', direction: 'rtl', flexDirection: 'column' }}>
                      <div className="col-2">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>شماره چک : {item.InChequeNumber}</label>
                      </div>
                      <div className="col-2">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>نام صاحب چک : {item.InChequeName}</label>
                      </div>
                      <div className="col-2">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>کد ملی صاحب چک : {item.InChequeCode}</label>
                      </div>
                      <div className="col-2">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>نام بانک چک : {item.InChequeBank}</label>
                      </div>
                      <div className="col-2">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>تاریخ جک : {item.InChequeDate}</label>
                      </div>

                      <div className="col-3">
                        <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}>مبلغ چک : {item.InChequeAmount}</label>
                      </div>
                      <div className="col-3">
                        <img src={item.InChequeImg} style={{ height: 100 }} id={"InChequeImg_" + index} name={"InChequeImg_" + index} style={{ width: '100%', padding: 15 }} />
                      </div>

                    </div>

                  )

                })
                }
              </div>
              <div>
                {Array.from(Array(parseInt(this.state.ChequeNember)).keys()).map((item, index) => {
                  return (
                    <div className="row" style={{ alignItems: 'baseline', display: 'flex', flexDirection: 'column', direction: 'rtl', alignItems: 'flex-start' }}>
                      <div style={{ marginBottom: 10, width: '100%' }}>

                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }} keyboardType="default" placeholder="شماره چک" className="form-control irsans" autoComplete="off" type="text" id={"InChequeNumber_" + index} name={"InChequeNumber_" + index} value={this.state["chequeNumber_" + index]} onChange={(event) => { this.setState({ ["InChequeNumber_" + index]: event.target.value }) }} required="true" />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%' }} className="DatePicker">

                        <DatePicker
                          onChange={value => this.setState({ ["InChequeDate_" + index]: value })}
                          value={this.state["InChequeDate_" + index]}
                          style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}
                          isGregorian={false}
                          timePicker={false}
                          placeholder="تاریخ چک"
                          persianDigits={false}
                          disabled={this.state.disableForm}
                        />
                      </div>

                      <div style={{ marginBottom: 10, width: '100%' }}>
                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }} className="form-control irsans" keyboardType="default" placeholder="مبلغ چک (ریال)" autoComplete="off" type="text" id={"InChequeAmount_" + index} name={"InChequeAmount_" + index} value={this.state["InChequeAmount_" + index]} onChange={(event) => { this.setState({ ["InChequeAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%' }}>
                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }} className="form-control irsans" keyboardType="default" placeholder="نام صاحب چک" autoComplete="off" type="text" id={"InChequeName_" + index} name={"InChequeName_" + index} value={this.state["chequeName_" + index]} onChange={(event) => { this.setState({ ["InChequeName_" + index]: event.target.value }) }} required="true" />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%' }}>
                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }} className="form-control irsans" keyboardType="default" placeholder="کد ملی صاحب چک" autoComplete="off" type="text" id={"InChequeCode_" + index} name={"InChequeCode_" + index} value={this.state["InChequeCode_" + index]} onChange={(event) => { this.setState({ ["InChequeCode_" + index]: event.target.value }) }} required="true" />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%' }}>
                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }} className="form-control irsans" keyboardType="default" placeholder="نام بانک" autoComplete="off" type="text" id={"InChequeBank_" + index} name={"InChequeBank_" + index} value={this.state["InChequeBank_" + index]} onChange={(event) => { this.setState({ ["InChequeBank_" + index]: event.target.value }) }} required="true" />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%', marginTop: 15 }}>
                      <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>آپلود تصویر چک</label>

                        <InputText disabled={this.state.disableForm} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%' }} className="form-control yekan" keyboardType="default" placeholder="آپلود تصویر چک" autoComplete="off" onChange={this.FileUpload} type="file" id={"InChequeFile_" + index} name={"InChequeFile_" + index} />
                      </div>
                      <div style={{ marginBottom: 10, width: '100%' }}>

                        <img src={this.state["InChequeImg_" + index]} id={"InChequeImg_" + index} name={"InChequeImg_" + index} style={{ width: '100%' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              {this.state.showLoadedCount > 0 &&
                              <ProgressBar value={this.state.loadedCount} />
                }
              <div style={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
                <Button style={{ marginLeft: 5, marginTop: 10, padding: 12, fontFamily: 'YekanBakhFaMedium' }} color="primary" onClick={() => this.EditLaon()} >ثبت مدارک</Button>

              </div>






            </div>
          </Dialog>

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
export default connect(mapStateToProps)(reqVam)  

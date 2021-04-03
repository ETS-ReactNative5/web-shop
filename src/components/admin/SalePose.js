import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { parse } from 'query-string';

class SalePose extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetSale = this.SetSale.bind(this);
    this.GetSale = this.GetSale.bind(this);
    this.delSale = this.delSale.bind(this);

    this.state = {
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: "",
      IntroducedPrice: "",
      creditAmount:"",
      debtorAmount:"",
      Device_UnitAmount_Price_S90:"2300000",
      Device_UnitAmount_Price_S90_color:"2450000",
      Device_UnitAmount_Price_S910:"2850000",
      Device_UnitAmount_Price_S58:"1450000",
      Device_UnitAmount_Price_Verifone:"2650000",
      edit:false

    }

  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading: 1
    })
    let that = this;
    let SCallBack = function (response) {
      
      that.setState({
        user_Id: response.data.authData.userId,
        user: response.data.authData.name,
        loading: 0
      })

      that.GetSale();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetSale() {
    let that = this;
    let param = {
      _id: this.state.selectedId,
      customerName: this.state.customerName,
      mobile: this.state.mobile,
      customerFamily: this.state.customerFamily,
      user: this.state.user,
      type: this.state.type,
      totalAmount: this.state.totalAmount.toString().replace(/,/g, ""),
      offAmount : this.state.offAmount.toString().replace(/,/g, ""),
      cacheAmount: this.state.cacheAmount.toString().replace(/,/g, ""),
      getRegisterAmount: this.state.getRegisterAmount,
      model: this.state.model,
      finalDate: this.state.finalDate,
      Introduced: this.state.Introduced,
      IntroducedPrice: this.state.IntroducedPrice,
      creditAmount: this.state.creditAmount,
      debtorAmount: this.state.debtorAmount,
      IntroducedCombo: this.state.IntroducedCombo,
      chequeBox: this.state.chequeBox,
      DeviceBox: this.state.DeviceBox,
      edit:this.state.edit
    };
    for (let state in this.state) {
      if (state.indexOf("chequ") > -1 && state != "chequeBox") {
        param[state] = this.state[state]?.toString().replace(/,/g, "");
      }
    }
    for (let state in this.state) {
      if (state.indexOf("Device_") > -1 && state != "DeviceBox") {
        param[state] = this.state[state]?.toString().replace(/,/g, "");
      }
    }
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetSale();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("CompanyApi/setPoseSales", param, SCallBack, ECallBack)
  }
  CreateForm() {
    
    let cheque = {};
    let device = {};
    for (let state in this.state) {
      if (state.indexOf("chequ") > -1 && state != "chequeBox") {

        cheque[state] = ""
      }
    }
    for (let state in this.state) {
      if (state.indexOf("Device_") > -1 && state != "DeviceBox" && state.indexOf("UnitAmount") == -1) {

        device[state] = ""
      }
    }
    this.setState({
      visibleManageSale: true,
      customerName: '',
      mobile: '',
      customerFamily: '',
      type: '1',
      totalAmount: '',
      offAmount: 0,
      cacheAmount: '',
      getRegisterAmount: false,
      finalDate:'',
      selectedId: null,
      Introduced: '',
      IntroducedPrice: '',
      IntroducedCombo: '',
      edit:false,
      ...device,
      ...cheque,
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageSale: false,
      selectedId: null
    });

  }
  onHideMapsDialog(event) {
    this.setState({
      visibleManageMaps: false,
      HasErrorForMaps: null
    });

  }
  selectedComponentChange(value) {
    let that = this;
    var p = [];

    let cheque = {};
    let device = {};
    for (let v in value) {
      if (v.indexOf("chequ") > -1 && v != "chequeBox") {
        cheque[v] = value[v]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    }
    for (let v in value) {
      if (v.indexOf("Device_") > -1 && v != "DeviceBox") {
        device[v] = value[v]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    }
    this.setState({
      edit:true,
      visibleManageSale: true,
      customerName: value.customerName,
      mobile: value.mobile,
      customerFamily: value.customerFamily,
      user: value.user,
      type: value.type,
      totalAmount: value.totalAmount ? value.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '',
      offAmount: value.offAmount ? value.offAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '',
      cacheAmount: value.cacheAmount ? value.cacheAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '',
      getRegisterAmount: value.getRegisterAmount,
      finalDate:value.finalDate,
      selectedId: value._id,
      visibleManageSale: true,
      Introduced: value.Introduced,
      IntroducedPrice: value.IntroducedPrice,
      IntroducedCombo: value.IntroducedCombo,
      chequeNumber: value.chequeNumber,
      chequeBox: value.chequeBox,
      DeviceBox: value.DeviceBox,
      creditAmount:value.creditAmount,
      debtorAmount:value.debtorAmount,
      ...cheque,
      ...device
    })
  }
  GetSale() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      that.setState({
        GridDataSales: response.data.result
      })
      that.setState({
        loading: 0
      })
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("CompanyApi/getPoseSales", param, SCallBack, ECallBack)
  }
  delSale(rowData) {
    this.setState({
      visibleManageSale: false
    })
    confirmAlert({
      title: <span className="yekan">حذف کاربر</span>,
      message: <span className="yekan">  آیا از حذف  {rowData.name} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: rowData._id,
              del: 1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetSale();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("CompanyApi/setPoseSales", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetSale} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delFilter(rowData)}></i>;
    }
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ثبت</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست فروش دستگاههای کارت خوان</span></div>

            <DataTable responsive value={this.state.GridDataSales} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="customerName" header="نام " className="irsans" style={{ textAlign: "center" }} />
              <Column field="customerFamily" header="نام خانوادگی " className="irsans" style={{ textAlign: "center" }} />

              <Column field="totalAmount" header="مبلغ کل (تومان)" className="irsans" style={{ textAlign: "center" }} />
              <Column field="offAmount" header="تخفیف" className="irsans" style={{ textAlign: "center" }} />

              
              <Column field="cacheAmount" header="مبلغ نقدی (تومان)" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ثبت فروش جدید"} visible={this.state.visibleManageSale} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row">
              <div className="col-lg-3">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.customerName} name="customerName" onChange={(event) => this.setState({ customerName: event.target.value })} required="true" />
                  <label>نام خریدار</label>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.customerFamily} name="customerFamily" onChange={(event) => this.setState({ customerFamily: event.target.value })} required="true" />
                  <label>نام خانوادگی خریدار</label>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.mobile} name="mobile" onChange={(event) => this.setState({ mobile: event.target.value })} required="true" />
                  <label>تلفن همراه</label>
                </div>
              </div>
              <div className="col-lg-3">

                <div className="group">
                  <input className="form-control irsans" style={{ direction: 'ltr' }} placeholder="1300/01/01" autoComplete="off" type="text" value={this.state.finalDate} name="finalDate" onChange={(event) => this.setState({ finalDate: event.target.value })} required="true" />
                  <label >تاریخ تحویل</label>
                </div>
              </div>
              <div className="col-lg-3">
                <label className="labelNoGroup irsans">نوع</label>
                <select className="custom-select irsans" value={this.state.type} name="type" onChange={(event) => this.setState({ type: event.target.value,creditAmount:event.target.value == 4 ? 0 : this.state.creditAmount })} style={{ marginBottom: 20 }} >
                  <option value="1">نقد</option>
                  <option value="2">اقساط</option>
                  <option value="3">نقد-اقساط</option>
                  <option value="4">چک</option>
                </select>
              </div>

              <div className="col-lg-3">
                <label className="labelNoGroup irsans">معرف</label>
                <select className="custom-select irsans" value={this.state.IntroducedCombo} name="IntroducedCombo" onChange={(event) => {
                  let price = "50000";
                  if (event.target.value == "5")
                    price = "100000";
                  if (event.target.value == "6")
                    price = "";
                  this.setState({ IntroducedCombo: event.target.value, IntroducedPrice: price })
                }
                } style={{ marginBottom: 20 }} >
                  <option value="6">بدون معرف</option>
                  <option value="1">سعید جعفری</option>
                  <option value="2">ایمان کارگر</option>
                  <option value="3">حامد یزدانیان</option>
                  <option value="4">میلاد اورنگی</option>
                  <option value="5">بازاریاب</option>

                </select>
              </div>
              <div className="col-lg-3">
                {this.state.IntroducedCombo && this.state.IntroducedCombo == "5" &&

                  <div className="group">
                    <input className="form-control irsans" autoComplete="off" type="text" value={this.state.Introduced} name="Introduced" onChange={(event) => this.setState({ Introduced: event.target.value })} required="true" />
                    <label >نام بازاریاب</label>
                  </div>
                }
              </div>

              <div className="col-lg-3">

                <div className="group">
                  <input className="form-control irsans" disabled autoComplete="off" type="text" value={this.state.IntroducedPrice} name="IntroducedPrice" onChange={(event) => this.setState({ IntroducedPrice: event.target.value })} required="true" />
                  <label >سود معرف (تومان)</label>
                </div>
              </div>



              <div className="col-lg-12">
                <div className="group">
                  <input min={0} max={9} className="form-control irsans" style={{ width: 150 }} autoComplete="off" type="text" value={this.state.Device_Number} name="Device_Number" onChange={(event) => {
                    let that = this;
                    for(let i=0;i<event.target.value;i++){
                      this.setState({ ["Device_UnitAmount_" + i]: this.state["Device_UnitAmount_Price_S90"] });
                    }
                    this.setState({ Device_Number: event.target.value })
                    if (isNaN(parseInt(event.target.value)))
                      that.setState({ DeviceBox: [] })
                    else {
                      let Arr = Array.from(Array(parseInt(event.target.value)).keys());
                      setTimeout(function () { that.setState({ DeviceBox: Arr }) }, 0);
                    }

                  }} required="true" />
                  <label>تعداد دستگاه </label>
                </div>
              </div>
              {this.state.DeviceBox && this.state.DeviceBox.map((item, index) => {



                return (
                  <div className="col-12">
                    <div className="row">
                      <div className="col-lg-3">
                        <label className="labelNoGroup irsans">مدل دستگاه</label>
                        <select className="custom-select irsans" id={"Device_Model_" + index} name={"Device_Model_" + index} value={this.state["Device_Model_" + index]} onChange={(event) => {
                          this.setState({ ["Device_Model_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),["Device_UnitAmount_" + index]: this.state["Device_UnitAmount_Price_"+event.target.value],["Device_TotalAmount_" + index]: (this.state["Device_UnitAmount_Price_"+event.target.value] ? parseInt(this.state["Device_UnitAmount_Price_"+event.target.value].toString().replace(/,/g, "")) : 0) + (this.state["Device_RegisterAmount_" + index] ? parseInt(this.state["Device_RegisterAmount_" + index].toString().replace(/,/g, "")) : 0) }) 
                          }} style={{ marginBottom: 20 }} >
                          <option value="S90">S90</option>
                          <option value="S90_color">S90 (رنگی)</option>
                          <option value="S910">S910</option>
                          <option value="S58">S58</option>
                          <option value="Verifone">Verifone</option>
                        </select>
                      </div>

                      <div className="col-lg-3">
                        <div className="group">
                          <input className="form-control irsans" autoComplete="off"  type="text" id={"Device_RegisterAmount_" + index} name={"Device_RegisterAmount_" + index} value={this.state["Device_RegisterAmount_" + index]} onChange={(event) => {
                             let computedPrice =(parseInt(event.target.value.toString().replace(/,/g, "") || 0) + parseInt(this.state["Device_UnitAmount_" + index] ? this.state["Device_UnitAmount_" + index].toString().replace(/,/g, "") : 0))
                            this.setState({ creditAmount:'',cacheAmount:'',["Device_TotalAmount_" + index]: computedPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") , ["Device_RegisterAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
                            let that = this;
                            setTimeout(function(){
                              let totalPrice=0;
                              
                              for(let i=0;i<that.state.DeviceBox.length;i++){
                                totalPrice+= parseInt(that.state["Device_TotalAmount_" + i] ? that.state["Device_TotalAmount_" + i].toString().replace(/,/g, "") : 0)
                              }
                              that.setState({ totalAmount: totalPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")})

                            },0)
                            }} required="true" />
                          <label>هزینه ثبت نام (تومان)</label>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="group">
                          <input className="form-control irsans" autoComplete="off" disabled type="text" id={"Device_UnitAmount_" + index} name={"Device_UnitAmount_" + index} value={this.state["Device_UnitAmount_" + index]} onChange={(event) => {
                            let computedPrice = (parseInt(event.target.value.toString().replace(/,/g, "") || 0) + parseInt(this.state["Device_RegisterAmount_" + index] ? this.state["Device_RegisterAmount_" + index].toString().replace(/,/g, "") : 0));
                            this.setState({ creditAmount:'',cacheAmount:'',["Device_TotalAmount_" + index]: computedPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","), ["Device_UnitAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })
                            let that = this;
                            setTimeout(function(){
                              let totalPrice=0;
                              
                              for(let i=0;i<that.state.DeviceBox.length;i++){
                                totalPrice+= parseInt(that.state["Device_TotalAmount_" + i] ? that.state["Device_TotalAmount_" + i].toString().replace(/,/g, "") : 0)
                              }
                              that.setState({ totalAmount: totalPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")})

                            },0)
                            
                            
                          }} required="true" />
                          <label> قیمت واحد دستگاه (تومان)</label>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="group">
                          <input className="form-control irsans" disabled autoComplete="off" type="text" id={"Device_TotalAmount_" + index} name={"Device_TotalAmount_" + index} value={this.state["Device_TotalAmount_" + index]} onChange={(event) => { 
                            this.setState({ ["Device_TotalAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                          <label>مبلغ کل (تومان)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              }
              <div className="col-12">
                <div className="row">
                  <div className="col-lg-3">
                    {(this.state.type == "1" || this.state.type == "3" || this.state.type == "4") && this.state.totalAmount &&
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" value={this.state.cacheAmount} name="cacheAmount" onChange={(event) => this.setState({ creditAmount:(parseInt(this.state.totalAmount.toString().replace(/,/g, "")) - parseInt(this.state.offAmount.toString().replace(/,/g, "")) - parseInt(event.target.value.toString().replace(/,/g, ""))).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),cacheAmount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                        <label >مبلغ نقدی (تومان)</label>

                      </div>
                    }
                  </div>
                  <div className="col-lg-3">
                    {this.state.totalAmount &&
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" value={this.state.offAmount} name="offAmount" onChange={(event) => {
                          this.setState({ offAmount:event.target.value ? parseInt(event.target.value.toString().replace(/,/g, "")).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
                        })
                        let that = this;
                        setTimeout(function(){
                          let totalPrice=0;
                          
                          for(let i=0;i<that.state.DeviceBox.length;i++){
                            totalPrice+= parseInt(that.state["Device_TotalAmount_" + i] ? that.state["Device_TotalAmount_" + i].toString().replace(/,/g, "") : 0)
                          }
                          that.setState({ totalAmount: totalPrice - parseInt(that.state.offAmount.toString().replace(/,/g, "")),
                          creditAmount:totalPrice - parseInt(that.state.offAmount.toString().replace(/,/g, "")) - parseInt(that.state.cacheAmount.toString().replace(/,/g, ""))
                        })

                        },0)
                        }} required="true" />
                        <label >تخفیف</label>

                      </div>
                    }
                  </div>
                  <div className="col-lg-3">
                    {(this.state.type == "3" ) && this.state.totalAmount &&
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" disabled type="text" value={this.state.creditAmount} name="creditAmount" onChange={(event) => this.setState({ creditAmount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                        <label >مبلغ اقساطی (تومان)</label>

                      </div>
                    }
                  </div>
                  <div className="col-lg-3">
                    {(this.state.type == "3" || this.state.type == "4") && this.state.totalAmount &&
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off"  type="text" value={this.state.debtorAmount} name="debtorAmount" onChange={(event) => {this.setState({ debtorAmount: event.target.value ? event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0})
                        let that = this;
                      setTimeout(function(){
                        let totalPrice=0;
                        
                        for(let i=0;i<that.state.DeviceBox.length;i++){
                          totalPrice+= parseInt(that.state["Device_TotalAmount_" + i] ? that.state["Device_TotalAmount_" + i].toString().replace(/,/g, "") : 0)
                        }
                        that.setState({ totalAmount: totalPrice - (that.state.debtorAmount ? parseInt(that.state.debtorAmount.toString().replace(/,/g, "")) : 0)  })

                      },0)
                      }} required="true" />
                        <label >بدهکار (تومان)</label>

                      </div>
                    }
                  </div>
                  <div className="col-lg-3">
                    {this.state.Device_Number &&
                      <div className="group">
                        <input className="form-control irsans" disabled autoComplete="off" type="text" value={this.state.totalAmount} name="totalAmount" onChange={(event) => this.setState({ totalAmount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                        <label>مبلغ کل (تومان)</label>
                      </div>
                    }
                  </div>
                </div>
              </div>

              {this.state.type && this.state.type == "4" &&
                <div className="col-12" >
                  <div className="row">

                    <div className="col-lg-2 col-md-6 col-12">
                      <div className="group">
                        <input min={0} max={9} className="form-control irsans" autoComplete="off" type="text" value={this.state.chequeNumber} name="chequeNumber" onChange={(event) => {
                          let that = this;
                          this.setState({ chequeNumber: event.target.value })
                          if (isNaN(parseInt(event.target.value)))
                            that.setState({ chequeBox: [] })
                          else {
                            let Arr = Array.from(Array(parseInt(event.target.value)).keys());
                            setTimeout(function () { that.setState({ chequeBox: Arr }) }, 0);
                          }

                        }} required="true" />
                        <label>تعداد چک</label>
                      </div>
                    </div>
                    {this.state.chequeBox && this.state.chequeBox.map((item, index) => {
                      return (
                        <div className="col-12">
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="group">
                                <input className="form-control irsans" autoComplete="off" type="text" id={"chequeNumber_" + index} name={"chequeNumber_" + index} value={this.state["chequeNumber_" + index]} onChange={(event) => { this.setState({ ["chequeNumber_" + index]: event.target.value }) }} required="true" />
                                <label>شماره چک</label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="group">

                                <input className="form-control irsans" style={{ direction: 'ltr' }} placeholder="1300/01/01" autoComplete="off" type="text" id={"chequeDate_" + index} name={"chequeDate_" + index} value={this.state["chequeDate_" + index]} onChange={(event) => { this.setState({ ["chequeDate_" + index]: event.target.value }) }} required="true" />
                                <label>تاریخ چک</label>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="group">
                                <input className="form-control irsans" autoComplete="off" type="text" id={"chequeAmount_" + index} name={"chequeAmount_" + index} value={this.state["chequeAmount_" + index]} onChange={(event) => { this.setState({ ["chequeAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                                <label>مبلغ چک (تومان)</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                    }


                  </div>
                </div>
              }

            </div>
          </form>
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
  connect(mapStateToProps)(SalePose)
);

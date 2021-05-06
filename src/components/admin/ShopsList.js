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
import { Button } from 'reactstrap';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Checkbox } from 'primereact/checkbox';
import { MultiSelect } from 'primereact/multiselect';

class ShopsList extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      CategoryListForDropDown:[],
      GridDataUsers: [],
      GridDataFactors: [],
      selectedCommission: null,
      categories:null,
      selectedMainShop: null,
      AllowCredit: false,
      showInSite: false,
      selectedName: null,
      selectedAddress: null,
      selectedCall: null,
      selectedMobile: null,
      selectedSheba: null,
      selectedRaymandAcc:null,
      selectedId: null,
      visibleDialog: false,
      statusDesc: null,
      SellerId: null,
      LastAmount: 0,
      Time1_1:"",
      Time1_2:"",
      Time1_3:"",
      Time1_4:"",
      Time2_1:"",
      Time2_2:"",
      Time2_3:"",
      Time2_4:"",
      Time3_1:"",
      Time3_2:"",
      Time3_3:"",
      Time3_4:"",
      Time4_1:"",
      Time4_2:"",
      Time4_3:"",
      Time4_4:"",
      Time5_1:"",
      Time5_2:"",
      Time5_3:"",
      Time5_4:"",
      Time6_1:"",
      Time6_2:"",
      Time6_3:"",
      Time6_4:"",
      Time7_1:"",
      Time7_2:"",
      Time7_3:"",
      Time7_4:"",
      loading: 0

    }
    this.onHide = this.onHide.bind(this);
    this.selectedListChange = this.selectedListChange.bind(this);
    this.EditShopSelected = this.EditShopSelected.bind(this);


  }
  CatTOptionTemplate(option) {
    return (
      <div className="country-item">
        <div>{option.name}</div>
      </div>
    );
  }
  selectedCatTemplate(option, props) {
    if (option) {
      return (
        <div className="country-item country-item-value">
          <div>{option.name}</div>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
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
        SellerId: response.data.authData.userId,
        loading: 0
      })
      that.getSettings();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }

  onHide(event) {
    
    this.setState({
      selectedId: null,
      selectedName: null,
      selectedAddress: null,
      selectedCall: null,
      selectedMobile: null,
      selectedSheba:null,
      selectedRaymandAcc:null,
      selectedCommission: null,
      selectedMainShop: null,
      categories:null,
      AllowCredit: false,
      showInSite:false,
      CreditCommission: 0,
      paymentType:'',
      credit:0,
      MehrCommission:0,
      visibleDialog: false,
      PrepareTime: '',
      Opened: false,
      Time1_1:"",
      Time1_2:"",
      Time1_3:"",
      Time1_4:"",
      Time2_1:"",
      Time2_2:"",
      Time2_3:"",
      Time2_4:"",
      Time3_1:"",
      Time3_2:"",
      Time3_3:"",
      Time3_4:"",
      Time4_1:"",
      Time4_2:"",
      Time4_3:"",
      Time4_4:"",
      Time5_1:"",
      Time5_2:"",
      Time5_3:"",
      Time5_4:"",
      Time6_1:"",
      Time6_2:"",
      Time6_3:"",
      Time6_4:"",
      Time7_1:"",
      Time7_2:"",
      Time7_3:"",
      Time7_4:"",


    });
    this.GetShopList();
  }
  selectedListChange(value) {
    let that = this;
    var p = [];
        let Time = {};
        if (value.OpenedTime) {
          let Count=0;
          for (let i = 0; i < 7; i++) {
            if(value && value.OpenedTime[Count]){
              if(value.OpenedTime[Count]["day" + (i+1)]){

                for (let j = 0; j < value.OpenedTime[Count]["day" + (i+1)]?.length; j++) {
                  Time["Time" + (i+1) + "_" + (j + 1)] = value?.OpenedTime[Count]["day" + (i+1)][j];
                }
                Count++;             
              }
              
            }
            
          }
        }
    this.setState({
      visibleDialog: true,
      selectedId: value._id,
      selectedCommission: value.commission,
      categories: value.cats,
      selectedMainShop: value.main,
      AllowCredit: value.AllowCredit,
      showInSite: value.showInSite,
      CreditCommission: value.CreditCommission,
      paymentType: value.paymentType,
      credit: value.credit,
      MehrCommission: value.MehrCommission,
      selectedName: value.name,
      selectedAddress: value.address,
      selectedCall: value.call || "",
      selectedMobile: value.mobile || "",
      selectedSheba: value.Sheba || "",
      selectedRaymandAcc: value.RaymandAcc || "",
      PrepareTime: value.PrepareTime,
      Opened: value.Opened,
      ...Time
    })

  }
  getSettings() {
    let that = this;
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      if (response.data.result) {
        that.setState({
          ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
          SaleFromMultiShops: response.data.result[0] ? response.data.result[0].SaleFromMultiShops : false,
          Raymand: response.data.result[0] ? response.data.result[0].Raymand : false

        })
      }
      that.GetShopList();

    }, function (error) {
    })


  }
  GetShopList() {
    let that = this;
    let param = {

    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        GridDataFactors: response.data.result,
        loading: 0
      })
      that.GetCategory();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.GetCategory();
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
  }
  EditShopSelected() {
    let that = this;
    let Time=[];
    for (let s in this.state) {
      if (s == "Time1_1") {
        Time[0] = { day1: [this.state["Time1_1"], this.state["Time1_2"], this.state["Time1_3"], this.state["Time1_4"]] };
      }
      if (s == "Time2_1") {
        Time[1] = { day2: [this.state["Time2_1"], this.state["Time2_2"], this.state["Time2_3"], this.state["Time2_4"]] };
      }
      if (s == "Time3_1") {
        Time[2] = { day3: [this.state["Time3_1"], this.state["Time3_2"], this.state["Time3_3"], this.state["Time3_4"]] };
      }
      if (s == "Time4_1") {
        Time[3] = { day4: [this.state["Time4_1"], this.state["Time4_2"], this.state["Time4_3"], this.state["Time4_4"]] };
      }
      if (s == "Time5_1") {
        Time[4] = { day5: [this.state["Time5_1"], this.state["Time5_2"], this.state["Time5_3"], this.state["Time5_4"]] };
      }
      if (s == "Time6_1") {
        Time[5] = { day6: [this.state["Time6_1"], this.state["Time6_2"], this.state["Time6_3"], this.state["Time6_4"]] };
      }
      if (s == "Time7_1") {
        Time[6] = { day7: [this.state["Time7_1"], this.state["Time7_2"], this.state["Time7_3"], this.state["Time7_4"]] };
      }
    }
    let param = {
      token: localStorage.getItem("api_token"),
      address: this.state.selectedAddress,
      showInSite:this.state.showInSite,
      call: this.state.selectedCall,
      mobile: this.state.selectedMobile,
      Sheba: this.state.selectedSheba,
      RaymandAcc:this.state.selectedRaymandAcc,
      ShopId: this.state.selectedId,
      name: this.state.selectedName,
      commission: this.state.selectedCommission,
      main: this.state.selectedMainShop,
      AllowCredit: this.state.AllowCredit,
      CreditCommission: this.state.CreditCommission,
      paymentType: this.state.paymentType,
      credit: this.state.credit,
      MehrCommission: parseInt(this.state.MehrCommission),
      PrepareTime: this.state.PrepareTime,
      Opened: this.state.Opened,
      OpenedTime: Time,
      cats:this.state.categories,
      edit: "1",
      editByAdmin:"1"
    };
    that.setState({
      loading: 0
    })
    let SCallBack = function (response) {
      that.onHide();
      that.setState({
  
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error);
      that.setState({
        loading: 1
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
  }
  GetCategory() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
     
      let CatList = [];
      for (let i = 0; i < response.data.result.length; i++) {
        CatList.push({ name: response.data.result[i].name, value: response.data.result[i]._id })
      }
      that.setState({
        CategoryListForDropDown: CatList,
        loading: 0
      })
 
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
          <div className="col-12">
            <button className="btn btn-info irsans" onClick={() => this.setState({ visibleDialog: true })} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> ایجاد فروشگاه جدید </button>
          </div>

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >‍‍‍‍‍‍‍لیست فروشگاهها</span></div>

            <DataTable responsive resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedId} onSelectionChange={e => this.selectedListChange(e.value)} >
              <Column field="_id" header="شناسه فروشگاه" className="yekan" style={{ textAlign: "center" }} />
              <Column field="UserId" header="شناسه فروشنده" className="yekan" style={{ textAlign: "center" }} />
              <Column field="name" header="نام فروشگاه" className="yekan" style={{ textAlign: "center" }} />
              <Column field="address" header="آدرس" className="yekan" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>

        <Dialog header="مشخصات فروشگاه" visible={this.state.visibleDialog} style={{ width: '60vw' }} minY={70} onHide={this.onHide} maximizable={true}>
          <form  >
            <div className="row">

              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedName} name="selectedName" onChange={(event) => this.setState({ selectedName: event.target.value })} required="true" />
                  <label className="yekan">نام فروشگاه</label>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="group">

                  <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedAddress} name="selectedAddress" onChange={(event) => this.setState({ selectedAddress: event.target.value })} required="true" />
                  <label className="yekan">آدرس فروشگاه</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">

                  <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedCall} name="selectedCall" onChange={(event) => this.setState({ selectedCall: event.target.value })} required="true" />
                  <label className="yekan">اطلاعات تماس</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">

                  <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedMobile} name="selectedMobile" onChange={(event) => this.setState({ selectedMobile: event.target.value })} required="true" />
                  <label className="yekan">شماره تلفن همراه - جهت دریافت پیامک های مربوط به سفارشات</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">

                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedSheba} name="selectedSheba" onChange={(event) => this.setState({ selectedSheba: event.target.value })} required="true" />
                  <label className="yekan">شماره شبا</label>

                </div>
              </div>
              {this.state.Raymand &&
              <div className="col-lg-12">
                <div className="group">

                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedRaymandAcc} name="selectedRaymandAcc" onChange={(event) => this.setState({ selectedRaymandAcc: event.target.value })} required="true" />
                  <label className="yekan">شماره حساب صندوق قرض الحسنه</label>

                </div>
              </div>
            }

              
              
              
              {!this.state.ProductBase &&
                  <div className="col-7">
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.PrepareTime} name="PrepareTime" onChange={(event) => this.setState({ PrepareTime: event.target.value })} required="true" />
                      <label className="yekan">زمان تقریبی آماده سازی محصولات (دقیقه) </label>

                    </div>
                  </div>
                  }  
             
              
              <div className="col-lg-12" >
                <div style={{ paddingRight: 8, textAlign: 'right',display:'flex' }}>

                  <Checkbox inputId="laon" value={this.state.AllowCredit} checked={this.state.AllowCredit} onChange={e => this.setState({ AllowCredit: e.checked })}></Checkbox>
                  <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>متصل به کیف پول {this.state.Raymand ? '/ مهرکارت' : ''} </label>

                </div>
              </div>
              
              {this.state.AllowCredit &&
                <div className="col-lg-3">
                  <div className="group">

                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.MehrCommission} name="MehrCommission" onChange={(event) => this.setState({ MehrCommission: event.target.value })} required="true" />
                    <label className="yekan">کارمزد مهرکارت</label>

                  </div>
                </div>
              }
              {this.state.AllowCredit &&
                <div className="col-lg-3" >
                  <div className="group">

                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.CreditCommission} name="CreditCommission" onChange={(event) => this.setState({ CreditCommission: event.target.value })} required="true" />
                    <label className="yekan">کارمزد {this.state.selectedName}</label>

                  </div>
                </div>
              }
              {this.state.AllowCredit &&
                <div className="col-lg-3" >
                  <div className="group">

                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.credit} name="credit" onChange={(event) => this.setState({ credit: event.target.value })} required="true" />
                    <label className="yekan">موجودی مهر کارت  {this.state.selectedName}(تومان)</label>

                  </div>
                </div>
              }
              {this.state.AllowCredit &&
                <div className="col-lg-12" >
                  <div className="group">

                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.paymentType} name="paymentType" onChange={(event) => this.setState({ paymentType: event.target.value })} required="true" />
                    <label className="yekan">نحوه تسویه</label>

                  </div>
                </div>
              }
              <div className="col-lg-12" >
                <div style={{ paddingRight: 8, textAlign: 'right',display:'flex' }}>

                  <Checkbox inputId="laon" value={this.state.showInSite} checked={this.state.showInSite} onChange={e => this.setState({ showInSite: e.checked })}></Checkbox>
                  <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>نمایش در صفحه اول سایت</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div style={{ paddingRight: 8, textAlign: 'right',display:'flex' }}>

                  <Checkbox inputId="laon" value={this.state.selectedMainShop} checked={this.state.selectedMainShop} onChange={e => this.setState({ selectedMainShop: e.checked })}></Checkbox>
                  <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>فروشگاه اصلی</label>

                </div>
              </div>
              <div className="col-lg-12">
              <label className="labelNoGroup yekan">دسته بندی های مرتبط با فروشگاه</label>
              <MultiSelect value={this.state.categories} optionLabel="name" style={{width:'100%'}} optionValue="value" options={this.state.CategoryListForDropDown} onChange={(event) => { 
                          

                          this.setState({ categories: event.value  }) 
                          
                        }} />

              
              
              </div>
              {!this.state.ProductBase &&
                  <div className="col-lg-12 col-12">
                    <div style={{ paddingRight: 8, textAlign: 'right', display: 'flex' ,display:'flex' }} >
                      <Checkbox inputId="Opened" value={this.state.Opened} checked={this.state.Opened} onChange={e => this.setState({ Opened: e.checked })}></Checkbox>
                      <label className="yekan" style={{ paddingRight: 5, marginBottom: 0 }}>فروشگاه باز است</label>
                    </div>

                  </div>
                  }
                  {this.state.Opened && !this.state.ProductBase &&
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">شنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time1_1} name="Time1_1" onChange={(event) => this.setState({ Time1_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time1_2} name="Time1_2" onChange={(event) => this.setState({ Time1_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time1_3} name="Time1_3" onChange={(event) => this.setState({ Time1_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time1_4} name="Time1_4" onChange={(event) => this.setState({ Time1_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">یکشنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time2_1} name="Time2_1" onChange={(event) => this.setState({ Time2_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time2_2} name="Time2_2" onChange={(event) => this.setState({ Time2_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time2_3} name="Time2_3" onChange={(event) => this.setState({ Time2_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time2_4} name="Time2_4" onChange={(event) => this.setState({ Time2_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">دوشنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time3_1} name="Time3_1" onChange={(event) => this.setState({ Time3_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time3_2} name="Time3_2" onChange={(event) => this.setState({ Time3_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time3_3} name="Time3_3" onChange={(event) => this.setState({ Time3_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time3_4} name="Time3_4" onChange={(event) => this.setState({ Time3_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">سه شنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time4_1} name="Time4_1" onChange={(event) => this.setState({ Time4_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time4_2} name="Time4_2" onChange={(event) => this.setState({ Time4_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time4_3} name="Time4_3" onChange={(event) => this.setState({ Time4_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time4_4} name="Time4_4" onChange={(event) => this.setState({ Time4_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">چهارشنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time5_1} name="Time5_1" onChange={(event) => this.setState({ Time5_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time5_2} name="Time5_2" onChange={(event) => this.setState({ Time5_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time5_3} name="Time5_3" onChange={(event) => this.setState({ Time5_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time5_4} name="Time5_4" onChange={(event) => this.setState({ Time5_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">پنجشنبه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time6_1} name="Time6_1" onChange={(event) => this.setState({ Time6_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time6_2} name="Time6_2" onChange={(event) => this.setState({ Time6_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time6_3} name="Time6_3" onChange={(event) => this.setState({ Time6_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time6_4} name="Time6_4" onChange={(event) => this.setState({ Time6_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <label className="yekan">جمعه  </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time7_1} name="Time7_1" onChange={(event) => this.setState({ Time7_1: event.target.value })} required="true" />
                            <label className="yekan"> صبح ها از ساعت </label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time7_2} name="Time7_2" onChange={(event) => this.setState({ Time7_2: event.target.value })} required="true" />
                            <label className="yekan">صبح ها تا ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time7_3} name="Time7_3" onChange={(event) => this.setState({ Time7_3: event.target.value })} required="true" />
                            <label className="yekan">عصرها از ساعت</label>

                          </div>
                        </div>
                        <div className="col-lg-2 col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Time7_4} name="Time7_4" onChange={(event) => this.setState({ Time7_4: event.target.value })} required="true" />
                            <label className="yekan">عصرها تا ساعت</label>

                          </div>
                        </div>
                      </div>

                    </div>
                  }

              <div className="col-lg-12">
                <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.EditShopSelected}>ثبت اطلاعات</Button>
              </div>

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
  connect(mapStateToProps)(ShopsList)
);
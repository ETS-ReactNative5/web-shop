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
import ReactToPrint,{PrintContextConsumer } from 'react-to-print';
import { ComponentToPrint } from './../ComponentToPrint.js';

import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import Cities from './../Cities.js'
import { Fieldset } from 'primereact/fieldset';
import { MultiSelect } from 'primereact/multiselect';
import Mapir from "mapir-react-component";
import { data } from 'jquery';
let markerArray = new Array(), lat, lon;

const Api_Code = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIn0.eyJhdWQiOiIxMTY2NCIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIiwiaWF0IjoxNjA2NjQyOTU4LCJuYmYiOjE2MDY2NDI5NTgsImV4cCI6MTYwOTE0ODU1OCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.VSdlmcGeLgctdaKhNHycuQjk3AZoPovTnREv40kb5bQDBxRXSoXHhxNbQCLEAO6lLWE61Db2RMpT7KBK1gzsP0EWy4u6-19Ya9OJO39sGABrvEYmkIJ9k0MSdBvZCI8Uz9kLdmoU8Osfk31dMJY6Bo__KjK72kdzB7fuhMWskVvB_X7V_EgXu4ex_1rj79GtZc54qjw08trxHZ4MnCUu3-FUVhxHmeC9Qw85i1q-cvF8oFcU7WHD3AhrcnDt59DO-Qk9DXdxEENHIREdtw5KtzCkDlst8eK8tA-sNQ6d9VR06lIJH5IbXvYcDPb02oO8clAFiIDROBgUSUmrSso4cA";

const Maps = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        'x-api-key': Api_Code, //Mapir api key
        'Mapir-SDK': 'reactjs'
      },
    }
  }
});


class ShopInformation extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      name: null,
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      address: null,
      call: null,
      mobile:null,
      Sheba:null,
      RaymandAcc:null,
      about: null,
      user_id: null,
      ShopId: null,
      boxAcc: null,
      bankAcc: null,
      laon: true,
      lat: '32.777403',
      lon : '51.649219',
      cash: true,
      Message: null,
      pic1: '',
      currentImage: '',
      SubCities: [],
      SelectedSubCities: [],
      loading: 0,
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
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    this.getSettings();

    this.FileUpload = this.FileUpload.bind(this);
    this.reverseFunction = this.reverseFunction.bind(this);

    this.EditShopInformation = this.EditShopInformation.bind(this);

  }
  reverseFunction(map, e) {
    let that = this;
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`
    fetch(url,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Api_Code
        }
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          address: data.address,
          latitude:e.lngLat.lat,
          longitude: e.lngLat.lng
        })




      })
    const array = [];
    array.push(<Mapir.Marker
      coordinates={[e.lngLat.lng, e.lngLat.lat]}
      anchor="bottom">
    </Mapir.Marker>);
    markerArray = array;
    lat = e.lngLat.lat;
    lon = e.lngLat.lng;

  }
  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    if (name == "logoCopyRight")
      formData.append('logoCopyRight', "1");
    if (name == "SpecialPic")
      formData.append('SpecialPic', "1");
    formData.append('myImage', e.target.files[0]);
    if (this.state.ShopId) {
      formData.append('ShopId', this.state.ShopId);
    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(this.state.url + 'uploadFile', formData, config)
      .then((response) => {
        if (name == "file")
          this.setState({
            logo: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "logoCopyRight")
          this.setState({
            logoCopyRight: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "SpecialPic")
          this.setState({
            SpecialPic: this.state.absoluteUrl + response.data.split("public")[1]
          })

      })
      .catch((error) => {
        console.log(error);
      });
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
      that.getShopInformation();

    }, function (error) {
    })


  }
  getShopInformation() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.setState({
        loading: 0
      })
      that.setState({
        user_id: response1.data.authData.userId,
        ShopId: response1.data.authData.shopId
      })
      that.setState({
        loading: 1
      })
      that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.ShopId,getQrCode:1 }, function (response) {
        that.setState({
          loading: 0,
          barCode:response.data.svg
        })
        let Time = {};
        if (response.data.result[0].OpenedTime) {
          let Count=0;
          for (let i = 0; i < 7; i++) {
            if(response.data.result[0] && response.data.result[0].OpenedTime[Count]){
              if(response.data.result[0].OpenedTime[Count]["day" + (i+1)]){

                for (let j = 0; j < response.data.result[0].OpenedTime[Count]["day" + (i+1)]?.length; j++) {
                  Time["Time" + (i+1) + "_" + (j + 1)] = response.data.result[0]?.OpenedTime[Count]["day" + (i+1)][j];
                }
                Count++;             
              }
              
            }
            
          }
        }
    
        that.setState({
          ShopId: that.state.ShopId,
          address: response.data.result[0].address,
          latitude:response.data.result[0].latitude,
          longitude: response.data.result[0].longitude,
          SelectedCity: response.data.result[0].city,
          SelectedSubCity: response.data.result[0].subCity,
          SendToCity: response.data.result[0].SendToCity,
          SendToNearCity: response.data.result[0].SendToNearCity,
          SendToState: response.data.result[0].SendToState,
          SendToCountry: response.data.result[0].SendToCountry,
          FreeInExpensive: response.data.result[0].FreeInExpensive,
          SelectedSubCities: response.data.result[0].SelectedSubCities,
          call: response.data.result[0].call,
          mobile: response.data.result[0].mobile,
          Sheba: response.data.result[0].Sheba,
          RaymandAcc: response.data.result[0].RaymandAcc,
          about: response.data.result[0].about,
          user_id: response.data.result[0].UserId,
          name: response.data.result[0].name,
          bankAcc: response.data.result[0].bankAcc,
          boxAcc: response.data.result[0].boxAcc,
          cash: response.data.result[0].cash,
          laon: response.data.result[0].laon,
          main: response.data.result[0].main,
          AllowCredit: response.data.result[0].AllowCredit,
          PrepareTime: response.data.result[0].PrepareTime,
          Opened: response.data.result[0].Opened,
          CreditCommission: response.data.result[0].CreditCommission,
          logo: response.data.result[0].logo ? that.state.absoluteUrl + response.data.result[0].logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png",
          logoCopyRight: response.data.result[0].logoCopyRight ? that.state.absoluteUrl + response.data.result[0].logoCopyRight.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png",
          SpecialPic: response.data.result[0].SpecialPic ? that.state.absoluteUrl + response.data.result[0].SpecialPic.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png",
          ...Time

        })
      }, function (error) {
        that.setState({
          loading: 0
        })
        console.log(error)
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
  getResponse(value) {
    if (this.state.SelectedCity != value.SelectedCity) {
      this.setState({
        SelectedSubCities: []
      })
    }
    this.setState({
      SelectedCity: value.SelectedCity,
      SelectedSubCity: value.SelectedSubCity
    })
    if (value.SubCities && value.SubCities.length > 0) {
      let SubCities = [];
      for (let item of value.SubCities) {
        SubCities.push({ label: item, value: item })
      }
      SubCities.shift();
      this.setState({
        SubCities: SubCities
      })

    }
  }
  EditShopInformation() {
    let that = this;
    let Time = [];
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
      address: this.state.address,
      latitude:this.state.latitude,
      longitude: this.state.longitude,
      city: this.state.SelectedCity,
      subCity: this.state.SelectedSubCity,
      SendToCity: this.state.SendToCity,
      SendToNearCity: this.state.SendToNearCity,
      SendToState: this.state.SendToState,
      SendToCountry: this.state.SendToCountry,
      FreeInExpensive: this.state.FreeInExpensive,
      SelectedSubCities: this.state.SelectedSubCities,
      call: this.state.call,
      mobile: this.state.mobile,
      Sheba: this.state.Sheba,
      RaymandAcc: this.state.RaymandAcc,
      about: this.state.about,
      ShopId: this.state.ShopId,
      name: this.state.name,
      boxAcc: this.state.boxAcc,
      bankAcc: this.state.bankAcc,
      cash: this.state.cash,
      laon: this.state.laon,
      AllowCredit: this.state.AllowCredit,
      PrepareTime: this.state.PrepareTime,
      Opened: this.state.Opened,
      OpenedTime: Time,
      CreditCommission: this.state.CreditCommission,
      edit: "1"
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
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
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

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
          <div style={{ display: "none" }}>
          <ComponentToPrint param={this.state.printParam} printType={this.state.printType} ref={el => (this.componentRef = el)} />
          </div>
            <Panel header="ویرایش اطلاعات شخصی" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <form  >
                <div className="row">

                  <div className="col-lg-7">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                      <label className="yekan">نام فروشگاه</label>
                    </div>
                  </div>
                  

                  <div className="col-lg-7">
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.call} name="call" onChange={(event) => this.setState({ call: event.target.value })} required="true" />
                      <label className="yekan">اطلاعات تماس فروشگاه</label>

                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.mobile} name="mobile" onChange={(event) => this.setState({ mobile: event.target.value })} required="true" />
                      <label className="yekan">شماره تلفن همراه - جهت دریافت پیامک های مربوط به سفارشات</label>

                    </div>
                  </div>
                  {this.state.Raymand &&
                    <div className="col-lg-7">
                      <div className="group">

                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.RaymandAcc} name="RaymandAcc" onChange={(event) => this.setState({ RaymandAcc: event.target.value })} required="true" />
                        <label className="yekan">شماره حساب صندوق قرض الحسنه</label>

                      </div>
                    </div>
                  }
                  <div className="col-lg-7">
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Sheba} name="Sheba" onChange={(event) => this.setState({ Sheba: event.target.value })} required="true" />
                      <label className="yekan">شماره شبا</label>

                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.about} name="about" onChange={(event) => this.setState({ about: event.target.value })} required="true" />
                      <label className="yekan">درباره فروشگاه</label>

                    </div>
                  </div>
                  <div className="col-12">
                    <div style={{textAlign:'left'}} >
                      <img src={this.state.barCode} style={{width:300,marginBottom:30}} />
                      <ReactToPrint
                          content={() => this.componentRef}
                        >
                          <PrintContextConsumer>
                            {({ handlePrint }) => (
                              <i className="far fa-print d-md-block d-none"   onClick={()=>{
                                this.setState({
                                  printParam: this.state.barCode,
                                  printType:'QrCode'
                                })
                                setTimeout(function(){
                                  handlePrint();

                                },0)
                              }} style={{ cursor: 'pointer' }} aria-hidden="true"></i>
                            )}
                          </PrintContextConsumer>
                        </ReactToPrint>
                    </div>

                  </div>
                  <div className="col-12" style={{ marginTop: 50 }}>
                    <hr />
                  </div>
                  {!this.state.ProductBase &&
                  <div className="col-lg-12 col-12">
                    <div style={{ paddingRight: 8, textAlign: 'right', display: 'flex' }} >
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
                  {!this.state.ProductBase &&
                  <div className="col-12" style={{ marginTop: 50 }}>
                    <hr />
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
                  <div className="col-lg-7" style={{ marginTop: 10 }}>
                    <div style={{ paddingRight: 8, textAlign: 'right', display: 'flex' }} >
                      <Checkbox inputId="AllowCredit" value={this.state.AllowCredit} checked={this.state.AllowCredit} onChange={e => this.setState({ AllowCredit: e.checked })}></Checkbox>
                      <label className="yekan" style={{ paddingRight: 5, marginBottom: 0 }}>امکان پرداخت از  کیف پول {this.state.Raymand ? '/ مهرکارت' : ''} وجود دارد</label>
                    </div>
                  </div>
                  {this.state.AllowCredit &&
                    <div className="col-lg-6" >
                      <div className="row">
                        <div className="col-12">
                          <div className="group">

                            <input className="form-control yekan" autoComplete="off" type="text" value={this.state.CreditCommission} name="CreditCommission" onChange={(event) => this.setState({ CreditCommission: event.target.value })} required="true" />
                            <label className="yekan">کارمزد فروش اقساطی</label>

                          </div>
                        </div>
                      </div>

                    </div>
                  }
                  <div className="col-12" style={{ marginTop: 50 }}>
                    <hr />
                  </div>
                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div style={{ paddingRight: 8 }}>

                      <Checkbox inputId="laon" value={this.state.laon} checked={this.state.laon} onChange={e => this.setState({ laon: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label" style={{ paddingRight: 5 }}>فروش اقساطی</label>
                      <Checkbox inputId="cash" value={this.state.cash} checked={this.state.cash} onChange={e => this.setState({ cash: e.checked })} style={{ paddingRight: 10 }}></Checkbox>
                      <label htmlFor="cash" className="p-checkbox-label" style={{ paddingRight: 15 }}>فروش نقدی</label>
                    </div>
                  </div>

                  <div className="col-lg-12" style={{ marginTop: 20, display: 'none' }}>
                    <div style={{ paddingRight: 10 }}>

                      <p className="yekan">
                        شماره حساب های زیر جهت انجام تسویه حساب دوره ای استفاده می شود
                      </p>
                      <p className="yekan">
                        تسویه حساب با فروشندگان در روز پایانی هفته انجام می شود
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.boxAcc} name="boxAcc" onChange={(event) => this.setState({ boxAcc: event.target.value })} required="true" />
                      <label className="yekan">شماره حساب صندوق انصارالحسین خورزوق</label>

                    </div>
                  </div>
                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.bankAcc} name="bankAcc" onChange={(event) => this.setState({ bankAcc: event.target.value })} required="true" />
                      <label className="yekan">شماره حساب بانک</label>

                    </div>
                  </div>
                  {this.state.main &&
                    <div className="col-6" style={{ marginTop: 20 }} >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="SpecialPic" />
                        <label> آپلود تصویر اختصاصی</label>
                      </div>
                    </div>
                  }
                    <div className="col-6" style={{ marginTop: 20 }}>
                      <img src={this.state.SpecialPic} />
                    </div>
                  <div className="col-6" style={{ marginTop: 20 }} >
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file" />
                      <label>آپلود لوگو</label>
                    </div>
                  </div>
                  <div className="col-6" style={{ marginTop: 20 }}>
                    <img src={this.state.logo} />
                  </div>
                  {this.state.main &&
                    <div className="col-6" style={{ marginTop: 20 }} >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="logoCopyRight" />
                        <label> آپلود لوگو کپی رایت</label>
                      </div>
                    </div>
                  }
                  {this.state.main &&
                    <div className="col-6" style={{ marginTop: 20 }}>
                      <img src={this.state.logoCopyRight} />
                    </div>
                  }

                  <div className="col-12" style={{ marginTop: 20 }}>

                    <Fieldset legend="تنظیمات ارسال کالا" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                      <div className="row">
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToCity: e.checked })} checked={this.state.SendToCity}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال درون شهری</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToNearCity: e.checked })} checked={this.state.SendToNearCity}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال به شهرهای مجاور</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToState: e.checked })} checked={this.state.SendToState}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال درون استانی</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToCountry: e.checked })} checked={this.state.SendToCountry}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال سزاسری</label>
                        </div>
                        {this.state.SendToNearCity &&
                          <div className="col-12" style={{ marginTop: 20, marginBottom: 20 }}>
                            <p className="yekan">
                              شهرهای مجاور شهر خود را انتخاب کنید
                            </p>
                            <MultiSelect optionLabel="label" style={{ width: '100%' }} value={this.state.SelectedSubCities} options={this.state.SubCities} onChange={(e) => this.setState({ SelectedSubCities: e.value })} />

                          </div>
                        }

                        <div className="col-lg-12 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ FreeInExpensive: e.checked })} checked={this.state.FreeInExpensive}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>برای خریدهای با مبلغ زیاد هزینه پیک رایگان شود</label>
                        </div>
                        <div className="col-lg-7">
                    <div className="group">

                      <Cities callback={this.getResponse.bind(this)} callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity} />


                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div style={{ marginTop: 30, overflow: 'hidden' }}>
                      <label className="yekan" style={{margin:20}}>آدرس فروشگاه : {this.state.address}</label>
                      <Mapir
                      center={[this.state.longitude || this.state.lon,  this.state.latitude  || this.state.lat]}
                      onClick={this.reverseFunction}
                      Map={Maps}
                      userLocation

                    >
                      {this.state.markerArray}
                    </Mapir>
                    </div>
                    <div className="group" style={{display:'none'}}>

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.address} name="address" onChange={(event) => this.setState({ address: event.target.value })} required="true" />
                      <label className="yekan">آدرس فروشگاه</label>

                    </div>
                  </div>

                      </div>
                    </Fieldset>
                  </div>

                  <div className="col-lg-12">
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.EditShopInformation}>ویرایش اطلاعات</Button>
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

              </form>
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
  connect(mapStateToProps)(ShopInformation)
);

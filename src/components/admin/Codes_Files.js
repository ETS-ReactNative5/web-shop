import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Codes_Files extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.selectedComponentChange = this.selectedComponentChange.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.onHideMapsDialog = this.onHideMapsDialog.bind(this);
    this.CreateForm = this.CreateForm.bind(this);
    this.handleChangeLName = this.handleChangeLName.bind(this);
    this.handleChangeFName = this.handleChangeFName.bind(this);
    this.SetCodes = this.SetCodes.bind(this);
    this.GetCodes = this.GetCodes.bind(this);
    this.handleChangeIcon = this.handleChangeIcon.bind(this);

    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      GridDataComponents: [],
      selectedId: null,
      selectedComponent: null,
      visibleManageComponent: false,
      visibleManageMaps: false,
      mapSelection: "",
      mapId: null,
      mapList: [],
      mapListTemp: [],
      CIds: [],
      SelectedComponents: [],
      HasErrorForMaps: null,
      FName: null,
      LName: null,
      Address: null,
      Icon: null,
      ComponentId: null,
      loading: 0,
      userid: null,
      CountArr:[],
      Count:0,
      param:{}

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
        userid: response.data.authData.userId,
        loading: 0
      })

      that.GetCodes();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }

  handleChangeIcon(event) {
    this.setState({ Icon: event.target.value });

  }
  handleChangeLName(event) {
    this.setState({ LName: event.target.value });

  }
  handleChangeFName(event) {
    this.setState({ FName: event.target.value });

  }

  SetCodes() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      title: this.state.title,
      Etitle: this.state.Etitle,
      PriceChange: this.state.PriceChange,
      MultiSelect: this.state.MultiSelect,
      id: this.state.id,

    };
    let Count=0;
    for (let state in this.state) {
      if (state.indexOf("value_") > -1 ) {
        Count++;
        param[state] = this.state[state];
      }
    }
    for (let state in this.state) {
      if (state.indexOf("desc_") > -1 ) {
        param[state] = this.state[state];
      }
    }
    param.count=Count;
    
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.GetCodes();
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetCodes", param, SCallBack, ECallBack)
  }
  CreateForm() {
    let state={};
    for(let i=0;i<200;i++){
        state["value_" + i] = undefined;
        state["desc_" + i] = undefined;
    }
    this.setState({
      visibleManageComponent: true,
      selectedId: null,
      selectedComponent: null,
      FName: "",
      LName: "",
      Address: "",
      PriceChange:false,
      MultiSelect:false,
      CountArr:[],
      Values:[],
      Icon: "",
      ComponentId: "",
      Count:0,
      ...state
    })
    

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageComponent: false,
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
    let state = {
      selectedId: value.id,
      id: value.id,
      title: value.title,
      Etitle: value.Etitle,
      PriceChange: value.PriceChange,
      MultiSelect: value.MultiSelect,
      Count: value?.values.length,
      Values: value?.values,
      CountArr: Array.from(Array(parseInt(value?.values.length)).keys()),
      visibleManageComponent: true
    }
    for(let i=0;i<value?.values.length;i++){
      if(value?.values[i]?.value != "" && value?.values[i]?.desc != ""){
        state["value_" + i] = value?.values[i]?.value;
        state["desc_" + i] = value?.values[i]?.desc;
      }
      
    }

    this.setState(state);

  }
  GetCodes(search) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      search:search||''
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        GridDataComponents: response.data.result
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
    this.Server.send("AdminApi/GetCodes", param, SCallBack, ECallBack)
  }

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetCodes} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>

            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >ثبت و ویرایش کدفایلها</span></div>
            <div className="row" style={{marginTop: "20px", marginBottom: "20px"}} >
            <div className="col-6" style={{ textAlign: 'right' }}>
                  <div className="p-inputgroup" dir="ltr">
                  <Button label="جستجو" onClick={() => this.GetCodes(this.state.search)}/>

                            <InputText placeholder="شناسه یا نام کد" style={{textAlign:'center'}}  value={this.state.search} name="search" onChange={(event)=>{this.setState({search:event.target.value})}}/>

                        </div>
              </div>
              <div className="col-6" style={{ textAlign: 'left' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px" }}> ساخت کدفایل جدید </button>
              </div>

            </div>
            <DataTable responsive value={this.state.GridDataComponents} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="id" header="شناسه" className="irsans" style={{ textAlign: "center" }} />
              <Column field="title" header="عنوان فارسی" className="irsans" style={{ textAlign: "center" }} />
              <Column field="Etitle" header="عنوان لاتین" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>

        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت کد جدید"} visible={this.state.visibleManageComponent}  footer={footer} minY={70} onHide={this.onHideFormsDialog}  maximized={true}>
            <div className="row">
            
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.id} name="id" onChange={(event)=>{this.setState({id:event.target.value})}} required="true" />
                  <label >شناسه کد</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.title} name="title" onChange={(event)=>{this.setState({title:event.target.value})}} required="true" />
                  <label>عنوان فارسی</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.Etitle} name="Etitle" onChange={(event)=>{this.setState({Etitle:event.target.value})}} required="true" />
                  <label>عنوان لاتین</label>
                </div>
              </div>
              <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ PriceChange: e.checked })} checked={this.state.PriceChange}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }} className="irsans">ثبت اختلاف قیمت</label>

              </div>
              <div className="col-12" style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Checkbox onChange={e => this.setState({ MultiSelect: e.checked })} checked={this.state.MultiSelect}></Checkbox>
                  <label style={{ paddingRight: 5, marginTop: 5 }} className="irsans">قابلیت انتخاب چند آیتم</label>

              </div>
              <div className="col-lg-12" style={{ marginTop: 20, marginRight: 5,textAlign:'right' }}>
                <button className="btn btn-secondary irsans" onClick={() => {
                  let Count = this.state.Count+1;
                  this.setState({
                    Count: Count
                  })
                  let that = this;
                    let Arr = Array.from(Array(parseInt(Count)).keys())
                    that.setState({
                      CountArr: Arr
                    })
                }
                } style={{ textAlign: 'right',cursor:'pointer' }}><i className="fa fa-plus" /><span style={{ marginRight: 10 }}> اضافه کردن ردیف جدید </span>
              </button>
              
              </div>
              <div className="col-lg-12" >
              {this.state.CountArr.map((item, index) => {
                return (
                  <div className="row">
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control irsans" autoComplete="off" type="text" id={"value_" + index} name={"value_" + index} value={this.state["value_" + index]} onChange={(event) => { this.setState({ ["value_" + index]: event.target.value }) }} required="true" />
                      <label>کلید</label>
                    </div>
                    </div>
                    <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control irsans" autoComplete="off" type="text" id={"desc_" + index} name={"desc_" + index} value={this.state["desc_" + index]} onChange={(event) => { this.setState({ ["desc_" + index]: event.target.value }) }} required="true" />
                      <label>عنوان</label>
                    </div>
                  </div>
                  </div>
                )

              })
              }
              </div>

            </div>
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
  connect(mapStateToProps)(Codes_Files)
);

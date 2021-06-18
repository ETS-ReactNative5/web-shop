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
import { RadioButton } from 'primereact/radiobutton';


import JoditEditor from "jodit-react";
import { Sidebar } from 'primereact/sidebar';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
const config = {
  readonly: false // all options from https://xdsoft.net/jodit/doc/
}
class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.selectedComponentChange = this.selectedComponentChange.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.onHideMapsDialog = this.onHideMapsDialog.bind(this);
    this.CreateForm = this.CreateForm.bind(this);
    this.ManageMaps = this.ManageMaps.bind(this);
    this.handleChangeMapSelection = this.handleChangeMapSelection.bind(this);
    this.handleChangeMap = this.handleChangeMap.bind(this);
    this.ChangeComponentsCheckBoxs = this.ChangeComponentsCheckBoxs.bind(this);
    this.ChangeDetailCheckBoxs = this.ChangeDetailCheckBoxs.bind(this);

    
    this.handleChangeComponentId = this.handleChangeComponentId.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeLName = this.handleChangeLName.bind(this);
    this.handleChangeFName = this.handleChangeFName.bind(this);
    this.SetComponents = this.SetComponents.bind(this);
    this.handleChangeIcon = this.handleChangeIcon.bind(this);
    this.SetPermition = this.SetPermition.bind(this);
    this.test = this.test.bind(this);

    
    this.SetMaps = this.SetMaps.bind(this);

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
      permitions:{},
      mapSelection: "",
      mapId: null,
      mapList: [],
      mapListTemp: [],
      CIds: [],
      CountArr:[],
      SelectedComponents: [],
      SelectedDetails: [],
      HasErrorForMaps: null,
      FName: null,
      LName: null,
      Address: null,
      Icon: null,
      ComponentId: null,
      loading: 0,
      user_Id: null

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
        loading: 0
      })

      that.GetComponents();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  handleChangeComponentId(event) {
    this.setState({ ComponentId: event.target.value });

  }
  handleChangeAddress(event) {
    this.setState({ Address: event.target.value });

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
  ChangeComponentsCheckBoxs(e) {
    let SelectedComponents = this.state.SelectedComponents||[];
    if (e.checked)
      SelectedComponents.push(e.value);
    else
      SelectedComponents.splice(SelectedComponents.indexOf(e.value), 1);

    this.setState({
      SelectedComponents: SelectedComponents
    })

  }

  


  test(){
    debugger;
    let that = this;
    let param = {
      Token: 143659686977202,
      OrderId: 85939317,
      TerminalNo: 44925540,
      RRN: 725979514507,
      status: 0,
      TspToken: "00000000-0000-0000-0000-000000000000",
      HashCardNumber: "685018953F13F46D870BB4ED7F3DCAC3C44279EC41598CD29CD9E039D95517C1",
      Amount: 10000,
      SwAmount: 10000,
      STraceNo: 810694
    }
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.GetComments(that.state.Status ? 1 : 0);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/verification2", param, SCallBack, ECallBack)

  }
  ChangeDetailCheckBoxs(e) {
    let SelectedDetails = this.state.SelectedDetails;
    if (e.checked)
      SelectedDetails.push(e.value);
    else
      SelectedDetails.splice(SelectedDetails.indexOf(e.value), 1);

    this.setState({

      SelectedDetails: SelectedDetails
    })
  }
  handleChangeMapSelection(event) {
    var Components = [];
    var permitions = {};
    var mapListTemp = [];
    this.state.mapList.map(function (v, i) {
      mapListTemp[i] = v._id;
      if (event.target.value == v._id){
        Components = v.components;
        permitions = v.permitions||{};
      }
    })
    if (Components.length > 0) {
      this.state.SelectedComponents = Components;
    }
    let firstForm="";
    for(let list of this.state.mapList){
      if(list._id == event.target.value)
        firstForm = list.firstForm||"";
    }
    this.setState({
      mapSelection: event.target.value,
      mapId: event.target.value,
      mapListTemp: mapListTemp,
      firstForm:firstForm,
      permitions:permitions
    });  
  }
  handleChangeMap(event) {
    this.setState({ mapId: event.target.value });
  }
  SetMaps() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      mapId: this.state.mapId,
      firstForm:this.state.firstForm,
      components: this.state.SelectedComponents,
      permitions : this.state.permitions,
      edit: this.state.mapSelection == "" ? "0" : "1"
    };

    if (!this.state.mapId) {
      Alert.error('شماره دسترسی نمی تواند خالی باشد', 5000);

      return;
    }
    if (this.state.SelectedComponents.length == 0) {
      Alert.error('حداقل یکی از فرم ها را انتخاب کنید', 5000);

      return;
    }
    if (this.state.mapSelection != "" && this.state.mapId != this.state.mapSelection) {
      Alert.error('شماره دسترسی را نمی توانید تغییر دهید', 5000);

      return;
    }
    if ((this.state.mapSelection == "" && this.state.mapListTemp.indexOf(this.state.mapId) != -1) || (this.state.mapSelection == "" && this.state.mapId == "1000")) {
      Alert.error('شماره دسترسی قبلا ثبت شده است', 5000);

      return;
    }
    this.setState({
      HasErrorForMaps: null
    })
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideMapsDialog();
      that.GetMaps();
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
    this.Server.send("AdminApi/SetMaps", param, SCallBack, ECallBack)
  }
  SetComponents() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      FName: this.state.FName,
      LName: this.state.LName,
      ComponentId: this.state.ComponentId,
      selectedId: this.state.selectedId,
      Address: this.state.Address,
      Icon: this.state.Icon,
      Parent: this.state.Parent,
      IsTitle: this.state.IsTitle,
      IsReport: this.state.IsReport,
      help: this.state.help
    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetComponents();
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
    this.Server.send("AdminApi/SetComponents", param, SCallBack, ECallBack)
  }

  SetPermition(){

    let permitions=this.state.permitions||{};
    permitions[this.state.detailId] = this.state.SelectedDetails;
    this.setState({ 
      permitions:permitions,
      VisibleSideBar:false
    })

  }
  GetMaps() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      user_Id: this.state.user_Id
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        mapList: response.data.result
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
    this.Server.send("AdminApi/GetMaps", param, SCallBack, ECallBack)
  }
  ManageMaps() {
    this.setState({
      visibleManageMaps: true
    })
  }
  CreateForm() {
    this.setState({
      visibleManageComponent: true,
      selectedId: null,
      selectedComponent: null,
      FName: "",
      LName: "",
      Address: "",
      Icon: "",
      ComponentId: ""
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageComponent: false,
      selectedId: null,
      SelectedDetails:[]
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
    this.setState({
      selectedId: value._id,
      FName: value.FName,
      LName: value.LName,
      Address: value.Url,
      Icon: value.Icon,
      ComponentId: value.CId,
      IsTitle: value.IsTitle,
      IsReport: value.IsReport,
      help: value.help,
      Parent: value.Parent,
      visibleManageComponent: true
    })

  }
  GetComponents() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.GetMaps();
      var CIds = [];
      response.data.result.map(function (v, i) {
        CIds[i] = { CId: v.CId, name: v.FName,Details:v.Details };
      })
      that.setState({
        CIds: CIds,
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
    this.Server.send("AdminApi/GetComponents", param, SCallBack, ECallBack)
  }

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetComponents} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );
    const footerMap = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetMaps} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>
        {this.state.HasErrorForMaps ?
          <Alert color="danger" style={{ textAlign: "center" }} className="irsans">
            {this.state.HasErrorForMaps}
          </Alert>
          : <p></p>
        }
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
          <button  onClick={this.test} >تست</button>
          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> ساخت فرم جدید </button>
              </div>
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-info irsans" onClick={this.ManageMaps} style={{ width: "200px", marginTop: "20px", marginBottom: "20px", marginRight: 20 }}> مدیریت دسترسی ها </button>

              </div>
            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >فرم های سیستم مدیریت</span></div>

            <DataTable responsive value={this.state.GridDataComponents} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="CId" header="شماره کامپوننت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="FName" header="نام فارسی" className="irsans" style={{ textAlign: "center" }} />
              <Column field="LName" header="نام لاتین" className="irsans" style={{ textAlign: "center" }} />
              <Column field="Url" header="آدرس" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>
        <Dialog header="مدیریت دسترسی ها" visible={this.state.visibleManageMaps} width="800px" footer={footerMap} minY={70} onHide={this.onHideMapsDialog} maximizable={true}>

          <form >
            <div className="row">
              {this.state.mapList.length > 0 &&
                <div className="col-lg-4">
                  <label className="labelNoGroup irsans">دسترسی را انتخاب کنید</label>
                  <select className="custom-select irsans" value={this.state.mapSelection} name="mapSelection" onChange={this.handleChangeMapSelection} >
                    <option value="" ></option>

                    {
                      this.state.mapList && this.state.mapList.map((v, i) => {

                        return (<option value={v._id} >{v._id}</option>)
                      })
                    }
                  </select>
                </div>
              }
              <div className="col-lg-4">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.mapId} name="mapId" onChange={this.handleChangeMap} required="true" />
                  <label>دسترسی</label>
                </div>
              </div>
              <div className="col-lg-4">
                {this.state.mapSelection &&
                  <div>
                  <label className="labelNoGroup irsans">نخستین امکان پنل مدیریت</label>
                  <select className="custom-select irsans" value={this.state.firstForm} name="mapSelection" onChange={(event  )=>this.setState({firstForm:event.target.value})} >
                    <option value="" ></option>

                    {
                      this.state.CIds && this.state.CIds.map((v, i) => {
                        return (<option value={v.CId} >{v.name}</option>)
                      })
                    }
                  </select>
                  </div>
              }
              </div>

              {
                this.state.CIds && this.state.CIds.map((v, i) => {
                  let id = "cb" + v.CId;
                  return (
                    <div className="col-lg-4 " style={{ textAlign: 'right' }}>
                      <Checkbox inputId={id} value={v.CId} style={{ verticalAlign: 'text-bottom' }} onChange={this.ChangeComponentsCheckBoxs} checked={this.state.SelectedComponents.indexOf(v.CId) !== -1}></Checkbox>
                      <label htmlFor={id} className="irsans">{v.name}</label>
                      <label  style={{color:'blue',textDecoration:'underline',cursor:'pointer'}} onClick={()=>{
                        let state = [];
                        if (v.Details) {

                          v.Details.map(function (o, j) {
                                state["desc_" + j] = o.desc;
                                state["value_" + j] = Math.pow(2, j);
                            })
                            let Count = v.Details.length;
                            this.setState({
                                Count: Count
                            })
                            let that = this;
                            let Arr = Array.from(Array(parseInt(Count)).keys())
                            that.setState({
                                CountArr: Arr
                            })
                        }
                        this.setState({
                          detailId:v.CId,
                          SelectedDetails:this.state.permitions[v.CId]||[],
                          VisibleSideBar:true,
                          ...state
                        })
                      }} className="irsans">(جزئیات)</label>
                    </div>
                  )
                })
              }




            </div>
          </form>
          
        </Dialog>
        <Sidebar header="جزئیات دسترسی" visible={this.state.VisibleSideBar} style={{ fontFamily: 'YekanBakhFaBold' }}  onHide={() => this.setState({VisibleSideBar:false})}>
        <div style={{textAlign:'right',marginTop:30}} >
        
                    {this.state.CountArr.map((item, index) => {
                            let value = Math.pow(2, index);
                            return (
                              
                                <div className="row">
                                    <div className="col-lg-12">
                                    <div style={{marginTop:10,display:'flex',alignItems:'baseline'}}>
                                      <Checkbox inputId={"id_"+this.state["value_"+item]} value={this.state["value_"+item]} style={{ verticalAlign: 'text-bottom' }} onChange={this.ChangeDetailCheckBoxs} checked={this.state.SelectedDetails.indexOf(this.state["value_"+item]) !== -1} ></Checkbox>
                                     <label htmlFor={"id_"+this.state["value_"+item]} className="irsans">{this.state["desc_"+item] + "("+this.state["value_"+item]+")"}</label>
                                      </div>
                                  
                                </div>
                                </div>
                            )

                        })
                }
                 <button className="btn btn-primary irsans" onClick={this.SetPermition} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> ثبت اولیه </button>

                </div>
        
        
        
        
        </Sidebar>
        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت فرم جدید"} visible={this.state.visibleManageComponent} width="800px" footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={true}>
          <form>
            <div className="row">
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.ComponentId} name="ComponentId" onChange={this.handleChangeComponentId} required="true" />
                  <label >شماره کامپوننت</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.FName} name="FName" onChange={this.handleChangeFName} required="true" />
                  <label>نام فارسی</label>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.LName} name="LName" onChange={this.handleChangeLName} required="true" />
                  <label>نام لاتین</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.Address} name="Address" onChange={this.handleChangeAddress} required="true" />
                  <label>آدرس</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.Icon} name="Icon" onChange={this.handleChangeIcon} required="true" />
                  <label>آیکن</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div>
                  <label className="labelNoGroup irsans" style={{ marginTop: 10 }}>کامپوننت پدر</label>

                  <select className="custom-select irsans" value={this.state.Parent} name="Parent" onChange={(event) => this.setState({
                    Parent: event.target.value
                  })} >
                    <option value=""></option>
                    {
                      this.state.GridDataComponents && this.state.GridDataComponents.map((v, i) => {
                        return (<option value={v.CId} >{v.FName}</option>)
                      })
                    }
                  </select>
                </div>

              </div>
              <div className="col-12" style={{ textAlign: 'right' }} >
                <Checkbox inputId="IsTitle" value={this.state.IsTitle} checked={this.state.IsTitle} onChange={e => this.setState({ IsTitle: e.checked })} style={{ marginBottom: 10 }}></Checkbox>
                <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>عنوان مجموعه</label>
              </div>
              <div className="col-12" style={{ textAlign: 'right' }} >
                <Checkbox inputId="IsReport" value={this.state.IsReport} checked={this.state.IsReport} onChange={e => this.setState({ IsReport: e.checked })} style={{ marginBottom: 10 }}></Checkbox>
                <label htmlFor="IsReport" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>گزارش</label>
              </div>


            </div>
            <div className="row">

                  <div className="col-lg-12" style={{ marginTop: 10,textAlign:'right' }}>
                    <p className="yekan">راهنمای فرم</p>
                    <div className="group">
                      <JoditEditor
                        value={this.state.help}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={(value) => {
                          this.setState({ help: value })
                        }}
                      />

                    </div>
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
  connect(mapStateToProps)(Forms)
);

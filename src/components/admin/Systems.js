import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Panel } from 'primereact/panel';


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';
import {Multiselect} from 'multiselect-react-dropdown';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Systems extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetSystem = this.SetSystem.bind(this);

    this.state = {
      layout: 'list',
      name: "",
      ShopsList: [],
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: ""

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
      that.getSystems();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetSystem() {
    let that = this;
    
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      code: this.state.code,
      credit: this.state.credit.toString().replace(/,/g, ""),
      name: this.state.name,
      subSystem: this.state.subSystem
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.getSystems();
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
    this.Server.send("AdminApi/SetSystem", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      name: "",
      code: "",
      credit:0,
      selectedId: null,
      subSystem:true
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageField: false,
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
    
    
    this.setState({
      name: value.name,
      code: value.code,
      credit: value.credit ? value.credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0,
      subSystem: value.subSystem,
      selectedId: value._id,
      visibleManageField:true

    })

  }
  delField(rowData) {
    this.setState({
      visibleManageField: false
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
              that.getSystems();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetWallets", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  getSystems() {
    let that = this;
    let SCallBack = function (response) {
      that.setState({
        systems: response.data.result
      })
    };
    let ECallBack = function (error) {
    }
    this.Server.send("MainApi/getSystems", {}, SCallBack, ECallBack)
  }

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetSystem} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delField(rowData)}></i>;
    }
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center mt-5">

          <div className="col-12" style={{ background: '#fff' }}>
            <Panel header="لیست سیستم ها" style={{ textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>

              <div className="row" >
                <div className="col-6" style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت سیستم جدید</button>
                </div>

              </div>

              <DataTable responsive value={this.state.systems} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
                <Column field="code" header="شماره" className="irsans" style={{ textAlign: "center" }} />
                <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
                <Column field="subSystem" header="زیر سیستم" className="irsans" style={{ textAlign: "center" }} />
                <Column field="credit" header="موجودی" className="irsans" style={{ textAlign: "center" }} />
                <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
              </DataTable>
            </Panel>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت سیستم جدید"} visible={this.state.visibleManageField} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{ alignItems: 'baseline' }}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.code} name="code" onChange={(event) => this.setState({ code: event.target.value })} required="true" />
                  <label>شماره</label>
                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                  <label >عنوان فارسی</label>

                </div>
              </div>

              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.credit} name="credit" onChange={(event) => this.setState({ credit: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                  <label >اعتبار سیستم</label>

                </div>
              </div>
              
              <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', padding: 0 }}>
                <div class="group" style={{width:300,marginRight:20}} >
                  <Checkbox inputId="subSystem" value={this.state.subSystem} checked={this.state.subSystem} onChange={e => this.setState({ subSystem: e.checked })}></Checkbox>
                  <label htmlFor="subSystem" className="p-checkbox-label yekan" style={{ paddingRight:30 }}>زیر سیستم</label>
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
  connect(mapStateToProps)(Systems)
);

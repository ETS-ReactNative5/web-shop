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

class Create_Filter extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetFilters = this.SetFilters.bind(this);

    this.state = {
      layout: 'list',
      name: "",
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

      that.GetFilters();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetFilters() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      name: this.state.name,
      type: this.state.type,
      FId: this.state.FId,
      DbTableName: this.state.DbTableName,
      DBTableFieldLabel: this.state.DBTableFieldLabel,
      DBTableFieldValue: this.state.DBTableFieldValue,
      latinName: this.state.latinName
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetFilters();
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
    this.Server.send("AdminApi/SetFilters", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageFilter: true,
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      OutputField: "",
      latinName: "",
      selectedId: null
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageFilter: false,
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
    this.setState({
      name: value.name,
      type: value.type,
      FId: value.FId,
      DbTableName: value.DbTableName,
      latinName: value.latinName,
      DBTableFieldValue: value.DBTableFieldValue,
      DBTableFieldLabel: value.DBTableFieldLabel,
      selectedId: value._id,
      visibleManageFilter: true



    })

  }
  GetFilters() {
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
        GridDataFilters: response.data.result
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
    this.Server.send("AdminApi/GetFilters", param, SCallBack, ECallBack)
  }
  delFilter(rowData) {
    this.setState({
      visibleManageFilter:false
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
              del:1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetFilters();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetFilters", param, SCallBack, ECallBack)

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
        <button className="btn btn-primary irsans" onClick={this.SetFilters} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i class="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delFilter(rowData)}></i>;
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
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت فیلتر جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >فیلترهای گزارشات</span></div>

            <DataTable responsive value={this.state.GridDataFilters} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="FId" header="شماره فیلتر" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="type" header="نوع" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت فیلتر جدید"} visible={this.state.visibleManageFilter}  footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row">
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.FId} name="FId" onChange={(event) => this.setState({ FId: event.target.value })} required="true" />
                  <label>شماره فیلتر</label>
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
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.latinName} name="latinName" onChange={(event) => this.setState({ latinName: event.target.value })} required="true" />
                  <label>عنوان لاتین</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.DbTableName} name="DbTableName" onChange={(event) => this.setState({ DbTableName: event.target.value })} required="true" />
                  <label>نام دیتابیس</label>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.DBTableFieldValue} name="DBTableField" onChange={(event) => this.setState({ DBTableFieldValue: event.target.value })} required="true" />
                  <label>(value) نام فیلد دیتابیس</label>
                </div>
              </div>
              {(this.state.type=="3" || this.state.type=="4") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.DBTableFieldLabel} name="DBTableField" onChange={(event) => this.setState({ DBTableFieldLabel: event.target.value })} required="true" />
                  <label>(label) نام فیلد دیتابیس</label>
                </div>
              </div>
              }
              


              <div className="col-lg-12">
                <label className="labelNoGroup irsans">نوع</label>
                <select className="custom-select irsans" value={this.state.type} name="type" onChange={(event) => this.setState({ type: event.target.value })} style={{ marginBottom: 20 }} >
                  <option value="1">تکست باکس</option>
                  <option value="2">چک باکس</option>
                  <option value="3">کامبو باکس</option>
                  <option value="4">اتوکامپلت</option>
                  <option value="5">تاریخ</option>

                </select>
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
  connect(mapStateToProps)(Create_Filter)
);

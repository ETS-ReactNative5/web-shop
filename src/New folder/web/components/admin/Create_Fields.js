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

class Create_Fields extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetFields = this.SetFields.bind(this);

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

      that.GetFields();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetFields() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      name: this.state.name,
      type: this.state.type,
      FId: this.state.FId,
      DbTableName: this.state.DbTableName,
      DBTableFieldLabel: this.state.DBTableFieldLabel,
      Default : this.state.Default,
      CheckOkFields : this.state.CheckOkFields,
      CheckNOkFields: this.state.CheckNOkFields,
      Separator:this.state.Separator,
      readOnly:this.state.readOnly,
      hidden:this.state.hidden,
      required:this.state.required,
      CodeNum: this.state.CodeNum,
      DBTableFieldValue: this.state.DBTableFieldValue,
      latinName: this.state.latinName
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetFields();
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
    this.Server.send("AdminApi/SetFields", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
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
      CheckNOkFields : value.CheckNOkFields,
      CheckOkFields: value.CheckOkFields,
      Separator:value.Separator,
      readOnly:value.readOnly,
      hidden:value.hidden,
      required:value.required,
      Default : value.Default,
      CodeNum: value.CodeNum,
      selectedId: value._id,
      visibleManageField: true



    })

  }
  GetFields() {
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
        GridDataFields: response.data.result
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
    this.Server.send("AdminApi/GetFields", param, SCallBack, ECallBack)
  }
  delField(rowData) {
    this.setState({
      visibleManageField:false
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
              that.GetFields();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetFields", param, SCallBack, ECallBack)

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
        <button className="btn btn-primary irsans" onClick={this.SetFields} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت فیلد جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >فیلدهای گزارشات</span></div>

            <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="FId" header="شماره فیلد" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="type" header="نوع" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت فیلد جدید"} visible={this.state.visibleManageField}  footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{alignItems:'baseline'}}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.FId} name="FId" onChange={(event) => this.setState({ FId: event.target.value })} required="true" />
                  <label>شماره فیلد</label>
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
              {(this.state.type=="3" || this.state.type=="4") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.DBTableFieldValue} name="DBTableField" onChange={(event) => this.setState({ DBTableFieldValue: event.target.value })} required="true" />
                  <label>(value) نام فیلد دیتابیس</label>
                </div>
              </div>
              }
              {(this.state.type=="3" || this.state.type=="4") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.DBTableFieldLabel} name="DBTableField" onChange={(event) => this.setState({ DBTableFieldLabel: event.target.value })} required="true" />
                  <label>(label) نام فیلد دیتابیس</label>
                </div>
              </div>
              }
              {(this.state.type=="6") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.CodeNum} name="CodeNum" onChange={(event) => this.setState({ CodeNum: event.target.value })} required="true" />
                  <label>شماره کدفایل</label>
                </div>
              </div>
              }


              {(this.state.type=="2") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.CheckOkFields} name="CheckOkFields" onChange={(event) => this.setState({ CheckOkFields: event.target.value })} required="true" />
                  <label>شماره فیلدهای مخفی در حالت فعال</label>
                </div>
              </div>
              }
              {(this.state.type=="2") &&
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.CheckNOkFields} name="CheckNOkFields" onChange={(event) => this.setState({ CheckNOkFields: event.target.value })} required="true" />
                  <label>شماره فیلدهای مخفی در حالت غیر فعال</label>
                </div>
              </div>
              }
              {(this.state.type=="2") &&
              <div className="col-lg-6">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.Default} checked={this.state.Default} onChange={e => this.setState({ Default: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> فعال در حالت پیش فرض</label>
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
                  <option value="6">کدفایل</option>
                  <option value="7">آپلود فایل</option>


                </select>
              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.required} checked={this.state.required} onChange={e => this.setState({ required: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> اجباری</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.Separator} checked={this.state.Separator} onChange={e => this.setState({ Separator: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> جداکننده عدد</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.readOnly} checked={this.state.readOnly} onChange={e => this.setState({ readOnly: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> فقط قابل خواندن (readonly)</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.hidden} checked={this.state.hidden} onChange={e => this.setState({ hidden: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> مخفی</label>
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
  connect(mapStateToProps)(Create_Fields)
);

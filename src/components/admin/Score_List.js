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
import { confirmAlert } from 'react-confirm-alert';
import { MultiSelect } from 'primereact/multiselect';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Score_List extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetScores = this.SetScores.bind(this);

    this.state = {
      layout: 'list',
      name: "",
      ShopsList:[],
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
      that.getScoreList();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetScores() {
    let that = this;
    debugger;   
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      fTitle: this.state.fTitle,
      lTitle: this.state.lTitle,
      for: this.state.for,
      score: this.state.score,
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.getScoreList();
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
    this.Server.send("AdminApi/setScoreList", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      fTitle: "",
      lTitle: "",
      for: "",
      score: "",
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
      fTitle: value.fTitle,
      lTitle: value.lTitle,
      for: value.for,
      score: value.score,
      selectedId: value._id,
      visibleManageField: true



    })

  }
  getScoreList() {
    let that = this;
    debugger;
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
    this.Server.send("AdminApi/getScoreList", param, SCallBack, ECallBack)
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
              that.getScoreList();
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

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetScores} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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

          <div className="col-12" style={{ background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت ردیف جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست امتیازات</span></div>

            <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="fTitle" header="شماره" className="irsans" style={{ textAlign: "center" }} />
              <Column field="lTitle" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="score" header="امتیاز" className="irsans" style={{ textAlign: "center" }} />
              <Column field="for" header="به ازای" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت ردیف جدید"} visible={this.state.visibleManageField}  footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{alignItems:'baseline'}}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.fTitle} name="fTitle" onChange={(event) => this.setState({ fTitle: event.target.value })} required="true" />
                  <label>نام فارسی</label>
                </div>  
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.lTitle} name="lTitle" onChange={(event) => this.setState({ lTitle: event.target.value })} required="true" />
                  <label >نام لاتین</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.score} name="score" onChange={(event) => this.setState({ score: event.target.value })} required="true" />
                  <label>امتیاز</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.for} name="for" onChange={(event) => this.setState({ for: event.target.value })} required="true" />
                  <label>به ازای</label>
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
  connect(mapStateToProps)(Score_List)
);

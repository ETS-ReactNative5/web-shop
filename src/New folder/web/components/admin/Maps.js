import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Alert } from 'reactstrap';
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

import { connect } from 'react-redux';

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      GridDataUsers: [],
      GridDataFactors: [],
      visibleCreateUser: false,
      selectedId: null,
      selectedUser: null,
      levelFilter: null,
      level: "1",
      name: null,
      username: null,
      pass: null,
      pass2: null,
      username: null,
      status: null,
      map: null,
      HasError: null,
      mapList: []

    }
    this.GetUsers();
    this.onLevelChange = this.onLevelChange.bind(this);
    this.CreateUser = this.CreateUser.bind(this);
    this.onHide = this.onHide.bind(this);
    this.selectedUserChange = this.selectedUserChange.bind(this);
    this.handleChangeLevel = this.handleChangeLevel.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePass2 = this.handleChangePass2.bind(this);
    this.SetOrEditUser = this.SetOrEditUser.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeMap = this.handleChangeMap.bind(this);

  }

  GetMaps() {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function (response) {
      that.setState({
        mapList: response.data.result
      })
    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("AdminApi/GetMaps", param, SCallBack, ECallBack)
  }
  SetOrEditUser() {
    let that = this;
    if (this.state.pass != this.state.pass2) {
      this.setState({
        HasError: "کلمه عبور و تکرار آن متفاوت اند"
      })
      return;
    }
    this.setState({
      HasError: null
    })

    let param = {
      token: localStorage.getItem("api_token"),
      name: this.state.name,
      username: this.state.username,
      level: this.state.level,
      status: this.state.status,
      pass: this.state.pass,
      map: this.state.map
    };
    let SCallBack = function (response) {
      that.GetUsers();
      that.setState({
        visibleCreateUser: false
      })
    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("AdminApi/ManageUsers", param, SCallBack, ECallBack)
  }
  handleChangeLevel(event) {
    this.setState({ level: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  handleChangePass(event) {
    this.setState({ pass: event.target.value });
  }
  handleChangePass2(event) {
    this.setState({ pass2: event.target.value });
  }
  handleChangeStatus(event) {
    this.setState({ status: event.target.value });

  }
  handleChangeMap(event) {
    this.setState({ map: event.target.value });

  }

  onHide(event) {
    this.setState({
      visibleCreateUser: false,
      selectedId: null,
      name: "",
      level: "1",
      username: "",
      pass: "",
      pass2: "",
      HasError: null
    });

  }
  CreateUser() {
    this.setState({
      visibleCreateUser: true,
      selectedId: null,
      selectedUser: null
    })
  }
  Operation() {

  }
  onLevelChange(event) {
    this.dt.filter(event.value, 'level', 'equals');
    this.setState({ levelFilter: event.value });
  }
  selectedUserChange(value) {
    let that = this;
    var p = [];
    this.setState({
      selectedId: value._id,
      name: value.name,
      level: value.level == "کاربر" ? "0" : "1",
      username: value.username,
      pass: value.password,
      pass2: value.password,
      selectedUser: value.products,
      status: value.status == "فعال" ? "1" : "0",
      map: value.map,
      visibleCreateUser: true
    })

  }
  GetUsers() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    let SCallBack = function (response) {
      that.GetMaps();
      response.data.result.map(function (v, i) {
        if (v.level == "0")
          v.level = "کاربر";
        else
          v.level = "مدیر";
        if (v.status == "1")
          v.status = "فعال"
        else
          v.status = "غیر فعال";
      })
      that.setState({
        GridDataUsers: response.data.result
      })
    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("AdminApi/getuser", param, SCallBack, ECallBack)
  }

  render() {
    let level = [
      { label: 'همه', value: null },
      { label: 'مدیر', value: 'مدیر' },
      { label: 'کاربر', value: 'کاربر' }
    ];

    let levelFilter = <Dropdown style={{ width: '100%' }}
      value={this.state.levelFilter} options={level} className="irsans" onChange={this.onLevelChange} />
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetOrEditUser} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>
        {this.state.HasError ?
          <Alert color="danger" style={{ textAlign: "center" }} className="irsans">
            {this.state.HasError}
          </Alert>
          : <p></p>
        }
      </div>
    );
    return (

      <div style={{ direction: 'rtl' }}>
        <div className="row justify-content-center">

          <div className="col-12">
            <button className="btn btn-primary irsans" onClick={this.CreateUser} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> ساخت کاربر جدید </button>

            <h2 style={{ textAlign: "center", fontSize: "14px", marginTop: 15 }} className="irsans alert-primary">لیست اعضا</h2>
            <DataTable ref={(el) => this.dt = el} value={this.state.GridDataUsers} selectionMode="single" selection={this.state.selectedUser} onSelectionChange={e => this.selectedUserChange(e.value)}>
              <Column field="username" filter={true} filterMatchMode="contains" header="نام کاربری" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" filter={true} filterMatchMode="contains" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="status" header="وضعیت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="level" header="سطح" className="irsans" style={{ textAlign: "center" }} filter={true} filterMatchMode="contains" filterElement={levelFilter} />
              <Column field="map" header="دسترسی" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>
        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت کاربر جدید"} visible={this.state.visibleCreateUser} width="800px" footer={footer} minY={70} onHide={this.onHide} maximizable={true}>

          <form  >
            <div className="row">
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} required="true" />
                  <label >نام کاربری</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={this.handleChangeName} required="true" />
                  <label>نام و نام خانوادگی</label>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.pass} name="pass" onChange={this.handleChangePass} required="true" />
                  <label>رمز عبور</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.pass2} name="pass2" onChange={this.handleChangePass2} required="true" />
                  <label>تکرار رمز عبور</label>
                </div>
              </div>
              <div className="col-lg-4">
                <label className="labelNoGroup irsans">سطح</label>

                <select className="custom-select irsans" value={this.state.level} name="level" onChange={this.handleChangeLevel} >
                  <option value="1">مدیر</option>
                  <option value="0">کاربر</option>
                </select>
              </div>
              <div className="col-lg-4">
                <label className="labelNoGroup irsans">وضعیت</label>

                <select className="custom-select irsans" value={this.state.status} name="status" onChange={this.handleChangeStatus} >
                  <option value="1">فعال</option>
                  <option value="0">غیر فعال</option>
                </select>
              </div>
              {this.state.level == "1" &&
                <div className="col-lg-4">
                  <label className="labelNoGroup irsans">دسترسی</label>

                  <select className="custom-select irsans" value={this.state.map} name="map" onChange={this.handleChangeMap} >
                    {
                      this.state.mapList && this.state.mapList.map((v, i) => {

                        return (<option value={v._id} >{v._id}</option>)
                      })
                    }
                  </select>
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
    admin: state.admin
  }
}
export default withRouter(
  connect(mapStateToProps)(Maps)
);

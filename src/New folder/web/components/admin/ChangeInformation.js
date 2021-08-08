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
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class ChangeInformation extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      name: null,
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      username: null,
      pass: null,
      pass2: null,
      address: null,
      username: null,
      Message: null,
      loading: 0
    }
    this.getUser();
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePass2 = this.handleChangePass2.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeRaymandAcc = this.handleChangeRaymandAcc.bind(this);
    this.handleChangeRaymandUser = this.handleChangeRaymandUser.bind(this);
    this.Edituser = this.Edituser.bind(this);
    this.getSettings();

  }
  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        that.setState({
          CreditSupport: response.data.result[0].CreditSupport,
          Raymand: response.data.result[0].Raymand,
        })
      }




    }, function (error) {
      that.setState({
        loading: 0
      })

    })


  }
  getUser() {
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
        user_id: response1.data.authData.userId
      })
      that.setState({
        loading: 1
      })
      that.Server.send("AdminApi/getuserInformation", { user_id: that.state.user_id }, function (response) {
        that.setState({
          loading: 0
        })
        that.setState({
          username: response.data.result[0].username,
          pass: response.data.result[0].password,
          pass2: response.data.result[0].password,
          name: response.data.result[0].name,
          RaymandAcc:response.data.result[0].name,
          RaymandUser:response.data.result[0].RaymandUser,

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
  Edituser() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.username,
      pass: this.state.pass,
      name: this.state.name,
      RaymandUser: this.state.RaymandUser,
      RaymandAcc: this.state.RaymandAcc,
      MyAccount: "1",
      level: "1"
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
      Alert.danger('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/ManageUsers", param, SCallBack, ECallBack)
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
  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }

  handleChangeRaymandAcc(event){
    this.setState({ RaymandAcc: event.target.value });

  }
  handleChangeRaymandUser(event){
    this.setState({ RaymandUser: event.target.value });

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
            <Panel header="ویرایش اطلاعات شخصی" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <form  >
                <div className="row">
                  <div className="col-lg-6">
                    <div >
                      <label className="labelNoGroup yekan">نام کاربری</label>

                      <input className="form-control yekan" disabled autoComplete="off" type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.name} name="name" onChange={this.handleChangeName} required="true" />
                      <label className="yekan">نام و نام خانوادگی</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.pass} name="pass" onChange={this.handleChangePass} required="true" />
                      <label className="yekan">رمز عبور</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.pass2} name="pass2" onChange={this.handleChangePass2} required="true" />
                      <label className="yekan">تکرار رمز عبور</label>
                    </div>
                  </div>
                  {this.state.Raymand &&
                    <div className="col-lg-6">
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" value={this.state.RaymandAcc} name="RaymandAcc" onChange={this.handleChangeRaymandAcc} required="true" />
                        <label>شماره حساب صندوق قرض الحسنه</label>
                      </div>
                    </div>
                  }
                  {this.state.Raymand &&
                    <div className="col-lg-6">
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" value={this.state.RaymandUser} name="RaymandUser" onChange={this.handleChangeRaymandUser} required="true" />
                        <label>شماره مشتری صندوق قرض الحسنه</label>
                      </div>
                    </div>
                  }

                  <div className="col-lg-12">
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.Edituser}>ویرایش اطلاعات</Button>
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
  connect(mapStateToProps)(ChangeInformation)
);

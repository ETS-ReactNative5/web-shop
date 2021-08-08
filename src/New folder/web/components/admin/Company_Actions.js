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
import DatePicker from 'react-datepicker2';

class Company_Actions extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetAction = this.SetAction.bind(this);
    this.GetAction = this.GetAction.bind(this);
    this.delAction = this.delAction.bind(this);

    this.state = {
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: "",
      IntroducedPrice: "",
      creditAmount: "",
      debtorAmount: "",
      edit: false

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
        user: response.data.authData.name,
        username: response.data.authData.username,
        loading: 0
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
  SetAction() {
    let that = this;
    if(!this.state.Date.local("fa"))
      return;
    let param = {
      _id: this.state.selectedId,
      type: this.state.type,
      desc: this.state.desc,
      StartTime: this.state.StartTime,
      EndTime: this.state.EndTime,
      System: this.state.System,
      username:this.state.username,
      name:this.state.user,
      Date:this.state.Date.local("fa").format("jYYYY/jM/jD")
    };
    
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      if(response.data.error){
        that.setState({
          loading: 0
        })
        Alert.warning(response.data.error[0],5000);
        return;
      }
      that.onHideFormsDialog();
      that.GetAction();
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
    this.Server.send("CompanyApi/setUserAction", param, SCallBack, ECallBack)
  }
  CreateForm() {

    this.setState({
      visibleManageAction: true,
      desc: '',
      type: '',
      StartTime: '',
      EndTime: '',
      System: '',
      _id:null
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageAction: false,
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
    
    this.setState({
      edit: true,
      visibleManageAction: true,
      StartTime: value.StartTime,
      EndTime: value.EndTime,
      type: value.type,
      desc: value.desc,
      System: value.System,
      type: value.type,
      selectedId: value._id
    })
  }
  GetAction() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Date: this.state.Date.local("fa").format("jYYYY/jM/jD"),
      username:this.state.username
    };
    this.setState({
      loading: 1,
      visibleManageAction:false
    })
    let SCallBack = function (response) {
      that.setState({
        GridData: response.data.result
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
    this.Server.send("CompanyApi/getUserAction", param, SCallBack, ECallBack)
  }
  delAction(rowData) {
    this.setState({
      visibleManageAction: false
    })
    confirmAlert({
      title: <span className="yekan">حذف ردیف</span>,
      message: <span className="yekan">  آیا از حذف مطمئنید  </span>,
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
              that.GetAction();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("CompanyApi/setUserAction", param, SCallBack, ECallBack)

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
        <button className="btn btn-primary irsans" onClick={this.SetAction} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delAction(rowData)}></i>;
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
            <div className="row" style={{ alignItems: 'baseline' }} >
              <div className="col-3">
                <DatePicker
                  onChange={value => this.setState({ Date: value })}
                  value={this.state.Date}
                  isGregorian={false}
                  timePicker={false}
                  placeholder="تاریخ روز"

                /></div>
              <div className="col-3" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.GetAction} disabled={!this.state.Date} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>جستجو</button>
              </div>
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-info irsans" onClick={this.CreateForm} disabled={!this.state.Date} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ثبت</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >کارکردهای روز</span></div>

            <DataTable responsive value={this.state.GridData} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="StartTime" header="تاریخ شروع" className="irsans" style={{ textAlign: "center" }} />

              <Column field="EndTime" header="تاریخ پایان" className="irsans" style={{ textAlign: "center" }} />
              <Column field="System" header="سیستم" className="irsans" style={{ textAlign: "center" }} />

              <Column field="type" header="نوع" className="irsans" style={{ textAlign: "center" }} />
              <Column field="desc" header="توضیح" className="irsans" style={{ textAlign: "center" }} />

              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ثبت کارکرد"} visible={this.state.visibleManageAction} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={true} maximized={false}>
          <form>

            <div className="row">
              <div className="col-lg-3">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.StartTime} name="StartTime" onChange={(event) => this.setState({ StartTime: event.target.value })} required="true" />
                  <label>ساعت شروع</label>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.EndTime} name="EndTime" onChange={(event) => this.setState({ EndTime: event.target.value })} required="true" />
                  <label>ساعت پایان</label>
                </div>
              </div>

              <div className="col-lg-3">
                <label className="labelNoGroup irsans">سیستم</label>
                <select className="custom-select irsans" value={this.state.System} name="System" onChange={(event) => this.setState({ System: event.target.value })} style={{ marginBottom: 20 }} >
                  <option value=""></option>

                  <option value="آنیاشاپ">آنیاشاپ</option>
                  <option value="آنیافود">آنیافود</option>
                  <option value="آنیابوک">آنیابوک</option>
                  <option value="دستگاههای کارتخوان">دستگاههای کارتخوان</option>
                </select>
              </div>

              <div className="col-lg-3">
                <label className="labelNoGroup irsans">نوع کارکرد</label>
                <select className="custom-select irsans" value={this.state.type} name="type" onChange={(event) => this.setState({ type: event.target.value })} style={{ marginBottom: 20 }} >
                  <option value=""></option>
                  <option value="برنامه نویسی">برنامه نویسی</option>
                  <option value="بررسی و تحلیل">بررسی و تحلیل</option>
                  <option value="طراحی ui">طراحی ui</option>
                  <option value="ثبت و ویرایش اطلاعات">ثبت و ویرایش اطلاعات</option>
                  <option value="ماموریت درون شهری">ماموریت درون شهری</option>
                  <option value="فاقد کار">فاقد کار</option>
                </select>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={(event) => this.setState({ desc: event.target.value })} required="true" />
                  <label>توضیح</label>
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
  connect(mapStateToProps)(Company_Actions)
);

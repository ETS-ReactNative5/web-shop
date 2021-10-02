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

class Wallets extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetWallets = this.SetWallets.bind(this);

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
      that.GetShops();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  GetShops() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
        debugger;
      let ShopsList = [];
      for (let i = 0; i < response.data.result.length; i++) {
        ShopsList.push({ name: response.data.result[i].name, value: response.data.result[i]._id })
      }
      that.setState({
        ShopsList: ShopsList,
        loading: 0
      })
      that.GetWallets();


    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
      that.GetWallets();

    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)



  }
  SetWallets() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      WId: this.state.WId,
      name: this.state.name,
      latinName: this.state.latinName,
      shops: this.state.shops,
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetWallets();
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
    this.Server.send("AdminApi/SetWallets", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      name: "",
      WId: "",
      latinName: "",
      shops:[],
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
      WId: value.WId,
      latinName: value.latinName,
      shops: value.shops,
      selectedId: value._id,
      visibleManageField: true



    })

  }
  GetWallets() {
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
    this.Server.send("AdminApi/GetWallets", param, SCallBack, ECallBack)
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
              that.GetWallets();
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
        <button className="btn btn-primary irsans" onClick={this.SetWallets} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت کیف جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست کیف پولها</span></div>

            <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="WId" header="شماره" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت کیف جدید"} visible={this.state.visibleManageField}  footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{alignItems:'baseline'}}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.WId} name="WId" onChange={(event) => this.setState({ WId: event.target.value })} required="true" />
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
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.latinName} name="latinName" onChange={(event) => this.setState({ latinName: event.target.value })} required="true" />
                  <label>عنوان لاتین</label>
                </div>
              </div>
              <div className="col-lg-12">
                <label className="labelNoGroup yekan">فروشگاههای متصل به کیف</label>
                <MultiSelect value={this.state.shops} optionLabel="name" style={{ width: '100%' }} optionValue="value" options={this.state.ShopsList} onChange={(event) => {
                  this.setState({ shops: event.value })
                }} />


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
  connect(mapStateToProps)(Wallets)
);

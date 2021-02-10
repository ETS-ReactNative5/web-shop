import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Checkbox } from 'primereact/checkbox';

class ShopsList extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,

      GridDataUsers: [],
      GridDataFactors: [],
      selectedCommission: null,
      selectedMainShop: null,
      AllowCredit: false,
      selectedName: null,
      selectedAddress: null,
      selectedCall: null,
      selectedId: null,
      visibleDialog: false,
      statusDesc: null,
      SellerId: null,
      LastAmount: 0,
      loading: 0

    }
    this.onHide = this.onHide.bind(this);
    this.selectedListChange = this.selectedListChange.bind(this);
    this.EditShopSelected = this.EditShopSelected.bind(this);


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
        SellerId: response.data.authData.userId,
        loading: 0
      })

      that.GetShopList();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }

  onHide(event) {
    this.setState({
      selectedId: null,
      selectedName: null,
      selectedAddress: null,
      selectedCall: null,
      selectedCommission: null,
      selectedMainShop: null,
      AllowCredit: false,
      CreditCommission: 0,
      visibleDialog: false


    });
    this.GetShopList();
  }
  selectedListChange(value) {
    let that = this;
    var p = [];

    this.setState({
      visibleDialog: true,
      selectedId: value._id,
      selectedCommission: value.commission,
      selectedMainShop: value.main,
      AllowCredit: value.AllowCredit,
      CreditCommission: value.CreditCommission,
      selectedName: value.name,
      selectedAddress: value.address,
      selectedCall: value.call || ""
    })

  }
  GetShopList() {
    let that = this;
    let param = {

    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        GridDataFactors: response.data.result,
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
  }
  EditShopSelected() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      address: this.state.selectedAddress,
      call: this.state.selectedCall,
      ShopId: this.state.selectedId,
      name: this.state.selectedName,
      commission: this.state.selectedCommission,
      main: this.state.selectedMainShop,
      AllowCredit: this.state.AllowCredit,
      CreditCommission: this.state.CreditCommission,
      edit: "1"
    };
    that.setState({
      loading: 0
    })
    let SCallBack = function (response) {
      that.onHide();
      that.setState({
        loading: 1
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error);
      that.setState({
        loading: 1
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
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
          <div className="col-12">
            <button className="btn btn-info irsans" onClick={() => this.setState({ visibleDialog: true })} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> ایجاد فروشگاه جدید </button>
          </div>

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >‍‍‍‍‍‍‍لیست فروشگاهها</span></div>

            <DataTable responsive resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedId} onSelectionChange={e => this.selectedListChange(e.value)} >
              <Column field="_id" header="شناسه فروشگاه" className="yekan" style={{ textAlign: "center" }} />
              <Column field="UserId" header="شناسه فروشنده" className="yekan" style={{ textAlign: "center" }} />
              <Column field="name" header="نام فروشگاه" className="yekan" style={{ textAlign: "center" }} />
              <Column field="address" header="آدرس" className="yekan" style={{ textAlign: "center" }} />
              <Column field="commission" header="پورسانت" className="yekan" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>

        <Dialog header="جزئیات فاکتور" visible={this.state.visibleDialog} style={{ width: '60vw' }} minY={70} onHide={this.onHide} maximizable={true}>
          <form  >
            <div className="row">

              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedName} name="selectedName" onChange={(event) => this.setState({ selectedName: event.target.value })} required="true" />
                  <label className="yekan">نام فروشگاه</label>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="group">

                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedCommission} name="selectedCommission" onChange={(event) => this.setState({ selectedCommission: event.target.value })} required="true" />
                  <label className="yekan">پورسانت</label>

                </div>
              </div>

              <div className="col-lg-12">
                <div className="group">

                  <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedAddress} name="selectedAddress" onChange={(event) => this.setState({ selectedAddress: event.target.value })} required="true" />
                  <label className="yekan">آدرس فروشگاه</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">

                  <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.selectedCall} name="selectedCall" onChange={(event) => this.setState({ selectedCall: event.target.value })} required="true" />
                  <label className="yekan">اطلاعات تماس</label>

                </div>
              </div>
              {this.state.AllowCredit &&
                <div className="col-lg-3">
                  <div className="group">

                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.CreditCommission} name="CreditCommission" onChange={(event) => this.setState({ CreditCommission: event.target.value })} required="true" />
                    <label className="yekan">کارمزد فروش اقساطی</label>

                  </div>
                </div>
              }
              <div className="col-lg-12">
                <div style={{ paddingRight: 8, textAlign: 'right' }}>

                  <Checkbox inputId="laon" value={this.state.AllowCredit} checked={this.state.AllowCredit} onChange={e => this.setState({ AllowCredit: e.checked })}></Checkbox>
                  <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>به بخش فروش اقساطی متصل است</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div style={{ paddingRight: 8, textAlign: 'right' }}>

                  <Checkbox inputId="laon" value={this.state.selectedMainShop} checked={this.state.selectedMainShop} onChange={e => this.setState({ selectedMainShop: e.checked })}></Checkbox>
                  <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>فروشگاه اصلی</label>

                </div>
              </div>

              <div className="col-lg-12">
                <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.EditShopSelected}>ثیت اطلاعات</Button>
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
  connect(mapStateToProps)(ShopsList)
);
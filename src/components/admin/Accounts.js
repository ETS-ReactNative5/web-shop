import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";


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
import { SelectButton } from 'primereact/selectbutton';

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      Filter: 'All',
      selectedTransfer: null,
      visibleDialog: false,
      loading: 0

    }
    this.onHide = this.onHide.bind(this);

    this.GetTransfer = this.GetTransfer.bind(this);
    this.TransferManagement = this.TransferManagement.bind(this);
    this.selectedTransferChange = this.selectedTransferChange.bind(this);
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

      that.GetTransfer(that.state.Filter);

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
      visibleDialog: false


    });
    this.GetTransfer(this.state.Filter)
  }

  TransferManagement() {
    let that = this;

    this.setState({
      loading: 1
    })
    let status = 0;
    if (this.state.selectedStatus == "0") {
      status = 1;
    }
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      type: 'edit',
      status: status,
      statusDesc: status == "0" ? "درخواست شده" : "پرداخت شده"
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        selectedStatus: status,
        selectedStatusDesc: status == "0" ? "درخواست شده" : "پرداخت شده"

      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetTransfer", param, SCallBack, ECallBack)
  }
  delTransfer(rowData) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: rowData._id
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.GetTransfer(that.state.Filter);
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetTransfer", param, SCallBack, ECallBack)
  }
  GetTransfer(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      condition: Filter == "All" ? {} : { "status": parseInt(Filter) },
      isMainShop: this.state.isMainShop,
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        GridDataTransferReq: response.data.result
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetTransfer", param, SCallBack, ECallBack)
  }
  selectedTransferChange(value) {
    let that = this;
    this.setState({
      visibleDialog: true,
      selectedShopName: value.shop[0].name,
      selectedUserName: value.user[0].name,
      selectedStatus: value.status,
      selectedStatusDesc: value.statusDesc,
      selectedId: value._id,
      selectedDate: value.date,
      selectedPrice: value.price
    })

  }

  render() {
    const FilterItems = [
      { label: 'درخواست شده', value: '0' },
      { label: 'پرداخت شده', value: '1' },
      { label: 'همه', value: 'All' }


    ];
    const userTemplate = (rowData) => {
      return `${rowData.user[0] ? rowData.user[0].name: ''}`;
    }
    const shopTemplate = (rowData) => {
      return `${rowData.shop[0] ? rowData.shop[0].name : ''}`;
    }
    const delTemplate = (rowData) => {
      if (rowData.status == 0)
        return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delTransfer(rowData)}></i>;
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

            <div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ لیست درخواست های انتقال وجه </span> </div>
            <SelectButton value={this.state.Filter} options={FilterItems} style={{ fontFamily: 'Yekan', textAlign: 'right', marginBottom: 15 }} className="yekan" onChange={(e) => { this.setState({ Filter: e.value }); this.GetTransfer(e.value) }}></SelectButton>

            <DataTable responsive value={this.state.GridDataTransferReq} selectionMode="single" selection={this.state.selectedTransfer} onSelectionChange={e => { if (e.originalEvent.target.tagName != "I") this.selectedTransferChange(e.value) }}  >
              <Column field="price" header="مبلغ" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
              <Column field="user" body={userTemplate} header="نام فروشنده" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
              <Column field="shop" body={shopTemplate} header="نام فروشگاه" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
              <Column field="date" header="تاریخ" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
              <Column field="statusDesc" header="وضعیت" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
              <Column field="del" body={delTemplate} header="حذف درخواست" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />

            </DataTable>
          </div>

        </div>

        <Dialog header="جزئیات درخواست" visible={this.state.visibleDialog} style={{ width: '60vw' }} minY={70} onHide={this.onHide} maximizable={true}>
          <form  >
            <div className="row">
              <div className="col-12">
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className="yekan">نام  : </p><p className="yekan">{this.state.selectedShopName}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className="yekan">نام فروشگاه : </p><p className="yekan">{this.state.selectedShopName}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className="yekan">مبلغ : </p><p className="yekan">{this.state.selectedPrice}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className="yekan">تاریخ درخواست : </p><p className="yekan">{this.state.selectedDate}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <p className="yekan">وضعیت درخواست : </p>
                  {this.state.selectedStatus == 0 ?
                    <p className="yekan" style={{ color: 'red' }}>{this.state.selectedStatusDesc}</p>
                    :
                    <p className="yekan" style={{ color: 'green' }}>{this.state.selectedStatusDesc}</p>
                  }
                </div>
              </div>



              <div className="col-lg-12">
                <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" className="yekan" onClick={this.TransferManagement}>تغییر وضعیت</Button>
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
  connect(mapStateToProps)(Accounts)
);
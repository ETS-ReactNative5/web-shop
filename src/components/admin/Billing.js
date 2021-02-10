import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import './Billing.css'
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import Charts from '.././Charts.js'
import { Chip } from 'primereact/chip';
import { Alert } from 'rsuite';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OrganizationChart } from 'primereact/organizationchart';
import { InputNumber } from 'primereact/inputnumber';

const data = [{
  label: 'مراحل تسویه حساب',
  expanded: true,
  className: 'department-cfo',
  children: [
    {
      label: 'فروش نقدی',
      className: 'department-first-child',
      expanded: true,
      children: [
        {
          label: ' درخواست تسویه حساب',
          expanded: true,
          children: [
            {
              label: 'ثبت کد شبا حساب بانکی',
              expanded: true,
              children: [
                {
                  label: 'انتقال وجه به حساب پس از یک هفته کاری'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      label: 'فروش اعتباری',
      className: 'department-second-child',
      expanded: true,
      children: [
        {
          label: 'تسویه طبق قوانین قرض الحسنه انصار الهدی طی اقساط 5 ماهه'
        }
      ]
    }
  ]
}];
class Billing extends React.Component {

  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      LastAmount: 0,
      LastCredit: 0,
      loading: 0,
      SellerId: null,
      UserId: null,
      sheba: null,
      price: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    this.TransferReq = this.TransferReq.bind(this);
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        SellerId: response.data.authData.shopId,
        UserId: response.data.authData.userId
      })
      that.GetFactors("All");


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)


  }
  GetFactors(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: Filter,
      SellerId: this.state.SellerId,
      isMainShop: this.state.isMainShop
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        LastAmount: response.data.result.finalPrice,
        LastCredit: response.data.result.finalCredit
      })
      that.GetTransfer();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors", param, SCallBack, ECallBack)
  }
  persianNumber(input) {
    var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
    var string = (input + '').split('');
    var count = string.length;
    var num;
    for (var i = 0; i <= count; i++) {
      num = string[i];
      if (persian[num]) {
        string[i] = persian[num];
      }
    }
    return string.join('');
  }

  TransferReq() {
    let that = this;
    let price = this.state.price.toString().replace(/,/g, "");
    if (price == 0 || price > this.state.LastAmount || price == '' || isNaN(price) || this.state.sheba == '') {
      Alert.warning('مبلغ و کد شبا را به درستی وارد کنید', 5000);
      return;
    }
    if (this.state.sheba.toString().indexOf("IR") > -1) {
      Alert.warning("کد شبا باید فقط شامل اعداد باشد", 5000);
      return;
    }
    if (this.state.sheba == '' || this.state.sheba.toString().length != 24) {
      Alert.warning('کد شبا نادرست است', 5000);
      return;
    }
    this.setState({
      loading: 1
    })


    let param = {
      token: localStorage.getItem("api_token"),
      UserId: this.state.UserId,
      price: price,
      sheba: "IR" + this.state.sheba,
      SellerId: this.state.SellerId,
      status: 0,
      statusDesc: 'درخواست شده'
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.GetTransfer();

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
      that.GetTransfer();
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
  GetTransfer() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId,
      isMainShop: this.state.isMainShop,
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      for (let value of response.data.result) {
        value.price = value.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
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

  render() {
    const userTemplate = (rowData) => {
      return `${rowData.user[0].name}`;
    }
    const shopTemplate = (rowData) => {
      return `${rowData.shop[0].name}`;
    }
    const delTemplate = (rowData) => {
      if (rowData.status == 0)
        return <i class="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delTransfer(rowData)}></i>;
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
            <div className="row">
              <div className="col-md-6 col-12">
                {(this.state.LastCredit != 0 || this.state.LastAmount != 0) ?
                  <div>
                    <div style={{ marginTop: 100 }} className="row">
                      <Chip className="col-md-5 col-12 mt-0" style={{ fontFamily: 'Yekan' }} label={'موجودی نقدی : ' + this.persianNumber(this.state.LastAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + ' تومان'} />
                      <div className="col-md-2 col-0" ></div>
                      <Chip className="col-md-5 col-12 mt-md-0 mt-4" style={{ fontFamily: 'Yekan' }} label={'موجودی اعتباری : ' + this.persianNumber(this.state.LastCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + ' تومان'} />

                    </div>
                    <div className="mt-4">

                      <Charts data={[this.state.LastAmount, this.state.LastCredit]} />
                    </div>
                  </div>
                  :
                  <div style={{ textAlign: 'center', marginTop: 125 }}>
                    <p style={{ fontFamily: 'Yekan', fontSize: 25 }}>موجودی قابل برداشت : {this.persianNumber("0")} تومان</p>
                  </div>
                }

              </div>
              <div className="col-md-6 col-12">
                <div>

                </div>
              </div>
            </div>
            <div className="row" style={{ marginTop: 50, borderTop: '2px solid #eee' }}>
              <div className="col-md-7 col-12 orede-md-2 order-1" >
                <div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ درخواست واریز وجه </span> </div>

                <div className="row">
                  <div className="col-12">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.price} name="price" onChange={(event) => this.setState({ price: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                      <label>مبلغ </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="group">
                      <input className="form-control yekan" style={{ textAlign: 'left' }} autoComplete="off" placeholder="نمونه : 062960000000100324200001 " type="text" value={this.state.sheba} name="sheba" onChange={(event) => this.setState({ sheba: event.target.value })} required="true" />
                      <label>کد شبا </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary irsans" onClick={this.TransferReq} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}> ثبت درخواست </button>

                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ لیست ده درخواست آخر </span> </div>

                    <DataTable responsive value={this.state.GridDataTransferReq} selectionMode="single"   >
                      <Column field="price" header="مبلغ" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
                      <Column field="user" body={userTemplate} header="نام فروشنده" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
                      <Column field="shop" body={shopTemplate} header="نام فروشگاه" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
                      <Column field="date" header="تاریخ" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
                      <Column field="statusDesc" header="وضعیت" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />
                      <Column field="del" body={delTemplate} header="حذف درخواست" className="yekan" style={{ textAlign: "center", fontSize: 13 }} />

                    </DataTable>
                  </div>
                </div>

              </div>
              <div className="col-md-5 col-12 orede-md-1 order-2">
                <div style={{ marginTop: 20 }}>
                  <OrganizationChart value={data}></OrganizationChart>

                </div>
              </div>
            </div>




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
  connect(mapStateToProps)(Billing)
);

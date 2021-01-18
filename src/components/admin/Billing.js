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

import { OrganizationChart } from 'primereact/organizationchart';
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
      LastAmount:0,
      LastCredit:0,
      loading: 0,
      SellerId : null,
      UserId : null,
      sheba:null,
      price:0,
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
        SellerId : response.data.authData.shopId,
        UserId : response.data.authData.userId
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
  GetFactors(Filter){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      Filter:Filter,
      SellerId:this.state.SellerId,
      isMainShop:this.state.isMainShop
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      that.setState({
        LastAmount:response.data.result.finalPrice,
        LastCredit:response.data.result.finalCredit
      })
      that.GetTransfer();
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors",param,SCallBack,ECallBack)
  }
  persianNumber(input){
    var persian = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
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

   TransferReq(){
    let that = this;
    if(this.state.price == 0 || this.state.price > this.state.LastAmount  || this.state.price == '' || isNaN(this.state.price) || this.state.sheba == '')
    {
      Alert.warning('مبلغ و کد شبا را به درستی وارد کنید',5000);
      return;
    }
    if( this.state.sheba == '' || this.state.sheba.indexOf("IR") == -1 )
    {
      Alert.warning('کد شبا نادرست است',5000);
      return;
    }
    this.setState({
      loading:1
    })
    
    
    let param={
      token: localStorage.getItem("api_token"),
      UserId : this.state.UserId,
      price : this.state.price,
      sheba : this.state.sheba,
      SellerId:this.state.SellerId
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetTransfer",param,SCallBack,ECallBack)
   }
   GetTransfer(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      SellerId:this.state.SellerId,
      isMainShop:this.state.isMainShop
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      debugger;
      that.setState({
        loading:0
      })
      
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetTransfer",param,SCallBack,ECallBack)
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
          <div className="col-sm-3 col-md-4 col-lg-3 ">
            <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
          </div>
          <div className="col-lg-9 col-md-8 col-12" style={{ marginTop: 20, background: '#fff' }}>
          <div className="row">
              <div className="col-6">
                {(this.state.LastCredit != 0 || this.state.LastAmount != 0) ?
                  <div>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:100}}>
                    <Chip style={{fontFamily:'Yekan'}} label={'موجودی نقدی : ' +this.persianNumber(this.state.LastAmount.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان'}  />
                    <Chip style={{fontFamily:'Yekan'}} label={'موجودی اعتباری : ' +this.persianNumber(this.state.LastCredit.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان'}  />

                      </div>
                    <Charts data = {[this.state.LastAmount,this.state.LastCredit]}  />
                  </div>
                    :
                <div style={{textAlign:'center',marginTop:125}}>
                  <p style={{fontFamily:'Yekan',fontSize:25}}>موجودی قابل برداشت : {this.persianNumber("0")} تومان</p>
                </div>  
                  }

              </div>
              <div className="col-6">
                <div>

                </div>
              </div>
            </div>
            <div className="row" style={{marginTop:50,borderTop:'2px solid #eee'}}>
              <div className="col-6" >
              <div className="section-title " style={{ marginLeft: 10, marginRight: 10, textAlign: 'right' }}><span className="title iranyekanwebmedium" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ درخواست واریز وجه </span> </div>

                <div className="row">
                  <div className="col-12">
                  <div className="group">
                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.price} name="price" onChange={(event)=>this.setState({price:event.target.value})}  required="true" />
                  <label>مبلغ </label>
					        </div>
                  </div>
                  <div className="col-12">
                  <div className="group">
                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.sheba} name="sheba" onChange={(event)=>this.setState({sheba:event.target.value})}  required="true" />
                  <label>کد شبا </label>
					      </div>
                  </div>
                  <div className="col-12">
                  <button  className="btn btn-primary irsans" onClick={this.TransferReq}  style={{width:"200px",marginTop : "5px" , marginBottom : "5px"}}> ثبت درخواست </button>

                  </div>
                </div>

              </div>
              <div className="col-6">
                <div style={{marginTop:20}}>
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

import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment-jalaali'
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';

import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Server from '../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Dialog } from 'primereact/dialog';
import Button from 'reactstrap/lib/Button';
import CardSubtitle from 'reactstrap/lib/CardSubtitle';
const FilterItems = [
  { label: 'همه', value: 'All' },
  { label: 'درخواست اولیه', value: '0' },
  { label: 'تایید شده', value: '1' },
  { label: 'رد شده', value: '-1' },



];
class TransferReqs extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FieldRef = React.createRef();
    this.selectedRecordChange = this.selectedRecordChange.bind(this);
    this.toast = React.createRef();

   
    
    
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      confirm:false,
      active:false,
      Filter:"0",
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)

    }


  }
  selectedRecordChange(value) {
    


    this.setState({
      AccountNumber: value.AccountNumber,
      sign: value.sign,
      Amount: value.Amount,
      ShebaId: value.ShebaId,
      AccPersonName: value.AccPersonName,
      SelectedId : value._id,
      status : value.status,
      AccBankName : value.AccBankName,
      rejectReason: value.rejectReason,
      userMobile: value.userMobile,
      ReqDate : value.ReqDate,
      ReqTime : value.ReqTime,
      VisibleDialog:true

    })

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
      that.GetRecords("0");

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  onHideReserveDialog(event) {
    this.setState({
      visibleManageField: false,
      selectedId: null
    });

  }
  GetRecords(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      condition: Filter != "All" ? {status:parseInt(Filter)} : {status:{$in:[0,1,-1]}} 
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      for(let i=0;i<response.data.result.length;i++){
        response.data.result[i].Amount = response.data.result[i].Amount ? response.data.result[i].Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
      }
      that.setState({
        GridData: response.data.result,
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/getTransferReq", param, SCallBack, ECallBack)
  }
  EditRecord(){
    debugger;
    let that = this;
    
    that.setState({
      loading: 1
    })
    

    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.SelectedId,
      status: parseInt(this.state.status),
      rejectReason : this.state.status == -1 ? this.state.rejectReason  : '',
      mobile : this.state.userMobile,
      EditByAdmin:true
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        SelectedId:null
      })
      that.GetRecords(that.state.Filter);
      that.toast.current.show({ severity: 'success', summary: <div> عملیات با موفقیت انجام شد </div>, life: 8000 });

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({ severity: 'error', summary: <div> عملیات انجام نشد </div>, life: 8000 });
      console.log(error)
    }
    this.Server.send("AdminApi/setTransferReq", param, SCallBack, ECallBack)


  }
  render() {
   

 
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }

        <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

        <div style={{ textAlign: 'right', marginBottom: 10,marginTop:20 }}>
              <SelectButton value={this.state.Filter} options={FilterItems} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { 
                if(e.value != null){
                  this.setState({ Filter: e.value }); this.GetRecords(e.value) 

                }
                
              }}></SelectButton>

        </div>
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>
           
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} > لیست رکورد ها (تمام مبالغ به ریال است)</span></div>

            <DataTable responsive value={this.state.GridData} selectionMode="single" selection={this.state.selectedLaon} onSelectionChange={e => { this.selectedRecordChange(e.value) }} >
              <Column field="AccountNumber" header="شماره حساب درخواست کننده" className="irsans" style={{ textAlign: "center" }} />
              <Column field="username" header="نام کاربری درخواست کننده" className="irsans" style={{ textAlign: "center" }} />
              <Column field="Amount" header="مبلغ" className="irsans" style={{ textAlign: "center" }} />
              <Column field="ShebaId" header="شماره شبا" className="irsans" style={{ textAlign: "center" }} />
              <Column field="AccPersonName" header="صاحب حساب مقصد" className="irsans" style={{ textAlign: "center" }} />
              <Column field="AccBankName" header="بانک مقصد" className="irsans" style={{ textAlign: "center" }} />
              <Column field="ReqDate" header="تاریخ درخواست" className="irsans" style={{ textAlign: "center" }} />
              <Column field="ReqTime" header="زمان درخواست" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>

        <Dialog header="جزئیات وام" visible={this.state.SelectedId} style={{ width: '80vw' }} minY={70} onHide={()=>{
          this.setState({
            SelectedId:null
          })
        }} maximizable={true}>
          <div style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: 400 }}>
        
      
          <div className="row" style={{ background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right',alignItems:'baseline' }}>
                <div className="col-lg-3">
                              <label className="labelNoGroup irsans">وضعیت</label>
                              <select className="custom-select irsans" id="company" name="company" value={this.state.status} onChange={(event) => {
                                this.setState({status: event.target.value }) 
                                }} style={{ marginBottom: 20 }} >
                                <option value="-1">رد شده</option>
                                <option value="0">درخواست اولیه</option>
                                <option value="1">تایید شده</option>
                              </select>
                    </div>
                    
                    <div className="col-lg-12">
                    <div className="group">
                      <img src={this.state.sign} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true} autoComplete="off" type="text" value={this.state.AccountNumber} name="AccountNumber" onChange={(event)=>this.setState({ AccountNumber: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>شماره حساب صندوق</label>
                    </div>
                  </div>
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true} autoComplete="off" type="text" value={this.state.ShebaId} name="ShebaId" onChange={(event)=>this.setState({ ShebaId: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>شماره شبا مقصد</label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true}  autoComplete="off" type="text" value={this.state.AccPersonName} name="AccPersonName" onChange={(event)=>this.setState({ AccPersonName: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>صاحب حساب مقصد</label>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true}  autoComplete="off" type="text" value={this.state.AccBankName} name="AccBankName" onChange={(event)=>this.setState({ AccBankName: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>نام بانک مقصد</label>
                    </div>
                  </div>
                  
                  
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true} autoComplete="off" type="text" value={this.state.Amount} name="Amount" onChange={(event)=>this.setState({ Amount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} style={{ textAlign: 'right' }} required="true" />
                      <label>مبلغ درخواستی</label>
                    </div>
                  </div>
                  {this.state.status == -1 &&
                  <div className="col-lg-12">
                    <div className="group">
                        <input className="form-control YekanBakhFaBold"  autoComplete="off" type="text" value={this.state.rejectReason} name="rejectReason" onChange={(event)=>this.setState({ rejectReason: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                        <label>دلیل رد درخواست</label>
                    </div>
                  </div>
                  }
                  
                  
                  
                  

                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={()=>this.EditRecord()}>ویرایش درخواست</Button>

                  </div>

                  <div className="col-lg-12" style={{marginTop:50}}>
                    {(this.state.SelectedStatus == 2 || this.state.SelectedStatus == 1) &&
                    
                    <div>
                      مدارک بارگزاری شده


                      <div>

              {this.state.ChequeList && this.state.ChequeList.map((item,index)=>{
                return(
                  <div className="row" style={{alignItems:'center',backgroundColor:"aliceblue"}}>
                    <div className="col-2">
                      <label> شماره چک : </label> <label>{item.InChequeNumber}</label>
                    </div>
                    <div className="col-2">
                    <label> به نام : </label> <label>{item.InChequeName}</label>
                    </div>
                    <div className="col-2">
                    <label> تاریخ : </label><label>{item.InChequeDate}</label>
                    </div>
                    
                    <div className="col-3">
                    <label> مبلغ : </label><label>{item.InChequeAmount}</label>
                    </div>
                    <div className="col-3">
                      <img src={item.InChequeImg} style={{height:100}} id={"InChequeImg_" + index} name={"InChequeImg_" + index} />
                    </div>

                  </div>
                
                )

              })
              }
              </div>
                    </div>

                   
                    
                    }
                  </div>





                </div>

          </div>
          
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
  connect(mapStateToProps)(TransferReqs)
);

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

  { label: 'تایید نهایی', value: '1' },
  { label: 'عدم تایید', value: '-1' }



];
class SekeVam extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FieldRef = React.createRef();
    this.selectedLaonChange = this.selectedLaonChange.bind(this);
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
  selectedLaonChange(value) {
    this.setState({
      selectedName: value.name,
      SelectedMobile: value._id,
      selectedReason: value.VarReason,
      SelectedCode: value.codeMelli,
      SelectedReqAmount: this.convertNum(value.reqAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      SelectedTimeSuggestion: value.TimeSuggestion,
      SelectedId : value._id,
      SelectedStatus : value.status,
      OldStatus : value.status,
      selectedDescription : value.desc||"",
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
        response.data.result[i].readif = (i+1)
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
    this.Server.send("AdminApi/GetSekeVams", param, SCallBack, ECallBack)
  }
  EditRecord(){
    let that = this;
    
    
    let msg = "";
    let statusTitle=["عدم تایید","درخواست اولیه","تایید نهایی"];
    if(this.state.SelectedStatus == "1" && this.state.selectedDescription == "" ){
      that.toast.current.show({ severity: 'warn', summary: <div> زمان مراجعه را مشخص کنید </div>, life: 8000 });
      return;
    }
    else if(this.state.selectedDescription == "" ){
      that.toast.current.show({ severity: 'warn', summary: <div> توضیحی وارد کنید </div>, life: 8000 });
      return;
    }
    if(this.state.SelectedStatus == "-1")
      msg = "درخواست وام سکه شما به دلیل زیر توسط سیستم رد شده است" + "\n" + this.state.selectedDescription  + "\n" + "قرض الحسنه انصارالهدی" ;
    if(this.state.SelectedStatus == "1")
      msg = "وام سکه درخواستی شما تایید شده است " + "\n" + " جهت هماهنگی و خرید ، در تاریخ " + this.state.selectedDescription + "با شماره 09132688818 تماس حاصل نمایید"  ;
    that.setState({
        loading: 1
    })

    
    let param = {
      token: localStorage.getItem("api_token"),
      mobile: this.state.SelectedMobile,
      name: this.state.selectedName,
      VarReason: this.state.selectedReason,
      reqAmount: this.state.SelectedReqAmount.toString().replace(/,/g, ""),
      TimeSuggestion: this.state.SelectedTimeSuggestion,
      _id: this.state.SelectedId,
      desc: this.state.selectedDescription||"",
      status: parseInt(this.state.SelectedStatus),
      codeMelli: this.state.SelectedCode,
      OldStatus: parseInt(this.state.OldStatus),
      msg:msg,
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
    this.Server.send("AdminApi/EditSekeVam", param, SCallBack, ECallBack)


  }
  convertNum(str){
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
       latinNumbers  = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
     
        if(typeof str === 'string')
        {
          for(var i=0; i<10; i++)
          {
            str = str.replace(persianNumbers[i], i).replace(latinNumbers[i], i);
          }
        }
        return str;
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
        <p className="mt-5" style={{textAlign:'center',fontSize:30}}>درخواست های وام سکه</p>
        <div style={{ textAlign: 'right', marginBottom: 10,marginTop:20 }}>
              <SelectButton value={this.state.Filter} options={FilterItems} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { 
                if(e.value != null){
                  this.setState({ Filter: e.value }); this.GetRecords(e.value)
                }
                }}></SelectButton>

        </div>
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>
           
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست رکورد ها</span></div>

            <DataTable responsive value={this.state.GridData} paginator  rows={10} selectionMode="single" selection={this.state.selectedLaon} onSelectionChange={e => { this.selectedLaonChange(e.value) }} >
              <Column field="readif" header="ردیف" className="irsans" style={{ textAlign: "center",width:60 }} />
              <Column field="name" filter={true} header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="_id" filter={true} header="تلفن همراه" className="irsans" style={{ textAlign: "center" }} />
              <Column field="VarReason" filter={true} header="دلیل درخواست" className="irsans" style={{ textAlign: "center" }} />

              <Column field="TimeSuggestion" filter={true} header="زمان مراجعه" className="irsans" style={{ textAlign: "center" }} />

              <Column field="Date" header="تاریخ ثبت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="Time" header="زمان ثبت" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>

        </div>

        <Dialog header="جزئیات درخواست" visible={this.state.SelectedId} style={{ width: '80vw' }} minY={70} onHide={()=>{
          this.setState({
            SelectedId:null
          })
        }} maximizable={true}>
          <div style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: 400 }}>
            
          <div className="row" style={{ background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right',alignItems:'baseline' }}>
                <div className="col-lg-12">
                              <label className="labelNoGroup irsans">وضعیت</label>
                              <select className="custom-select irsans" id="company" name="company" value={this.state.SelectedStatus} onChange={(event) => {
                                this.setState({SelectedStatus: event.target.value }) 
                                }} style={{ marginBottom: 20 }} >
                                <option value="-1">عدم تایید</option>
                                <option value="0">درخواست اولیه</option>
                                <option value="1">تایید نهایی</option>
                              </select>
                    </div>
                    <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedName} name="selectedName" onChange={(event)=>this.setState({ selectedName: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>نام و نام خانوادگی</label>
                    </div>
                  </div>

                  
                  <div className="col-lg-6" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedMobile} name="SelectedMobile" onChange={(event)=>this.setState({ SelectedMobile: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>موبایل</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true} autoComplete="off" type="text" value={this.state.selectedReason} name="selectedReason" onChange={(event)=>this.setState({ selectedReason: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>دلیل درخواست</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedReqAmount} name="SelectedReqAmount" onChange={(event)=>this.setState({ SelectedReqAmount: event.target.value.reqAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} style={{ textAlign: 'right' }} required="true" />
                      <label>مبلغ درخواستی (تومان)</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" disabled={true} autoComplete="off" type="text" value={this.state.SelectedTimeSuggestion} name="SelectedTimeSuggestion" onChange={(event)=>this.setState({ SelectedTimeSuggestion: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>اولویت زمان مراجعه</label>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedCode} name="SelectedCode" onChange={(event)=>this.setState({ SelectedCode: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>کد ملی</label>
                    </div>
                  </div>
                  
                  
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedDescription} name="selectedDescription" onChange={(event)=>this.setState({ selectedDescription: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      {this.state.SelectedStatus == 1 ?
                      <label>زمان مراجعه</label>
                      :
                      <label>توضیح</label>
                      }
                    </div>
                  </div>
                  
                  

                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={()=>this.EditRecord()}>ویرایش درخواست</Button>

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
  connect(mapStateToProps)(SekeVam)
);

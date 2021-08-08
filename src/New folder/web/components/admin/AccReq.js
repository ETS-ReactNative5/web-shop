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
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
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
class AccReq extends React.Component {
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
    debugger;
    this.setState({
      selectedName: value.name,
      SelectedMobile: value.mobile,
      selectedAcc: value.number,
      SelectedCode: value.CodeMelli,
      SelectedCartPic: value.CartMelli_Pic,
      SelectedShenasnamePic: value.Shenasname_Pic,
      selectedUId: value.UId,
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
      that.GetAccs("0");

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
  GetAccs(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      condition: Filter != "All" ? {status:parseInt(Filter)} : {status:{$in:[0,1,-1]}} 
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
     
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
    this.Server.send("AdminApi/GetAccountReq", param, SCallBack, ECallBack)
  }
  EditAcc(){
    let that = this;
    
    
    let msg = "";
    let statusTitle=["عدم تایید","درخواست اولیه","تایید نهایی"];
    if(this.state.SelectedStatus == "1" && !this.state.selectedAcc){
      that.toast.current.show({ severity: 'warn', summary: <div> شماره حساب را وارد کنید </div>, life: 8000 });
      return;
    }
    if(this.state.SelectedStatus == "-1")
      msg = "درخواست افتتاح حساب شما توسط سیستم رد شده است . برای افتتاح حساب مجدد میتوانید به اپلیکیشن مراجعه کنید" + "\n" + this.state.selectedDescription||""  + "\n" ;
    if(this.state.SelectedStatus == "1")
      msg = "حساب شما در صندوق انصار الهدی ایجاد شد " + "\n" + "شماره حساب : " + this.state.selectedAcc +  + "\n" + this.state.selectedDescription||"" + "\n" ;
    that.setState({
        loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      mobile: this.state.SelectedMobile,
      name: this.state.selectedName,
      number: this.state.selectedAcc,
      _id: this.state.SelectedId,
      desc: this.state.selectedDescription||"",
      status: parseInt(this.state.SelectedStatus),
      CodeMelli: this.state.SelectedCode,
      OldStatus: parseInt(this.state.OldStatus),
      msg:msg,
      EditByAdmin:true
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        SelectedId:null
      })
      that.GetAccs(that.state.Filter);
      that.toast.current.show({ severity: 'success', summary: <div> عملیات با موفقیت انجام شد </div>, life: 8000 });

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({ severity: 'error', summary: <div> عملیات انجام نشد </div>, life: 8000 });
      console.log(error)
    }
    this.Server.send("AdminApi/EditAccountReq", param, SCallBack, ECallBack)


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
                  this.setState({ Filter: e.value }); this.GetAccs(e.value)
                }
                }}></SelectButton>

        </div>
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
           
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست رکورد ها</span></div>

            <DataTable responsive value={this.state.GridData} selectionMode="single" selection={this.state.selectedLaon} onSelectionChange={e => { this.selectedLaonChange(e.value) }} >
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="mobile" header="تلفن همراه" className="irsans" style={{ textAlign: "center" }} />

              <Column field="number" header="شماره حساب" className="irsans" style={{ textAlign: "center" }} />
              <Column field="RegDate" header="تاریخ ثبت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="RegTime" header="زمان ثبت" className="irsans" style={{ textAlign: "center" }} />

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
                <div className="col-lg-3">
                              <label className="labelNoGroup irsans">وضعیت</label>
                              <select className="custom-select irsans" id="company" name="company" value={this.state.SelectedStatus} onChange={(event) => {
                                this.setState({SelectedStatus: event.target.value }) 
                                }} style={{ marginBottom: 20 }} >
                                <option value="-1">عدم تایید</option>
                                <option value="0">درخواست اولیه</option>
                                <option value="1">تایید نهایی</option>
                              </select>
                    </div>
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedAcc} name="selectedAcc" onChange={(event)=>this.setState({ selectedAcc: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>شماره حساب صندوق</label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedCode} name="SelectedCode" onChange={(event)=>this.setState({ SelectedCode: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>کد ملی</label>
                    </div>
                  </div>
                  
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedName} name="selectedName" onChange={(event)=>this.setState({ selectedName: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>نام و نام خانوادگی</label>
                    </div>
                  </div>

                  
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedMobile} name="SelectedMobile" onChange={(event)=>this.setState({ SelectedMobile: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>موبایل</label>
                    </div>
                  </div>
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedDescription} name="selectedDescription" onChange={(event)=>this.setState({ selectedDescription: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>توضیح</label>
                    </div>
                  </div>
                  
                  

                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={()=>this.EditAcc()}>ویرایش درخواست</Button>

                  </div>

                  <div className="col-lg-12" style={{marginTop:50}}>
                    
                    <div>
                      مدارک بارگزاری شده


                      <div>

                <div className="row" style={{alignItems:'center',backgroundColor:"aliceblue"}}>
                    <div className="col-6">
                    <label> کپی کارت ملی : </label>
                      <img src={this.state.SelectedCartPic} style={{width:"100%",height:200}} id="SelectedShenasnamePic" name="SelectedShenasnamePic" />
                    </div>
                    <div className="col-6">
                    <label> کپی شناسنامه : </label>
                      <img src={this.state.SelectedShenasnamePic} style={{width:"100%",height:200}} id="SelectedShenasnamePic" name="SelectedShenasnamePic" />
                    </div>

                </div>
                </div>
                </div>

                   
                    
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
  connect(mapStateToProps)(AccReq)
);

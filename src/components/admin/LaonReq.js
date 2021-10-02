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

  { label: 'تایید اولیه', value: '1' },
  { label: 'تایید نهایی', value: '2' },
  { label: 'عدم تایید', value: '-1' }



];
class LaonReq extends React.Component {
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
      selectedName: value.LaonName,
      selectedAcc: value.LaonAcc,
      selectedAmount: value.LaonAmount,
      selectedUId: value.UId,
      SelectedId : value._id,
      SelectedStatus : value.status,
      ChequeList : value.ChequeList,
      OldStatus : value.status,
      SelectedLaonMobile : value.LaonMobile,
      selectedDescription : value.desc,

      needChange:value.needChange,
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
      that.GetLaons("0");

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
  GetLaons(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      condition: Filter != "All" ? {status:parseInt(Filter)} : {status:{$in:[0,1,2,-1]}} 
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      for(let i=0;i<response.data.result.length;i++){
        response.data.result[i].LaonAmount = response.data.result[i].LaonAmount ? response.data.result[i].LaonAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0
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
    this.Server.send("AdminApi/GetLaon", param, SCallBack, ECallBack)
  }
  EditLaon(){
    debugger;
    let that = this;
    
    that.setState({
      loading: 1
    })
    let msg = "";
    let statusTitle=["عدم تایید","ثبت اولیه","تایید اولیه","تایید نهایی"];
    let extra = "";
    if(this.state.SelectedStatus == "1")
      extra += "با مراجعه به سایت مدارک خود را تکمیل کنید"+"\n";
    if(this.state.needChange)
      extra += "درخواست شما به اصلاح نیاز دارد"+"\n";  
    if(this.state.selectedDescription)
      extra += this.state.selectedDescription+"\n";  
      debugger;
    if(this.state.SelectedStatus != this.state.OldStatus)
      msg = "درخواست وام شما در وضعیت "+statusTitle[parseInt(this.state.SelectedStatus)+1]+" قرار گرفت" + "\n" + extra ;
    else
      msg = "درخواست وام  بررسی شد " + "\n" + extra ;

    let param = {
      token: localStorage.getItem("api_token"),
      LaonAmount: parseInt(this.state.selectedAmount.toString().replace(/,/g, "")),
      LaonName: this.state.selectedName,
      LaonAcc: this.state.selectedAcc,
      _id: this.state.SelectedId,
      needChange: this.state.needChange,
      desc: this.state.needChange ? this.state.selectedDescription : "",
      status: parseInt(this.state.SelectedStatus),
      LaonMobile: this.state.SelectedLaonMobile,
      OldStatus: parseInt(this.state.OldStatus),
      msg:msg,
      EditByAdmin:true
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        SelectedId:null
      })
      that.GetLaons(that.state.Filter);
      that.toast.current.show({ severity: 'success', summary: <div> عملیات با موفقیت انجام شد </div>, life: 8000 });

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({ severity: 'error', summary: <div> عملیات انجام نشد </div>, life: 8000 });
      console.log(error)
    }
    this.Server.send("AdminApi/EditLaon", param, SCallBack, ECallBack)


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
                  this.setState({ Filter: e.value }); this.GetLaons(e.value) 

                }
                
              }}></SelectButton>

        </div>
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>
           
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} > لیست رکورد ها (تمام مبالغ به ریال است)</span></div>

            <DataTable responsive value={this.state.GridData} selectionMode="single" selection={this.state.selectedLaon} onSelectionChange={e => { this.selectedLaonChange(e.value) }} >
              <Column field="LaonName" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="LaonAcc" header="شماره حساب" className="irsans" style={{ textAlign: "center" }} />
              <Column field="LaonAmount" header="مبلغ درخواستی" className="irsans" style={{ textAlign: "center" }} />
              <Column field="RegDate" header="تاریخ ثبت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="RegTime" header="زمان ثبت" className="irsans" style={{ textAlign: "center" }} />

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
                              <select className="custom-select irsans" id="company" name="company" value={this.state.SelectedStatus} onChange={(event) => {
                                this.setState({SelectedStatus: event.target.value }) 
                                }} style={{ marginBottom: 20 }} >
                                <option value="-1">عدم تایید</option>
                                <option value="0">ثبت نام اولیه</option>
                                <option value="1">تایید اولیه</option>
                                <option value="2">تایید نهایی</option>
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
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedName} name="selectedName" onChange={(event)=>this.setState({ selectedName: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>نام و نام خانوادگی</label>
                    </div>
                  </div>

                  
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.SelectedLaonMobile} name="SelectedLaonMobile" onChange={(event)=>this.setState({ SelectedLaonMobile: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>موبایل</label>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedAmount} name="selectedAmount" onChange={(event)=>this.setState({ selectedAmount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} style={{ textAlign: 'right' }} required="true" />
                      <label>مبلغ درخواستی</label>
                    </div>
                  </div>
                  {this.state.SelectedStatus != "2" && 
                  <div className="col-lg-12">
                    <div  style={{display:'flex',justifyContent:'baseline',margin:10}}>

                      <Checkbox inputId="laon" value={this.state.needChange} checked={this.state.needChange} onChange={e => this.setState({ needChange: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label" style={{ paddingRight: 5 }}>نیاز به اصلاح دارد</label>

                    </div>
                  </div>
                  }
                  {this.state.needChange && this.state.SelectedStatus != "2" && 
                  <div className="col-lg-12" >
                    <div className="group">
                      <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.selectedDescription} name="selectedDescription" onChange={(event)=>this.setState({ selectedDescription: event.target.value })} style={{ textAlign: 'right' }} required="true" />
                      <label>توضیح</label>
                    </div>
                  </div>
                  
                  }
                  

                  <div className="col-lg-12" style={{ textAlign: 'right' }}>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={()=>this.EditLaon()}>ویرایش درخواست</Button>

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
  connect(mapStateToProps)(LaonReq)
);

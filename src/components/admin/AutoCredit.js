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

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class AutoCredit extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.selectedComponentChange = this.selectedComponentChange.bind(this);

    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: "",
      LevelOption:[],
      levelOfUser:'-1',
      amount:'',
      charge:''
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
      that.getCodes(["0"])


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getCodes(id) {
    let that = this;
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        levelTitle:response.data.result[0].title,
        LevelOption:response.data.result[0].values,
        loading: 0
      })
      that.getAutuCharge();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetCodes", { id: id }, SCallBack, ECallBack)
  }
  getAutuCharge() {
    let that = this;
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      for(let i=0;i<response.data.result.length >0; i++){
        response.data.result[i].amount = response.data.result[i].amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        response.data.result[i].charge = response.data.result[i].charge.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      }
      that.setState({
        GridData:response.data.result,
        loading: 0,
        visibleManageField:false
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getAutuCharge", {}, SCallBack, ECallBack)
  }

  SetAutoCharge(){
    let that = this;
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.getAutuCharge();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    let levelTitle = '';
    for(let v of this.state.LevelOption){
      if(v.value == this.state.levelOfUser)
        levelTitle = v.desc;
    }
    this.Server.send("AdminApi/setAutuCharge", {levelOfUser:this.state.levelOfUser,levelTitle:levelTitle,amount:this.state.amount.toString().replace(/,/g, ""),charge:this.state.charge.toString().replace(/,/g, "")}, SCallBack, ECallBack)
  }
  selectedComponentChange(value) {
    let that = this;
    var p = [];
    let state = {
      selectedId: value._id,
      levelOfUser: value.levelOfUser,
      amount: value.amount,
      charge: value.charge,
      visibleManageField: true
    }
    

    this.setState(state);

  }
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={()=>this.SetAutoCharge()} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
              <div className="col-6" style={{ textAlign: 'right' }}>
                <button className="btn btn-primary irsans" onClick={()=>this.setState({visibleManageField:true})} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت ردیف جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >ردیف های شارژ خودکار اعتبار کیف پول</span></div>

            <DataTable responsive value={this.state.GridData} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="levelOfUser" header="شناسه" className="irsans" style={{ textAlign: "center" }} />
              <Column field="levelTitle" header="عنوان" className="irsans" style={{ textAlign: "center" }} />
              <Column field="charge" header="مبلغ اعتبار" className="irsans" style={{ textAlign: "center" }} />
              <Column field="amount"  header="مبلغ خرید" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت ردیف جدید"} visible={this.state.visibleManageField}  footer={footer} minY={70} onHide={()=>{this.setState({visibleManageField:false,selectedId:null,levelOfUser:'-1',amount:'',charge:''})}} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{alignItems:'baseline'}}>
            <div className="col-lg-12">
                {this.state.LevelOption.length > 0 &&
                <div>
                          <label className="labelNoGroup irsans">{this.state.levelTitle}</label>
                          <select disabled={this.state.selectedId} className="custom-select irsans" value={this.state.levelOfUser} onChange={(event) => {this.setState({ levelOfUser: event.target.value }) }} >
                            {
                            this.state.LevelOption.map(function(u,j){
                              return(
                                <option value={u.value}>{u.desc}</option>
                              )
                            })


                            }
                          </select>
                </div>
              }
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.amount} name="amount" onChange={(event) => this.setState({ amount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                  <label >مبلغ خرید (پس از رسیدن جمع مبالغ خرید کاربر به این مقدار اعتبار شارژ شود)</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.charge} name="charge" onChange={(event) => this.setState({ charge: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") })} required="true" />
                  <label>مبلغ اعتبار</label>
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
  connect(mapStateToProps)(AutoCredit)
);

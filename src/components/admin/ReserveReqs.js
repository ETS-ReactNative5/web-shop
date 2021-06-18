import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment-jalaali'
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { Sidebar } from 'primereact/sidebar';

import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from 'primereact/autocomplete';
import DatePicker from 'react-datepicker2';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import Button from 'reactstrap/lib/Button';

class ReserveReqs extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FieldRef = React.createRef();

   
    
    
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      confirm:false,
      active:false,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)

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
      that.GetReserve();

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
  GetReserve() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let number = [];
      for(let i=0;i<response.data.result.length;i++){
        number.push(response.data.result[i].number)
      }
      that.setState({
        GridDataReserve: response.data.result,
        number:number,
        loading: 0
      })
      that.GetReserveDetails();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserve", param, SCallBack, ECallBack)
  }
  Verify(row){
    let that = this;
    let param = {
      number: row.number,
      name: row.name,
      type: row.RName,
      verify:true,
      day:row.day,
      mobile:row.mobile
    };
    debugger;
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
        that.setState({
            loading: 0
        })
        that.GetReserveDetails();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/ReserveConfirm", param, SCallBack, ECallBack)
  }
  Cancel(row){
    let that = this;
    let param = {
      number: row.number,
      name: row.name,
      type: row.RName,
      verify:false,
      day:row.day,
      mobile:row.mobile
    };
    debugger;
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
        that.setState({
            loading: 0
        })
        that.GetReserveDetails();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/ReserveConfirm", param, SCallBack, ECallBack)
  }
  GetReserveDetails() {
    let that = this;
    let param = {
      number: this.state.number,
      confirmed:1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      for(let i=0;i<response.data.result.length;i++){
        response.data.result[i].ReplaceDay = response.data.result[i].day.replaceAll("_","/")

        response.data.result[i].RName = response.data.result[i].reserve[0]?.name
      }  
      that.setState({
        loading: 0,
        GridDataReserveDetails: response.data.result
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserveDetails", param, SCallBack, ECallBack)
  }
  
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetReserve} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const verifyTemplate = (rowData, props) => {
  
      return  <button className="btn btn-success irsans" onClick={() => this.Verify(rowData)} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> تایید </button>

    }
    const canceleTemplate = (rowData, props) => {
  
        return  <button className="btn btn-danger irsans" onClick={() => this.Cancel(rowData)} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> عدم تایید </button>
  
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
           
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست رکورد ها</span></div>

            <DataTable responsive value={this.state.GridDataReserveDetails} selectionMode="single" >
              <Column field="RName" header="محل" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="ReplaceDay" header="روز" className="irsans" style={{ textAlign: "center" }} />
              <Column field="mobile" header="موبایل" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={verifyTemplate} header="تایید" className="irsans" style={{ textAlign: "center" }} />

              <Column field="del" body={canceleTemplate} header="عدم تایید" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
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
  connect(mapStateToProps)(ReserveReqs)
);

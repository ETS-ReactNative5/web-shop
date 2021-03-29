import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './report.css'
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
import { Fieldset } from 'primereact/fieldset';
import DatePicker from 'react-datepicker2';

class Show_Reports extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      loading: 0,
      output:'',
      legend: " فیلتر گزارش شماره " + this.props.number
      

    }
    
    this.showReports = this.showReports.bind(this);
  }
  GetFilters() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      number:this.props.number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let FilterIds=[];
      that.setState({
        method:response.data.result[0].method,
        number:that.props.number
      })
      for(let item of response.data.result[0].Filters){
        FilterIds.push(item.id);
      }
      that.Server.send("AdminApi/GetFilters", {_id:FilterIds}, function (response) {
        let ShowParam=[];
        for(let item of response.data.result){
          ShowParam.push({name:item.latinName,type:item.type});
        }
        that.setState({
          loading: 0,
          Filters:response.data.result,
          ShowParam:ShowParam
        })
      }, function (error) {
        Alert.error('عملیات انجام نشد', 5000);
        that.setState({
          loading: 0
        })
      })
      
      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFilters", param, SCallBack, ECallBack)
  }
  showReports() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      number:this.state.number
    };
    for(let item of this.state.ShowParam){
      if(item.type == "5"){
        param[item.name]=this.state[item.name].local("fa").format("jYYYY/jM/jD");

      }else{
        param[item.name]=this.state[item.name];
      }
    }


    this.setState({
      loading: 1
    })

    let SCallBack = function (response) {
      that.setState({
        output:response.data.result,
        loading: 0
      })

      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/"+this.state.method, param, SCallBack, ECallBack)
  }
  componentDidMount() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      
      that.setState({
        loading: 0
      })
      that.GetFilters();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
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
         
          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>

          <Fieldset legend={this.state.legend} toggleable collapsed={this.state.panelCollapsed} onToggle={(e) => this.setState({panelCollapsed: e.value})}>
          <div className="row" style={{alignItems:'baseline'}}>
              {this.state.Filters && this.state.Filters.map((item, index)=>{
                if(item.type=="1"){
                  return(
                    <div className="col-12 col-lg-4">
                      <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="2"){
                  return(
                    <div className="col-12 col-lg-4">
                      <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="3"){
                  return(
                    <div className="col-12 col-lg-4">
                      <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="4"){
                  return(
                    <div className="col-12 col-lg-4">
                      <div className="group" >
                      <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="5"){
                  return(
                    <div className="col-12 col-lg-4">
                      <DatePicker
                        onChange={value => this.setState({[item.latinName]:value})}
                        value={this.state[item.latinName]}
                        isGregorian={false}
                        timePicker={false}
                        placeholder={item.name}

                      />
                    </div>
                  )
                }
                
              })}
              <div className="col-lg-12">
                <button className="btn btn-primary irsans" onClick={this.showReports} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}> مشاهده گزارش </button>
              </div>
            </div>
            </Fieldset>
            
            <div className="report-container" dangerouslySetInnerHTML={{ __html: this.state.output}} > 
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
  connect(mapStateToProps)(Show_Reports)
);
import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

import { connect } from 'react-redux';
import { Alert } from 'rsuite';

class SalesProduct extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      GridDataUsers:[], 
      GridDataFactors:[]
      
    }
    this.itemTemplateUsers = this.itemTemplateUsers.bind(this);
    this.itemTemplateFactors = this.itemTemplateFactors.bind(this);   
    this.GetUsers();
    
  }
  itemTemplateUsers(car, layout) {
    if(!car)
        return (
          <div className="p-col-12 p-md-3">
              <div></div>
          </div>
      );
    
    if (layout === 'list') {
        return (
          
            <div className="row">
                <div className="col-lg-12" >
                <div className="row" style={{margin:20}}>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.name}</p>
                    </div>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.username}</p>
                    </div>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.phone}</p>
                    </div>
                    
                    <div className="col-lg-4 irsans" style={{textAlign:"center"}}>
                      <p className="irsans">{car.Address}</p>
                    </div>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.status=="1" ? "فعال" : "غیر فعال"}</p>
                    </div>
                  
                   
                </div>
                </div>

            </div>
        );
    }
    if (layout === 'grid') {
      return (
          <div className="p-col-12 p-md-3">
              <div>{car}</div>
          </div>
      );
    }
    
}
itemTemplateFactors(car, layout) {
    if(!car)
        return (
          <div className="p-col-12 p-md-3">
              <div></div>
          </div>
      );
    if (layout === 'list' ) {
        return (
          
            <div className="row">
                <div className="col-lg-12" >
                <div className="row" style={{margin:20}}>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.Amount} تومان</p>
                    </div>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.refId}</p>
                    </div>
                    <div className="col-lg-2 irsans" style={{textAlign:"right"}}>
                      <p className="irsans">{car.username}</p>
                    </div>
                    
                    <div className="col-lg-4 irsans" style={{textAlign:"center"}}>
                    <a href="#" className="irsans">جزئیات</a>
                    </div>
                  
                   
                </div>
                </div>

            </div>
        );
    }
    if (layout === 'grid') {
      return (
          <div className="p-col-12 p-md-3">
              <div>{car}</div>
          </div>
      );
    }
    
}
  GetUsers(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      GetAll:1
    };
    let SCallBack = function(response){
      that.GetFactors();
      that.setState({
        GridDataUsers : response.data.result
      })
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("AdminApi/getuser",param,SCallBack,ECallBack)
  }
  GetFactors(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      GetAll:1
    };
    let SCallBack = function(response){
      that.setState({
        GridDataFactors : response.data.result
      })
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors",param,SCallBack,ECallBack)
  }
 
    render(){
      const columns = [
        {field: 'username', header: 'خریدار'},
        {field: 'Amount', header: 'قیمت'},
        {field: 'refId', header: 'رسید تراکنش'},
        {field: 'color', header: 'Color'}
    ];

    const dynamicColumns = columns.map((col,i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });
     return (
             
          <div style={{direction:'rtl'}}>
       
          <div className="col-lg-12"> 
              <h2 style={{  textAlign : "center",fontSize:"14px",marginTop:15}} className="irsans alert-primary">لیست اعضا</h2>
              <DataTable value={this.state.GridDataUsers}>
                        <Column field="username" header="نام کاربری" />
                        <Column field="name" header="نام" />
                        <Column field="status" header="وضعیت" />
                        <Column field="level" header="سطح" />
                        <Column field="map" header="دسترسی" />
                    </DataTable>
              
          </div>
          <div className="col-lg-12"> 
              <h2 style={{  textAlign : "center",fontSize:"14px",marginTop:15}} className="irsans alert-primary">لیست فاکتورها</h2>
              <DataTable value={this.state.GridDataFactors}>
                        {dynamicColumns}
              </DataTable>
              
          </div>
          </div>

      
          
          

        )
    }
}
const mapStateToProps = (state) => {
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(SalesProduct)
);

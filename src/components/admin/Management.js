import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import AdminProduct  from './AdminProduct.js'

import  './Dashboard.css'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {InputText} from 'primereact/inputtext';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';

class Management extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [], 
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [] ,
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,

      
      
    }
   
  }
  
    render(){
      const footer = (
        <div>
                <button  className="btn btn-primary irsans" onClick={this.editProduct}  style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}> اصلاح محصول </button>

        </div>
    );
        return (
             
          <div  style={{direction:'rtl'}} >
        
          <div className="row justify-content-center">
          <div  className="col-12 col-md-4 col-lg-3 ">

           <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
           </div>
            <div className="col-lg-9 col-md-8 col-12" style={{marginTop:20,background:'#fff'}}> 
            <AdminProduct />
            </div>
           
          </div>
        <div >


        
      </div>
          
          </div>
          

        )
    }
}
export default Management;
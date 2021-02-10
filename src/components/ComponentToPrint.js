import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header1 from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { TabMenu } from 'primereact/tabmenu';
import { ProgressSpinner } from 'primereact/progressspinner';
import Footer from './Footer.js'
import Header2 from './Header2.js'
import { DataTable } from 'primereact/datatable';
import './User.css'
import { Alert } from 'rsuite';
import { Link } from 'react-router-dom'
import Cities from './Cities.js'


import Mapir from "mapir-react-component";
let markerArray=new Array(),lat,lon;


export class  ComponentToPrint extends React.Component {

  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      param:this.props.param,
      url: this.Server.getUrl(),
      absoluteUrl: this.Server.getAbsoluteUrl(),

    }




  }
  componentDidMount(){
  }
  render() {
   
   

    return (
      <div style={{ direction: 'rtl' }}>
        {this.state.param &&
          <div>{this.state.param.Amount}</div>
        }
      </div>
    )
  }
}

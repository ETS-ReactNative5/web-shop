import React, { Component } from 'react';

import Server from '../Server.js'
import { connect } from "react-redux"
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import './QrCode.css';
import Header from '../Header.js'

import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'

class BarCode extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.Server = new Server();
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this);

    this.state = {
      result:'',
      AccountNumber: this.props.location.search.split("account=")[1],
      Type: this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0],
    }



  }
  handleScan(result){
    if(result){
      this.setState({ result })
    }
  }
  handleError(err){
    console.error(err)
  }
  
  render() {
    
    return (
      <div >
        <Header />

        <BarcodeScannerComponent
        width="100%"
        height="100%"
        onUpdate={(err, result) => {
            if(result){
                this.setState({
                    result:result
                  })
            }
        }}
      />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
    password: state.password,
    ip: state.ip,
    account: state.account,
    place: state.place,
    fullname: state.fullname,
    mobile: state.mobile
  }
}
export default connect(mapStateToProps)(BarCode)  

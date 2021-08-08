import React, { Component } from 'react';

import Server from '../Server.js'
import { connect } from "react-redux"
import QrReader from 'react-qr-reader';
import './QrCode.css';
import Header from '../Header.js'

import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'

class QrCode extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.Server = new Server();
    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);

    this.state = {
      result:'',
      AccountNumber: this.props.location.search.split("account=")[1],
      Type: this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0],
    }



  }
  handleScan(data){
    if(data){
      this.setState({
        result:data
      })
    }
    
  }
  handleError(error){
    console.log(error)
  }
  render() {
    if (this.state.result) {
      return <Redirect to={"/Shop?Type=&account="+this.state.AccountNumber+"&_id="+this.state.result+""} />;
    }
    return (
      <div className="qr-reader-wrapper">
        <Header />
        <QrReader
          style={{Height:'100%'}}
          className="qr-reader"
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          showViewFinder={false}
        />
        <p style={{marginTop:30,textAlign:'center'}} className="YekanBakhFaMedium">{this.state.result}</p>

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
export default connect(mapStateToProps)(QrCode)  

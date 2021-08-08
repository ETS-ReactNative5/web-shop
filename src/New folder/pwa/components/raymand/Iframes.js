import React, { Component } from 'react';

import Server from '../Server.js'
import { connect } from "react-redux"
import Header from '../Header.js'
import Iframe from 'react-iframe'

import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'

class Iframes extends React.Component {
  constructor(props) {
    super(props);
    let links=[
      {link:"https://topup.pec.ir/?mid=666&t=p",title:"خرید بسته اینترنتی"},
      {link:"https://topup.pec.ir/?mid=666",title:"خرید شارژ"},
      {link:'https://aniashop.ir',title:'آنیاشاپ'},
      {link:'https://aniafood.ir',title:'آنیافود'},
      {link:'http://heybilit.com',title:'آژانس هواپیمایی شنتیا'},
      {link:"https://bill.pec.ir/?mid=666",title:"پرداخت قبوض"}

    ]
    this.state = {
      Type:this.props.location.search.split("Link=")[1],
      link:links[parseInt(this.props.location.search.split("Link=")[1])] ? links[parseInt(this.props.location.search.split("Link=")[1])].link : '',
      title:links[parseInt(this.props.location.search.split("Link=")[1])] ? links[parseInt(this.props.location.search.split("Link=")[1])].title : ''
    }

  }
  render() {
    
    return (
      <div className="qr-reader-wrapper">
        <Header ComponentName={this.state.title} />
        <Iframe url={this.state.link}
        width="100%"
        height="600"
        id="myId"
        className="myClassname"
        display="initial"
        style={{border:0}}
        position="relative"/>

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
export default connect(mapStateToProps)(Iframes)  

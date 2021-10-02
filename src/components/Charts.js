import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'

import './Charts.css'

import 'primeicons/primeicons.css';
import Server from './Server.js'
import { connect } from 'react-redux';
import {defaults } from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';

defaults.global.defaultFontFamily   = 'iranyekanwebmedium';

let data = {}


class Charts extends React.Component {

  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      type:this.props.type||"pie",
      loading: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    data = {
      labels: this.props.labels,
      datasets: [{
        data: this.props.data,
        backgroundColor: this.props.backgroundColor || ['#FF6384','#36A2EB'],
        hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB'
        ],
        label:this.props.label||""
      }]
    };
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.setState({
        loading: 0
      })


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
      <div>
        {this.state.type == "pie" &&
          <Pie data={data} />
        }
        {this.state.type == "bar" &&
          <Bar data={data}  />
        }
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
  connect(mapStateToProps)(Charts)
);

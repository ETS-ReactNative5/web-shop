import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Login  from '../Login.js'
import Management  from './Management.js'
import Server from './../Server.js'

class Admin extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();

    this.state={
      Show:false,
      Aute :  this.props.Autenticated ?  this.props.Autenticated : false,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)

    }
    axios.post(this.state.url+'checktoken', {
      token: localStorage.getItem("api_token")
    })
    .then(response => {
      if(response.data.authData.level == "0")
        return;
      this.setState({
        Aute : true,
        Show:true
      })
      this.props.dispatch({
        type: 'LoginTrueAdmin',    
        admin:{
          username:response.data.authData.username
        }
      })
    })
    .catch(error => {
      this.setState({
        Show:true
      })
      console.log(error)
    })
    
  }
 

    render(){
        return (
            this.state.Show ?
            this.state.Aute ?
              <Management />
                :
              <Login admin="1" />
            :
            <div></div>  



        )
    }
}
export default Admin;
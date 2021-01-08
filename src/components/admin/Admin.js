import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Login  from './Login.js'
import Management  from './Management.js'

class Admin extends React.Component {
  constructor(props){
    super(props);
    this.state={
      Show:false,
      Aute :  this.props.Autenticated ?  this.props.Autenticated : false,
      url:'https://api.emdcctv.com/AdminApi/'/*
      url:'http://localhost:3000/MainApi/'*/

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
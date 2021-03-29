import React, { Component } from 'react';
import Header1  from './Header1.js'
import Header2  from './Header2.js'
import MainBox2  from './MainBox2.js'
import MainBox3  from './MainBox3.js'
import MainBox4  from './MainBox4.js'
import Footer  from './Footer.js'  
import Server  from './Server.js'

import Haraj  from './Haraj.js'



import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom'

import axios from 'axios' 

class MainBox1 extends React.Component {
    constructor(props){
        super(props)
        this.Server = new Server();

        this.state={
            Autenticated:false,
            username : null,
            url:this.Server.getUrl()

        }
   
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
            console.log(response.data)
            this.setState({
                Autenticated : true,
                username : response.data.authData.username
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    render(){
    return (
            <div style={{backgroundColor:'#eee'}}>
                <Header1 /> 
                <Header2 /> 
                <div className="A-container" >
                    <MainBox2 /> 
                    <MainBox4 /> 
                </div>
                
                <Footer />
           </div>
            
            
   
       
     
    )
    }
}
const mapStateToProps = (state) => {
    return{
        CartNumber : state.CartNumber
    }
  }
  export default withRouter(
    connect(mapStateToProps)(MainBox1)
  );
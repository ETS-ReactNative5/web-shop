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

class MainShop extends React.Component {
    constructor(props){
        super(props)
        this.Server = new Server();

        this.state={
            Autenticated:false,
            username : null,
            loading:true,
            url:this.Server.getUrl()

        }
   
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
            this.getSettings();
            this.setState({
                Autenticated : true,
                username : response.data.authData.username
            })
        })
        .catch(error => {
            this.getSettings();

            console.log(error)
        })
    }
    getResponse(){
        this.setState({
            loading: false
        })
    }
    getSettings(){

        axios.post(this.state.url+'getSettings', {
            token: localStorage.getItem("api_token")
          })
          .then(response => {
            this.setState({
                Theme:response.data.result ? response.data.result.Theme : "1"
            })
          })
          .catch(error => {
          })
    }
    render(){
    return (
            <div>
                <Header1 /> 
                <Header2 /> 
                <div className={this.state.Theme == "2" ? "B-container" : "A-container"} >
                    <MainBox2 callback={this.getResponse.bind(this)} /> 
                    {!this.state.loading ?
                    <MainBox4 BrandTitle="برندها" /> 
                    :
                    <div style={{ textAlign: 'center' }}></div>
                    }
                </div>
                {!this.state.loading ?
                    <Footer />
                :
                    <div style={{ textAlign: 'center' }}></div>
                }
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
    connect(mapStateToProps)(MainShop)
  );
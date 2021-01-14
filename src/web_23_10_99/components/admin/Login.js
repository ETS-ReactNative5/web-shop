import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import { Button,Alert } from 'reactstrap';
import Admin  from './Admin.js'
import { connect } from 'react-redux';
import Server  from '.././Server.js'

class Login extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();

    this.state={
      inputEmail:'',
      inputPassword:'',
      articles : [],
      name:'',
      Autenticated:false,
      HasError:false,
      url:this.Server.getUrl(1)

    }
    this.handleChangeinputEmail = this.handleChangeinputEmail.bind(this);
    this.get = this.get.bind(this);
    this.handleChangeinputPassword = this.handleChangeinputPassword.bind(this);
    axios.post(this.state.url+'checktoken', {
      token: localStorage.getItem("api_token")
    })
    .then(response => {
      this.props.dispatch({
        type: 'LoginTrueAdmin',    
        admin:{
          username:response.data.authData.username
        }
      })
      this.setState({
        Autenticated : true
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  get(){
    this.setState({
      HasError:false
    })
    axios.post(this.state.url+'getuser', {
      username: this.state.inputEmail,
      password: this.state.inputPassword,
      token: localStorage.getItem("api_token")
    })
    .then(response => {
      this.setState({
        name : response.data.result[0].name
      })
      localStorage.setItem("UId_admin",response.data.result[0]._id);
      localStorage.setItem("api_token",response.data.token);
      this.props.dispatch({
        type: 'LoginTrueAdmin',    
        admin:{
          username:this.state.inputEmail
        }
      })
      this.setState({
         Autenticated : true
      })

      
    })
    .catch(error => {
      
      this.setState({
        HasError:"نام کاربری یا رمز عبور اشتباه است"
      })
      console.log(error)
    })
  }
  handleChangeinputEmail(event){
this.setState({inputEmail: event.target.value});
  }
  handleChangeinputPassword(event){
this.setState({inputPassword: event.target.value});
  }
    render(){
    if (this.state.Autenticated == true) {
      return <Admin Autenticated={this.state.Autenticated} />
    }
        return (
   <div className="container">
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card card-signin my-5">
          <div className="card-body">
            <h5 className="card-title text-center irsans">مدیریت | ورود به محیط کاربری</h5>
            <form className="form-signin">
            <div className="group">
                  <input className="form-control irsans" type="text" id="inputEmail"  value={this.state.inputEmail} name="inputEmail" onChange={this.handleChangeinputEmail}   required  />
                  <label>نام کاربری</label>
					  </div>
            <div className="group">
                  <input type="password" className="form-control irsans" id="inputPassword" name="inputPassword" value={this.state.inputPassword} onChange={this.handleChangeinputPassword} required />
                  <label>رمز عبور</label>
					  </div>
            <Button style={{marginLeft:5,marginTop:10}} color="primary" className="form-control irsans"  onClick={this.get}>ورود</Button>
          </form>
          </div>  
          {this.state.HasError ?
          <Alert color="danger" style={{textAlign:"center"}} className="irsans">
            {this.state.HasError}
          </Alert>
          :<p></p>
          }
        </div>
      </div>
    </div>
  </div>
  

        )
    }
}
const mapStateToProps = (state) => {
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Login)
);

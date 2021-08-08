import React, { Component } from 'react';
import { Toast } from 'primereact/toast';

import Server from '../Server.js'
import { connect } from "react-redux"
import { Button } from 'primereact/button';
import {Password} from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import Header from '../Header.js'
import Num2persian from 'num2persian';

class ChangePass extends React.Component {
  constructor(props){
    super(props);  
    const { navigation } = this.props;
    this.Server = new Server();
    this.toast = React.createRef();
    this.ChangePass = this.ChangePass.bind(this);
    this.state={      
      AccountNumber:this.props.location.search.split("account=")[1],
      Type:this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0],
      ShowLoading:false
    }
    
     


  }
  
  ChangePass(){   
     let that = this;
    if(this.state.NewPassword1=='' || this.state.NewPassword2 =='' || this.state.OldPassword==''){
        that.toast.current.show({ severity: 'warn', summary: "همه ی موارد را تکمیل کنید", life: 8000 });

      return;
    }
    if(this.state.NewPassword1 != this.state.NewPassword2){
        that.toast.current.show({ severity: 'warn', summary: "رمز عبور جدید و تکرار آن یکسان نیستند", life: 8000 });

      return;
    }
    if(this.state.OldPassword != this.props.password){

      that.toast.current.show({ severity: 'warn', summary: "رمز عبور فعلی صحیح نیست", life: 8000 });

      return;
    }  
    if(this.state.OldPassword == this.state.NewPassword2){
        that.toast.current.show({ severity: 'warn', summary: "رمز عبور جدید و رمز عبور قدیمی نمی توانند یکسان باشند", life: 8000 });

      return;
    }
    var param = '{CommandNo : "14" , AccountNo: "' + that.props.account + '",Param1: "' + that.state.NewPassword1 + '" }';
    let SCallBack = function(response){
      that.setState({
        ShowLoading:false
      })
      if(response.length>0)
        that.toast.current.show({ severity: 'success', summary: "رمز عبور با موفقیت تغییر کرد", life: 8000 });
      else
        that.toast.current.show({ severity: 'error', summary:"عملیات تغییر رمز انجام نشد", life: 8000 });

  



    };   
    let ECallBack = function(error){
      that.setState({
        ShowLoading:false
      })         
        alert(error)  
    }
    this.setState({
      ShowLoading:true
    }) 
    this.Server.sendRaymand(""+that.props.ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack)    
  }
 
  render() {      
   
    
 
 
    return (       
      <div style={{height:'100%'}}>
           <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
      <div>
      <Header credit={this.state.credit} ComponentName="تغییر رمز عبور" />

    </div>
      <div style={{direction:'rtl',padding:20,backgroundColor: '#fff',height:'100%'}}>
         <div floatingLabel> 
                        <div style={{fontFamily:'YekanBakhFaMedium'}} >رمز عبور فعلی</div>
                            <Password   value={this.state.OldPassword}  keyboardType="number-pad" secureTextEntry={true} name="OldPassword" onChange={(event)=>{
                              this.setState({OldPassword:event.target.value})
                            }}  inputStyle={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%',marginBottom:20}} style={{width:'100%'}}  />
          </div>
          <div floatingLabel> 
                        <div style={{fontFamily:'YekanBakhFaMedium'}} >رمز عبور جدید</div>
                            <Password   value={this.state.NewPassword1}  keyboardType="number-pad" secureTextEntry={true} name="NewPassword1" onChange={(event)=>{
                              this.setState({NewPassword1:event.target.value})
                            }}  inputStyle={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%',marginBottom:20}} style={{width:'100%'}}  />
          </div>
          <div floatingLabel> 
                        <div style={{fontFamily:'YekanBakhFaMedium'}} >تکرار رمز عبور جدید</div>
                            <Password   value={this.state.NewPassword2}  keyboardType="number-pad" secureTextEntry={true} name="NewPassword2" onChange={(event)=>{
                              this.setState({NewPassword2:event.target.value})
                            }}  inputStyle={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%',marginBottom:20}}  style={{width:'100%'}} />
          </div>

          <Button  info rounded style={{marginTop:10,marginLeft:10,marginRight:10,marginBottom:10,padding:10,width:'80%',textAlign:'center',marginTop:30}}  onClick={this.ChangePass}>
              <span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,width:'100%' }}>تغییر رمز عبور</span> 
          </Button> 
           
       
    </div>
    </div> 
    );
  }
}

function mapStateToProps(state) {        
  return {
    username : state.username,
    password : state.password,
    ip : state.ip,
    account:state.account,
    place:state.place,
    fullname : state.fullname,
    mobile : state.mobile
  }
}
export default connect(mapStateToProps)(ChangePass)  

import React, { Component } from 'react';
import axios from 'axios'  
import {ProgressSpinner} from 'primereact/progressspinner';

class Server extends React.Component {
   constructor(props){
     super(props);
     let serverUrl=[
      'http://localhost:3000/',
      'https://api.emdcctv.com/',
      'https://marketapi.sarvapps.ir/',
      'https://foodapi.sarvapps.ir/',
      'https://siteapi.sarvapps.ir/'
     ]
     this.state={
        isLoading:false,
        serverUrl: serverUrl[0],
        serverUrl2: serverUrl[0]
     };
   }
   getUrl(admin){

      let second = localStorage.getItem("food");
      return admin ? (!second ? this.state.serverUrl+"AdminApi/" : this.state.serverUrl2+"AdminApi/") : (!second ? this.state.serverUrl+"MainApi/" : this.state.serverUrl2+"MainApi/" )
   }
   getAbsoluteUrl(){

    let second = localStorage.getItem("food");
      return !second ? this.state.serverUrl : this.state.serverUrl2 ;
   }
   getInfo(){
      if(this.state.serverUrl.indexOf("emdcctv") > -1)
         return {
            "pay":"0",
            "BestOff":"0",
            "SmsType":"0",
            "ShowPriceBeforeLogin" :"0"

         };
      else
      return {
         "pay":"1",
         "BestOff":"1",
         "SmsType":"1",
         "ShowPriceBeforeLogin" :"1"

      };
   }
   send(url,params,SuccessCallBack,ErrorCallBack){
      this.setState({
         isLoading:true
      })
      let serverUrl = localStorage.getItem("food") ? this.state.serverUrl2 : this.state.serverUrl;
      axios.post(serverUrl+url+'', params)
       .then(response => {
         this.setState({
            isLoading:false
          })
          SuccessCallBack(response,this.setState.isLoading);
          
       })
       .catch(error => {
          this.setState({
            isLoading:false
          })
          ErrorCallBack(error,this.setState.isLoading);
          
       })

   }
   send2(url,params,SuccessCallBack,ErrorCallBack){
    this.setState({
       isLoading:true
    })
    axios.post(url+'', params)
     .then(response => {
       this.setState({
          isLoading:false
        })
        SuccessCallBack(response,this.setState.isLoading);
        
     })
     .catch(error => {
        this.setState({
          isLoading:false
        })
        ErrorCallBack(error,this.setState.isLoading);
        
     })

 }
   sendRaymand(url,params,SuccessCallBack,ErrorCallBack,temp,method,api){
      var m = method||"POST"
      var XMLParser = require('react-xml-parser');
      var headers = {
        'Content-Type': 'application/json; charset=utf-8',
         'dataType': 'json'
      }
      if(m=="POST"){
        if(!api){
          var req = {
            method: m,
            headers: {
              Accept: 'application/json; charset=utf-8',
              'Content-Type': 'application/json',
    
            },
            body:params
          };
        }
        else{
          var req = {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin" : '*',
              "Access-Control-Allow-Headers": '*',
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Im5hbWUiLCJyb2xlIjoidGVsIiwibmJmIjoxNTg0NjI3MzMxLCJleHAiOjE1ODQ2MzA5MzEsImlhdCI6MTU4NDYyNzMzMX0.VL6DIeI4l1QsXzlMmn7-EmNwakjdBKa-NanP7zHlpeY"
    
            },
            body:params
          };
  
        }
           
  
  
      }
      else{
        if(api){
          var req = {
            method: "GET",  
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Im5hbWUiLCJyb2xlIjoidGVsIiwibmJmIjoxNTg0NjI3MzMxLCJleHAiOjE1ODQ2MzA5MzEsImlhdCI6MTU4NDYyNzMzMX0.VL6DIeI4l1QsXzlMmn7-EmNwakjdBKa-NanP7zHlpeY"
    
            }
          };
        }
      }
          
      fetch(url, req)
      .then((response) => response.json())
      .then((response) => {

        if(!api){
          if(!temp){
            var xml = new XMLParser().parseFromString(response.d); 
            //console.warn(xml.children); 
            
            SuccessCallBack(xml.children);
            }else{           
              SuccessCallBack(response);       
            }
  
        }else{
          SuccessCallBack(response);
  
        }
        
        
      })
      .catch((error) => {
        ErrorCallBack(error);
      });
      /*axios.post(url, params, {headers: headers})
      .then(function (response) {
  
        if(!temp){
        var xml = new XMLParser().parseFromString(response.data.d); 
        //console.warn(xml.children); 
        
        SuccessCallBack(xml.children);
        }else{           
          SuccessCallBack(response.data.d);       
        }  
      })   
      .catch(function (error) {  
        
        ErrorCallBack(error);
      });*/
   
   }
 
}
export default Server;
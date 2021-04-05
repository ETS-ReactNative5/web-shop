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
        serverUrl: serverUrl[3]
     };
   }
   getUrl(admin){
      return admin ? this.state.serverUrl+"AdminApi/" : this.state.serverUrl+"MainApi/" 
   }
   getAbsoluteUrl(admin){
      return this.state.serverUrl;
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
      axios.post(this.state.serverUrl+url+'', params)
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
 
}
export default Server;
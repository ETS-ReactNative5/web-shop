import React, { Component } from 'react';
import axios from 'axios'  
import {ProgressSpinner} from 'primereact/progressspinner';

class Server extends React.Component {   
   constructor(props){
      
     super(props);
     const type=2;
     let serverUrl=[
      'http://localhost:3000/',
      'https://api.emdcctv.com/',
      'https://marketapi.sarvapps.ir/',
      'https://foodapi.sarvapps.ir/',
      'https://siteapi.sarvapps.ir/',
      'https://api.aniabook.ir/',
      'http://sad.samentour.ir:3000/'    
     ]
     let addressUrl=[
      'http://localhost:3000/',
      'https://emdcctv.com/',
      'https://aniashop.ir/',
      '',
      '',
      'https://aniabook.ir/',
      'http://sad.samentour.ir:3000/'    
     ]
     this.state={
        isLoading:false,
        serverUrl: serverUrl[type],
        addressUrl:addressUrl[type]  
     };   
   }
   getAddress(){
      return this.state.addressUrl
   }
   getUrl(admin){
      return admin ? this.state.serverUrl+"AdminApi/" : this.state.serverUrl+"MainApi/" 
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
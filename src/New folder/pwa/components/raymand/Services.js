import React, { Component } from 'react';
import Server from '../Server.js'
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { connect } from "react-redux"
import Header from '../Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import { withRouter, Redirect, Link } from 'react-router-dom'

    
class Services extends React.Component {      
  constructor(props){
    super(props);  
    const { navigation } = this.props;
    let search = decodeURI(this.props.location.search);
    this.state={
      AccountNumber:search.split("account=")[1],
      Place:this.props.place,
      Type:search.split("Type=")[1] && search.split("Type=")[1].split("&")[0],

    }

  }
  ItemsClick(type){          
    let page="";
    if(type=="IncreaseAccount"){
      window.open("http://r-bank.ir/"+this.state.Place+this.state.AccountNumber,"_blank");
      return;
    }
    if(type=="Cheque"){
      page="/Cheque?Type=&&account="+this.state.AccountNumber;
    }
    if(type=="LocalTransfer"){
      page="/Transfer?Type=LocalTransfer&&account="+this.state.AccountNumber;
    }
    if(type=="Transfer"){
      page="/Transfer?Type=Transfer&&account="+this.state.AccountNumber;
    }
    this.setState({
      page:page
    })

  }
  render() {    
   
    if(this.state.page){
      return <Redirect to={this.state.page} />;
    }
    return (   

        <div style={{backgroundColor:'#fff',height:'100%'}}>      

           <Header span style={{ padding:0,margin:0,marginBottom:20 }} bgColor={'#ebdd25'} height={120} ComponentName={this.state.Type} />
          
           <img src="../images/15.png" style={{zIndex:2,position:'absolute',top:54,left:35}}  />

        <div style={{marginTop:40,maxHeight:'calc(100% - 210px)',overflow:'auto'}}>    
             <div style={{display:'flex',flexDirection:'row-reverse',justifyContent: 'center',textAlign: 'center',alignItems:'center'}}>
                
                <div style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} onClick={()=>this.ItemsClick("IncreaseAccount")}>
                   <img src="../images/12.png" style={{zIndex:2,maxWidth:100}}  />
                    <span style={{color:'#000'}} >واریز به حساب</span>
                </div> 
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Transfer?Type=LocalTransfer&account=${this.state.AccountNumber}`} >

                   <img src="../images/11.png" style={{zIndex:2,maxWidth:100}}  />
                   <span style={{color:'#000'}} >انتقال وجه داخلی</span>

                </Link>
                 
             </div>               
             <div style={{display:'flex',flexDirection:'row-reverse',alignSelf: 'center',textAlign: 'center'}}>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Transfer?Type=Transfer&account=${this.state.AccountNumber}`} >

                  <img src="../images/14.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >انتقال وجه به حساب بانکی  </span>
                  
                </Link>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Cheque?Type=&account=${this.state.AccountNumber}`} >

                  <img src="../images/13.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >مدیریت چک ها </span>
                </Link>
                  

             </div>  
             <div style={{display:'flex',flexDirection:'row-reverse',alignSelf: 'center',textAlign: 'center'}}>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Shop?Type=credit&account=${this.state.AccountNumber}`} >

                  <img src="../images/shop.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >مهر کارت </span>
                  
                </Link>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Shop?Type=&account=${this.state.AccountNumber}`} >

                  <img src="../images/pay.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >درگاه پرداخت</span>
                </Link>
                  

             </div> 

             <div style={{display:'flex',flexDirection:'row-reverse',alignSelf: 'center',textAlign: 'center'}}>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/Turnover?Type=credit&account=${this.state.AccountNumber}`} >

                  <img src="../images/report.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >گزارش مهر کارت</span>
                  
                </Link>
                <Link style={{flexGrow: 1,height:'100%',width:100,borderWidth: 0.5,color: '#f9b248',margin:3,display:'flex',flexDirection:'column',alignItems:'center'}} to={`${process.env.PUBLIC_URL}/QrCode?Type=&account=${this.state.AccountNumber}`} >

                  <img src="../images/qrcode.png" style={{zIndex:2,maxWidth:100}}  />
                  <span style={{color:'#000'}} >QrCode</span>
                </Link>
             </div> 
        </div>
        <div style={{position:'fixed',bottom:0,backgroundColor:'#ebdd25',width:'100%',textAlign:'center'}}>
        <span  style={{fontFamily:'YekanBakhFaMedium',color:'#fff',fontSize:30}}>{this.state.AccountNumber}</span>  

        </div>
         
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {   
    username: state.username,
    password: state.password,
    ip: state.ip,
    account: state.account,
    place:state.place,
    fullname : state.fullname,
    mobile : state.mobile
  }     
}
export default connect(mapStateToProps)(Services)  

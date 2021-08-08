import React, { Component } from 'react';
import { connect } from "react-redux"
import Server from '../Server.js'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner';
import Header from '../Header.js'

class Hesab extends React.Component { 
  constructor(props){
    super(props); 
    this.Server = new Server();
    this.GetAccounts();
    this.state = {
      basic: true,
      listViewData: [],
      Accounts:[],
      ShowLoading:1     

    };
  }
  ConvertNumToFarsi(text){
    if(!text)
      return text;
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  GetAccounts(RefreshVam){
    let that = this;
    let SCallBack = function(response){
      let data=[];
      let resp=[];
     for(let i=0;i<response.length;i++){
       resp[i] = response[i].children;
      
     }
     for(let i=0;i<resp.length;i++){
      for(let j=0;j<resp[i].length;j++){
        if(resp[i][j].name=="A_Kind"){
          if(resp[i][j].value=="5")
          data.push(resp[i])
        }
   
      }   
     }
     let ListView=[];
     for(let i=0;i<data.length;i++){
     let price = that.Price(data[i][2].value);
     let color = i%2 ? '#6ca0ff' : '#ebdd25'
     ListView[i] = {  
      data : 
      <div > 
      <div style={{display:'flex',justifyContent:'space-around',backgroundColor:color,borderRadius:25,padding:5,marginRight:10,marginLeft:10}} >
       <div> 
       <span style={{color:'#333'}}><span className="YekanBakhFaMedium">{that.ConvertNumToFarsi(data[i][1].value)}</span></span>
       </div>
       <div>
      <span style={{fontFamily:'YekanBakhFaMedium',color:'#333'}} >
            {data[i][3].value}
        </span>   
      </div>              
      </div>
      <div style={{padding:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
      <div> 
      <span  style={{color:'#333',fontSize:18,display:'flex'}} className="YekanBakhFaMedium" >      
      <span style={{color:color}} className="YekanBakhFaMedium">ریال</span><span>{that.ConvertNumToFarsi(price)} </span>   
      </span>          
       
      </div>           
      </div>        
      
          <div style={{borderBottomLeftRadius:5 ,borderBottomRightRadius:5,borderTopLeftRadius:5,borderTopRightRadius:5,paddingRight:5,paddingLeft:5,marginLeft:15,marginRight:15,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}}> 
            <div style={{backgroundColor:color,paddingRight:4,paddingLeft:4,borderRadius:20}}>
            <Link to={`${process.env.PUBLIC_URL}/Services?Type=${data[i][3].value}&&account=`+data[i][1].value}  className=""  style={{ textDecoration: 'none' }}>
              <span  style={{fontFamily:'YekanBakhFaMedium',fontSize:15,color:'#333'}} ><span name="pulse" style={{fontSize: 16, color: '#768883'}} />   سرویس ها</span>
            </Link>
            </div>  
            <div style={{backgroundColor:color,paddingRight:4,paddingLeft:4,borderRadius:20}}>   
            <div  onClick={()=>that.GetAccounts()}>
            <Link to={`${process.env.PUBLIC_URL}/Gardesh?account=`+data[i][1].value} className=""  style={{ textDecoration: 'none' }}>
              <span  style={{fontFamily:'YekanBakhFaMedium',fontSize:15,color:'#333'}} ><span name="pulse" style={{fontSize: 16, color: '#768883'}} />   گردش حساب</span>
            </Link>
            </div>
            </div>
            <div style={{backgroundColor:color,paddingRight:4,paddingLeft:4,borderRadius:20}}>       
              <div ><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,color:'#333'}} onClick={()=>that.GetAccounts()}><span name="refresh" style={{fontSize: 15, color: '#768883'}} />  به روزرسانی</span></div>

            </div> 
          </div>
          {data.length-1 != i &&
          <hr style={{backgroundColor:color,height:4,borderTop:2,marginTop:25}} />
          }
          </div>  
     }
     }
     that.setState({
      listViewData: ListView,
      ShowLoading:0
     })  
    
    } 
    let ECallBack = function(error){
      that.setState({
        ShowLoading:0
      })
    }
    
    var param = '{CommandNo : "3" , AccountNo: "' + that.props.account + '",Param1: "' + that.props.password + '" }';
    let ip = that.props.ip || "https://ansar24.com";

    that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack)
  }
  Price(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  render() {
     
    return (  
      !this.state.ShowLoading ?
      <div>
      <Header ComponentName="حسابها" />
      <div style={{display:'flex',height:'100%',justifyContent:'space-between'}} >


          <div style={{position:'relative',width:'100%',textAlign:'left',marginTop:30}}>
          {
            this.state.listViewData.map((item, index) => (
              <div>
                {item.data}
              </div>
                  
            )) 
          } 
          </div>
        </div>
        </div>

        
      :
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
        <ProgressSpinner style={{paddingTop:150}}/>
          
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
export default connect(mapStateToProps)(Hesab)  

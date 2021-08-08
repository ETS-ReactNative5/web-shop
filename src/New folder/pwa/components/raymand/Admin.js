import React, { Component } from 'react';
import { Badge } from 'primereact/badge';

import Server from '../Server.js'
import { connect } from "react-redux"
import Header from '../Header.js'
import { withRouter, Redirect, Link } from 'react-router-dom'
import Turnover from './Turnover.js'
import { ProgressSpinner } from 'primereact/progressspinner';

class Admin extends React.Component {       
  constructor(props){
    super(props);  
    this.Server = new Server();
    this.state={
      AccountNumber:this.props.location.search.split("account=")[1],
      Place:this.props.place,
      listViewData:[],
      Sort:"",
      loading:false,
      IsSeller:-1,
      url:this.Server.getUrl()
    }     
    
  }
  componentDidMount() {
    let that = this;
    this.init();
  }
  init() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      if(response.data.authData.userId){
        that.setState({
          UId: response.data.authData.userId,
          loading: 0
        })
      }
      
      that.getuserInformation(response.data.authData.userId);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getuserInformation(UId){

    let that = this;
    let param = {
      user_id:UId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        shopId:response.data.result ? response.data.result[0].shopId : null,
        isPayk:(response.data.result && response.data.result[0].map == "payk") ? true : false,
        loading: 0
      })
      that.getShop(response.data.result[0].shopId);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/getuserInformation", param, SCallBack, ECallBack)

  }
  getUserAniaFood(){
     
    let that = this;
    let SCallBack = function (response) {
      localStorage.setItem("api_token",response.data.token);
      
      that.init();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/getuser", {
      username: this.props.mobile,
      noPass:1
    }, SCallBack, ECallBack)
   
  }
  getShop(shopId){
    if(this.state.isPayk){
      this.setState({
        isPayk:1
      })
      return;
    } 
    if(!shopId){
      this.setState({
        IsSeller:0
      })
      if(!localStorage.getItem("food")){
        localStorage.setItem("food","1");
        this.getUserAniaFood();
      }
      else  
        return;
    }
    let that = this;
    let param = {
      ShopId:shopId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        shop:response.data.result[0],
        credit:response.data.result[0]?.credit||0,
        loading: 0,
        IsSeller:1
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)

  }
  render() {         
   
    if (this.state.isPayk) {
      return <Redirect to={"/Payk"} /> ;
    }
    return (   
       <div>
           <Header credit={this.state.credit} ComponentName="پذیرندگان" />
       <div> 
       <div style={{maxHeight:'calc(100% - 210px)',overflow:'auto'}}>    
        {this.state.IsSeller == 0 &&
            <div>
            <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center',color:'red' }}>
               شما به عنوان پذیرنده در سیستم تعریف نشده اید
             </p>
             <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>
               برای ثبت نام به عنوان پذیرنده و استفاده از امکانات فروش نقدی و اقساطی محصولات خود به صورت حضوری و آنلاین با پشتیبانان سیستم تماس بگیرید
             </p>

            </div>
        }
        {this.state.IsSeller == 1 &&
            <div>
              <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}} >
          <div style={{width:'48%',height:100,marginTop:10}}>
            <Link style={{position:'relative',width:122,textAlign:'left'}} to={`${process.env.PUBLIC_URL}/ManageProducts`} >
              <div  style={{background:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon20.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" >محصولات</span>
              </div>
            </Link>
          </div>

          <div style={{width:'48%',height:100,marginTop:10}}>
            <Link style={{position:'relative',width:122,textAlign:'left'}} to={`${process.env.PUBLIC_URL}/Factors`} >
              <div  style={{background:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon21.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" >سفارشات آنلاین</span>
              </div>
            </Link>
          </div>


        </div>
        <hr style={{borderColor:'#eaeaea42'}} />
            <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center',color:'green',fontSize:17,direction:'rtl' }}>
               موجودی مهر کارت  {this.state.shop?.name}  <br/> <span style={{fontSize:23}}>{this.state.credit.toString().replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال  </span>
             </p>
             
              <Turnover shop="1" shopId={this.state.shopId} />
            </div>
        }
        {this.state.IsSeller == -1 &&
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
            <ProgressSpinner style={{paddingTop:150}}/>
        </div>
        
        }
             
        </div>
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
export default connect(mapStateToProps)(Admin)  


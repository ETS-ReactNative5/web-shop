import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import Server  from './Server.js'
import queryString from 'query-string'
import Header1  from './Header1.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
class Invoice extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();

    this.state={
      refId:'',
      InMobileApp:"0",
      url: this.Server.getUrl()

    }
    
    //})
  }
  componentDidMount(){
    const value=queryString.parse(this.props.location.search);
    let refId = value.refId;
    if(refId || refId=="-1"){
      this.setState({
        refId:refId,
        InMobileApp:value.InMobileApp=="1" ? "1" : "0"
      })
      if(refId && refId !=-1){
        axios.post(this.state.url+'getuserInformation', {
          token: localStorage.getItem("api_token"),
          user_id:value.userId

        })
        .then(response => {
                let credit = response.data.result[0].credit;
                this.props.dispatch({
                  type: 'LoginTrueUser',    
                  CartNumber:0,
                  credit:credit
                })
                
            })
          .catch(error => {
    
          })
        
      }
      return;
    }
    let Authority = value.Authority,
        Amount = value.Amount,
        Status = value.Status,
        _id = value._id,
        userId = value.userId;
    this.setState({
      InMobileApp:value.InMobileApp == "undefined" ? "0" : value.InMobileApp
    })    
    if(Status=="NOK"){
      this.setState({
        refId : -1,
      })
      return;
    }
    var that = this
    //axios.post(this.state.url+'checktoken', {
     // token: userId
    //})
    //.then(response1 => {    
      
    axios.post(that.state.url+'verification' , {
      Amount: Amount,
      Authority:Authority,
      _id:_id,
      userId:userId
    }) 
    .then(response => {
      if(response.data.result){
        axios.post(this.state.url+'getuserInformation', {
          token: localStorage.getItem("api_token"),
          user_id:userId,
          project:{ "user.password": 0,"user.address": 0 ,"user.company": 0  ,"user.username": 0}

      })
      .then(response => {
              let credit = response.data.result[0].credit;
              that.props.dispatch({
                type: 'LoginTrueUser',    
                CartNumber:0,
                credit:credit,
                off:this.props.off
              })
              that.setState({
                refId : response.data.result,
                userId : userId
              })
          })
        .catch(error => {
  
        })
        
        /*let param={
          refId : response.data.result,
          username : null,
          Amount : Amount
        };
        let SCallBack = function(response){
          };
        let ECallBack = function(error){
              alert(error)
        }
        this.Server.send("MainApi/SetFactor",param,SCallBack,ECallBack)*/

      }
        
    }).catch(error => {
      // alert(error);
      that.setState({
        refId : -1,
       })
       console.log(error)
     })


  }
  persianNumber(input){
		var persian = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
		var string = (input + '').split('');
		var count = string.length;
		var num;
		for (var i = 0; i <= count; i++) {
		num = string[i];
		if (persian[num]) {
			string[i] = persian[num];
		}
		}
		return string.join('');
	}
  CloseWindow(){
      window.close();
  }
    render(){
     return (
       <div>
        <Header1 /> 
        <Header2 /> 
      <div className="container" style={{marginTop:15,minHeight:600}}>
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-7 mx-auto">
          <div className="card card-signin" style={{padding: 40}}>
            <div className="card-body" style={{paddingTop:0,paddingBottom:0,textAlign:'center'}}>
              <img src={require('../public/Ania.png')}  style={{width:115,marginBottom:20}}/>
              <h5 className="card-title text-center yekan"> فاکتور خرید</h5>

            </div>  
            {this.state.refId && this.state.refId != -1 &&
            <div  style={{textAlign:"center",opacity:1}} className="yekan alert alert-success ">
            پرداخت با موفقیت انجام شد  <br/>
            </div>
           
            }
            

            {this.state.refId && this.state.refId != -1 ? 
            <div  style={{textAlign:"center",opacity:1}} className="alert alert-primary yekan">
              <div>از خرید شما سپاسگزاریم</div><br/>
              رسید تراکنش <br /> <br /> <div style={{fontSize:21,color:'green'}}>  {this.persianNumber(this.state.refId)} </div><br/>
              <div>محصولات خریداری شده به زودی آماده و به آدرس شما ارسال می شود</div>
            </div>
            
            :
            this.state.refId != -1 ? 
            <div style={{textAlign:"center",opacity:1}} className="yekan alert alert-danger ">
            در حال دریافت اطلاعات ....  
            </div>

            : <div  style={{textAlign:"center",opacity:1}} className="yekan alert alert-danger ">
            پرداخت انجام نشد 
            </div>

            }
            {this.state.InMobileApp=="0" &&
           <div  style={{textAlign:"center",opacity:1}} className="yekan alert alert-success ">
              <a href="http://aniashop.ir">بازگشت به صفحه اصلی سایت</a>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>

        )
    }
}
const mapStateToProps = (state) => {
  return{
    CartNumber : state.CartNumber,
    off : state.off,
		credit:state.credit
  }
}
export default withRouter(
  connect(mapStateToProps)(Invoice)
);
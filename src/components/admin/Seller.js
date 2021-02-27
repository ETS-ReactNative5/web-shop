import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter,Redirect,Link} from 'react-router-dom'  
import axios from 'axios'  
import {AutoComplete} from 'primereact/autocomplete';
import Server  from './../Server.js'
import Header1  from './../Header1.js'
import Footer  from './../Footer.js' 
import Header2  from './../Header2.js'
import { Button } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Toast } from 'primereact/toast';

class Seller extends React.Component {
    constructor(props){
      super(props); 
      this.state = {
        userId:null,
        ShopId:null,
        HasShop:"0",
        name:"",
        address:"",
        GoToManagement:false,
        HasError:null,
        DisplayPage:false,
        pleaseWait:true
      }
      this.Server = new Server();
      this.toast =  React.createRef();

      this.CreateShop = this.CreateShop.bind(this)
      
		
    }
    componentDidMount(){
      let param={ //9132248532
        token: localStorage.getItem("api_token"),
      };
      let that = this;
      let SCallBack = function(response){
        that.setState({
          userId : response.data.authData.userId
        })
        if(response.data.authData.level != "2")
          that.setState({
            HasShop : "0",
            DisplayPage : true
          })
        else{
          that.setState({
            HasShop : "1",
            GoToManagement : true,
            DisplayPage:true
          }) 
          
        }
           
        that.props.dispatch({
          type: 'LoginTrueUser',    
          CartNumber:localStorage.getItem("CartNumber")
        })
       

      };
      let ECallBack = function(error){
        that.setState({
          DisplayPage:true,
          HasShop:"-1"
        })
        console.log(error)
      }
      this.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
    }
    CreateShop(){

      let param={
        UserId : this.state.userId,
        name : this.state.name,
        address : this.state.address,
        type:this.state.type,
        edit:"0"
      };
      let that = this;
      let SCallBack = function(response){
        localStorage.setItem("api_token","")
        localStorage.setItem("CartNumber",0)
        that.props.dispatch({
          type: 'LoginTrueUser',    
              CartNumber:0,
              off:0,
              credit:0
        })
        
        that.toast.current.show({severity: 'success', summary: 'ایجاد فروشگاه', detail: <div><span>فروشگاه <span>{that.state.name}</span> با موفقیت ایجاد شد </span><br/><Link to={`${process.env.PUBLIC_URL}/Login`} style={{ textDecoration: 'none', color: '#333' }}>ورود به سیستم</Link></div>, life: 8000});
        

      };
      let ECallBack = function(error){
        that.toast.current.show({severity: 'error', summary: 'ایجاد فروشگاه', detail: <div><span> اشکال در ثبت فروشگاه</span></div>, life: 8000});
        console.log(error)
      }
      this.Server.send("AdminApi/CreateShop",param,SCallBack,ECallBack)

    }
    render(){    
      if(this.state.GoToManagement){
        return <Redirect to='/admin/Management' />;

      } 
        return (
     <div dir="rtl" style={{display:this.state.DisplayPage ? "block" : "none"}}>
       <Toast ref={this.toast} position="top-right" style={{fontFamily:'YekanBakhFaBold',textAlign:'right'}} />

       <Header1 /> 
       <Header2 /> 

			<div className="container firstInPage" >
        <div style={{backgroundColor:'#fff',marginTop:50,padding:40,borderRadius:25}}>
				<div className="row justify-content-center">

					<div className="col-lg-12 col-12 order-1">
            <div style={{textAlign:'center'}} ><br/><br/>
						  <span className="yekan" style={{fontSize:25}}>غرفه خود را در آنیا بسازید</span><br/><br/>
              <span className="yekan"  style={{fontSize:25}}>محصولات خود را بفروشید</span>
            </div>
       </div>
       </div>
       
            {this.state.HasShop == "1" ?
               <div>
                 <div className="row justify-content-center">
                    <div className="col-lg-12">
                  <p style={{fontSize:20,textAlign:'right'}} className="yekan"><span style={{color:'red'}}>نام فروشگاه : </span>{this.state.name}</p>

                  </div>
                  </div>
              </div>
              : this.state.HasShop == "0" ?
              <div>
                  <div className="row justify-content-center">
                  <div className="col-lg-6"> 
                  <div className="row" >
                  
                    <div className="col-lg-12">

                    <div className="group">
                      <input  className="form-control yekan" autoComplete="off"  type="text" value={this.state.name} name="name" onChange={(event)=>this.setState({name:event.target.value})}  required="true"  />
                      <label >نام فروشگاه</label>

                    </div>
                    </div>
                      <div className="col-lg-12">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.address} name="address" onChange={(event)=>this.setState({address:event.target.value})}  required="true"/>
                        <label>آدرس فروشگاه</label>
                      </div>
                      </div>
                      <div className="col-lg-12">
                      <div className="group">
                      <select className="custom-select YekanBakhFaBold" value={this.state.type} name="type" onChange={(event) => this.setState({ type: event.target.value })} >
                        <option value="">زمینه فعالیت فروشگا را وارد کنید</option>
                        <option value="کالای دیجیتال">کالای دیجیتال</option>
                        <option value="محصولات فرهنگی">محصولات فرهنگی</option>
                        <option value="لوازم التحریر">لوازم التحریر</option>
                        <option value="کتاب">کتاب</option>
                        <option value="محصولات خوراکی">محصولات خوراکی</option>
                        <option value="پوشاک">پوشاک</option>
                        <option value="لوازم منزل">لوازم منزل</option>
                        <option value="سایر">سایر</option>


                      </select>
                      </div>
                      </div>
                      
                      </div>
                    </div>
                    <div className="col-12" style={{textAlign:'center'}}>
                    <button  className="btn btn-primary yekan" onClick={this.CreateShop}  style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}> اعمال </button>

                      </div>


                      
                      </div>
              </div>
              :
              <div>
                <div style={{textAlign:'center',marginTop:50,fontSize:20}} className="yekan">
                ایتدا در سیستم  <a href="/#/Login" >ثبت نام</a> کنید و یا <a href="/#/Login" >وارد شوید</a>
                  </div>
              </div>
            }

				</div>
      
	</div>
  <Footer />
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
	connect(mapStateToProps)(Seller)
   );

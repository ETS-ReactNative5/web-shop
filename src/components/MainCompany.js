import React, { Component } from 'react';
import Header  from './Header.js'
import MainBox4  from './MainBox4.js'
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


import SlideBox  from './SlideBox.js'
import Footer  from './Footer.js'  
import Server  from './Server.js'
import Login  from './Login.js'  
import {withRouter , NavLink ,Link,Redirect} from 'react-router-dom'
import { Accordion, AccordionTab } from 'primereact/accordion';

import Haraj  from './Haraj.js'



import { connect } from 'react-redux';

import axios from 'axios' 

class MainCompany extends React.Component {
    constructor(props){
        super(props)
        this.Server = new Server();
        this.onHide = this.onHide.bind(this);
        this.CreateSubSystem = this.CreateSubSystem.bind(this);
        this.toast = React.createRef();

        this.state={
            Autenticated:-1,
            username : null,
            loading:true,
            Blog:[],
            activeIndex:[0],
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl()

        }
   
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
            this.setState({
                Autenticated : 1,
                username : response.data.authData.username
            })
            this.getSettings();
        })
        .catch(error => {
            this.setState({
                Autenticated : 0
            })
            this.getSettings();
        })
    }
    getSettings() {
		let that = this;
		that.Server.send("AdminApi/getSettings", {}, function (response) {
	
		  if (response.data.result) {
			that.setState({
			  System: response.data.result[0] ? response.data.result[0].System : "shop",
        SeveralShop: response.data.result[0] ? response.data.result[0].SeveralShop : false,

			})
            that.getBlogs();

	
		  }
		}, function (error) {
            that.getBlogs();

		})
	
	
	}
    getPics(l, type) {
        let that = this;
        axios.post(this.state.url + 'getPics', {})
          .then(response => {
            response.data.result.map(function (item, index) {
              
              if (item.name == "file4"){
                that.setState({
                    logo4: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
                    link4: item.link,
                    text4: item.text
                  })
              }
                
                
              if (item.name == "file5")
                that.setState({
                  logo5: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
                  link5: item.link,
                  text5: item.text
                })
              that.setState({
                loading:false
              })
                  
            })
          })
          .catch(error => {
          })
    
      }
      onHide(event) {
        this.setState({ VisibleDialog: null });
    }
    getBlogs(){
        let that = this;
        
        let param={
            BlogId:this.state.id,
            condition:this.state.id ? {} : {FixPage:false} 
        }; 
        let SCallBack = function(response){
            that.setState({
                Blog:response.data.result,
                loading:0
            })
            that.getPics();

        };
        
        let ECallBack = function(error){
            that.getPics();

        }
        that.Server.send("AdminApi/getBlogs",param,SCallBack,ECallBack)
    }
    CreateSubSystem(){

      let param={
        name : this.state.name,
        address : this.state.address,
        mobile : this.state.mobile
      };  
      let that = this;
      let SCallBack = function(response){
        localStorage.setItem("api_token","")
        
        if(response.data.error)
          that.toast.current.show({severity: 'error', summary: 'ایجاد زیر سیستم', detail: <div><span> {response.data.result}</span></div>, life: 8000});
        else{
          that.toast.current.show({severity: 'success', summary: 'ایجاد زیر سیستم', detail: <div><span>زیر سیستم <span>{that.state.name}</span> با موفقیت ایجاد شد </span><br/><Link to={`${process.env.PUBLIC_URL}/Login`} style={{ textDecoration: 'none', color: '#333' }}>ورود به سیستم</Link></div>, life: 8000});
          that.setState({
            VisibleDialog:false
          })
          
        }

        

      };
      let ECallBack = function(error){
        that.toast.current.show({severity: 'error', summary: 'ایجاد زیر سیستم', detail: <div><span> اشکال در ثبت زیر سیستم</span></div>, life: 8000});
      }
      this.Server.send("AdminApi/CreateSubSystem",param,SCallBack,ECallBack)

    }
    render(){
    return (
            <div className="A-container" style={{backgroundColor:'#fff'}}>
                <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />
                <Header />
                <div className="row"  >
                    <div className="col-lg-9 col-12">
                    <SlideBox/> 

                    </div>
                  {this.state.Autenticated == 1 ?
                  <div className="col-lg-3 col-0 d-lg-block d-none "  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ height: '49%', overflow: 'hidden' }}>
                        
                        {this.state.link4 && this.state.link4.indexOf("http") > -1 ?
                          <a href={this.state.link4} className="" target="_blank" style={{ textDecoration: 'none' }}>
                            {this.state.text4 &&
                              <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgba(20, 15, 21, 0.09)', paddingBottom: 5, width: '37%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text4}</p>
                            }
                            <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo4})` }} ></div>
                          </a>
                          :
                          <Link to={`${process.env.PUBLIC_URL}/` + this.state.link4} className="" href="#" target="_blank" style={{ textDecoration: 'none' }}>
                            {this.state.text4 &&
                              <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgba(20, 15, 21, 0.09)', paddingBottom: 5, width: '37%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text4}</p>
                            }
                            <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo4})` }} ></div>
                          </Link>
                        }
                      </div>
                      <div style={{ height: '2%' }}>

                      </div>
                      <div style={{ height: '49%', overflow: 'hidden' }}>
                        {this.state.link5 && this.state.link5.indexOf("http") > -1 ?
                          <a href={this.state.link5} className="" target="_blank" style={{ textDecoration: 'none' }}>
                            {this.state.text5 &&
                              <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgb(20 15 21 / 76%)', paddingBottom: 5, width: '50%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text5}</p>
                            }
                            <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo5})` }} ></div>
                          </a>
                          :
                          <Link to={`${process.env.PUBLIC_URL}/` + this.state.link5} className="" href="#" target="_blank" style={{ textDecoration: 'none' }}>
                            {this.state.text5 &&
                              <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgb(20 15 21 / 76%)', paddingBottom: 5, width: '50%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text5}</p>
                            }
                            <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo5})` }} ></div>
                          </Link>
                        }

                      </div>
                    </div>

                  </div>
                :
                    <div className="col-lg-3 col-12">
                      {this.state.SeveralShop &&
                          <div style={{width:'100%',textAlign:'left'}}>
                           <button className="btn btn-info YekanBakhFaMedium" style={{marginTop:10}} onClick={()=>{this.setState({
                             VisibleDialog:true
                           })}}>زیر سیستم خود را بسازید</button>
                          </div>
                        }
                        {this.state.Autenticated == 0 &&
                            <Login noHeader={1} noFooter={1} />
                        }
                        
                        
                    </div>
                    }
                </div>
                <div className="row" style={{marginTop:50}}>
                <div className="col-12">
                <Accordion multiple activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({activeIndex: e.index})}>
    
    
                    {this.state.Blog.map((item,index)=>{
                        return(
                            <AccordionTab header={item.title}>
                                <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight" style={{textAlign:'right',overflow:'hidden',height:150}} />
                                <NavLink    className="car-details" to={`${process.env.PUBLIC_URL}/Blogs?id=`+item._id} style={{color:'#333',backgroundColor:'#eee',textDecoration:'none'}} >
                                    مشاهده متن کامل
                                </NavLink>
                            </AccordionTab>
                            
                        )
                    })}   
                </Accordion>
                <MainBox4 BrandTitle="برخی از مشتریان"/>

                </div>
                </div>
                {!this.state.loading ?
                    <Footer System={this.state.System} />
                :
                    <div style={{ textAlign: 'center' }}></div>
                }

              <Dialog visible={this.state.VisibleDialog} onHide={this.onHide}  style={{ width: '700px' }} maximizable={false} maximized={false}>
                  <div className="row">
                  <div className="col-12" style={{textAlign:'center',marginTop:15}}>
                  <p className="YekanBakhFaBold" style={{fontSize:18}}>پس از ساخت زیر سیستم بلافاصله امکان استفاده از امکانات آن برای شما فراهم خواهد شد</p>
                  </div>
                  <div className="col-12">
                    <div className="group">

                            <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="name" name="name" value={this.state.name} onChange={(event)=>{this.setState({name:event.target.value})}} required />
                            <label className="YekanBakhFaBold">نام مجموعه</label>
                    </div>
                    
                    </div>
                    <div className="col-12">
                    <div className="group">

                            <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="mobile" name="mobile" value={this.state.mobile} onChange={(event)=>{this.setState({mobile:event.target.value})}} required />
                            <label className="YekanBakhFaBold">شماره موبایل</label>
                    </div>
                    
                    </div>
                    <div className="col-12">
                    <div className="group">
                            <input type="text" className="form-control YekanBakhFaBold" style={{textAlign:'center'}} id="address" name="address" value={this.state.address} onChange={(event)=>{this.setState({address:event.target.value})}} required />
                            <label className="YekanBakhFaBold">آدرس</label>
                    </div>
                      </div>
                      <div className="col-12">
                      <button className="btn btn-info YekanBakhFaMedium" style={{marginTop:10}} onClick={this.CreateSubSystem}>ساخت </button>
                      </div>
                   
                  </div>
                </Dialog>
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
    connect(mapStateToProps)(MainCompany)
  );
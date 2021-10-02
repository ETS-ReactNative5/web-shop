import React, { Component } from 'react';
import Header  from './Header.js'
import MainBox4  from './MainBox4.js'
import { Toast } from 'primereact/toast';
import SaleSystem  from './admin/SaleSystem.js'


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
        this.CreateSubSystem = this.CreateSubSystem.bind(this);
        this.toast = React.createRef();

        this.state={
            Autenticated:-1,
            username : null,
            loading:true,
            Blog:[],
            activeIndex:null,
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
        AllowSubSystem:  response.data.result[0] ? response.data.result[0].AllowSubSystem : false,
        AllowRegister:  response.data.result[0] ? response.data.result[0].AllowRegister : false

			})
            //that.getBlogs();
            that.getPics();


	
		  }
		}, function (error) {
            //that.getBlogs();
            that.getPics();



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
            that.getPageLayout();

          })
          .catch(error => {
            that.getPageLayout();

          })
    
      }
    getBlogs(){
        let that = this;
        let param={
            BlogId:this.state.id,
            condition:this.state.id ? {} : {FixPage:false,draft:{$ne:true}} 
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
    getPageLayout(){
      let that = this;
      let param={
          page:'first' 
      }; 
      let SCallBack = function(response){
          that.setState({
              Layout:response.data.result[0].content,
              LayoutItems:response.data.result[0].items,
              loading:0
          })

      };
      
      let ECallBack = function(error){

      }
      that.Server.send("AdminApi/getPageLayout",param,SCallBack,ECallBack)
  }

    CreateSubSystem(){

      let param={
        name : this.state.name,
        latinName: this.state.latinName,
        pass : this.state.pass,
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
                <Header Company={1} />
                <div className="row"  >
                    
                    <div className="col-lg-12 col-12">
                    <SlideBox/> 

                    </div>
                  
                </div>
                <div className="row" style={{marginTop:50}}>
                <div className="col-12">
                <Accordion multiple activeIndex={this.state.activeIndex} style={{display:'none'}} onTabChange={(e) => this.setState({activeIndex: e.index})}>
    
    
                    {this.state.Blog.map((item,index)=>{
                        return(
                            <AccordionTab header={item.title}>
                                <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight blog" style={{textAlign:'right',overflow:'hidden'}} />
                                <NavLink    className="car-details" to={`${process.env.PUBLIC_URL}/Blogs?id=`+item._id} style={{color:'#333',backgroundColor:'#eee',textDecoration:'none'}} >
                                    مشاهده متن کامل
                                </NavLink>
                            </AccordionTab>
                            
                        )
                    })}   
                </Accordion>
                
                {this.state.Layout && this.state.Layout.map((item,index)=>{
                    if(!this.state.LayoutItems["hidden"+item.id]){
                      return(
                        <div style={{textAlign:'right',marginTop:index == 0 ? 0 : 100}}>
                            {this.state.LayoutItems["link"+item.id]
                            ?
                            this.state.LayoutItems["link"+item.id].indexOf("http://") != -1 ?
                            <a  href={this.state.LayoutItems["link"+item.id]} target="_blank" style={{cursor:'pointer'}} >
                              <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            </a>
                            :

                            <NavLink  to={this.state.LayoutItems["link"+item.id].indexOf("http://") != -1 ? this.state.LayoutItems["link"+item.id] : `${process.env.PUBLIC_URL}/${this.state.LayoutItems["link"+item.id]}`} target="_blank" style={{cursor:'pointer'}} >
                              <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            </NavLink>
                            :
                            <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            }
                        </div>
                        
                    )
                    }
                        
                    })}
                {this.state.Blog.map((item,index)=>{
                        return(
                            <div style={{textAlign:'right',marginTop:50}}>
                                <NavLink    className="car-details" to={`${process.env.PUBLIC_URL}/Blogs?id=`+item._id} style={{textDecoration:'none',fontSize:35}} >
                                  {item.title}                                </NavLink>
                                <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight blog" style={{textAlign:'right',overflow:'hidden'}} />
                                
                            </div>
                            
                        )
                    })}

                <MainBox4 BrandTitle="برخی از مشتریان"/>
                </div>
                </div>
                {!this.state.loading ?
                    <Footer System={this.state.System} />
                :
                    <div style={{ textAlign: 'center' }}></div>
                }

             
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
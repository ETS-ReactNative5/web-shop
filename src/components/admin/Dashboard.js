import React, { Component,useState } from 'react';
import axios from 'axios'  
import {Link,Redirect } from 'react-router-dom'
import Server  from '.././Server.js'
import { Sidenav,Nav,Dropdown,Icon} from 'rsuite';
import { Alert } from 'rsuite';
import { Badge,Button } from 'rsuite';
import  './Dashboard.css'
const styles = {
   width: '100%',
   display: 'inline-table',
   marginRight: 10,
   marginTop:15
 };

class Dashboard extends React.Component {
  constructor(props){    
    super(props);
    this.toggle = this.toggle.bind(this);
    this.Server = new Server();

    this.state={
      list : this.props.list||[],
      data:this.props.data||[],
      NewUsers:this.props.NewUsers||null,
      NewFactors:this.props.NewFactors||null,
      isOpen:false,
      setIsOpen:true,
      absoluteUrl:this.Server.getAbsoluteUrl(),
      url:this.Server.getUrl(1),
      ShopId : (this.props.data && this.props.data.length >0) ? this.props.data[0]._id : null,
      user_id: (this.props.data && this.props.data.length >0) ? this.props.data[0].UserId : null,
      name: (this.props.data && this.props.data.length >0) ? this.props.data[0].name : null,
      logo : (this.props.data && this.props.data.length >0 && this.props.data[0].logo ) ? this.Server.getAbsoluteUrl() + this.props.data[0].logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png",
     }
    this.logout = this.logout.bind(this);
    if(this.props.list && this.props.list.length>0)
      return; 
    

    this.getShopInformation();  
    
     
  }
  componentWillReceiveProps(newProps) {
    if(newProps.NewFactors)
      this.setState({
        NewFactors : this.persianNumber(newProps.NewFactors)
      })
    if(newProps.NewUsers)
      this.setState({
        NewUsers : this.persianNumber(newProps.NewUsers)
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
  GetFactors(){
    let that = this;
    if(this.state.NewFactors != null)
      return;
    let param={
      token: localStorage.getItem("api_token"),
      GetAll:1,
      SellerId:this.state.user_id
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      let NewFactors = 0;
      response.data.result.result.map(function(v,i){
        
        if(v.status=="1")
          NewFactors++;
      })
      that.setState({
        NewFactors:that.persianNumber(NewFactors)
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors",param,SCallBack,ECallBack)
  }
  GetUsers(){
    let that = this;
    if(this.state.NewUsers != null)
      return;
    this.setState({
      loading:1
    })
    let param={
      token: localStorage.getItem("api_token"),
      GetAll:1
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      var NewUsers=0;
      response.data.result.map(function(v,i){
        if(v.level=="0" && (v.levelOfUser == -1 || v.levelOfUser==null))
          NewUsers++;
        
      })
      that.GetFactors()
      that.setState({
        NewUsers:that.persianNumber(NewUsers)
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getuser",param,SCallBack,ECallBack)
  }
  getList(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function(response){
      let result = response.data.result;
      for(let i=0;i<result.length;i++){
        result[i].children=[];
        for(let j=0;j<result.length;j++){
          if(result[i].CId==result[j].Parent && result[i].IsTitle){
            result[i].children.push(result[j])
          }
        }
      }
      that.setState({
         list:result,
         username : response.data.user
      })
      that.GetUsers();

    }
       
   let ECallBack = function(error){
      console.log(error)
      Alert.error('عملیات انجام نشد', 5000);
    }
   this.Server.send("MainApi/GetComponentsList",param,SCallBack,ECallBack)
  }
  getShopInformation(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response1){
      that.setState({
        loading:0
      })
      that.setState({
        user_id : response1.data.authData.userId,
        ShopId:response1.data.authData.shopId
      })
      that.setState({
        loading:1
      })
      that.Server.send("AdminApi/ShopInformation",{UserId: that.state.user_id,ShopId:that.state.ShopId},function(response){
        that.setState({
          loading:0
        })
        if(response.data.result.length>0){
          that.setState({
            data:response.data.result,
            ShopId : response.data.result[0]._id,
            address:response.data.result[0].address,
            user_id:response.data.result[0].UserId,
            name:response.data.result[0].name,
            logo : response.data.result[0].logo ? that.state.absoluteUrl + response.data.result[0].logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png"
            
          })
        }
        
        that.getList();
      },function(error){
        that.setState({
          loading:0
        })
        that.getList();
      })

    };
    let ECallBack = function(error){
      that.setState({
        logout : true
      })
      that.setState({
        loading:0
      })
    }
    that.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
  }
  logout(e) {
	localStorage.setItem("api_token","")
	this.setState({
		logout : true
	})
   }
   toggle(){
      this.setState({
         isOpen:!this.state.isOpen
      })
   }

    render(){
    if (this.state.logout) {
        return <Redirect to={"/login"} push={true}/>;
    }
    if(this.state.list.length > 0 )
        return (
   <div>
		 
       <div  style={{textAlign:'center',margin:5}}>
       
       <div style={styles}>
             <Sidenav  defaultOpenKeys={['0', '2']} appearance="default" expanded={true}  >
             <Sidenav.Header>
               <a href="/" style={{textDecoration:'none'}}>
                  <img src={this.state.logo}  style={{marginTop:20}} className="d-none d-sm-inline-block" />
                  <p className="yekan" style={{marginTop:20,background:'#3ee6a8',color:'#fff',padding:4}}>{this.state.name}</p>
               </a>
              
      	    </Sidenav.Header> 
               <Sidenav.Body style={{overflow:'auto',direction:'ltr'}}>
                 <Nav>
                   
                   {this.state.list.map((v, i) => {
                         const icon = "fa " + v.icon;  
                         var LiClass="Dassbord-Items yekan"; 
                         if(!v.Parent){
                           if(v.children.length > 0){
                            return ( <Dropdown
                                      placement="rightStart"
                                      eventKey={i}
                                      title={v.FName}
                                      icon={v.icon ? <Icon icon="magic" /> : ""}
                                      className={LiClass}
                                    >
                                      {v.children.map((u,j) =>{
                                        return (
                                          <Dropdown.Item eventKey={i + "_" + j} href={"/#"+u.Url} className={LiClass}  className={v.class} params={{ testvalue: "hello" }} dashList={this.state.list} dashData={this.state.data}>{((u.FName=="لیست کاربران" && this.state.NewUsers) || (u.FName=="سفارشات" && this.state.NewFactors)) ?
                                                    ( 
                                                      v.FName=="لیست کاربران" ?
                                                     <Badge content={this.state.NewUsers}>
                                                       <div>{u.FName}</div>
                                                     </Badge>
                                                     :
                                                     <Badge content={this.state.NewFactors}>
                                                       <div>{u.FName}</div>
                                                     </Badge>
                                                    )
                                                    : 
                                                   u.FName}
                                           </Dropdown.Item>
                                        )
                                      })
                                      }
                                      
                                    </Dropdown>
                            )
                           }else{
                            return (    
                           
                              <Nav.Item eventKey="1" href={"/#"+v.Url}   className={LiClass} style={{textDecoration:'none',padding:5,textAlign:'right'}}  params={{ testvalue: "hello" }} dashList={this.state.list} dashData={this.state.data}>{((v.FName=="لیست کاربران" && this.state.NewUsers) || (v.FName=="سفارشات" && this.state.NewFactors)) ?  
                               ( 
                                 v.FName=="لیست کاربران" ?
                                <Badge content={this.state.NewUsers}>
                                  <div>{v.FName}</div>
                                </Badge>
                                :
                                <Badge content={this.state.NewFactors}>
                                  <div>{v.FName}</div>
                                </Badge>
                               )
                               : 
                              v.FName}</Nav.Item>
                            )
                           }                         
                         
                         }
                         
                      })
                     }
                      <Nav.Item style={{padding:5,textAlign:'right'}}><p onClick={this.logout} className="yekan" style={{color:'red'}}><em className="fa fa-power-off">&nbsp;</em> خروج</p></Nav.Item>
   
                 </Nav>
               </Sidenav.Body>
             </Sidenav>
             
            
      
           </div>
      </div>
                
                
                
	</div>	
        )
        else
        return (
         <div style={{marginRight:30}} >

            </div>
        )

    }
}
const headerStyles = {
	padding: 20,
	fontSize: 16,
	background: '#34c3ff',
	color: ' #fff',
	textAlign:'right'
   };
export default Dashboard;
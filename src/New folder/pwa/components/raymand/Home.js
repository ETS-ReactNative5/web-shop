import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux';
import Server from '../Server.js'
import Hesab from './Hesab.js'
import Vam from './Vam.js'
import Header from '../Header.js'
import Footer from '../Footer.js'


import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Toast } from 'primereact/toast';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { ProgressSpinner } from 'primereact/progressspinner';
import './Home.css'

const params5 = {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  loop: 1,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },
  pagination: {
    el: '.swiper-pagination'
  }
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()   // Create a ref object
    localStorage.removeItem("food");

    this.Server = new Server();
    this.state = {
      activePage: 1,
      CurrentTab: 1,
      credit: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()

    }


  }
  componentDidMount() {
    this.getUser();
  }
  getUser(){
    let that = this;
    that.setState({
      ShowLoading:1
    })
    this.Server.send("MainApi/getuser", { username: this.props.mobile, noPass: 1 }, function (response) {
      localStorage.setItem("api_token",response.data.token);
      
      that.getPics();
    }, function () {
      that.setState({
        page:'/'
      })

    })
  }
  getPics() {
    let that = this;
    this.Server.send("MainApi/getPics", {}, function (response) {

      response.data.result.map(function (item, index) {
        //that.getUser();
        if (item.name == "extra-file1"){
          that.setState({
            logo1: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
            link1: item.link
          })
        }
         
        if (item.name == "extra-file2")
          that.setState({
            logo2: item.fileUploaded ?  that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
            link2: item.link
          })
        if (item.name == "extra-file3")
          that.setState({
            logo3: item.fileUploaded ?  that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
            link3: item.link
          })
        if (item.name == "file4")
          that.setState({
            logo4: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
            link4: item.link,
            text4: item.text
          })
          
        if (item.name == "file5")
          that.setState({
            logo5: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
            link5: item.link,
            text5: item.text
          })
        if (item.name == "file8")
          that.setState({
            logo8: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
            link8: item.link,
            text8: item.text
          })
        if (item.name == "file9")
          that.setState({
            logo9: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
            link9: item.link,
            text9: item.text
          })  
        if (item.name == "file11"){
          that.setState({
            SpecialImage: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]
          })
        }
        if (item.name == "file13"){

          that.setState({
            loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]
          })
        }
            
      })
      setTimeout(()=>{
        that.setState({
          ShowLoading:0
        })
      },1)
      
    }, function () {

    })

  }

  render() {
    if (this.state.page) {
      return <Redirect to={this.state.page} />;
    }
    return (

      <div style={{ height: '100%' }} className="bg3">
        {!this.state.ShowLoading ?
        <div className="bg3">
     
        <div style={{textAlign:'center',display:'flex',justifyContent:'center'}}>
        <div style={{ backgroundColor: '#fff', height: 50, width: '75%', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '60%' }}>
              <img src="./icons/ansar_name.png" style={{ width: '100%' }} />

            </div>
            <div style={{ width: '25%' }}>
              <img src="./icons/ansar_logo.png" style={{ width: 40 }} />

            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}} >
          {this.props.username && 
            <div style={{width:'48%',height:100,marginTop:10}}>
              <Link style={{position:'relative',width:122,textAlign:'left'}} to={`${process.env.PUBLIC_URL}/Vam`} >
                <div  style={{background:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                  <img src="./icons/icon05.png?ver=1" style={{width:70}} />
                  <span className="YekanBakhFaMedium" >تسهیلات</span>
                </div>
              </Link>
            </div>
          }
          {this.props.username && 
            <div style={{width:'48%',height:100,marginTop:10}}>
              <Link style={{position:'relative',width:122,textAlign:'left'}} to={`${process.env.PUBLIC_URL}/Hesab`} >
                <div  style={{background:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                  <img src="./icons/icon08.png?ver=1" style={{width:70}} />
                  <span className="YekanBakhFaMedium" >حساب ها</span>
                </div>
              </Link>
            </div>
          }
          {this.props.username && 
            <div style={{width:'48%',height:100,marginTop:10}}>
              <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Shop?Type=credit&account=${this.state.AccountNumber}`} >
                <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                  <img src="./icons/icon03.png?ver=1" style={{width:70}} />
                  <span className="YekanBakhFaMedium" >مهرکارت</span>
                </div>
              </Link>
            </div>
          }
          {this.props.username && 
            <div style={{width:'48%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Shop?Type=&account=${this.state.AccountNumber}`} >

              <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon02.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" >خرید نقدی</span>
              </div>
            </Link>
            </div>
          }

          <div style={{width:'48%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/MainBox?food=1`} >
            <div  style={{backgroundColor:'#fff',position:'relative',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon04.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" >آنیافود</span>
              <span style={{color:'#000',position:'absolute',top:0,left:0,fontSize:11,display:'none'}} >به زودی</span>
            </div>
            </Link>

          </div>
          <div style={{width:'48%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/MainBox`} >
            <div  style={{backgroundColor:'#fff',position:'relative',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon01.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" >آنیاشاپ</span>
              <span style={{color:'red',position:'absolute',top:0,left:0,fontSize:11,display:'none'}} >به زودی</span>
            </div>
            </Link>
          </div>

        </div>
        <div style={{textAlign:'center',display:'flex',justifyContent:'center',marginTop:20}} >
          <div style={{width:'95%'}}>
              <Swiper {...params5} >
                    <div>
                      {this.state.link1 && this.state.link1.indexOf("http") > -1 ?
                        <Link to={this.state.link1} className=""  style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text1} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link1} className=""  href="#" style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text1} />
                        </Link>
                      }
                    </div>
                    <div>
                      {this.state.link2 && this.state.link2.indexOf("http") > -1 ?
                        <Link to={this.state.link2} className=""  style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo2} style={{borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text2} />

                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link2} className=""  href="#" style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo2} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text2} />

                        </Link>
                      }
                    </div>
                    <div>
                      {this.state.link3 && this.state.link3.indexOf("http") > -1 ?
                        <Link to={this.state.link3} className=""  style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text3} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link3} className=""  href="#" style={{ textDecoration: 'none' }}>
                          
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:130,width:'100%' }} title={this.state.text3} />
                        </Link>
                      }
                    </div>
                  </Swiper>
                  </div>
          </div>
          <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap'}} >
          <div style={{width:'30%',height:100,marginTop:10}}>
          <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Club`}  >

            <div style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>

              <img src="./icons/icon11.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >باشگاه مشتریان</span>


            </div>
            </Link>

          </div>
          {this.props.username && 
          <div style={{position:'relative',width:'30%',height:100,marginTop:10}}>
            <div style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon15.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >بیمه</span>
              <span style={{color:'red',position:'absolute',top:0,left:0,fontSize:10}} >به زودی</span>

            </div>
          </div>
          }
          {this.props.username && 
          <div style={{width:'30%',height:100,marginTop:10}}>
          <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Travel`}  >

            <div style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon18.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >سفر</span>

            </div>
            </Link>
          </div>
          }
          {this.props.username && 
          <div style={{width:'30%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Bill`}  >

            <div style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon12.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" style={{fontSize:12}} >پرداخت قبض</span>

              </div>
            </Link>
          </div>
          }
          {this.props.username && 
          <div style={{width:'30%',height:100,marginTop:10}}>
          <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/charge`}  >

            <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon13.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >شارژ</span>
            </div>
          </Link>
          </div>
          }
          {this.props.username && 
          <div style={{width:'30%',height:100,marginTop:10}}>
          <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Internet`}  >

            <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon14.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >بسته اینترنت</span>
            </div>
          </Link>
          </div>
          }
          <div style={{width:'30%',height:100,marginTop:10}}>
          <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Support`}  >
          <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>

              <img src="./icons/icon10.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >پشتیبانی</span>
            </div>
            </Link>
          </div>
          <div style={{width:'30%',height:100,marginTop:10}}>
            <Link to={`${process.env.PUBLIC_URL}/Turnover?Type=credit`} >
              <div style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon17.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" style={{fontSize:12}} >گزارش مهرکارت</span>

              </div>
            </Link>
          </div>
          <div style={{width:'30%',height:100,marginTop:10}}>
            <div onClick={()=>{
              localStorage.removeItem("api_token");
              localStorage.removeItem("food");
              this.props.dispatch({
                type: 'LoginTrue',
                LoginAnia:true,
                username: null,
                password: null,
                mobile: null
              })
              this.setState({
                page:'/'
              })
            }} style={{position:'relative',backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
              <img src="./icons/icon16.png?ver=1" style={{width:70}} />
              <span className="YekanBakhFaMedium" style={{fontSize:12}} >خروج</span>

            </div>
          </div>
          

        </div>
        <div style={{height:80}}>

          </div>
        <div style={{position:'fixed',bottom:0,width:'100%'}}>
        <Footer noBack="1" bgColor="#fff" />

        </div>
        </div>
        :
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
          <ProgressSpinner style={{ paddingTop: 150 }} />
        </div>
      }
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
    place: state.place,
    fullname: state.fullname,
    mobile: state.mobile,
    LoginAnia:state.LoginAnia
  }
}
export default connect(mapStateToProps)(Home)


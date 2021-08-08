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
class Travel extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()   // Create a ref object
    this.Server = new Server();
    localStorage.removeItem("food");
    this.state = {
      activePage: 1,
      CurrentTab: 1,
      credit: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()

    }


  }
  componentDidMount() {
    if(!this.props.username){
      this.setState({
        page:'/'
      })
    }
  }
 

  render() {
    
    return (

      <div style={{ height: '100%' }}>
       <Header ComponentName="سفر" />

        {!this.state.ShowLoading ?
        <div className="bg4" style={{height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',paddingTop:70}} >
         <div style={{width:'30%',height:100,marginTop:10}}>
            <a target="_blank" style={{marginBottom:20,zIndex:2}} href="http://heybilit.com"  >

            <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon09.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" style={{fontSize:12}} >خرید بلیط هواپیما</span>
              </div>
            </a>
          </div>
          <div style={{width:'30%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Reserve?number=1`}  >

            <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon19.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" style={{fontSize:12}} >رزرو ویلا باغ بهادران</span>
              </div>
            </Link>
          </div>
          <div style={{width:'30%',height:100,marginTop:10}}>
            <Link style={{marginBottom:20,zIndex:2}} to={`${process.env.PUBLIC_URL}/Reserve?number=2`}  >

            <div style={{backgroundColor:'#fff',borderRadius:7,width:'100%',height:'100%',color:'#000',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'space-around'}}>
                <img src="./icons/icon19.png?ver=1" style={{width:70}} />
                <span className="YekanBakhFaMedium" style={{fontSize:12}} >رزرو ویلا باغ بهادران ویژه</span>
              </div>
            </Link>
          </div>
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
    mobile: state.mobile
  }
}
export default connect(mapStateToProps)(Travel)


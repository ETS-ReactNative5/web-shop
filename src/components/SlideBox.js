import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';


import './Header1.css'
import Server from './Server.js'
import { connect } from 'react-redux';

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

class SlideBox extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.myRef = React.createRef()   // Create a ref object 
    this.state = {
      UId: null,
      levelOfUser: null,
      GotoLogin: false,
      pics: [],
      logo1: null,
      logo2: null,
      logo3: null,
      logo4: null,
      logo5: null,
      link1: null,
      link2: null,
      link3: null,
      link4: null,
      link5: null,
      text1: null,
      text2: null,
      text3: null,
      text4: null,
      text5: null,
      SpecialImage:null,
      loading: true,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()
    }
    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        this.setState({
          UId: response.data.authData.userId,
          levelOfUser: response.data.authData.levelOfUser
        })
        this.getSettings();
      })
      .catch(error => {
        this.getSettings();

      })




  }
  getSettings(){
    axios.post(this.state.url+'getSettings', {
        token: localStorage.getItem("api_token")
      })
      .then(response => {
        this.setState({
            Template:response.data.result ? response.data.result.Template : "1",
            ProductBase: response.data.result ? response.data.result.ProductBase : false,
            SaleFromMultiShops: response.data.result ? response.data.result.SaleFromMultiShops : false
        })
        this.getPics();

      })
      .catch(error => {
        console.log(error)
        this.getPics();

      })
  }
  persianNumber(input) {
    var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
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
  getPics(l, type) {
    let that = this;
    axios.post(this.state.url + 'getPics', {})
      .then(response => {
        response.data.result.map(function (item, index) {
          if (item.name == "file1"){
            that.setState({
              logo1: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
              link1: item.link,
              text1: item.text
            })
          }
           
          if (item.name == "file2")
            that.setState({
              logo2: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
              link2: item.link,
              text2: item.text
            })
          if (item.name == "file3")
            that.setState({
              logo3: item.fileUploaded ?  that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
              link3: item.link,
              text3: item.text
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
          that.setState({
            loading:false
          })
              
        })
      })
      .catch(error => {
      })

  }

  render() {

    return (


      !this.state.loading ?
        <div>
                {this.state.logo1 && this.state.logo2 ?
                <Swiper {...params5} style={{ position: 'absolute' }}>
                <div>
                  {this.state.link1 && this.state.link1.indexOf("http") > -1 ?
                    <Link to={this.state.link1} className="" target="_blank" style={{ textDecoration: 'none' }}>
                      {this.state.text1 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                      }
                      <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text1} />
                    </Link>
                    :
                    <Link to={`${process.env.PUBLIC_URL}/` + this.state.link1} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                      {this.state.text1 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                      }
                      <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text1} />
                    </Link>
                  }
                </div>

                <div>
                  {this.state.link2 && this.state.link2.indexOf("http") > -1 ?
                    <Link to={this.state.link2} className="" target="_blank" style={{ textDecoration: 'none' }}>
                      {this.state.text2 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                      }
                      <img src={this.state.logo2} style={{borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text2} />

                    </Link>
                    :
                    <Link to={`${process.env.PUBLIC_URL}/` + this.state.link2} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                      {this.state.text2 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                      }
                      <img src={this.state.logo2} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text2} />

                    </Link>
                  }
                </div>

                <div>
                  {this.state.link3 && this.state.link3.indexOf("http") > -1 ?
                    <Link to={this.state.link3} className="" target="_blank" style={{ textDecoration: 'none' }}>
                      {this.state.text3 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                      }
                      <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text3} />
                    </Link>
                    :
                    <Link to={`${process.env.PUBLIC_URL}/` + this.state.link3} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                      {this.state.text3 &&
                        <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ whiteSpace:'pre-wrap',overflow: 'hidden', maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                      }
                      <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text3} />
                    </Link>
                  }
                </div>
              </Swiper>
              :
              this.state.logo1 ?
              <div>
                <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',minHeight:150,width:'100%' }} title={this.state.text3} />
              </div>
              :
              <div>
              </div>
                }
                
                  

          

        </div>

        :
        <div style={{ zIndex: 10000 }} >
          <p style={{ textAlign: 'center' }}>
            
            <img src={this.state.loading_pic}  />
          </p>

        </div>


    )
  }
}
const mapStateToProps = (state) => {
  return {
    CartNumber: state.CartNumber,
    off: state.off
  }
}
export default withRouter(
  connect(mapStateToProps)(SlideBox)
);

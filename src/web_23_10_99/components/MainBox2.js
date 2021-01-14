import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import CatList from './CatList.js'
import Photos from './Photos.js'


import './Header1.css'
import Server from './Server.js'
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
const params6 = {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  loop: 1,
  slidesPerView: 1
}
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

const params4 = {
  autoplay: {
    delay: 7000,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: 1,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  }/*,
      pagination: {
        el: '.swiper-pagination'
      }*/
}
const params3 = {
  slidesPerView: 1,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },

  pagination: {
    el: '.swiper-pagination'
  }
}
const params1 = {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  loop: 1,
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  breakpoints: {
    1024: {
      slidesPerView: 5,
      spaceBetween: 40
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    }
  }
}
const params2 = {
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  breakpoints: {
    1024: {
      centeredSlides: false,
      slidesPerView: 3,
      spaceBetween: 20
    },
    768: {
      centeredSlides: false,
      slidesPerView: 3,
      spaceBetween: 15
    },
    640: {
      centeredSlides: false,
      slidesPerView: 2,
      spaceBetween: 10
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    }
  }

}
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
const responsiveOne = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
class MainBox2 extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.myRef = React.createRef()   // Create a ref object 
    this.state = {
      products: [],
      productsBestOff: [],
      BestShops: [],
      Newproducts: [{
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      },
      {
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      },
      {
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      }],
      UId: null,
      levelOfUser: null,
      MaxObj: [],
      HsrajDate: moment(),
      GotoLogin: false,
      GotoCart: false,
      pics: [],
      Randproducts: [],
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
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
      loading: true,
      cats: [],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()
    }
    this.SendToCart = this.SendToCart.bind(this);

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        this.setState({
          UId: response.data.authData.userId,
          levelOfUser: response.data.authData.levelOfUser
        })
        this.getPics();
      })
      .catch(error => {
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
  getCategory(p) {
    let condition = p ? { condition: { Parent: '', pic: { $ne: null } } } : { condition: { showInSite: true } };
    axios.post(this.state.url + 'GetCategory', condition)
      .then(response => {
        let resp = [];
        let forRem = []
        response.data.result.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
        if (p) {
          this.setState({
            cats: response.data.result
          })
          this.getCategory();

        }
        else {
          this.setState({
            catsList: response.data.result
          })
          this.getProducts(3, "new")
        }


      })
      .catch(error => {
        if (p)
          this.getCategory();
        else
          this.getProducts(3, "new")

        console.log(error)
      })

  }
  getPics(l, type) {
    let that = this;

    axios.post(this.state.url + 'getPics', {})
      .then(response => {
        response.data.result.map(function (item, index) {
          if (item.name == "file1")
            that.setState({
              logo1: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link1: item.link,
              text1: item.text
            })
          if (item.name == "file2")
            that.setState({
              logo2: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link2: item.link,
              text2: item.text
            })
          if (item.name == "file3")
            that.setState({
              logo3: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link3: item.link,
              text3: item.text
            })
          if (item.name == "file4")
            that.setState({
              logo4: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link4: item.link,
              text4: item.text
            })
          if (item.name == "file5")
            that.setState({
              logo5: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link5: item.link,
              text5: item.text
            })
        })
        that.getCategory(1);
      })
      .catch(error => {
        that.getCategory(1);
      })

  }
  roundPrice(price) {
    return price.toString();
    if (price == 0)
      return price;
    price = parseInt(price).toString();
    let C = "500";
    let S = 3;
    if (price.length <= 5) {
      C = "100";
      S = 2;
    }
    if (price.length <= 4) {
      C = "100";
      S = 2;
    }
    let A = price.substr(price.length - S, S)
    if (A == C || A == "000" || A == "00")
      return price;
    if (parseInt(A) > parseInt(C)) {
      let B = parseInt(A) - parseInt(C);
      return (parseInt(price) - B + parseInt(C)).toString();
    } else {
      let B = parseInt(C) - parseInt(A);
      return (parseInt(price) + B).toString();
    }


  }
  getProducts(l, type) {
    axios.post(this.state.url + 'getProducts', {
      token: localStorage.getItem("api_token"),
      levelOfUser: this.state.levelOfUser,
      type: type,
      limit: l
    })
      .then(response => {
        /*let off=[];
        response.data.result.map(function(v,i){
            off[i]=parseInt(v.off);
        })
        let Max = Math.max(...off);
        let obj = null;
        response.data.result.map(function(v,i){
            if(v.off==Max)
                obj=v;
        })*/
        if (!type) {

          if (response.data.result[0]) {
            var HarajDate = response.data.result[0].HarajDate,
              ExpireDate = response.data.result[0].ExpireDate,
              TodayDate = response.data.extra ? response.data.extra.TodayDate : null;


            if (ExpireDate >= TodayDate) {
              var that = this;
              var x = setInterval(function () {
                //let ExpireDate = (that.myRef && that.myRef.current && that.myRef.current.attributes.expiredate.value) ? that.myRef.current.attributes.expiredate.value : response.data.result[0].ExpireDate;
                let ExpireDate = (that.myRef.current && that.myRef.current && that.myRef.current.getElementsByClassName("swiper-slide-active") && that.myRef.current.getElementsByClassName("swiper-slide-active")[0].attributes.expiredate.value) ? that.myRef.current.getElementsByClassName("swiper-slide-active")[0].attributes.expiredate.value : response.data.result[0].ExpireDate;
                var distance = new Date(ExpireDate + " 23:59:59") - new Date(new moment().locale('fa').format("jYYYY/jMM/jDD HH:mm:ss"));

                var day = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element with id="demo"
                that.setState({
                  days: day,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds
                })

                // If the count down is finished, write some text
                if (distance < 0) {
                  that.setState({
                    MaxObj: []
                  })
                  clearInterval(x);
                  //document.getElementById("demo").innerHTML = "EXPIRED";
                }
              }, 1000);



              var maximg = this.state.absoluteUrl + response.data.result[0].fileUploaded.split("public")[1];
              this.setState({
                MaxObj: response.data.result,
                maximg: maximg
              })
            }
          }
          //this.getProducts(8,"bestselling");
          this.getProducts(8, "special");

        } else if (type == "special") {
          this.getProducts(10, "bestOff");
          this.setState({
            products: response.data.result
          })

        }
        else if (type == "bestOff") {
          this.setState({
            productsBestOff: response.data.result,
            loading: false
          })
          this.getProducts(3, "random")

        }
        else if (type == "new") {
          //this.getProducts(0,"Haraj_Day");
          this.getProducts(0);
          this.setState({
            Newproducts: response.data.result

          })

        }
        else if (type == "random") {
          this.setState({
            Randproducts: response.data.result
          })

        }



      })
      .catch(error => {
        console.log(error)
      })

  }

  SendToCart(PId, Number, UId, Price) {
    let that = this;

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        that.setState({
          UId: response.data.authData.userId
        })
        let param = {
          PId: PId,
          Number: Number,
          UId: response.data.authData.userId,
          Price: Price,
          Status: "0",
          Type: "insert",
          token: localStorage.getItem("api_token")
        };
        let SCallBack = function (response) {
          let res = response.data.result;
          //alert(res)
          /*let { history } = that.props;
          history.push({
              pathname: '/cart'
          })*/
          that.setState({
            GotoCart: true
          })

        };
        let ECallBack = function (error) {
          //alert(error)
        }
        that.Server.send("MainApi/ManageCart", param, SCallBack, ECallBack)

      })
      .catch(error => {
        that.setState({
          GotoLogin: true
        })
        console.log(error)
      })

  }
  render() {
    let C = this.state.MaxObj.length == 0 ? "col-lg-12 col-12" : "col-lg-8 col-12";
    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    if (this.state.GotoLogin) {
      return <Redirect to={"/login"} push={true} />;
    }
    if (this.state.GotoCart) {
      return <Redirect to={"/cart"} push={true} />;
    }
    return (


      !this.state.loading ?
        <div>



          <div class="row" >

            <div className="col-lg-12 col-12" >
              <div className="row" style={{ marginTop: 10, marginBottom: 20 }}>

                <div className="col-lg-9 col-12 TopSlider"  >
                  <Swiper {...params5} style={{ position: 'absolute' }}>
                    <div>
                      {this.state.link1 && this.state.link1.indexOf("http") > -1 ?
                        <Link to={this.state.link1} className="" target="_blank" style={{ textDecoration: 'none' }}>
                          {this.state.text1 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                          }
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text1} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link1} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text1 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                          }
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text1} />
                        </Link>
                      }
                    </div>

                    <div>
                      {this.state.link2 && this.state.link2.indexOf("http") > -1 ?
                        <Link to={this.state.link2} className="" target="_blank" style={{ textDecoration: 'none' }}>
                          {this.state.text2 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                          }
                          <img src={this.state.logo2} style={{borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text2} />

                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link2} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text2 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                          }
                          <img src={this.state.logo2} style={{ borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text2} />

                        </Link>
                      }
                    </div>

                    <div>
                      {this.state.link3 && this.state.link3.indexOf("http") > -1 ?
                        <Link to={this.state.link3} className="" target="_blank" style={{ textDecoration: 'none' }}>
                          {this.state.text3 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                          }
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text3} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link3} className="" target="_blank" href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text3 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                          }
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap' }} title={this.state.text3} />
                        </Link>
                      }
                    </div>
                  </Swiper>
                </div>
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

              </div>
            </div>
            {this.state.products.length > 0 &&
              <div className="col-lg-12 col-12"  >
                <div style={{ background: '#f08304', marginTop: 20, borderTopRightRadius: 50, borderBottomRightRadius: 100, marginRight: 20, marginBottom: 20 }} >
                  <div className=" backgroundsvg" style={{ direction: 'rtl', paddingRight: 0 }}>

                    <Swiper {...params2}>
                      <div style={{ maxWidth: 170 }}>
                        <p class="iranyekanweblight" style={{ marginTop: 15, color: '#fff', marginLeft: 20, fontSize: 22 }}>محصولات شگفت انگیز</p>
                        <img src={require('../public/pngfuel.png')} style={{ width: 170, marginTop: 20, marginRight: 20, opacity: 0.5, transform: 'rotate(20deg)' }} />
                      </div>
                      {this.state.products.map((item, index) => {
                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                        return (

                          <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ padding: 22, textDecorationStyle: 'none', borderRadius: 5, background: '#fff', color: '#333', maxWidth: 250 }}>
                            <div className="p-grid p-nogutter" >
                              <div className="p-col-12 c-product-box__img" align="center" >
                                <img src={img} alt="" />
                              </div>
                              <div className="p-col-12 car-data" style={{ marginTop: 10 }}>
                                <div className="car-title iranyekanwebmedium" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>

                                <div className="car-title iranyekanwebmedium" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
                                {
                                  item.number > 0
                                    ?
                                    <div>
                                      {(this.state.UId || !item.ShowPriceAftLogin) &&
                                        <div>
                                          {
                                            ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
                                              <div className="car-subtitle oldPrice  iranyekanwebmedium" style={{ textAlign: 'center', fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                              :
                                              <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696', height: 16 }} ></div>
                                          }
                                          <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center' }} ><span className="iranyekanwebmedium" style={{ float: 'left', fontSize: 11, marginTop: 10 }}>تومان</span> <span className="iranyekanwebmedium" style={{ fontSize: 20 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off)) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                                        </div>
                                      }
                                    </div>
                                    : (this.state.UId || !item.ShowPriceAftLogin) &&
                                    <div>
                                      <div className="car-subtitle iranyekanwebmedium" style={{ height: 22 }} ></div>

                                      <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center' }} ><span className="iranyekanwebmedium" style={{ fontSize: 14, marginTop: 10, color: 'red' }}>ناموجود</span> </div>

                                    </div>
                                }



                              </div>
                              {
                                item.number > 0 && (parseInt(this.props.off) + item.off) > "0" &&
                                <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 0 }} >{this.persianNumber(((!item.NoOff ? parseInt(this.props.off) : 0) + item.off))} %</div>

                              }

                            </div>
                          </Link>

                        )
                      })
                      }

                    </Swiper>
                  </div>

                </div>




              </div>
            }
            <div className="col-lg-12 col-12" >
            <div className="row" style={{ marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 20, padding: 20, borderRadius: 20 }}>
              {this.state.cats.map((item, index) => {
                if (item.pic && index < 4) {
                  return (
                    <div className="col-md-3 col-12 mb-md-0 mb-3">
                      <Link to={`${process.env.PUBLIC_URL}/products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ height: 150, width: '100%' }} src={this.state.absoluteUrl + item.pic.split("public")[1]}></img>
                      </Link></div>
                  )
                }
              })
              }

            </div>
            </div>
            {
              this.state.catsList[0] &&
              <CatList _id={this.state.catsList[0]._id} title={this.state.catsList[0].name} name={this.state.catsList[0].name} />

            }

            <Photos name="file6" Class="InlineImages" borderRadius="30" padding="20" width="100%" height="180" />
            {
              this.state.catsList[1] &&
              <CatList _id={this.state.catsList[1]._id} title={this.state.catsList[1].name} name={this.state.catsList[1].name} />

            }
            <div class="row" >
              <div className="col-md-6 col-12">
                <Photos name="file8" Class="InlineImagesHalf"  />
              </div>
              <div className="col-md-6 col-12">
                <Photos name="file9" Class="InlineImagesHalf"  />
              </div>
            </div>
            {
              this.state.catsList[2] &&
              <CatList _id={this.state.catsList[2]._id} title={this.state.catsList[2].name} name={this.state.catsList[2].name} />

            }
            <Photos name="file7" Class="InlineImages" borderRadius="30" padding="20" width="100%" height="180" />

            {
              this.state.catsList[3] &&
              <CatList _id={this.state.catsList[3]._id} title={this.state.catsList[3].name} name={this.state.catsList[3].name} />

            }

            <div className="col-lg-8 col-12" style={{ background: '#fff', display: 'none' }} >
              <div className="section-title " style={{ textAlign: 'right', marginTop: 4 }}><span className="title IRANYekan" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍   تازه ها   </span></div>


              <Swiper {...params4} >


                {this.state.Newproducts[0] &&
                  <div >
                    {
                      this.state.Newproducts[0].title &&
                      <div className="row justify-content-center"  >

                        <div className="col-md-7 col-12" style={{ textAlign: 'center' }}>

                          <div className="mt-md-5 yekan" style={{ textAlign: 'center' }} >
                            <span style={{ display: 'block' }}>{this.state.Newproducts[0].title} </span> <span style={{ color: '#1bd172' }}>{this.state.Newproducts[0].subTitle} </span>
                          </div>

                          {(this.state.UId || !this.state.Newproducts[0].ShowPriceAftLogin) &&
                            this.state.Newproducts[0].number > 0 ?
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="yekan" style={{ float: 'left', fontSize: 11, marginTop: 15 }}>تومان</span> <span className="yekan" style={{ fontSize: 30, marginTop: 30, color: 'brown' }}>{this.persianNumber(this.roundPrice((this.state.Newproducts[0].price - ((this.state.Newproducts[0].price * (this.state.Newproducts[0].off + (!this.state.Newproducts[0].NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                            :
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="iranyekanwebmedium" style={{ fontSize: 18, marginTop: 10, color: '#653c60' }}>ناموجود</span> </div>

                          }
                          <Link to={`${process.env.PUBLIC_URL}/Products?id=` + ((this.state.Newproducts[0].product_detail && this.state.Newproducts[0].product_detail.length > 0) ? this.state.Newproducts[0].product_detail[0]._id : this.state.Newproducts[0]._id)} className="caption button-radius animated fadeInRight yekan" href="#" style={{ marginTop: 60, display: "inline-block", textDecoration: 'none' }}><span className="icon fa fa-arrow-left"></span>مشاهده جزئیات</Link>


                        </div>
                        <div className="col-md-4 col-12">

                          <img src={this.state.absoluteUrl + (this.state.Newproducts[0].fileUploaded ? this.state.Newproducts[0].fileUploaded.split("public")[1] : "/nophoto.png")} />



                        </div>
                      </div>
                    }

                  </div>
                }
                {this.state.Newproducts[1] &&
                  <div >
                    {
                      this.state.Newproducts[1].title &&
                      <div className="row justify-content-center" >

                        <div className="col-md-7 col-12" style={{ textAlign: 'center' }}>

                          <div className="mt-md-5 yekan" style={{ textAlign: 'center' }} >
                            <span style={{ display: 'block' }}>{this.state.Newproducts[1].title} </span> <span style={{ color: '#1bd172' }}>{this.state.Newproducts[1].subTitle} </span>
                          </div>
                          {(this.state.UId || !this.state.Newproducts[1].ShowPriceAftLogin) &&
                            this.state.Newproducts[1].number > 0 ?
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="yekan" style={{ float: 'left', fontSize: 11, marginTop: 15 }}>تومان</span> <span className="yekan" style={{ fontSize: 30, marginTop: 30, color: 'brown' }}>{this.persianNumber(this.roundPrice((this.state.Newproducts[1].price - ((this.state.Newproducts[1].price * (this.state.Newproducts[1].off + (!this.state.Newproducts[1].NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                            :
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="iranyekanwebmedium" style={{ fontSize: 18, marginTop: 10, color: '#653c60' }}>ناموجود</span> </div>

                          }
                          <Link to={`${process.env.PUBLIC_URL}/Products?id=` + ((this.state.Newproducts[1].product_detail && this.state.Newproducts[1].product_detail.length > 0) ? this.state.Newproducts[1].product_detail[0]._id : this.state.Newproducts[1]._id)} className="caption button-radius animated fadeInRight yekan" href="#" style={{ marginTop: 60, display: "inline-block", textDecoration: 'none' }}><span className="icon fa fa-arrow-left"></span>مشاهده جزئیات</Link>

                        </div>
                        <div className="col-md-4 col-12">

                          <img src={this.state.absoluteUrl + (this.state.Newproducts[1].fileUploaded ? this.state.Newproducts[1].fileUploaded.split("public")[1] : "/nophoto.png")} />



                        </div>
                      </div>
                    }

                  </div>
                }
                {this.state.Newproducts[2] &&
                  <div >
                    {
                      this.state.Newproducts[2].title &&
                      <div className="row justify-content-center" >

                        <div className="col-md-7 col-12" style={{ textAlign: 'center' }}>

                          <div className="mt-md-5 yekan" style={{ textAlign: 'center' }} >
                            <span style={{ display: 'block' }}>{this.state.Newproducts[2].title} </span> <span style={{ color: '#1bd172' }}>{this.state.Newproducts[2].subTitle} </span>
                          </div>
                          {(this.state.UId || !this.state.Newproducts[2].ShowPriceAftLogin) &&

                            this.state.Newproducts[2].number > 0 ?
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="yekan" style={{ float: 'left', fontSize: 11, marginTop: 15 }}>تومان</span> <span className="yekan" style={{ fontSize: 30, marginTop: 30, color: 'brown' }}>{this.persianNumber(this.roundPrice((this.state.Newproducts[2].price - ((this.state.Newproducts[2].price * (this.state.Newproducts[2].off + (!this.state.Newproducts[2].NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                            :
                            <div className="car-subtitle yekan" style={{ textAlign: 'center', marginTop: 40 }} ><span className="iranyekanwebmedium" style={{ fontSize: 18, marginTop: 10, color: '#653c60' }}>ناموجود</span> </div>

                          }
                          <Link to={`${process.env.PUBLIC_URL}/Products?id=` + ((this.state.Newproducts[2].product_detail && this.state.Newproducts[2].product_detail.length > 0) ? this.state.Newproducts[2].product_detail[0]._id : this.state.Newproducts[2]._id)} className="caption button-radius animated fadeInRight yekan" href="#" style={{ marginTop: 60, display: "inline-block", textDecoration: 'none' }}><span className="icon fa fa-arrow-left"></span>مشاهده جزئیات</Link>

                        </div>
                        <div className="col-md-4 col-12">

                          <img src={this.state.absoluteUrl + (this.state.Newproducts[2].fileUploaded ? this.state.Newproducts[2].fileUploaded.split("public")[1] : "/nophoto.png")} />



                        </div>
                      </div>
                    }

                  </div>
                }
              </Swiper>

            </div>
            {

            this.state.MaxObj.length != "0" &&
            <div className="col-lg-12  col-12 Haraj pb-3" style={{ background: '#fff', marginTop: 0 }}>

              
                <div ref={this.myRef}>
                  <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ آفر هفته </span><Link to={`${process.env.PUBLIC_URL}/Products?Haraj=1`}  ><span className="yekan" style={{ fontSize: 12, outline: 0, float: 'left' }}> همه پیشنهادها</span></Link></div>


                  <Swiper {...params3} >
                    {this.state.MaxObj.map((item, index) => {
                      var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                      var img1 = this.state.absoluteUrl + item.fileUploaded1.split("public")[1];
                      var img2 = this.state.absoluteUrl + item.fileUploaded2.split("public")[1];
                      return (
                        <div expiredate={item.ExpireDate} className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ display: 'block', textDecorationStyle: 'none', color: '#333', margin: 5, padding: 5, borderRadius: 5, marginLeft: 0 }}>
                          <div className="row justify-content-center">

                            <div className="col-lg-6  col-12" align="center" >

                              <div className="car-title yekan  mt-md-5" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 22 }}>{item.title}</div>

                              <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 15, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
                              {
                                item.number > 0
                                  ?
                                  <div>
                                    {(this.state.UId || !item.ShowPriceAftLogin) &&
                                      <div>
                                        {
                                          ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
                                            <div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#8e7b7b' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                            :
                                            <div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#8e7b7b', height: 16 }} ></div>

                                        }
                                        <div className="car-subtitle yekan" style={{ textAlign: 'center', marginBottom: 15 }} ><span className="yekan" style={{ float: 'left', fontSize: 22, marginTop: 10 }}>تومان</span> <span className="iranyekanwebblack" style={{ fontSize: 40 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off + (!item.NoOff ? parseInt(this.props.off) : 0))) / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                                      </div>
                                    }
                                  </div>
                                  : (this.state.UId || !item.ShowPriceAftLogin) &&
                                  <div>
                                    <div className="car-subtitle yekan" style={{ height: 22 }} ></div>

                                    <div className="car-subtitle yekan" style={{ textAlign: 'center', marginBottom: 15 }} ><span className="yekan" style={{ fontSize: 22, marginTop: 10, color: 'red' }}>ناموجود</span> </div>
                                  </div>
                              }
                              <div className="ellipsis yekan" style={{ display: 'none', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5, maxWidth: 300, lineHeight: 3, textDecoration: 'none', height: 143 }} >{item.desc}</div>
                              <div className="row" style={{ marginTop: 50 }}>
                                <div className="col-md-5 col-12" style={{ marginBottom: 30 }}>

                                  {
                                    (item.off + (!item.NoOff ? parseInt(this.props.off) : 0)) > "0" &&
                                    <div style={{ position: 'relative' }}>
                                      <div className="car-title yekan off" style={{ position: 'absolute', top: -30, left: 3 }} > <span>  {this.persianNumber((item.off + (!item.NoOff ? parseInt(this.props.off) : 0)))} %</span> </div>
                                    </div>
                                  }

                                  <div className="deals_timer d-flex flex-row align-items-center justify-content-center" style={{ marginTop: 0 }}>

                                    <div >
                                      <div className="deals_timer_box clearfix" data-target-time="" style={{ marginTop: 10 }}>

                                        <div className="deals_timer_unit">
                                          <div id="deals_timer1_day" className="deals_timer_day yekan" style={{ fontSize: 25 }}>{this.state.days != "0" ? this.persianNumber(this.state.days) : ""}</div>
                                          <span className="yekan" style={{ fontSize: 14 }}>{this.state.days != "0" ? "روز" : ""}</span>
                                        </div>
                                        <div className="deals_timer_unit">
                                          <div id="deals_timer1_hr" className="deals_timer_hr yekan" style={{ fontSize: 25 }}>{this.state.hours != "0" ? this.persianNumber(this.state.hours) : ""}</div>
                                          <span className="yekan" style={{ fontSize: 14 }}>{this.state.hours != "0" ? "ساعت" : ""}</span>
                                        </div>
                                        <div className="deals_timer_unit">
                                          <div id="deals_timer1_min" className="deals_timer_min yekan" style={{ fontSize: 25 }}>{this.persianNumber(this.state.minutes)}</div>
                                          <span className="yekan" style={{ fontSize: 14 }}>دقیقه</span>
                                        </div>
                                        <div className="deals_timer_unit">
                                          <div id="deals_timer1_sec" className="deals_timer_sec yekan" style={{ fontSize: 25 }}>{this.persianNumber(this.state.seconds)}</div>
                                          <span className="yekan" style={{ fontSize: 14 }}>ثانیه</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-7 col-12">
                                  <Link to={`${process.env.PUBLIC_URL}/Products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} className="caption button-radius animated fadeInRight yekan" href="#" style={{ display: "inline-block", textDecoration: 'none' }}><span className="icon fa fa-arrow-left"></span>مشاهده جزئیات</Link>

                                </div>
                              </div>



                            </div>
                            <div className="col-lg-6 col-12">
                              <div className="row" style={{ height: '100%' }} >

                                <div className="col-md-8 col-12">
                                  <img src={img} alt="" style={{ borderRadius: 5, height: '100%', maxHeight: 350 }} />

                                </div>
                                {item.fileUploaded1 &&
                                  <div className="col-md-3 d-md-block d-none">
                                    <div style={{ border: '1px solid #ccc', borderRadius: 5 }}>
                                      <img src={img1} alt="" style={{ padding: 10, height: 150 }} />
                                    </div>
                                    <div style={{ border: '1px solid #ccc', borderRadius: 5, marginTop: 15 }}>
                                      <img src={img2} alt="" style={{ padding: 10, height: 150 }} />
                                    </div>


                                  </div>
                                }

                              </div>

                            </div>
                          </div>

                        </div>

                      )
                    })
                    }
                  </Swiper>
                </div>
             
            </div>
            }
            <div className="col-lg-12 col-12" style={{ backgroundColor: '#fff', marginTop: 20, display: 'none' }}   >
              {this.state.productsBestOff.length > 0 &&
                <div><div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 16, color: 'gray' }} >‍‍‍‍‍‍‍ محصولات پر تخفیف</span></div>
                  <Swiper {...params1} >
                    {this.state.productsBestOff.map((item, index) => {
                      var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                      return (
                        <div>
                          <Link className="car-details hvr-underline-reveal" to={`${process.env.PUBLIC_URL}/Products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ padding: 5, display: 'block', textDecorationStyle: 'none', color: '#333', border: "1px solid rgb(239 239 239)", margin: 5, padding: 5, borderRadius: 5 }}>
                            <div className="p-grid p-nogutter" >
                              <div className="p-col-12 c-product-box__img" align="center" >
                                <img src={img} alt="" />
                              </div>
                              <div className="p-col-12 car-data" style={{ marginTop: 10 }}>
                                <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>

                                <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>


                                {
                                  item.number > 0
                                    ?
                                    <div>
                                      {(this.state.UId || !item.ShowPriceAftLogin) &&
                                        <div>
                                          {
                                            ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
                                              <div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                              :
                                              <div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696', height: 16 }} ></div>

                                          }
                                          <div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><span className="yekan" style={{ float: 'left', fontSize: 11, marginTop: 10 }}>تومان</span> <span className="yekan" style={{ fontSize: 20 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off + (!item.NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                                        </div>
                                      }
                                    </div>
                                    : (this.state.UId || !item.ShowPriceAftLogin) &&
                                    <div>
                                      <div className="car-subtitle yekan" style={{ height: 22 }} > </div>

                                      <div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><span className="yekan" style={{ fontSize: 14, marginTop: 10, color: 'red' }}>ناموجود</span> </div>
                                    </div>
                                }

                              </div>
                              {
                                ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" &&
                                <div className="car-title yekan off" style={{ position: 'absolute', top: 0 }} >{this.persianNumber((item.off + (!item.NoOff ? parseInt(this.props.off) : 0)))} %</div>

                              }

                            </div>
                          </Link>
                        </div>

                      )
                    })
                    }
                  </Swiper></div>
              }
              <div style={{ display: 'none' }} >
                <Carousel
                  swipeable={true}
                  draggable={false}
                  showDots={false}
                  responsive={responsive}
                  ssr={true} // means to render carousel on server-side.
                  infinite={true}
                  autoPlay={false}
                  autoPlaySpeed={1000}
                  keyBoardControl={true}
                  customTransition="all .5"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  deviceType={this.props.deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                >
                  {this.state.productsBestOff.map((item, index) => {
                    var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                    return (
                      <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} >
                        <div className="p-grid p-nogutter" >
                          <div className="p-col-12" align="center" >
                            <img src={img} style={{ height: 80 }} alt="" />
                          </div>
                          <div className="p-col-12 car-data" style={{ marginTop: 10 }}>
                            <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>

                            <div className="car-title yekan" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
                            {(this.state.UId || !item.ShowPriceAftLogin) &&
                              <div>
                                {
                                  ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" &&
                                  <div className="car-subtitle yekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                }
                                <div className="car-subtitle yekan" style={{ textAlign: 'center' }} ><span className="yekan" style={{ float: 'left', fontSize: 11, marginTop: 10 }}>تومان</span> <span className="yekan" style={{ fontSize: 20 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off + (!item.NoOff ? parseInt(this.props.off) : 0))) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                              </div>
                            }

                          </div>
                          {
                            ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" &&
                            <div className="car-title yekan off" style={{ position: 'absolute', top: 0 }} >{this.persianNumber(((!item.NoOff ? parseInt(this.props.off) : 0) + item.off))} %</div>

                          }

                        </div>
                      </Link>

                    )
                  })
                  }
                </Carousel>
              </div>



            </div>


            <div className="col-lg-12 col-12" style={{ backgroundColor: '#fff', marginTop: 20, display: 'none' }}   >
              ///////////////////

              </div>


          </div>

        </div>

        :
        <div style={{ zIndex: 10000 }} >
          <p style={{ textAlign: 'center' }}>
            <img src={require('../public/loading.gif')} style={{ width: 320 }} />
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
  connect(mapStateToProps)(MainBox2)
);

import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner';


import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import CatList from './CatList.js'

import Header from './Header.js'
import Header1 from './Header1.js'

import CartBox from './CartBox.js'



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

class MainBox extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    let food = localStorage.getItem("food") || (this.props.location.search && this.props.location.search.split("food=")[1]);
    let aniaShop = (this.props.location.search && this.props.location.search.split("aniashop=")[1]);

    if(aniaShop)
      localStorage.removeItem("food");
    else
      localStorage.setItem("food",food);
    
    this.myRef = React.createRef()   // Create a ref object 
    this.state = {
      products: [],
      productsBestOff: [],
      BestShops: [],
      catsList:[],
      shopList:[],
      cats: [],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()
    }
    this.SendToCart = this.SendToCart.bind(this);
    localStorage.removeItem("api_token");

  }
  getUser(){
    let that = this;
    if(!that.props.mobile)
      return;
    that.Server.send("MainApi/getuser", {username:that.props.mobile,noPass:1}, function (response) {
      if(response.data.error){
        that.Server.send("MainApi/autoRegister", {username:that.props.mobile,password:that.props.password,address:'',name:that.props.fullname,RaymandUser:that.state.username}, function (response) {
        }, function (error) {
          localStorage.setItem("api_token",response.data.token);

        })
      }else{
        localStorage.setItem("api_token",response.data.token);


      }
      that.setState({
        api_token : response.data.token
      })
      
    }, function (error) {
      that.setState({
        ShowLoading: false
      })
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
  getCategory(p) {
    let condition = p ? { condition: { $or: [{Parent: ''},{Parent: null}], pic: { $ne: null } } } : { condition: { showInSite: true } };
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
          if(this.state.ProductBase){
            this.getProducts(3, "new")
          }else{
            this.getShops();
          }
        }


      })
      .catch(error => {
        if (p)
          this.getCategory();
        else

        console.log(error)
      })

  }
  getShops(){
      let condition = {condition:{showInSite:true}};
      axios.post(this.state.url + 'getShops', condition)
        .then(response => {
            this.getProducts(3, "new")

            this.setState({
              shopList: response.data.result
            })
            
  
  
        })
        .catch(error => {
            this.getProducts(3, "new")

        })
  
  }
  getPics(l, type) {
    let that = this;
    axios.post(this.state.url + 'getPics', {})
      .then(response => {
        response.data.result.map(function (item, index) {
          if (item.name == "file1"){
            that.setState({
              logo1: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
              link1: item.link,
              text1: item.text
            })
          }
           
          if (item.name == "file2")
            that.setState({
              logo2: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
              link2: item.link,
              text2: item.text
            })
          if (item.name == "file3")
            that.setState({
              logo3: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
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

        if (type == "special") {
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
          this.props.callback();
          this.getProducts(3, "random")

        }
        else if (type == "new") {
          //this.getProducts(0,"Haraj_Day");
          this.getProducts(0);
          this.setState({
            Newproducts: response.data.result

          })

        }
        else if(!type){
          this.getUser();

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
  componentDidMount() {

    this.getSettings();

  }
  render() {
    
    if (this.state.GotoLogin) {
      return <Redirect to={"/login"} push={true} />;
    }
    if (this.state.GotoCart) {
      return <Redirect to={"/cart"} push={true} />;
    }
    return (

      <div>
        <div className="row">
           <Header credit={this.state.credit} small="1" ComponentName="مجموعه فروشگاهی آنیا" />
           <div style={{padding:10}}>
           <Header1 />

             </div>
           <div style={{textAlign:'center',display:'flex',justifyContent:'center'}} >

            <div style={{width:'95%'}}>
              <Swiper {...params5} >
                    <div>
                      {this.state.link1 && this.state.link1.indexOf("http") > -1 ?
                        <Link to={this.state.link1}  style={{ textDecoration: 'none' }}>
                          {this.state.text1 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                          }
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:200,width:'100%' }} title={this.state.text1} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link1}  href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text1 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none animate__animated animate__fadeInLeftBig " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text1}</p>
                          }
                          <img src={this.state.logo1} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:200,width:'100%' }} title={this.state.text1} />
                        </Link>
                      }
                    </div>

                    <div>
                      {this.state.link2 && this.state.link2.indexOf("http") > -1 ?
                        <Link to={this.state.link2} className=""  style={{ textDecoration: 'none' }}>
                          {this.state.text2 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                          }
                          <img src={this.state.logo2} style={{borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:160,width:'100%' }} title={this.state.text2} />

                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link2} className=""  href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text2 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text2}</p>
                          }
                          <img src={this.state.logo2} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:200,width:'100%' }} title={this.state.text2} />

                        </Link>
                      }
                    </div>

                    <div>
                      {this.state.link3 && this.state.link3.indexOf("http") > -1 ?
                        <Link to={this.state.link3} className=""  style={{ textDecoration: 'none' }}>
                          {this.state.text3 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                          }
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:200,width:'100%' }} title={this.state.text3} />
                        </Link>
                        :
                        <Link to={`${process.env.PUBLIC_URL}/` + this.state.link3} className=""  href="#" style={{ textDecoration: 'none' }}>
                          {this.state.text3 &&
                            <p className="iranyekanweblight  p-md-3 d-md-block d-none " style={{ overflow: 'hidden', height: 300, maxHeight: 300, borderRadius: 5, position: 'absolute', zIndex: 2, fontSize: 18, color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(27 26 25 / 58%)', width: 350, textAlign: 'center', boxShadow: 'rgb(62 36 36) 10px 10px 15px', top: 30, left: 50 }}>{this.state.text3}</p>
                          }
                          <img src={this.state.logo3} style={{ borderRadius: 12, whiteSpace: 'pre-wrap',maxHeight:200,width:'100%' }} title={this.state.text3} />
                        </Link>
                      }
                    </div>
                  </Swiper>
                  </div>
          </div>
          <div className="col-12" style={{marginTop:5,marginBottom:5}}>
           <div style={{display:'flex',justifyContent:'space-around'}}>
             <div style={{width:'43%'}}>
             <Link to={`${process.env.PUBLIC_URL}/` + this.state.link4} href="#"  style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo4}></img>
                      </Link>
                      </div>
             <div style={{width:'43%'}}>
             <Link to={`${process.env.PUBLIC_URL}/` + this.state.link5} href="#"  style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo5}></img>
                      </Link>
                      </div>
               </div>
               
           
             </div>
          <div className="col-12" >
            {
              this.state.catsList[0] &&
              <CatList _id={this.state.catsList[0]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[0].name} name={this.state.catsList[0].name} />

            }
            </div>
            <div className="col-12" >
            {
              this.state.catsList[1] &&
              <CatList _id={this.state.catsList[1]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[1].name} name={this.state.catsList[1].name} />

            }
            </div>
            <div className="col-12" style={{marginTop:5,marginBottom:5}}>
           <div style={{display:'flex',justifyContent:'space-around'}}>
             <div style={{width:'43%'}}>
             <Link to={`${process.env.PUBLIC_URL}/` + this.state.link8} href="#"  style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo8}></img>
                      </Link>
                      </div>
             <div style={{width:'43%'}}>
             <Link to={`${process.env.PUBLIC_URL}/` + this.state.link9} href="#"  style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo9}></img>
                      </Link>
                      </div>
               </div>
               
           
             </div>
          
            <div className="col-12" >
            {
              this.state.catsList[2] &&
              <CatList _id={this.state.catsList[2]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[2].name} name={this.state.catsList[2].name} />

            }
            </div>
            
            <div className="col-12" >
            {
              this.state.catsList[3] &&
              <CatList _id={this.state.catsList[3]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[3].name} name={this.state.catsList[3].name} />

            }
            </div>
           

           
            <div className="col-12" >
            {
              this.state.catsList[4] &&
              <CatList _id={this.state.catsList[4]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[4].name} name={this.state.catsList[4].name} />

            }
            </div>
            <div className="col-12" >
            {
              this.state.catsList[5] &&
              <CatList _id={this.state.catsList[5]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[5].name} name={this.state.catsList[5].name} />

            }
            </div>
            <div className="col-12" >
            {
              this.state.catsList[6] &&
              <CatList _id={this.state.catsList[6]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[6].name} name={this.state.catsList[6].name} />

            }
            </div>
            

            <div className="col-12" >
            {
              this.state.catsList[7] &&
              <CatList _id={this.state.catsList[7]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[7].name} name={this.state.catsList[7].name} />

            }
            </div>
            <div className="col-12" >
            {
              this.state.catsList[8] &&
              <CatList _id={this.state.catsList[8]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[8].name} name={this.state.catsList[8].name} />

            }
            </div>
            <div className="col-12" >
            {
              this.state.catsList[9] &&
              <CatList _id={this.state.catsList[9]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[9].name} name={this.state.catsList[9].name} />

            }
            </div>
            

         <div style={{height:50}} />
         {this.state.api_token &&
            <CartBox />    
         }
        </div>

    </div>


    )
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
	  mobile : state.mobile,
    LoginAnia:state.LoginAnia
	}
}
export default withRouter(
  connect(mapStateToProps)(MainBox)
);

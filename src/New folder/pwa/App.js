import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Helmet } from "react-helmet";
/*import firebase from './firebase'*/

import Login from './components/raymand/Login.js'
import Gardesh from './components/raymand/Gardesh.js'
import Hesab from './components/raymand/Hesab.js'
import Vam from './components/raymand/Vam.js'
import reqVam from './components/raymand/reqVam.js'
import New from './components/raymand/New.js'


import ChangePass from './components/raymand/ChangePass.js'

import Factors from './components/ania/Factors.js'

import Payk from './components/ania/Payk.js'


import ManageProducts from './components/ania/ManageProducts.js'


import User from './components/User.js'

import Services from './components/raymand/Services.js'
import Cheque from './components/raymand/Cheque.js'
import Transfer from './components/raymand/Transfer.js'
import Shop from './components/raymand/Shop.js'
import Travel from './components/raymand/Travel.js'
import Club from './components/raymand/Club.js'
import Support from './components/ania/Supprot.js'

import Reserve from './components/raymand/Reserve.js'


import Shops from './components/Shops.js'
import QrCode from './components/raymand/QrCode.js'
import Admin from './components/raymand/Admin.js'

import BarCode from './components/raymand/BarCode.js'
import Cart from './components/Cart.js'
import Tag from './components/Tag.js'


import Category from './components/Category.js'
import Invoice from './components/Invoice.js'
import CatList from './components/CatList.js'
import Cities from './components/Cities.js'
import Iframes from './components/raymand/Iframes.js'

import Turnover from './components/raymand/Turnover.js'

import Charge from './components/Charge.js'

import Internet from './components/Internet.js'
import Bill from './components/Bill.js'


import Home from './components/raymand/Home.js'
import Server from './components/Server.js'
import ScrollToTop from './components/ScrollToTop.js'


import MainBox from './components/MainBox.js'

import Blogs from './components/Blogs.js'
import Form from './components/Form.js'


import Products from './components/Products.js'


import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import reducer from './reducer.js'
import { createStore } from 'redux'
import ReactGA  from 'react-ga';

class App extends Component {
  store = createStore(reducer);
  constructor(props) {
    super(props)
    this.Server = new Server();
    this.state = {
      STitle:"",
      Tags:"",
      ChatId: "",
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
  }
  componentDidMount () {
    //window.$crisp = [];
    //this.getSettings();
    
   };
   getSettings() {
    let that = this;
    that.Server.send("AdminApi/getSettings", {}, function (response) {

      if (response.data.result) {
        that.setState({
          STitle: response.data.result[0] ? response.data.result[0].STitle : "فروشگاه آنلاین ",
          Tags: response.data.result[0] ? response.data.result[0].Tags : '',
          ChatId: response.data.result[0] ? response.data.result[0].ChatId : ''
        })
        /*window.CRISP_WEBSITE_ID = "a44c0904-6e17-4f82-95e6-6043273a6609";//response.data.result[0] ? response.data.result[0].ChatId : '';
        (function() {
          var d = document;
          var s = d.createElement("script");
    
          s.src = "https://client.crisp.chat/l.js";
          s.async = 1;
          d.getElementsByTagName("head")[0].appendChild(s);

        })();*/

      }
    }, function (error) {
    })


  }
  
  render() {
    return (
      <div style={{height:'100%'}}>
        <Provider store={this.store} style={{height:'100%'}}>
          <HashRouter >
            <div style={{height:'100%'}}>
              
              <Helmet>
                <title>{this.state.STitle}</title>
                <link rel="shortcut icon" href="/favicon.png"></link>
                <meta name="theme-color" content="#20ad31" />
                <meta name="description"
                    content={this.state.Tags}/>
                <meta name="keywords"
                    content={this.state.Tags}/> 
                </Helmet>
              <ScrollToTop>
                <Switch>
                  <Route path="/" component={Login} exact />
                  <Route path="/Home" component={Home}  />
                  <Route path="/Gardesh" component={Gardesh}  />
                  <Route path="/Services" component={Services}  />
                  <Route path="/Transfer" component={Transfer}  />

                  <Route path="/Hesab" component={Hesab}  />
                  <Route path="/Charge" component={Charge}  />

                  <Route path="/Category" component={Category}  />

                  
                  <Route path="/Internet" component={Internet}  />
                  <Route path="/Bill" component={Bill}  />

                  
                  <Route path="/Vam" component={Vam}  />
                  <Route path="/QrCode" component={QrCode}  />
                  <Route path="/BarCode" component={BarCode}  />

                  
                  <Route path="/Turnover" component={Turnover}  />
                  <Route path="/Iframes" component={Iframes}  />
                  <Route path="/MainBox" component={MainBox}  />
                  <Route path="/Blogs" component={Blogs}  />
                  
                  <Route path="/Form" component={Form}  />

                  
                  <Route path="/Products" component={Products}  />

                  
                  <Route path="/Admin" component={Admin}  />

                  <Route path="/Cheque" component={Cheque}  />

                  <Route path="/Server" component={Server}  />

                  <Route path="/User" component={User} />

                  <Route path="/Shop" component={Shop} />
                  <Route path="/Shops" component={Shops} />
                  <Route path="/ChangePass" component={ChangePass} />
                  <Route path="/Travel" component={Travel} />
                  <Route path="/Club" component={Club} />
                  <Route path="/Support" component={Support} />

                  
                  <Route path="/Reserve" component={Reserve} />
                  
                  <Route path="/ManageProducts" component={ManageProducts} />

                  <Route path="/Factors" component={Factors} />
                  <Route path="/Payk" component={Payk} />
                  <Route path="/reqVam" component={reqVam} />
                  <Route path="/New" component={New} />
                  <Route path="/Cart" component={Cart} />
                  <Route path="/Invoice" component={Invoice} />
                  <Route path="/CatList" component={CatList} />
                  <Route path="/Tag" component={Tag} />
                </Switch>
              </ScrollToTop>
            </div>
          </HashRouter>
        </Provider>
      </div>
    );
  }
}

export default App;


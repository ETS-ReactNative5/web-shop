import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/app.css'

import { Helmet } from "react-helmet";
import MainBox1 from './components/MainBox1.js'

import Map from './components/Map.js'
import Photos from './components/Photos.js'




import Blogs from './components/Blogs.js'

import Blog from './components/admin/Blog.js'
import Cats from './components/admin/Cats.js'

import AdminLogin from './components/admin/Login.js'
import Login from './components/Login.js'
import Shop from './components/Shop.js'
import Comments from './components/admin/Comments.js'

import ScrollToTop from './components/ScrollToTop.js'


import Admin from './components/admin/Admin.js'
import Sales from './components/admin/Sales.js'
import Users from './components/admin/Users.js'
import Maps from './components/admin/Maps.js'
import Forms from './components/admin/Forms.js'
import Management from './components/admin/Management.js'
import Guarantee from './components/admin/Guarantee.js'
import Brands from './components/admin/Brands.js'

import Pics from './components/admin/Pics.js'

import Products from './components/Products.js'
import Cart from './components/Cart.js'
import Category from './components/Category.js'
import Register from './components/Register.js'
import Invoice from './components/Invoice.js'
import Dashboard from './components/admin/Dashboard.js'
import User from './components/User.js'
import ChangeInformation from './components/admin/ChangeInformation.js'
import Seller from './components/admin/Seller.js'
import ShopInformation from './components/admin/ShopInformation.js'
import ShopsList from './components/admin/ShopsList.js'
import Set from './components/admin/Set.js'
import CatList from './components/CatList.js'

import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import reducer from './reducer.js'

import { createStore } from 'redux'
import ReactGA from 'react-ga';
ReactGA.initialize('G-C524RVK7ZJ');
ReactGA.pageview(window.location.pathname + window.location.search);
class App extends Component {

  store = createStore(reducer);
  constructor(props) {
    super(props)
  }
  componentDidMount () {
    // Include the Crisp code here, without the <script></script> tags
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "ea0f60d8-ddbc-426f-ad20-287596e0b0ea";

    (function() {
      var d = document;
      var s = d.createElement("script");

      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
   };
  render() {
    return (

      <div >
        <Provider store={this.store}>
          <HashRouter >
            <div>
              <Helmet>
                {/*<title>امداد الکترونیک | emdcctv.com</title>*/}
                <title>آنیاشاپ | aniashop.ir</title>
                <link rel="shortcut icon" href="/favicon.png"></link>
                <meta name="theme-color" content="#20ad31" />
                <meta name="description"
                    content="فروشگاه آنلاین ، خرید اینترنتی ، اصفهان ، خرید اقساطی"/>
                <meta name="keywords"
                    content="کالای دیجیتال ، لپ تاپ ، موبایل ، خرید ، آنلاین"/>

              </Helmet>
              <ScrollToTop>
                <Switch>
                  <Route path="/" component={MainBox1} exact />
                  <Route path="/admin/Cats" component={Cats} />
                  <Route path="/admin/Admin" component={Admin} />
                  <Route path="/admin/Sales" component={Sales} />
                  <Route path="/admin/Users" component={Users} />
                  <Route path="/admin/Forms" component={Forms} />
                  <Route path="/admin/Maps" component={Maps} />
                  <Route path="/admin/Blog" component={Blog} />
                  <Route path="/Blogs" component={Blogs} />
                  <Route path="/admin/Management" component={Management} />
                  <Route path="/admin/Comments" component={Comments} />
                  <Route path="/admin/Guarantee" component={Guarantee} />
                  <Route path="/admin/Brands" component={Brands} />
                  <Route path="/admin/Pics" component={Pics} />
                  <Route path="/admin/Set" component={Set} />
                  <Route path="/admin/Dashboard" component={Dashboard} />
                  <Route path="/admin/ChangeInformation" component={ChangeInformation} />
                  <Route path="/Products" component={Products} />
                  <Route path="/Photos" component={Photos} />
                  <Route path="/Map" component={Map} />
                  <Route path="/CatList" component={CatList} />
                  <Route path="/MainBox1" component={MainBox1} exact />
                  <Route path="/Login" component={Login} />
                  <Route path="/admin/" component={AdminLogin} exact />
                  <Route path="/Shop" component={Shop} />
                  <Route path="/Cart" component={Cart} />
                  <Route path="/Category" exact component={Category} />
                  <Route path="/Register" component={Register} />
                  <Route path="/Invoice" component={Invoice} />
                  <Route path="/User" component={User} />
                  <Route path="/admin/Seller" component={Seller} />
                  <Route path="/admin/ShopInformation" component={ShopInformation} />
                  <Route path="/admin/ShopsList" component={ShopsList} />
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

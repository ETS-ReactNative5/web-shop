import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/app.css'
import { Helmet } from "react-helmet";
import MainShop from './components/MainShop.js'
import Map from './components/Map.js'
import Photos from './components/Photos.js'
import Charts from './components/Charts.js'
import Tag from './components/Tag.js'
import Blogs from './components/Blogs.js'
import Pages from './components/Pages.js'

import Blog from './components/admin/Blog.js'
import Cats from './components/admin/Cats.js'
import Billing from './components/admin/Billing.js'

import MoneyManagement from './components/admin/MoneyManagement.js'
import AppSettings from './components/admin/AppSettings.js'


import MehrCartClear from './components/admin/MehrCartClear.js'
import Company from './components/Company.js'


import AutoCredit from './components/admin/AutoCredit.js'
import LaonReq from './components/admin/LaonReq.js'
import AccReq from './components/admin/AccReq.js'



import Accounts from './components/admin/Accounts.js'
import SiteSettings from './components/admin/SiteSettings.js'
import AdminLogin from './components/admin/Login.js'
import Login from './components/Login.js'
import Shop from './components/Shop.js'
import Comments from './components/admin/Comments.js'
import ScrollToTop from './components/ScrollToTop.js'
import Admin from './components/admin/Admin.js'
import Sales from './components/admin/Sales.js'
import Sales_Registered from './components/admin/Sales_Registered.js'
import Sales_ReadyToSend from './components/admin/Sales_ReadyToSend.js'
import Sales_Posted from './components/admin/Sales_Posted.js'
import Sales_Ended from './components/admin/Sales_Ended.js'
import Sales_Cleared from './components/admin/Sales_Cleared.js'
import Create_Tags from './components/admin/Create_Tags.js'
import Codes_Files from './components/admin/Codes_Files.js'
import Cancel_Products from './components/admin/Cancel_Products.js'
import Canceled_Products from './components/admin/Canceled_Products.js'
import Server from './components/Server.js'
import withTracker from './components/withTracker';
import Users from './components/admin/Users.js'
import Maps from './components/admin/Maps.js'
import Forms from './components/admin/Forms.js'
import Management from './components/admin/Management.js'
import Guarantee from './components/admin/Guarantee.js'
import Ansar_Pic from './components/admin/Ansar_Pic.js'
import Brands from './components/admin/Brands.js'
import Pics from './components/admin/Pics.js'
import Edit_User_Credit from './components/admin/Edit_User_Credit.js'
import Products from './components/Products.js'
import Cart from './components/Cart.js'
import Category from './components/Category.js'
import Register from './components/Register.js'
import Invoice from './components/Invoice.js'
import Dashboard from './components/admin/Dashboard.js'
import User from './components/User.js'
import MainCompany from './components/MainCompany.js'
import ShopGroups from './components/admin/ShopGroups.js'
import SaleSystem from './components/admin/SaleSystem.js'

import Chat from './components/admin/Chat.js'

import ThermalPrinter from './components/admin/ThermalPrinter.js'

import Wallets from './components/admin/Wallets.js'
import Score_List from './components/admin/Score_List.js'

import Off_List from './components/admin/Off_List.js'
import Unit_List from './components/admin/Unit_List.js'
import Chat_Settings from './components/admin/Chat_Settings.js'
import FirstPageLayout from './components/admin/FirstPageLayout.js'
import TransferReqs from './components/admin/TransferReqs.js'


import ChangeInformation from './components/admin/ChangeInformation.js'
import Seller from './components/admin/Seller.js'
import ShopInformation from './components/admin/ShopInformation.js'
import ShopsList from './components/admin/ShopsList.js'
import Set from './components/admin/Set.js'
import CatList from './components/CatList.js'
import Cities from './components/Cities.js'
import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import reducer from './reducer.js'
import { createStore } from 'redux'
import ReactGA from 'react-ga';
import 'primereact/resources/themes/nova-alt/theme.css';
import { io } from "socket.io-client";

class App extends Component {

  store = createStore(reducer);
  constructor(props) {
    super(props)
    this.Server = new Server();
    this.state = {
      STitle: "",
      Tags: "",
      ChatId: "",
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
  }
  
  componentDidMount() {
    // Include the Crisp code here, without the <script></script> tags
    window.$crisp = [];
    ReactGA.initialize('G-TWHDY0YJDL');
    
    
    
    this.getSettings();

  };
  getSettings() {
    let that = this;

    that.Server.send("AdminApi/getSettings", {}, function (response) {

      if (response.data.result) {
        let chatId = response.data.result[0] ? response.data.result[0].ChatId : '';
        that.setState({
          STitle: response.data.result[0] ? response.data.result[0].STitle : "فروشگاه آنلاین ",
          Tags: response.data.result[0] ? response.data.result[0].Tags : '',
          ChatId: response.data.result[0] ? response.data.result[0].ChatId : '',
          System: response.data.result[0] ? response.data.result[0].System : 'shop',
          ColorTheme: response.data.result[0] ? response.data.result[0].ColorTheme : ''

        })
        if(response.data.result[0] && response.data.result[0].ColorTheme){
          import('primereact/resources/themes/'+response.data.result[0].ColorTheme+'/theme.css').then(Bar => {
            that.setState({
              themeLoaded:true
            })
          });
        }
        debugger;
        if(chatId.indexOf("Ania-") == -1){
          (function () {
            var d = document;
            var s = d.createElement("script");
  
            s.src = "https://client.crisp.chat/l.js";
            s.async = 1;
            d.getElementsByTagName("head")[0].appendChild(s);
          })();
          window.CRISP_WEBSITE_ID = chatId ;
        }
        else{
          window.AniaChatId=chatId;
          window.AniaChatInit(io,that.Server.getAbsoluteUrl())
        }
          
        

      }
    }, function (error) {
    })


  }

  render() {
    return (
      <div style={{height:'100%'}} >
        <Provider store={this.store}>
          <HashRouter >
            <div style={{background: "#fff",height:'100%'}}>
              
              <Helmet>
                <title>{this.state.STitle}</title>
                <link rel="shortcut icon" href="/favicon.png"></link>
                <meta name="theme-color" content="#20ad31" />
                <meta name="description"
                  content={this.state.Tags} />
                <meta name="keywords"
                  content={this.state.Tags} />
              </Helmet>
              <ScrollToTop>
                <Switch>

                  {this.state.System == "shop" &&
                    <Route path="/" component={withTracker(MainShop)} exact />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Cats" component={Cats} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/Tag" component={Tag} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales" component={Sales} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales_Registered" component={Sales_Registered} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales_ReadyToSend" component={Sales_ReadyToSend} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales_Posted" component={Sales_Posted} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales_Ended" component={Sales_Ended} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Sales_Cleared" component={Sales_Cleared} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Cancel_Products" component={Cancel_Products} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Canceled_Products" component={Canceled_Products} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Create_Tags" component={Create_Tags} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/Products" component={withTracker(Products)} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/CatList" component={CatList} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/MainShop" component={withTracker(MainShop)} exact />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/Shop" component={Shop} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/Cart" component={Cart} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/Category" exact component={Category} />
                  }
                  <Route path="/Invoice" component={Invoice} />
                  {this.state.System == "shop" &&
                    <Route path="/admin/Seller" component={Seller} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/ShopInformation" component={ShopInformation} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/ShopsList" component={ShopsList} />
                  }
                   
                  {this.state.System == "shop" &&
                    <Route path="/admin/Wallets" component={Wallets} />
                  }
                  {this.state.System == "shop" &&
                    <Route path="/admin/Score_List" component={Score_List} />
                  }

                  {this.state.System == "shop" &&
                    <Route path="/admin/Off_List" component={Off_List} />
                  }


                  {this.state.System == "company" &&
                    <Route path="/" component={withTracker(MainCompany)} exact />
                  }
                  {this.state.System == "company" &&
                  <Route path="/Company" component={Company} />
                }
                  <Route path="/admin/MehrCartClear" component={MehrCartClear} />
                  <Route path="/admin/AutoCredit" component={AutoCredit} />
                  <Route path="/admin/SaleSystem" component={SaleSystem} />

                  
                  <Route path="/Charts" component={Charts} />
                  <Route path="/admin/MoneyManagement" component={MoneyManagement} />
                  <Route path="/admin/AppSettings" component={AppSettings} />

                  
                  <Route path="/admin/Billing" component={Billing} />
                  <Route path="/admin/Accounts" component={Accounts} />
                  <Route path="/admin/Admin" component={Admin} />
                  <Route path="/admin/Users" component={Users} />
                  <Route path="/admin/Forms" component={Forms} />
                  <Route path="/admin/Maps" component={Maps} />
                  <Route path="/admin/Blog" component={Blog} />
                  <Route path="/Blogs" component={Blogs} />
                  <Route path="/Pages" component={Pages} />                  
                  <Route path="/Cities" component={Cities} />
                  <Route path="/admin/Management" component={Management} />
                  <Route path="/admin/Comments" component={Comments} />
                  <Route path="/admin/Guarantee" component={Guarantee} />
                  <Route path="/admin/Brands" component={Brands} />
                  <Route path="/admin/Edit_User_Credit" component={Edit_User_Credit} />
                  <Route path="/admin/Pics" component={Pics} />
                  <Route path="/admin/Set" component={Set} />
                  <Route path="/admin/Dashboard" component={Dashboard} />
                  <Route path="/admin/ShopGroups" component={ShopGroups} />
                  <Route path="/admin/ChangeInformation" component={ChangeInformation} />
                  <Route path="/Photos" component={Photos} />
                  <Route path="/Map" component={Map} />
                  <Route path="/Login" component={withTracker(Login)} />
                  <Route path="/admin/" component={AdminLogin} exact />
                  <Route path="/Register" component={Register} />
                  <Route path="/User" component={User} />
                  <Route path="/admin/SiteSettings" component={SiteSettings} />
                  <Route path="/admin/Codes_Files" component={Codes_Files} />
                  <Route path="/admin/Ansar_Pic" component={Ansar_Pic} />
                  <Route path="/admin/LaonReq" component={LaonReq} />
                  <Route path="/admin/AccReq" component={AccReq} />
                  <Route path="/admin/Unit_List" component={Unit_List} />
                  <Route path="/admin/Chat" component={Chat} />
                  <Route path="/admin/Chat_Settings" component={Chat_Settings} />
                  <Route path="/admin/ThermalPrinter" component={ThermalPrinter} />

                  
                  <Route path="/admin/FirstPageLayout" component={FirstPageLayout} />

                  <Route path="/admin/TransferReqs" component={TransferReqs} />

                  
                  
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

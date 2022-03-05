import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom'
import Server from '.././Server.js'
import { Alert } from 'rsuite';
import { io } from "socket.io-client";
import { Sidenav } from 'rsuite';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';

import { Toast } from 'primereact/toast';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SubMenu
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import './Dashboard.css'
const styles = {
  width: '100%',
  display: 'inline-table',
  marginRight: 10,
  marginTop: 15
};
var socket;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.Server = new Server();
    this.state = {
      list: this.props.list || [],
      data: this.props.data || [],
      NewUsers: this.props.NewUsers || null,
      NewFactors: this.props.NewFactors || null,
      isOpen: false,
      setIsOpen: true,
      SideVisible: false,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1),
      menuCollapse: false,
      ShopId: (this.props.data && this.props.data.length > 0) ? this.props.data[0]._id : null,
      user_id: (this.props.data && this.props.data.length > 0) ? this.props.data[0].UserId : null,
      name: (this.props.data && this.props.data.length > 0) ? this.props.data[0].name : null,
      logo: (this.props.data && this.props.data.length > 0 && this.props.data[0].logo) ? this.Server.getAbsoluteUrl() + this.props.data[0].logo.split("public")[1] : "http://siteapi.sarvapps.ir/nophoto.png",
    }
    socket = io(this.Server.getAbsoluteUrl());
    socket.on("connect", (data) => {

    })
    this.toast = React.createRef();

    this.logout = this.logout.bind(this);
    if (this.props.list && this.props.list.length > 0)
      return;
    this.GoToForm = this.GoToForm.bind(this);


    this.getShopInformation();


  }
  componentDidMount() {
    socket.on("factorCreated", (data) => {
      var product = "";
      var warningNumber = "";
      var errorNumber = "";
      if (data.products_id) {
        for (let i = 0; i < data.products_id.length; i++) {
          product += "" + data.products_id[i].title + " \n (" + data.products_id[i].number + ") عدد";
          if (data.products_id[i].RemainedNumber == 0) {

            errorNumber += "" + data.products_id[i].title + "\n ";
          }
          else if (data.products_id[i].RemainedNumber < 3) {

            warningNumber += "" + data.products_id[i].title + "\n ";
          }
        }
      }

      let msg = <div>
        <div>سفارش جدیدی ثبت شد</div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{product}</div>
      </div>
      this.toast.current.show({ sticky: true, severity: 'success', summary: msg, position: 'bottom-left' });
      if (warningNumber) {
        this.toast.current.show({
          sticky: true, severity: 'warn', summary: <div>
            <div>موجودی محصولات زیر رو به پایان است</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{warningNumber}</div>
          </div>, position: 'bottom-left'
        });
      }
      if (errorNumber) {
        this.toast.current.show({
          sticky: true, severity: 'error', summary: <div>
            <div>موجودی محصولات زیر  به پایان رسیده است</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{errorNumber}</div>
          </div>, position: 'bottom-left'
        });
      }


    });

  }
  componentWillReceiveProps(newProps) {
    if (newProps.NewFactors)
      this.setState({
        NewFactors: this.persianNumber(newProps.NewFactors)
      })
    if (newProps.NewUsers)
      this.setState({
        NewUsers: this.persianNumber(newProps.NewUsers)
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
  GetFactors() {
    let that = this;
    if (this.state.NewFactors != null)
      return;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1,
      SellerId: this.state.user_id
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      let NewFactors = 0;
      response.data.result.result.map(function (v, i) {

        if (v.status == "1")
          NewFactors++;
      })
      that.setState({
        NewFactors: that.persianNumber(NewFactors)
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors", param, SCallBack, ECallBack)
  }
  GetUsers() {
    let that = this;
    if (this.state.NewUsers != null)
      return;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      var NewUsers = 0;
      response.data.result.map(function (v, i) {
        if (v.level == "0" && (v.levelOfUser == -1 || v.levelOfUser == null))
          NewUsers++;

      })
      that.GetFactors()
      that.setState({
        NewUsers: that.persianNumber(NewUsers)
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getuser", param, SCallBack, ECallBack)
  }
  getList() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function (response) {
      let res = [];
      let result = response.data.result;
      for (let i = 0; i < result.length; i++) {
        result[i].items = [];

        for (let j = 0; j < result.length; j++) {
          result[j].icon_1 = result[j].Icon;
          result[j].label = result[j].FName;

          if (result[i].CId == result[j].Parent && result[i].IsTitle) {
            result[i].items.push(result[j]);
            result[j].remove = 1;
          }
          result[j].command = (event) => {
            let u = event.item;
            if (u.items && u.items.length > 0);
            else {
              that.GoToForm(u.CId, u.IsReport, u.help)

            }
          }
        }
      }
      for (let i = 0; i < result.length; i++) {
        if (result[i].items.length == 0)
          delete result[i].items
        if (!result[i].remove)
          res.push(result[i])
      }
      that.setState({
        list: res,
        username: response.data.user
      })
      that.GetUsers();

    }

    let ECallBack = function (error) {
      console.log(error)
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("MainApi/GetComponentsList", param, SCallBack, ECallBack)
  }
  getShopInformation() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.setState({
        loading: 0
      })
      that.setState({
        user_id: response1.data.authData.userId,
        ShopId: response1.data.authData.shopId
      })
      that.setState({
        loading: 1
      })
      that.Server.send("AdminApi/ShopInformation", { UserId: that.state.user_id, ShopId: that.state.ShopId }, function (response) {
        that.setState({
          loading: 0
        })
        if (response.data.result.length > 0) {
          that.setState({
            data: response.data.result,
            ShopId: response.data.result[0]._id,
            address: response.data.result[0].address,
            user_id: response.data.result[0].UserId,
            name: response.data.result[0].name,
            logo: response.data.result[0].logo ? that.state.absoluteUrl + response.data.result[0].logo.split("public")[1] : "http://siteapi.sarvapps.ir/nophoto.png"

          })
        }

        that.getList();
      }, function (error) {
        that.setState({
          loading: 0
        })
        that.getList();
      })

    };
    let ECallBack = function (error) {
      that.setState({
        logout: true
      })
      that.setState({
        loading: 0
      })
    }
    that.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  logout(e) {
    localStorage.setItem("api_token", "")
    this.setState({
      logout: true
    })
  }
  goToHome(e) {
    this.setState({
      goToHome: true
    })
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
  GoToForm(CId, IsReport, help) {

    this.setState({
      SideVisible: false
    })
    this.props.callback({ CId: CId, IsReport: IsReport, help: help });
    window.scrollTo(0, 0);
  }
  render() {
    if (this.state.logout) {
      return <Redirect to={"/"} push={true} />;
    }
    if (this.state.goToHome) {
      return <Redirect to={"/"} push={true} />;
    }
    
    if (this.state.list.length > 0)
      return (
        <div id="menu-dashboard">

          <div style={{ textAlign: 'center', margin: 5 }}>
            <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

            <div>
              <div className="closemenu d-md-none d-block" onClick={() => { this.setState({ SideVisible: !this.state.SideVisible }) }}>
                <i className="far fa-align-justify" style={{ color: 'red' }} />
              </div>

             

            <div style={{ position: 'inherit', height: 'auto', overflowY: 'auto', fontFamily: 'IRANYekan' }}  >

                <ProSidebar collapsed={this.state.menuCollapse} className="d-md-block d-none">

                  <SidebarHeader>

                    <div className="logotext" style={{textAlign:'center'}}>
                      {this.state.menuCollapse ?
                        <span href="#" onClick={()=>{this.setState({ menuCollapse: !this.state.menuCollapse }); return false;}} style={{ textDecoration: 'none',cursor:'pointer' }}>
                          <img src={this.state.logo} style={{ marginTop: 20,maxHeight:50 }} />

                        </span>
                        :
                        <span onClick={()=>{this.setState({ menuCollapse: !this.state.menuCollapse }); return false;}} style={{ textDecoration: 'none' }}>
                          <img src={this.state.logo} style={{ marginTop: 20, maxWidth: 150,maxHeight:82 }} />
                          <p className="yekan" style={{ marginTop: 20, padding: 4, display: 'flex', justifyContent: 'space-around', fontSize: 16, alignItems: 'center',cursor:'pointer' }}>
                            <span>{this.state.name}</span>
                          </p>
                        </span>
                      }
                    </div>

                  </SidebarHeader>
                  <SidebarContent>
                    <Menu iconShape="square">
                      <MenuItem icon={<i className="fal fa-home" style={{ color: '#fff',fontSize:28,marginLeft:8 }} />}  onClick={()=>{this.goToHome()}}>خانه</MenuItem>
                      {this.state.list.map((item, index) => {
                        if (item.items) {
                          return (
                            <SubMenu title={item.FName} icon={<i className={item.icon_1} style={{ color: '#fff',fontSize:28,marginLeft:8 }} />}>

                              {item.items.map((subMenu, index2) => {
                                return (
                                  <MenuItem  onClick={() => { this.GoToForm(subMenu.CId, subMenu.IsReport, subMenu.help) }} className="main">{subMenu.FName}</MenuItem>
                                )
                              })}
                            </SubMenu>
                          )

                        } else {
                          return (
                            <MenuItem icon={<i className={item.icon_1} style={{ color: '#fff',fontSize:28,marginLeft:8 }} />} className="exit" onClick={() => { this.GoToForm(item.CId, item.IsReport, item.help) }}>{item.FName}</MenuItem>
                          )
                        }


                      })}
                       <MenuItem icon={<i className="fas fa-sign-out-alt" style={{ color: 'red',fontSize:28,marginLeft:8 }} />}  onClick={this.logout}>خروج</MenuItem>

                    </Menu>
                  </SidebarContent>
                  
                </ProSidebar>
                <Sidebar position="right" visible={this.state.SideVisible} onHide={() => this.setState({
                  SideVisible: false
                })}>
                  <Sidenav defaultOpenKeys={['0', '2']} appearance="default" expanded={true}  >
                    <Sidenav.Header>
                      <a href="/" style={{ textDecoration: 'none' }}>
                        <img src={this.state.logo} style={{ marginTop: 20 }} className="d-none d-sm-inline-block" />
                        <p className="yekan" style={{ marginTop: 20, padding: 4 }}>{this.state.name}</p>
                      </a>

                    </Sidenav.Header>
                    <Sidenav.Body style={{ overflow: 'auto', direction: 'ltr' }}>
                      <PanelMenu model={this.state.list} style={{ direction: 'rtl' }} className="yekan" />

                    </Sidenav.Body>
                  </Sidenav>
                </Sidebar>


              </div>




            </div>
          </div>



        </div>
      )
    else
      return (
        <div style={{ marginRight: 30 }} >

        </div>
      )

  }
}

export default Dashboard;
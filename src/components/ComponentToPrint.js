import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header1 from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { TabMenu } from 'primereact/tabmenu';
import { ProgressSpinner } from 'primereact/progressspinner';
import Footer from './Footer.js'
import Header2 from './Header2.js'
import { DataTable } from 'primereact/datatable';
import './User.css'
import { Alert } from 'rsuite';
import { Link } from 'react-router-dom'
import Cities from './Cities.js'


import Mapir from "mapir-react-component";
let markerArray=new Array(),lat,lon;


export class  ComponentToPrint extends React.Component {

  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      param:this.props.param,
      html:'',
      url: this.Server.getUrl(),
      absoluteUrl: this.Server.getAbsoluteUrl(),

    }




  }
  componentWillReceiveProps(newProps){
    if(newProps.param && newProps.printType != "QrCode"){
      let address = newProps.param.address ? newProps.param.address : '';
      let name = newProps.param.name ? newProps.param.name : '';
      let trs=""
      for(let i=0;i<newProps.param.products.length >0 ;i++){
        if(this.props.SeveralShop){
          trs +="<tr><td>"+(i+1)+"</td><td>"+newProps.param.products[i].title+"</td><td>"+newProps.param.products[i].SellerName+"</td><td>"+newProps.param.products[i].number+"</td><td>"+newProps.param.products[i].UnitPrice+" تومان</td><td>"+newProps.param.products[i].price+" تومان</td></tr>"

        }else{
          trs +="<tr><td>"+(i+1)+"</td><td>"+newProps.param.products[i].title+"</td><td>"+newProps.param.products[i].subTitle+"</td><td>"+newProps.param.products[i].number+"</td><td>"+newProps.param.products[i].UnitPrice+" تومان</td><td>"+newProps.param.products[i].price+" تومان</td></tr>"

        }
      }
      let subTitle = this.props.SeveralShop ? "فروشنده" : "عنوان دوم"
      let html=
          "<div>"
          +"<div style='border:1px solid;margin-bottom:10px'><div style='text-align:center'>فاکتور خرید</div>"
          +"<div style='display:flex;flex-direction:row;justify-content:flex-end'>"
          +"<div ><p class='yekan' style='text-align:right;padding-right:2px;padding-left:2px'>"+"زمان خرید: "+ newProps.param.Date+"</p></div><div ></div></div>"
          +"<div style='display:flex;flex-direction:row;justify-content:space-between'>"
          +"<div ><p class='yekan' style='text-align:right;padding-right:2px;padding-left:2px'>"+"نام خریدار: "+ name+"</p></div><div ><p class='yekan' style='text-align:right;padding-right:2px;padding-left:2px'>"+"تلفن همراه: "+ newProps.param.username+"</p></div></div>"
          +"<div style='display:flex;flex-direction:row;justify-content:space-between'>"
          +"<div ><p class='yekan' style='text-align:right;padding-right:2px;padding-left:2px'>"+"آدرس: "+ address+"</p></div><div ></div></div>"
          +"</div><div style='display:flex;justify-content:center'><table border='1' style='text-align:center'><thead><tr><td style='width:50px'>ردیف</td><td style='width:200px'>نام کالا</td><td style='width:120px'>"+subTitle+"</td><td style='width:120px'>تعداد</td><td style='width:120px'>قیمت واحد</td><td style='width:120px'>قیمت کل</td></tr></thead><tbody>"
          +trs+
          "</tbody></table></div>";
          html+="<div style='border:1px solid;margin-top:10px'>"
          if(newProps.param.credit > 0)
            html+= "<div style='display:flex;justify-content: flex-end;padding-right:2px;padding-left:2px'><div>کسر از کیف پول  : "+newProps.param?.credit+" تومان</div></div>"
          html+= "<div style='display:flex;justify-content: flex-end;padding-right:2px;padding-left:2px'><div>مبلغ سفارش : "+newProps.param.Amount +" تومان</div></div>";
          if(newProps.param.paykAmount)
            html+= "<div style='display:flex;justify-content: flex-end;padding-right:2px;padding-left:2px'><div>هزینه پیک : "+newProps.param.paykAmount  +" تومان</div></div>";
          html+= "<div style='display:flex;justify-content: flex-end;padding-right:2px;padding-left:2px'><div>جمع کل : "+newProps.param?.finalAmount +" تومان</div></div>";

          html+= "<div style='display:flex;justify-content: flex-start;margin-top:20px;padding-right:2px;padding-left:2px'><div>امضاء خریدار: </div></div></div>";
          if(newProps.forUser){
            this.setState({
              html:"<div class='yekan' dir='rtl' style='margin-top:20px;text-align:right;width:100%;line-height:2;display:flex;justify-content:center'><div style='width:715'><div>" + html + "</div></div></div></div>"
            })
          }else{
            this.setState({
              html:"<div class='yekan' dir='rtl' style='margin-top:20px;text-align:right;width:100%;line-height:2;display:flex;justify-content:center'><div style='width:715'><div style='min-height:500px'>" + html + "</div></div><div style='border-top:1px dashed;margin-top:15px;margin-bottom:15px'></div><div style='min-height:500px'>" + html +  "</div></div></div>"
            })
          }
          
    }
    else if(newProps.printType == "QrCode"){
      this.setState({
        html:"<p style='text-align:center;width:100%;margin-top:100px'><img src="+newProps.param+" style='width:90%' /></p>"
      })
    }
    if(newProps.htmlParam){
      this.setState({
        html:newProps.htmlParam
      })
    }
  }
  render() {

   

    return (
      <div style={{ direction: 'rtl' }}>
          <div dangerouslySetInnerHTML={{ __html: this.state.html}} ></div>
      </div>
    )
  }
}

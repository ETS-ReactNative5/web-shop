import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import AdminProduct from './AdminProduct.js'
import Users from './Users.js'
import Cats from './Cats.js'
import Billing from './Billing.js'
import Accounts from './Accounts.js'
import Blog from './Blog.js'
import Brands from './Brands.js'
import ChangeInformation from './ChangeInformation.js'
import Comments from './Comments.js'
import Forms from './Forms.js'
import Guarantee from './Guarantee.js'
import Login from './Login.js'
import Maps from './Maps.js'
import Pics from './Pics.js'
import Sales_Registered from './Sales_Registered.js'
import Sales_ReadyToSend from './Sales_ReadyToSend.js'
import Sales_Posted from './Sales_Posted.js'
import Sales_Ended from './Sales_Ended.js'
import Sales_Cleared from './Sales_Cleared.js'
import Sales from './Sales.js'
import Create_Filter from './Create_Filter.js'
import Create_Reports from './Create_Reports.js'
import Show_Reports from './Show_Reports.js'
import SalePose from './SalePose.js'
import Codes_Files from './Codes_Files.js'




import SalesProduct from './SalesProduct.js'
import Set from './Set.js'
import ShopInformation from './ShopInformation.js'
import ShopsList from './ShopsList.js'
import SiteSettings from './SiteSettings.js'

import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      CId:null


    }

  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      that.setState({
        loading: 0
      })
      that.setState({
        user_Id: response.data.authData.userId
      })
      
      that.GetMaps();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  GetMaps() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      user_Id: this.state.user_Id,
      sameUser:1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        CId:(response.data.result.length > 0 && response.data.result[0].firstForm) ? response.data.result[0].firstForm : '100'
      });
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetMaps", param, SCallBack, ECallBack)
  }
  getResponse(value) {

    this.setState({
      CId: value.CId,
      IsReport:value.IsReport
    })
  }

  render() {

    return (

      <div style={{ direction: 'rtl' }} >

        <div className="row justify-content-center">
          <div className="col-12 col-md-4 col-lg-3 ">

            <Dashboard callback={this.getResponse.bind(this)} list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
          </div>
          <div className="col-lg-9 col-md-8 col-12" style={{ marginTop: 20, background: '#fff' }}>
            {this.state.CId == "100" && !this.state.IsReport &&
              <AdminProduct />
            }
            {this.state.CId == "101" && !this.state.IsReport &&
              <Users />
            }
            {this.state.CId == "102" && !this.state.IsReport &&
              <Cats />
            }
            {this.state.CId == "103" && !this.state.IsReport &&
              <Set />
            }
            {this.state.CId == "118" && !this.state.IsReport &&
              <Billing />
            }
            {this.state.CId == "119" && !this.state.IsReport &&
              <Accounts />
            }
            {this.state.CId == "116" && !this.state.IsReport &&
              <Blog />
            }
            {this.state.CId == "114" && !this.state.IsReport &&
              <Brands />
            }
            {this.state.CId == "109" && !this.state.IsReport &&
              <ChangeInformation />
            }
            {this.state.CId == "112" && !this.state.IsReport &&
              <Comments />
            }
            {this.state.CId == "108" && !this.state.IsReport &&
              <Forms />
            }
            {this.state.CId == "202" && !this.state.IsReport &&
              <Guarantee />
            }
            {this.state.CId == "201" && !this.state.IsReport &&
              <Maps />
            }
            {this.state.CId == "115" && !this.state.IsReport &&
              <Pics />
            }
            {this.state.CId == "106" && !this.state.IsReport &&
              <Sales />
            }
            
            {
            this.state.CId == "200" && !this.state.IsReport &&
                <SalesProduct />
            }
            
            {this.state.CId == "110" && !this.state.IsReport &&
              <ShopInformation />
            }
            {this.state.CId == "111" && !this.state.IsReport &&
              <ShopsList />
            }
            {this.state.CId == "120" && !this.state.IsReport &&
              <SiteSettings />
            }
            {this.state.CId == "121" && !this.state.IsReport &&
              <Sales_Registered />
            }
            {this.state.CId == "122" && !this.state.IsReport &&
              <Sales_ReadyToSend />
            }
            {this.state.CId == "123" && !this.state.IsReport &&
              <Sales_Posted />
            }
            {this.state.CId == "124" && !this.state.IsReport &&
              <Sales_Ended />
            }
            {this.state.CId == "125" && !this.state.IsReport &&
              <Sales_Cleared />
            }
            {this.state.CId == "126" && !this.state.IsReport &&
              <Create_Filter />
            }
            {this.state.CId == "127" && !this.state.IsReport &&
              <Create_Reports />
            }
            {this.state.CId == "130" && !this.state.IsReport &&
              <SalePose />
            }
            {this.state.CId == "151" && !this.state.IsReport &&
              <Codes_Files />
            }

            {this.state.IsReport &&
              <Show_Reports number={this.state.CId} />
            }


        </div>
        <div >



        </div>

      </div>

</div>
    )
  }
}
export default Management;
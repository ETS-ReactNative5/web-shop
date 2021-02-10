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
      CId:"100"


    }

  }
  getResponse(value) {
    this.setState({
      CId: value.CId
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
            {this.state.CId == "100" &&
              <AdminProduct />
            }
            {this.state.CId == "101" &&
              <Users />
            }
            {this.state.CId == "102" &&
              <Cats />
            }
            {this.state.CId == "103" &&
              <Set />
            }
            {this.state.CId == "118" &&
              <Billing />
            }
            {this.state.CId == "119" &&
              <Accounts />
            }
            {this.state.CId == "116" &&
              <Blog />
            }
            {this.state.CId == "114" &&
              <Brands />
            }
            {this.state.CId == "109" &&
              <ChangeInformation />
            }
            {this.state.CId == "112" &&
              <Comments />
            }
            {this.state.CId == "108" &&
              <Forms />
            }
            {this.state.CId == "202" &&
              <Guarantee />
            }
            {this.state.CId == "201" &&
              <Maps />
            }
            {this.state.CId == "115" &&
              <Pics />
            }
            {this.state.CId == "106" &&
              <Sales />
            }
            
            {
            this.state.CId == "200" &&
                <SalesProduct />
            }
            
            {this.state.CId == "110" &&
              <ShopInformation />
            }
            {this.state.CId == "111" &&
              <ShopsList />
            }
            {this.state.CId == "120" &&
              <SiteSettings />
            }
            {this.state.CId == "121" &&
              <Sales_Registered />
            }
            {this.state.CId == "122" &&
              <Sales_ReadyToSend />
            }
            {this.state.CId == "123" &&
              <Sales_Posted />
            }
            {this.state.CId == "124" &&
              <Sales_Ended />
            }
            {this.state.CId == "125" &&
              <Sales_Cleared />
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
import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog} from 'primereact/dialog';
import { Button } from 'reactstrap';
import {ToggleButton} from 'primereact/togglebutton';

import { connect } from 'react-redux';
import {Dropdown} from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert,Message } from 'rsuite';


class Comments extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],  
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],  
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      GridDataComments:[],
      Status:0,
      loading:0
      
    }
    this.selectedListChange = this.selectedListChange.bind(this)

    
  }
  selectedListChange(value){
    let that = this;
    let param={
      _id:value._id,
      status:that.state.Status?0:1
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      that.GetComments(that.state.Status?1:0);
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("MainApi/modifyComment",param,SCallBack,ECallBack)
  }
  componentDidMount(){
    let param={
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    that.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0,
        SellerId : response.data.authData.userId
      })

      that.GetComments();

    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
  }

  GetComments(status){
    let that = this;
    let param={
      status:status||0,
      limit:1000
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response){
      console.log(response.data.result)
      that.setState({
        loading:0,
        GridDataComments : response.data.result
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("MainApi/getComment",param,SCallBack,ECallBack)
  }
  EditShopSelected(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      address:this.state.selectedAddress,
      ShopId:this.state.selectedId,
      name:this.state.selectedName,
      commission:this.state.selectedCommission,
      edit:"1"
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response){
        that.setState({
          loading:0
        })
        Alert.success('عملیات با موفقیت انجام شد', 5000);
        that.onHide();
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.danger('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation",param,SCallBack,ECallBack)
  }
 
    render(){
      
     return (
      <div style={{direction:'rtl'}}>
        {this.state.loading == 1 &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px'}}>
                <Loader content="لطفا صبر کنید ..." className="yekan"  />
              </div>
            }
      <div className="row justify-content-center">
    <div className="col-sm-12 col-md-4 col-lg-3 ">

    <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
     </div>
      <div className="col-lg-9 col-md-8 col-12" style={{marginTop:50}}>
      <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍لیست پیام ها</span></div>

      <div>
      {
      this.state.Status 
      ?
      <Message
        type="success"
        title="پیامهای تایید شده"
        className="yekan"
        style={{textAlign:'right',fontSize:15}}
        description={
          <p className="yekan">
                    برای  عدم تایید پیام  روی سطر آن  کلیک کنید

            <br />
            <ToggleButton onLabel="مشاهده پیامهای تایید نشده" offLabel="مشاهده پیامهای تایید شده" className="iranyekanwebregular" style={{fontFamily:'iranyekanwebregular',marginBottom:10,float:'left'}} checked={this.state.Status} onChange={(e) => {this.setState({Status: e.value});this.GetComments(e.value?1:0)}} />

          </p>
        }
        
      />
        :
        <Message
        type="error"
        title="پیامهای تایید نشده"
        className="yekan"
        style={{textAlign:'right',fontSize:15}}
        description={
          <p className="yekan">
             برای   تایید پیام  روی سطر آن  کلیک کنید
            <br />
            <ToggleButton onLabel="مشاهده پیامهای تایید نشده" offLabel="مشاهده پیامهای تایید شده" className="yekan" style={{fontFamily:'yekan',marginBottom:10,float:'left'}} checked={this.state.Status} onChange={(e) => {this.setState({Status: e.value});this.GetComments(e.value?1:0)}} />

          </p>
        }
        
      />
      }
      </div>
            
              <DataTable responsive resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataComments} selectionMode="single" style={{marginTop:20}} selection={this.state.selectedId} onSelectionChange={e => this.selectedListChange(e.value)} >
                        <Column field="_id"  header="شناسه پیام" className="yekan" style={{textAlign:"center"}} />
                        <Column field="CommentText" header="متن پیام" className="yekan" style={{textAlign:"center"}} />
                        <Column field="ProductId"  header="شناسه محصول"  className="yekan" style={{textAlign:"center"}}/>
                        <Column field="SellerId" header="شناسه فروشنده"   className="yekan" style={{textAlign:"center"}}/>
                        <Column field="date" header="تاریخ"   className="yekan" style={{textAlign:"center"}}/>

              </DataTable>

      </div>
     
    </div>
 
    </div>    
   )
    }
}
const mapStateToProps = (state) => {
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Comments)
);
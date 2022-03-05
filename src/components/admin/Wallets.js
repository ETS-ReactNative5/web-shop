import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Panel } from 'primereact/panel';

import { Toast } from 'primereact/toast';

import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';
import {Multiselect} from 'multiselect-react-dropdown';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Wallets extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetWallets = this.SetWallets.bind(this);
    this.toast = React.createRef();

    this.state = {
      layout: 'list',
      name: "",
      ShopsList: [],
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: "",
      systems: [],
      mySystem:{subSystem:false},
      wallets:[]

    }


  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading: 1
    })
    let that = this;
    let SCallBack = function (response) {
      that.setState({
        user_Id: response.data.authData.userId,
        loading: 0
      })
      that.getManagerSystemInfo();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  GetShops() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      let ShopsList = [];
      for (let i = 0; i < response.data.result.length; i++) {
        ShopsList.push({ name: response.data.result[i].name, value: response.data.result[i]._id })
      }
      that.setState({
        ShopsList: ShopsList,
        ShopsListOrginal : ShopsList,
        loading: 0
      })
      that.GetWallets();


    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
      that.GetWallets();

    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)



  }
  SetWallets() {
    let that = this;
    let shops=[]; 
    if (!this.state.selectedSystem) {
      that.toast.current.show({ severity: 'warn', summary: 'هشدار', detail: <div><span>سیستم را وارد کنید</span></div>, life: 8000 });
      return;
    }
    debugger;
    if (!this.state.mainWallet && !this.state.mainWalletId ) {
      that.toast.current.show({ severity: 'warn', summary: 'هشدار', detail: <div><span>کیف پول پدر را وارد کنید</span></div>, life: 8000 });
      return;
    }
    for(let item of this.state.shops){
      shops.push(item.value)
    }
    debugger;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      WId: this.state.WId,
      name: this.state.name,
      latinName: this.state.latinName,
      shops: shops,
      system:this.state.selectedSystem,  
      mainWallet: !this.state.mainWallet ? this.state.mainWalletId : null
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetWallets();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetWallets", param, SCallBack, ECallBack)
  }
  CreateForm() {
    let ShopsList = [];
    debugger;
    if(this.state.wallets.length > 0){
      let shops = this.state.wallets.filter((item)=>{ 
        return (item.system == this.state.mySystem._id && !item.mainWallet)
      
      })
      shops = shops.length > 0 ? shops[0].shops : [];
      for (let i = 0; i < this.state.ShopsListOrginal.length; i++) {
        if(shops.indexOf(this.state.ShopsListOrginal[i].value) > -1 )
          ShopsList.push({ name: this.state.ShopsListOrginal[i].name, value: this.state.ShopsListOrginal[i].value })
      }
    }else{
      ShopsList = this.state.ShopsListOrginal
    }
    this.setState({
      visibleManageField: true,
      name: "",
      WId: "",
      latinName: "",
      shops: [],
      selectedId: null,
      selectedSystem:(this.state.mySystem && this.state.mySystem._id) ? this.state.mySystem._id : null,
      mainWallet:false,
      ShopsList:ShopsList,
      mainWalletId:null
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageField: false,
      selectedId: null
    });

  }
  onHideMapsDialog(event) {
    this.setState({
      visibleManageMaps: false,
      HasErrorForMaps: null
    });

  }
  selectedComponentChange(value) {
    let that = this;
    var p = [];
    let shops = [];
    if(value.shops){
      for(let i=0;i<this.state.ShopsList.length;i++){
        if(value.shops.indexOf(this.state.ShopsList[i].value) != -1){
          shops.push(this.state.ShopsList[i])
        }
      }
    }    
    let ShopsList = [];
    debugger;
    if(value.mainWallet){
      let shops = this.state.wallets.filter((item)=>{ return item.value == value.mainWallet});
      shops = shops.length > 0 ? shops[0].shops : [];
      for (let i = 0; i < this.state.ShopsListOrginal.length; i++) {
        if(shops.indexOf(this.state.ShopsListOrginal[i].value) > -1 )
          ShopsList.push({ name: this.state.ShopsListOrginal[i].name, value: this.state.ShopsListOrginal[i].value })
      }
    }else{
      for (let i = 0; i < this.state.ShopsListOrginal.length; i++) {
        if(value.shops.indexOf(this.state.ShopsListOrginal[i].value) > -1 )
          ShopsList.push({ name: this.state.ShopsListOrginal[i].name, value: this.state.ShopsListOrginal[i].value })
      }
    }
    this.setState({
      name: value.name,
      WId: value.WId,
      latinName: value.latinName,
      shops: shops,
      selectedId: value._id,
      visibleManageField:true,
      selectedSystem:value.system,
      mainWallet:value.mainWallet ? false : true,
      mainWalletId:value.mainWallet,
      ShopsList: ShopsList

    })

  }
  getManagerSystemInfo(){
    let that = this;
    let param = {
      user_id:this.state.user_Id
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        mySystem: (response.data.result[0] && response.data.result[0].system[0]) ? response.data.result[0].system[0] : {subSystem:false}
      })
      that.getSystems();




    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.getSystems();


    }
    this.Server.send("MainApi/getManagerSystemInfo", param, SCallBack, ECallBack)
  }
  GetWallets() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let wallets = [];
      for(let i=0;i<response.data.result.length;i++){
        if(!response.data.result[i].mainWallet){
           wallets.push({value:response.data.result[i]._id,name:response.data.result[i].name,system:response.data.result[i].system,shops:response.data.result[i].shops});
        }
      }
      that.setState({
        GridDataFields: response.data.result,
        wallets:wallets,
        loading: 0
      })
      
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetWallets", param, SCallBack, ECallBack)
  }
  delField(rowData) {
    this.setState({
      visibleManageField: false
    })
    confirmAlert({
      title: <span className="yekan">حذف کاربر</span>,
      message: <span className="yekan">  آیا از حذف  {rowData.name} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: rowData._id,
              del: 1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetWallets();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetWallets", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  getSystems() {
    let that = this;
    let SCallBack = function (response) {
      let systems = [];
      if(response.data.result){
        
        for(let i=0;i<response.data.result.length;i++){
          systems.push({value:response.data.result[i]._id,name:response.data.result[i].name})
        }
      }  
      that.setState({
        systems: systems
      })
      that.GetShops();
    };
    let ECallBack = function (error) {
      that.GetShops();
    }
    this.Server.send("MainApi/getSystems", {}, SCallBack, ECallBack)
  }

  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetWallets} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delField(rowData)}></i>;
    }
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center mt-5">
        <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

          <div className="col-12" style={{ background: '#fff' }}>
            <Panel header="لیست کیف پولها" style={{ textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>

              <div className="row" >
                <div className="col-6" style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت کیف جدید</button>
                </div>

              </div>

              <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
                <Column field="WId" header="شماره" className="irsans" style={{ textAlign: "center" }} />
                <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
                <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
              </DataTable>
            </Panel>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت کیف جدید"} visible={this.state.visibleManageField} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{ alignItems: 'baseline' }}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.WId} name="WId" onChange={(event) => this.setState({ WId: event.target.value })} required="true" />
                  <label>شماره</label>
                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                  <label >عنوان فارسی</label>

                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" disabled={this.state.selectedId} autoComplete="off" type="text" value={this.state.latinName} name="latinName" onChange={(event) => this.setState({ latinName: event.target.value })} required="true" />
                  <label>عنوان لاتین</label>
                </div>
              </div>
              {!this.state.mySystem.subSystem &&
                <div className="col-12" style={{marginTop:20}}>
                <div  style={{ textAlign: 'right', display: 'flex', alignItems: 'flex-start', padding: 0 }} >
                <Checkbox inputId="mainWallet" value={this.state.mainWallet} checked={this.state.mainWallet} onChange={e => this.setState({ mainWallet: e.checked,mainWalletId:'' })}></Checkbox>
                    <label htmlFor="mainWallet" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>کیف پول اصلی</label>
                </div>
                    
                </div>
              }
              

              {!this.state.mainWallet &&
                <div className="col-lg-4" style={{marginTop:20}}>
                <label className="labelNoGroup yekan">کیف پول پدر</label>
                          <select style={{width:'100%'}} onChange={(event)=>{
                            debugger;
                            let system = this.state.system
                            for(let i=0;i<this.state.wallets.length;i++){
                              if(this.state.wallets[i].value == event.target.value){
                                system = this.state.wallets[i].system
                              }
                            }
                            let ShopsList = [];

                            if(event.target.value){
                              let shops = this.state.wallets.filter((item)=>{ 
                                return (item.value == event.target.value)
                              
                              })
                              shops = shops.length > 0 ? shops[0].shops : [];
                              for (let i = 0; i < this.state.ShopsListOrginal.length; i++) {
                                if(shops.indexOf(this.state.ShopsListOrginal[i].value) > -1 )
                                  ShopsList.push({ name: this.state.ShopsListOrginal[i].name, value: this.state.ShopsListOrginal[i].value })
                              }
                            }else{
                              ShopsList = this.state.ShopsListOrginal
                            }
                            
                            this.setState({mainWalletId:event.target.value,selectedSystem:system,ShopsList:ShopsList})
                          
                          }} value={this.state.mainWalletId}>
                            <option value="" ></option>
                            {this.state.wallets.map(function(item,index){
                                return(
                                  <option value={item.value} >{item.name}</option>
                                )
                            })
                            }
                          </select>
                </div>
              }
                {this.state.mainWallet &&
                  <div className="col-lg-4" style={{marginTop:20}}>
                          <label className="labelNoGroup yekan">سیستم متصل به کیف پول</label>
                            <select style={{width:'100%'}}  onChange={(event)=>this.setState({selectedSystem:event.target.value})} value={this.state.selectedSystem}>
                              <option value="" ></option>
                              {this.state.systems.map(function(item,index){
                                  return(
                                    <option value={item.value} >{item.name}</option>
                                  )
                              })
                              }
                            </select>
                      


                </div>
                }
                

                <div className="col-lg-12" style={{marginTop:20}}>
                <Multiselect
                  options={this.state.ShopsList} // Options to display in the dropdown
                  displayValue="name" // Property name to display in the dropdown options
                  selectedValues={this.state.shops}
                  placeholder="فروشگاههای متصل به کیف"
                  onSelect={(selectedList, selectedItem)=>{
                    /*let shops=[];
                    for(let item of selectedList){
                      shops.push(item.value)
                    }*/
                    this.setState({
                      shops:selectedList
                    })
                  }}
                  onRemove={(selectedList, selectedItem)=>{
                    this.setState({
                      shops:selectedList
                    })
                  }}
                />


              </div>
            
              
              



            </div>
          </form>
        </Dialog>

      </div>





    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Wallets)
);

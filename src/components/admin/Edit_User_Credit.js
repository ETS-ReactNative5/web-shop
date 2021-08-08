import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import { AutoComplete } from 'primereact/autocomplete';

import { connect } from 'react-redux';
import { max } from 'moment-jalaali';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class Edit_User_Credit extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      payType:1,
      selectedWallet:{},
      GridDataUsers: [],
      GridDataFactors: [],
      visibleCreateUser: false,
      selectedId: null,
      selectedUser: null,
      levelFilter: null,
      level: "1",
      name: null,
      username: null,
      pass: null,
      pass2: null,
      address: null,
      mail: null,
      company: null,
      username: null,
      status: null,
      map: null,
      HasError: null,
      mapList: [],
      levelOfUser: null,
      off: null,
      levelOfUserArray: [],
      ShowNewLevelOfUser: 0,
      levelOfUser2: -1,
      userType:0,
      Offs: [],
      PriceOfLevels: [],
      formuls: [],
      formul: null,
      formul_level: '',
      formul_off: '',
      formul_opr: '',
      PriceOfLevel: null,
      loading: 0

    }
    this.CreateUser = this.CreateUser.bind(this);

    this.onHide = this.onHide.bind(this);
    this.selectedUserChange = this.selectedUserChange.bind(this);
    this.handleChangeLevel = this.handleChangeLevel.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePass2 = this.handleChangePass2.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeCredit = this.handleChangeCredit.bind(this);

    this.handleChangeNewCredit = this.handleChangeNewCredit.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);

    

    this.handleChangeRaymandAcc = this.handleChangeRaymandAcc.bind(this);
    this.handleChangeRaymandUser = this.handleChangeRaymandUser.bind(this);

    
    this.EditCredit = this.EditCredit.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeMap = this.handleChangeMap.bind(this);

  }

  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        that.setState({
          CreditSupport: response.data.result[0].CreditSupport,
          Raymand: response.data.result[0].Raymand,
        })
      }
      that.GetWallets();




    }, function (error) {
      that.setState({
        loading: 0
      })

    })


  }
  getShop(id) {
    let that = this;
   
      let param = {
        token: localStorage.getItem("api_token"),
        ShopId:id
      };
      this.setState({
        loading: 1
      })
      let SCallBack = function (response) {
        response.data.result[0].status = response.data.result[0].AllowCredit ? "متصل به مهرکارت" : "مهرکارت ندارد"

        that.setState({
          GridDataUsers: response.data.result,
          loading: 0
        })
       

        
      };
      let ECallBack = function (error) {
        that.setState({
          loading: 0
        })
      }
      this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
    
  }
  EditCredit(id) {
    let that = this;
    debugger;

    if(!this.state.newCredit)
      return;
    this.setState({
      loading: 1
    })
    this.setState({
      HasError: null
    })
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.userType == 0 ? this.state.username : 'system',
      status: this.state.status,
      payType: this.state.payType,
      Amount: this.state.newCredit.toString().replace(/,/g, ""),
      desc: this.state.desc,
      ShopId:this.state.userType == 1 ? this.state.GridDataUsers[0]._id : null,
      Step:2,
      wallet:this.state.wallet
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      if(that.state.userType == 0)
        that.GetUsers(that.state.searchId);
      else
        that.getShop(that.state.searchId);
      that.setState({
        visibleCreateUser: false
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("MainApi/setCredit", param, SCallBack, ECallBack)
  }
  handleChangeLevel(event) {
    this.setState({ level: event.target.value });
  }
  handleChangeMail(event) {
    this.setState({ mail: event.target.value });
  }
  handleChangeCompany(event) {
    this.setState({ company: event.target.value });
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangePass(event) {
    this.setState({ pass: event.target.value });
  }
  handleChangePass2(event) {
    this.setState({ pass2: event.target.value });
  }
  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }
  handleChangeCredit(event) {
    this.setState({ credit: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") });


  }
  handleChangeNewCredit(event) {
    this.setState({ newCredit: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
  }
  handleChangeDesc(event){
    this.setState({ desc: event.target.value });

  }
  handleChangeRaymandAcc(event){
    this.setState({ RaymandAcc: event.target.value });

  }
  handleChangeRaymandUser(event){
    this.setState({ RaymandUser: event.target.value });

  }
  handleChangeStatus(event) {
    this.setState({ status: event.target.value });

  }
  handleChangeMap(event) {
    this.setState({ map: event.target.value });

  }

  onHide(event) {
    this.setState({
      visibleCreateUser: false,
      name: "",
      username: "",
      credit: 0,
      newCredit:'',
      desc:'',
      payType:1
    });

  }
  CreateUser() {
    this.setState({
      visibleCreateUser: true,
      selectedId: null,
      selectedUser: null
    })
  }
  selectedUserChange(value) {
    let that = this;
    var p = [];
    let wallet={};
    for(let w of this.state.wallets){
      if(w.value == this.state.wallet)
        wallet = w;
    }
    let walletCredit={};
    for(let w of value.wallet){
      if(w.name == this.state.wallet)
        walletCredit = w.credit;
    }
    value.wallet = value.wallet || {};
    this.setState({
      selectedId: value._id,
      selectedWallet:wallet,
      walletName:wallet.label,
      newCredit:'',
      name: value.name,
      mail: value.mail,
      company: value.company,
      level: value.level == "کاربر" ? "0" : "1",
      username: value.username,
      pass: value.password,
      pass2: value.password,
      address: value.address,
      credit: wallet.value == "mehr" ? (value.credit ? value.credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value.credit) : 
              (walletCredit ? walletCredit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : (walletCredit||0)),
      RaymandAcc:value.RaymandAcc,
      RaymandUser:value.RaymandUser,
      ShopId: value.shopId,
      selectedUser: value.products,
      status: value.status == "فعال" ? "1" : "0",
      map: value.map,
      visibleCreateUser: true,
      levelOfUser: value.levelOfUser,
      NewLevelOfUser: value.levelOfUser
    })

  }
  componentDidMount() {
    let that = this;
    this.Server.send("MainApi/checktoken", {
      token: localStorage.getItem("api_token")
    }, function (response) {
      that.setState({
        ShopId: response.data.authData.shopId
      })
      that.getSettings();
    }, function (error) {
      console.log(error)
      that.getSettings();
    })



  }

  
   onSelect(event) {
    this.setState({searchName:event.value.name,searchId:event.value._id});
    if(this.state.userType == 0)
      this.GetUsers(event.value._id);
    else
      this.getShop(event.value._id);  
  }
  
  
  suggestBrands(event) {
      let that = this;
      this.setState({ brand: event.query, Count: 0 });
      let param = {};
      debugger;
      if(this.state.userType == 0 ){
         param = {
          title: event.query,
          table:"users",
          name:["name","username","RaymandAcc","RaymandUser"]
        };
      }else{
        let shops=[];
        for(let w of this.state.wallets){
          if(w.value == this.state.wallet)
            shops = w.shops;
        }
         param = {
          title: event.query,
          table:"shops",
          condition:{convertToObject:1,key:"_id",value:shops},
          name:"name"/*["name","name"]*/
        };
      }
      
      let SCallBack = function (response) {
        let brandSuggestions = [];
        response.data.result.reverse().map(function (v, i) {
          brandSuggestions.push({ _id: v._id,name:v.name})
        })
        that.setState({ brandSuggestions: brandSuggestions });
      };
  
      let ECallBack = function (error) {
  
      }
      that.Server.send("AdminApi/searchItems", param, SCallBack, ECallBack)
  
  
  }
  itemTemplate(brand) {
      return (
        <div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
          <div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >
            <div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>
              <span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _id={brand._id} >
                <span style={{whiteSpace:'pre-wrap'}} _id={brand._id}>{brand.name}</span><br />
              </span>
            </div>
            
          </div>
        </div>
      );
    }


    GetWallets() {
      let that = this;
      let param = {
        token: localStorage.getItem("api_token")
      };
      this.setState({
        loading: 1
      })
      let SCallBack = function (response) {
        let wallets = [];
        for(let resp of response.data.result){
          wallets.push({label:resp.name,value:resp.latinName,shops:resp.shops});
        }
        that.setState({
          wallet:wallets[0]?.value,
          wallets: wallets
        })
        that.setState({
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
  GetUsers(id) {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      userId: id
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        GridDataUsers: response.data.result
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
  rowClass(data) {
    if(data.credit)
      data.credit = data.credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return {
      'row-highlight1':0
    }
  }
  render() {
    let level = [
      { label: 'همه', value: null },
      { label: 'مدیر', value: 'مدیر' },
      { label: 'کاربر', value: 'کاربر' }
    ];

    let levelFilter = <Dropdown style={{ width: '100%' }}
      value={this.state.levelFilter} options={level} className="irsans" onChange={this.onLevelChange} />
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={()=>this.EditCredit()} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}> اعمال </button>

      </div>
    );
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">
        <div className="col-lg-12" style={{textAlign:'right',marginTop:60}}>
                  <div style={{marginRight: 10,border: "1px solid #eee",borderRadius: 10,padding: 10}}>
                  <label className="IRANYekan">نوع کیف پول را انتخاب کنید</label>

                  <SelectButton value={this.state.wallet} options={this.state.wallets} onChange={(e) => {
                    this.setState({wallet:e.value === null ? this.state.wallet : e.value,searchName:'',GridDataUsers:[]})
                  
                  }}></SelectButton>
                  </div>
          </div>
        <div className="col-lg-12" style={{textAlign:'right',marginTop:20}}>
                  <div style={{marginRight:10}}>
                  <label className="IRANYekan">وضعیت کاربری را انتخاب کنید</label>

                  <SelectButton value={this.state.userType} options={[{label:'کاربران',value:0},{label:'پذیرندگان',value:1}]} onChange={(e) => {
                    this.setState({userType:e.value === null ? this.state.userType : e.value,searchName:'',GridDataUsers:[]})
                  
                  }}></SelectButton>
                  </div>
          </div>
          {this.state.userType == 0 &&
          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
          <AutoComplete placeholder="بخشی از نام / شماره موبایل / شناسه کاربری / شماره حساب  را وارد کنید"  style={{ width: '100%' }} onChange={(event)=>{this.setState({searchName:event.value})}} itemTemplate={this.itemTemplate.bind(this)} value={this.state.searchName} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />


            <div className="section-title " style={{ textAlign: 'right',display:'flex',justifyContent:'space-between' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >نتیجه جستجو</span>
            
            
            </div>
            
            <DataTable rowClassName={this.rowClass} rows={15} paginator={true} responsive ref={(el) => this.dt = el} value={this.state.GridDataUsers} selectionMode="single" selection={this.state.selectedUser} onSelectionChange={e => this.selectedUserChange(e.value)}>
              
              <Column field="username"  header="نام کاربری" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name"  header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="status" header="وضعیت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="credit" header="موجودی مهرکارت" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>
          }
          {this.state.userType == 1 &&
          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
          <AutoComplete placeholder="بخشی از نام فروشگاه / شماره موبایل   را وارد کنید"  style={{ width: '100%' }} onChange={(event)=>{this.setState({searchName:event.value})}} itemTemplate={this.itemTemplate.bind(this)} value={this.state.searchName} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />


            <div className="section-title " style={{ textAlign: 'right',display:'flex',justifyContent:'space-between' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >نتیجه جستجو</span>
            
            
            </div>
            
            <DataTable rowClassName={this.rowClass} rows={15} paginator={true} responsive ref={(el) => this.dt = el} value={this.state.GridDataUsers} selectionMode="single" selection={this.state.selectedUser} onSelectionChange={e => this.selectedUserChange(e.value)}>
              
              <Column field="username"  header="نام کاربری" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name"  header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="status" header="وضعیت" className="irsans" style={{ textAlign: "center" }} />
              <Column field="credit" header="موجودی مهرکارت" className="irsans" style={{ textAlign: "center" }} />

            </DataTable>
          </div>
          }

        </div>
        <Dialog header={"اصلاح"} visible={this.state.visibleCreateUser} width="800px" footer={footer} minY={70} maxY={400} onHide={this.onHide} maximizable={true}>
          <p style={{textAlign:'right',fontSize:22,fontFamily:'YekanBakhFaBold',marginBottom:'20px !important'}}>کیف پول جاری : {this.state.selectedWallet.label}</p>
          <form style={{ maxWidth: 800, maxHeight: 450, marginBottom: 10, maxWidth: 1000 }}  >
            <div className="row">
              <div className="col-lg-6 col-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" disabled={true} type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} required="true" />
                  <label >نام کاربری</label>

                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="group">
                  <input className="form-control irsans" disabled={true} autoComplete="off" type="text" value={this.state.name} name="name" onChange={this.handleChangeName} required="true" />
                  <label>نام و نام خانوادگی</label>
                </div>
              </div>
              
              {this.state.CreditSupport &&
                <div className="col-lg-6">
                  <div className="group">
                    <input className="form-control irsans" disabled={true} autoComplete="off" type="text" value={this.state.credit} name="credit" onChange={this.handleChangeCredit} required="true" />
                    <label>موجودی کیف پول</label>
                  </div>
                </div>
              }
                <div className="col-lg-12" style={{textAlign:'right'}}>
                  <div style={{marginRight:10}}>
                  <label className="IRANYekan">نوع تراکنش</label>

                  <SelectButton value={this.state.payType} options={[{label:'واریز',value:1},{label:'برداشت',value:0}]} onChange={(e) => {this.setState({payType:e.value === null ? this.state.payType : e.value})}}></SelectButton>
                  </div>
                </div>
                <div className="col-lg-6" style={{marginTop:10}}>
                  <div className="group">
                    <input className="form-control irsans"  autoComplete="off" type="text" value={this.state.newCredit} name="newCredit" onChange={this.handleChangeNewCredit} required="true" />
                    <label>مبلغ(ریال)</label>
                  </div>
                </div>
                <div className="col-lg-12" style={{marginTop:10}}>
                  <div className="group">
                    <input className="form-control irsans"  autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={this.handleChangeDesc} required="true" />
                    <label>توضیح</label>
                  </div>
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
  connect(mapStateToProps)(Edit_User_Credit)
);

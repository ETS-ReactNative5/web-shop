import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method

import { ComponentToPrint } from '../ComponentToPrint.js';

import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { SelectButton } from 'primereact/selectbutton';

import { connect } from 'react-redux';
import { max } from 'moment-jalaali';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class SetSale extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      payType: 1,
      selectedWallet: {},
      GridDataUsers: [],
      GridDataFactors: [],
      visibleSearchDialog: true,
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
      userType: 0,
      Offs: [],
      PriceOfLevels: [],
      formuls: [],
      formul: null,
      formul_level: '',
      formul_off: '',
      formul_opr: '',
      PriceOfLevel: null,
      loading: 0,
      mySystem: { subSystem: false },
      step: 0,
      typeOfpeyments: [{ label: "اقساطی", value: "1" }/*, { label: "نقدی", value: "2" }*/],
      typeOfpeyment: "1"

    }
    this.NewUser = this.NewUser.bind(this);

    this.onHide = this.onHide.bind(this);

    this.setCredit = this.setCredit.bind(this);

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeNewCredit = this.handleChangeNewCredit.bind(this);
    this.toast = React.createRef();

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
      debugger;
      if (response.data.result) {
        that.setState({
          CreditSupport: response.data.result[0].CreditSupport,
          Raymand: response.data.result[0].Raymand,
        })
      }
      that.getManagerSystemInfo()





    }, function (error) {
      that.setState({
        loading: 0
      })

    })


  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value,showReport:false });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  
  handleChangeNewCredit(event) {
    this.setState({ Amount: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") });
  }
  
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
 
  onHide(event) {
    this.setState({
      visibleSearchDialog: false
    });

  }
  NewUser() {
    this.setState({
      step: 0,
      username:"",
      Amount:"",
      password:"",
      showReport:false
    })
  }
  componentDidMount() {
    let that = this;
    this.Server.send("MainApi/checktoken", {
      token: localStorage.getItem("api_token")
    }, function (response) {
      that.setState({
        ShopId: response.data.authData.shopId,
        userOfSite: response.data.authData.username,
        userId: response.data.authData.userId
      })
      that.getSettings();
    }, function (error) {
      console.log(error)
      that.getSettings();
    })



  }


  GetWallets(system) {
    let that = this;
    debugger;
    let param = {
      token: localStorage.getItem("api_token"),
      systemId: system || this.state.system
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let wallets = [];
      for (let resp of response.data.result) {
        wallets.push({ label: resp.name, value: resp.latinName, shops: resp.shops });
      }
      that.setState({
        wallet: wallets[0]?.value,
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
  GetLastRecord(username) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SeveralShop: true,
      ShopName_name: this.state.ShopId,
      username:username,
      mainShop: false,
      number: "5",
      inForm:1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      debugger;
      that.setState({
        printOutput:response.data.result,
        inForm:1,
        loading: 0,
        showReport:true
      })
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/getMehrCarts", param, SCallBack, ECallBack)
  }


  
  setCredit(Step) {
    let that = this;
    debugger;
    if (!this.state.Amount)
      return;
    let Amount = this.state.Amount.toString().replace(/,/g, "");
    if (isNaN(Amount)) {
      that.toast.current.show({ severity: 'warn', summary: <div> مبلغ نمیتواند غیر عددی باشد </div>, life: 8000 });
      return;
    }
    this.setState({
      loading: 1
    })
    this.setState({
      HasError: null
    })
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.username,
      payType: 0,
      Amount: Amount,
      ShopId: this.state.ShopId,
      Step: Step,
      wallet: this.state.wallet,
      userOfSite: this.state.userOfSite,
      system:this.state.system,
      isMainSystem: this.state.mySystem._id == this.state.system ? true : false

    };
    let SCallBack = function (response) {
     
      if(response.data.error){
        that.toast.current.show({ severity: 'error', summary: <div> {response.data.message} </div>, life: 8000 });
        that.setState({
          loading: 0  
        })
      }else{
        if(Step == 2){
          that.toast.current.show({ severity: 'success', summary: <div> عملیات با موفقیت انجام شد </div>, life: 8000 });
          that.GetLastRecord(that.state.username);

          that.setState({
            step: 0,
            loading: 0,
            username:"",
            Amount:"",
            password:""
  
          })

        }else{
          confirmDialog({
            message: <div>
              <h3>در صورت تایید مبلغ {that.state.Amount} ریال از حساب {that.state.name} کسر خواهد شد</h3>
            </div>,
            header: 'تایید خرید',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: "تایید نهایی",
            rejectLabel: "انصراف",
            accept: () => {that.setCredit(2)},
            reject: () => {that.setState({
              step:1
            })}
        });
        that.setState({
          loading:0
        })

        }
        
      }
      
      
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      that.toast.current.show({ severity: 'error', summary: <div> عملیات انجام نشد </div>, life: 8000 });
      console.log(error)
    }
    this.Server.send("MainApi/setCredit", param, SCallBack, ECallBack)
  }
  SaleByDynaPass() {
    let that = this;
    if (!this.state.password){
      that.toast.current.show({ severity: 'warn', summary: <div> رمز پویا را وارد کنید </div>, life: 8000 });
      return;
    }
    if (!this.state.Amount){
      that.toast.current.show({ severity: 'warn', summary: <div> مبلغ را وارد کنید </div>, life: 8000 });
      return;
    }
    let Amount = this.state.Amount.toString().replace(/,/g, "");
    if (isNaN(Amount)) {
      that.toast.current.show({ severity: 'warn', summary: <div> مبلغ نمیتواند غیر عددی باشد </div>, life: 8000 });
      return;
    }
    this.setState({
      loading: 1
    })
    let param = {
      username: this.state.username,
      dynamicPass:this.state.password
    };
    let SCallBack = function (response) {
      if(response.data.result.error){
        that.toast.current.show({ severity: 'error', summary: <div> {response.data.result.error} </div>, life: 8000 });
        that.setState({
          loading: 0
        })
        return;
      }else{
        that.setCredit(1)

      }
     
     
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/SaleByDynaPass", param, SCallBack, ECallBack)
  }
  createDynamicPass() {
    let that = this;
    if (!this.state.username){
      that.toast.current.show({ severity: 'warn', summary: <div> نام کاربری را وارد کنید </div>, life: 8000 });
      return;
    }
    this.setState({
      loading: 1
    })
    let param = {
      username: this.state.username
    };
    let SCallBack = function (response) {
      if(response.data.result.error){
        that.toast.current.show({ severity: 'error', summary: <div> {response.data.result.error} </div>, life: 8000 });
        that.setState({
          loading: 0
        })
        return;
      }else{
        let wallets = [];
        for (let resp of response.data.result.wallet) {
          if((resp.name == "mehr" && response.data.result.credit > 0 ) || resp.credit > 0  )
          wallets.push({ label: resp.name, credit: resp.name == "mehr" ? response.data.result.credit : resp.credit });
        }
        let finalWallets=[];
        for(let resp of that.state.wallets){
          for(let i=0;i<wallets.length;i++){
            if(resp.value == wallets[i].label){
              finalWallets.push({ label: resp.label, value: resp.value,credit:wallets[i].credit })
            }
          }
        }
        debugger;
        
        that.setState({
          step:1,
          loading: 0,
          wallet: finalWallets[0]?.value,
          walletCredit: finalWallets[0]?.credit,
          wallets:finalWallets,
          name:response.data.result.name
        })

      }
     
     
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/createDynamicPass", param, SCallBack, ECallBack)
  }
  getManagerSystemInfo() {
    let that = this;
    let param = {
      user_id: this.state.userId
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      debugger;
      that.setState({
        loading: 0,
        mySystem: (response.data.result[0] && response.data.result[0].system[0]) ? response.data.result[0].system[0] : { subSystem: false }
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
  getSystems() {
    let that = this;
    debugger;
    let SCallBack = function (response) {
      let systems = [];
      for (let resp of response.data.result) {
        systems.push({ label: resp.name, value: resp._id });
      }
      that.setState({
        system: that.state.mySystem._id ? that.state.mySystem._id : systems[0]?.value,
        systems: systems
      })
      that.GetWallets();



    };
    let ECallBack = function (error) {
      that.GetWallets();

    }
    this.Server.send("MainApi/getSystems", {}, SCallBack, ECallBack)
  }

  render() {

    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

        <div className="row justify-content-center mt-5">
          <div className="col-lg-12" >
            <Panel header="ثبت خرید" style={{ textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <div className="row" >
              
                  <div className="col-lg-12" style={{ textAlign: 'right', marginTop: 20 }}>
                    <div style={{borderRadius: 10 }}>
                      <label className="IRANYekan">نوع پرداخت</label>

                      <SelectButton value={this.state.typeOfpeyment} options={this.state.typeOfpeyments} onChange={(e) => {
                        this.setState({ typeOfpeyment: e.value === null ? this.state.typeOfpeyment : e.value })

                      }}></SelectButton>
                    </div>
                  </div>
                {this.state.wallets && this.state.wallets.length > 0 && this.state.step == 1 &&
                  <div className="col-lg-12" style={{ textAlign: 'right', marginTop: 20 }}>
                    <div style={{borderRadius: 10 }}>
                      <label className="IRANYekan">نوع کیف پول را انتخاب کنید</label>

                      <SelectButton value={this.state.wallet} options={this.state.wallets} onChange={(e) => {
                        debugger;
                        let walletCredit = "";
                        for(let resp of this.state.wallets){
                          if(resp.value == e.value)
                            walletCredit = resp.credit
                        }
                        this.setState({ wallet: e.value === null ? this.state.wallet : e.value, walletCredit: walletCredit,
                        })

                      }}></SelectButton>
                    </div>
                  </div>
                }

              {this.state.wallets && this.state.wallets.length > 0 && this.state.step == 1 &&
                  <div className="col-lg-12" style={{ textAlign: 'right', marginTop: 20 }}>
                    <div style={{borderRadius: 10 }}>
                     <p>موجودی کیف پول جاری {this.state.walletCredit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال می باشد </p>
                    </div>
                  </div>
                }




              </div>
              <form style={{ maxWidth: 800, maxHeight: 450, marginBottom: 10, maxWidth: 1000 }}  >
            <div className="row" style={{marginTop:30}}>
              <div className="col-lg-12 col-12">

                <div className="group">
                  <input style={{maxWidth:300}} className="form-control irsans" disabled={this.state.step == 1} autoComplete="off" type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} required="true" />
                  <label >نام کاربری (تلفن همراه)</label>

                </div>
              </div>
              {this.state.step == 1 &&
              <div className="col-lg-12 col-12">

                <div className="group">
                  <input className="form-control irsans" style={{maxWidth:300}} autoComplete="off" type="password" value={this.state.password} name="password" onChange={this.handleChangePassword} required="true" />
                  <label >رمز پویا</label>

                </div>
              </div>
              } 
              

             
               {this.state.step == 1 &&
                <div className="col-lg-12" style={{ marginTop: 10 }}>
                  <div className="group">
                    <input className="form-control irsans" style={{maxWidth:300}} autoComplete="off" type="text" value={this.state.Amount} name="Amount" onChange={this.handleChangeNewCredit} required="true" />
                    <label>مبلغ(ریال)</label>
                  </div>
                </div>
               } 
              
             



            </div>
          </form>
          <div className="row">
            <div className="col-lg-3 col-12">
              {this.state.step == 0 ?
                <button className="btn btn-primary irsans" onClick={() => this.createDynamicPass()} style={{ width: "120px", marginTop: "5px", marginBottom: "5px" }}> 
                دریافت رمز پویا
                </button>
              :
              <button className="btn btn-primary irsans" onClick={() => this.SaleByDynaPass()} style={{ width: "120px", marginTop: "5px", marginBottom: "5px" }}> 
              انجام خرید
             </button>
             }
            

            </div>
            <div className="col-lg-9 col-12" style={{textAlign:'left'}}>
            <button className="btn btn-secondary irsans" onClick={() => this.NewUser()} style={{ width: "120px", marginTop: "5px", marginBottom: "5px" }}> کاربر جدید </button>

            </div>

      </div>
            </Panel>
              {this.state.showReport &&
                  <div style={{textAlign:'center',fontFamily:'irsans'}}>
                  <h1>تاریخچه خریدهای  {this.state.name} از فروشگاه شما</h1>  
                  <div style={{fontFamily:'iranyekan'}} dangerouslySetInnerHTML={{ __html: this.state.printOutput}}></div>

                  </div>
              }
          </div>

        </div>
        

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
  connect(mapStateToProps)(SetSale)
);

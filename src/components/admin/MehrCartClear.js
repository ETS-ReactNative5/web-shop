import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import './Dashboard.css'

import { SelectButton } from 'primereact/selectbutton';

import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { Dropdown } from 'primereact/dropdown';
import DatePicker from 'react-datepicker2';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';

const config = {
  readonly: false // all options from https://xdsoft.net/jodit/doc/
}
class MehrCartClear extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();



    this.toast = React.createRef();

    this.state = {
      layout: 'list',
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      ShopArraySelected: [],
      ShopArrayOption: [],
      Count: 0,
      CountArr: [],
      showButton:true

    }


  }
  GetShopList() {
    let that = this;
    let param = {};
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      let ShopArray = [],
        ShopArrayName = [],
        ShopArrayOption = [];
      for (let i = 0; i < response.data.result.length; i++) {
        ShopArray[i] = response.data.result[i]._id;
        ShopArrayName[i] = response.data.result[i].name;
        ShopArrayOption.push({
          name: response.data.result[i].name,
          value: response.data.result[i]._id
        })
      }
      that.setState({
        ShopArray: ShopArray,
        ShopArrayName: ShopArrayName,
        ShopArrayOption: ShopArrayOption,
        ShopId: ShopArray[0],
        ShopArraySelected: [],
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
  ShopOptionTemplate = (option) => {
    return (
      <div className="country-item">
        <div>{option.name} {this.state.ShopArraySelected.indexOf(option.value) > -1 ? "*" : ""}</div>
      </div>
    );
  }
  selectedShopTemplate = (option, props) => {
    if (option) {
      return (
        <div className="country-item country-item-value">
          <div>{option.name}</div>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
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
      that.GetWallets();


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }

  Set(){
    let that = this;
    if(!this.state.ShopId){
      this.toast.current.show({ severity: 'warn', summary: <div>فروشگاه را انتخاب کنید</div>, life: 8000 });
      return;
    }
    
    let Count=0;
    let cheque=[];
    let items=[];
    let Amount=0;
    let temp={};   
    let temp2={};
    for (let i=0; i<this.state.Count; i++) {

      temp={};   
      temp2={};  
      if ("ChequeNumber_"+Count ) {
        temp2["number"]  = this.state["ChequeNumber_"+i];
        if(!this.state["ChequeNumber_"+i]){
          this.toast.current.show({ severity: 'warn', summary: <div>شماره را وارد کنید</div>, life: 8000 });
          return;
        }

      }
      if ("ChequeDate_"+Count ) {
        if(!this.state["ChequeDate_"+i]){
          this.toast.current.show({ severity: 'warn', summary: <div>تاریخ را وارد کنید</div>, life: 8000 });
          return;
        }
        temp2["date"] = this.state["ChequeDate_"+i];
        temp2["date_c"] =Date.parse(this.state["ChequeDate_"+i]);

        

      
      }
      if ("ChequeAmount_"+Count ) {
        if(!this.state["ChequeAmount_"+i]){
          this.toast.current.show({ severity: 'warn', summary: <div>مبلغ را وارد کنید</div>, life: 8000 });
          return;
        }
        Amount+= parseInt(this.state["ChequeAmount_"+i].toString().replace(/,/g, ""));
        temp2["Amount"] = this.state["ChequeAmount_"+i].toString().replace(/,/g, "");
        temp["Amount"] = this.state["ChequeAmount_"+i].toString().replace(/,/g, "");
      }
      if ("ChequeDesc_"+Count ) {
        temp2["desc"] = this.state["ChequeDesc_"+i];
        temp["desc"] = this.state["ChequeDesc_"+i];
      }

      temp.username = "system"; 
      temp.type = 0;
      temp.cleared = 1;
  
      temp.wallet = this.state.wallet;
      temp.ShopId = this.state.ShopId;
      temp2.ShopId = this.state.ShopId;
      temp2.user_Id = this.state.user_Id;
      items.push(temp)
      cheque.push(temp2)

    }
    
    this.setState({
      showButton:false
    })
    let param = {
      token: localStorage.getItem("api_token"),
      Amount: Amount,
      ShopId: this.state.ShopId,
      wallet:this.state.wallet,
      UserId: this.state.user_Id,
      username:'system',
      items:items,
      cheque:cheque,
      payType:0

    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      if(response.data.error){
        that.toast.current.show({ severity: 'error', summary: <div>{response.data.error}</div>, life: 8000 });
        that.setState({
          loading: 0,
          showButton:true

        })
        return;
      }
      that.toast.current.show({ severity: 'success', summary: <div>عملیات انجام شد</div>, life: 8000 });
      let state={};
      for (let i=0; i<that.state.Count; i++) {
        state["ChequeNumber_"+i]="";
        state["ChequeAmount_"+i]="";
        state["ChequeDesc_"+i]="";
      }
      that.setState({
        showButton:true,
        loading: 0,
        Count:0,
        CountArr:[],
        ...state
      })
    };
    let ECallBack = function (error) {
      console.log(error)
      that.toast.current.show({ severity: 'error', summary: <div>عملیات انجام نشد</div>, life: 8000 });

      that.setState({
        showButton:true,
        loading: 0
      })
    }

    this.Server.send("MainApi/setCreditCleared", param, SCallBack, ECallBack)

  }
  decreasCommission(){
    let that = this;
    if(!this.state.ShopId){
      this.toast.current.show({ severity: 'warn', summary: <div>فروشگاه را انتخاب کنید</div>, life: 8000 });
      return;
    }
    if(!this.state.SCommission){
      this.toast.current.show({ severity: 'warn', summary: <div>مبلغ را وارد کنید</div>, life: 8000 });
      return;
    }
    let param = {
      token: localStorage.getItem("api_token"),
      Amount: this.state.SCommission.toString().replace(/,/g, ""),
      ShopId: this.state.ShopId,
      UserId: this.state.user_Id,
      wallet:this.state.wallet,
      username:'system',
      desc:'برداشت کمیسیون صندوق',
      Step:2,
      payType:0,
      cleared:1

    };
    this.setState({
      loading: 1,
      showButton:false
    })
    let SCallBack = function (response) {
      that.toast.current.show({ severity: 'success', summary: <div>عملیات انجام شد</div>, life: 8000 });
      let state={};
      for (let i=0; i<that.state.Count; i++) {
        state["ChequeNumber_"+i]="";
        state["ChequeAmount_"+i]="";
        state["ChequeDesc_"+i]="";
      }
      that.setState({
        showButton:true,
        loading: 0,
        Count:0,
        CountArr:[],
        ...state
      })
    };
    let ECallBack = function (error) {
      console.log(error)
      that.toast.current.show({ severity: 'error', summary: <div>عملیات انجام نشد</div>, life: 8000 });

      that.setState({
        showButton:true,
        loading: 0
      })
    }

    this.Server.send("MainApi/setCredit", param, SCallBack, ECallBack)

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
      that.GetShopList();

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

  render() {

    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">
        <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

        <div className="section-title " style={{ width:'100%',textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >عملیات تسویه حساب</span></div>

          <div className="col-12" style={{ textAlign: 'right' }}>
          
          
          <Panel header="انتخاب فروشگاه" style={{ marginTop: 20, textAlign: 'right', fontFamily: 'yekan' }}>
            <div  style={{textAlign:'right'}}>
                    <div style={{marginRight: 10,border: "1px solid #eee",borderRadius: 10,padding: 10}}>
                    <label className="IRANYekan">نوع کیف پول را انتخاب کنید</label>

                    <SelectButton value={this.state.wallet} options={this.state.wallets} onChange={(e) => {
                      this.setState({wallet:e.value === null ? this.state.wallet : e.value,searchName:'',GridDataUsers:[]})
                    
                    }}></SelectButton>
                    </div>
            </div>
          </Panel>
          
          
          <Panel header="انتخاب فروشگاه" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
            <Dropdown value={this.state.ShopId} panelStyle={{ width: '100%', textAlign: 'right' }} style={{ fontFamily: 'iranyekanwebregular', width: '100%', textAlign: 'right', marginTop: 20 }} options={this.state.ShopArrayOption} onChange={(event) => this.setState({
              ShopId: event.target.value
            })} optionLabel="name" placeholder="فروشگاه را انتخاب کنید"
              valueTemplate={this.selectedShopTemplate} filter filterBy="name" itemTemplate={this.ShopOptionTemplate} />
          </Panel>
          <Panel header="کسر سود صندوق" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" id="SCommission" name="SCommission" value={this.state.SCommission} onChange={(event) => { this.setState({ SCommission: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                        <label>مبلغ (ریال)</label>
                      </div>
                      <button className="btn btn-primary yekan" disabled={!this.state.showButton} onClick={() => { this.decreasCommission() }} style={{ width: "100px", marginTop: "5px", marginBottom: "5px",marginTop:50 }}>ثبت تغییرات</button>
          </Panel>
          <Panel header="تسویه حساب فروشگاههای طرف قرارداد مهرکارت" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
            
            <button className="btn btn-secondary irsans" onClick={() => {
              let Count = this.state.Count + 1;
              this.setState({
                Count: Count
              })
              let that = this;
              let Arr = Array.from(Array(parseInt(Count)).keys())
              that.setState({
                CountArr: Arr
              })
            }
            } style={{ textAlign: 'right', cursor: 'pointer',marginTop:35 }}><i className="fa fa-plus" /><span style={{ marginRight: 10 }}> اضافه کردن ردیف جدید </span>
            </button>

            <div>
              {this.state.CountArr.map((item, index) => {
                return (
                  <div className="row" style={{ alignItems: 'baseline' }}>
                    <div className="col-lg-2">
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" id={"ChequeNumber_" + index} name={"ChequeNumber_" + index} value={this.state["chequeNumber_" + index]} onChange={(event) => { this.setState({ ["ChequeNumber_" + index]: event.target.value }) }} required="true" />
                        <label>شماره چک</label>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <DatePicker
                        onChange={value => this.setState({ ["ChequeDate_" + index]: value })}
                        value={this.state["ChequeDate_" + index]}
                        isGregorian={false}
                        timePicker={false}
                        placeholder="تاریخ چک"
                        persianDigits={false}

                      />

                    </div>
                    <div className="col-lg-3">
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" id={"ChequeAmount_" + index} name={"ChequeAmount_" + index} value={this.state["ChequeAmount_" + index]} onChange={(event) => { this.setState({ ["ChequeAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                        <label>مبلغ چک (ریال)</label>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="group">
                        <input className="form-control irsans" autoComplete="off" type="text" id={"ChequeDesc_" + index} name={"ChequeDesc_" + index} value={this.state["chequeName_" + index]} onChange={(event) => { this.setState({ ["ChequeDesc_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                        <label>توضیح</label>
                      </div>
                    </div>
                    <div className="col-lg-1">
                      {this.state.Count == (index+1) &&
                      <i className="fa fa-minus" style={{cursor:'pointer'}} onClick={() => {
                        let Count = this.state.Count - 1;
                        this.setState({
                          Count: Count
                        })
                        let that = this;
                        let Arr = Array.from(Array(parseInt(Count)).keys())
                        that.setState({
                          CountArr: Arr
                        })
                      }} > </i>
                    }
                    
                    </div>

                  </div>
                )
              })}
            </div>
            {this.state.Count != 0 && 
                        <button className="btn btn-primary yekan" disabled={!this.state.showButton} onClick={() => { this.Set() }} style={{ width: "100px", marginTop: "5px", marginBottom: "5px",marginTop:50 }}>ثبت تغییرات</button>

            }

            </Panel>
            

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
  connect(mapStateToProps)(MehrCartClear)
);

import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ComponentToPrint } from './../ComponentToPrint.js';
import { Toast } from 'primereact/toast';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import GoogleMapReact from 'google-map-react';
import ReactToPrint from 'react-to-print';
import './DataTableDemo.css';


class Sales_Registered extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.toast = React.createRef();

    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      Filter: '2',
      GridDataUsers: [],
      GridDataFactors: [],
      selectedFactor: null,
      newStatus: null,
      selectedId: null,
      statusDesc: null,
      SellerId: null,
      LastAmount: 0,
      LastCredit: 0,
      loading: 0,
      isMainShop: 0,
      AllowChangeStatusReadyToSend:true,
      showProductStatus: 0,
      url: this.Server.getUrl()

    }
    this.selectedFactorChange = this.selectedFactorChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onHide2 = this.onHide2.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleProductStatusChange = this.handleProductStatusChange.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);



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
        SellerId: response.data.authData.shopId,
        UserId: response.data.authData.userId
      })
      setTimeout(function () {
        that.getSettings();

      }, 0)

      that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.SellerId }, function (response) {
        that.setState({
          isMainShop: response.data.result[0].main
        })

      }, function (error) {

        that.getSettings();
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  onRowSelect(event) {
    this.setState({
      ProductSelectedTitle: event.data.title,
      ProductStatus: event.data.status,
      showProductStatus: true
    })
    let that = this;
    setTimeout(function(){
      
      let x = that;
      let selectedP = that.state.GridDataFactors[0].products[that.state.ProductSelectedIndex];
      that.setState({
        AllowChangeStatusReadyToSend:((Date.now() - selectedP.LastChangeDate_num) > 1200000 && selectedP.status == "3") ? false : true

      })
    },0)
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
  onStatusChange(event) {
    this.dt.filter(event.value, 'statusDesc', 'equals');
    this.setState({ statusDesc: event.value });
  }
  handleChangeStatus(event) {
    let that = this;
    that.setState({
      newStatus: event.target.value
    })
    let msg = "";
    if (event.target.value == "2" || event.target.value == "3" || event.target.value == "4") {
      msg = event.target.value == "2" ? "سفارش شما توسط فروشنده تامین و آماده ارسال گردید" + "\n" + that.state.STitle :
        (event.target.value == "3" ? "سفارشتان به مامور ارسال تحویل گردید.این سفارش تا ساعتی دیگر به دستتان خواهد رسید" + "\n" + that.state.STitle :
          "سفارش شما تحویل شد ." + "\n" + "از خریدتان ممنونیم" + "\n" + that.state.STitle)
    }
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedId: this.state.selectedId,
      statusDesc: event.target.options[event.target.selectedIndex].innerText,
      selectedUsername: this.state.selectedUsername,
      msg: msg
    };
    let SCallBack = function (response) {

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("AdminApi/changeFactorStatus", param, SCallBack, ECallBack)
    return false;
  }
  handleProductStatusChange(event) {
    let that = this;
    that.setState({ ProductStatus: event.target.value });
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedFactorId: that.state.selectedId,
      statusDesc: event.target.options[event.target.selectedIndex].innerText,
      UserId: that.state.UserId,
      SelectedProductId: that.state.selectedProductId

    };
    that.state.selectedFactor[that.state.ProductSelectedIndex].status = event.target.value;

    let SCallBack = function (response) {

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    that.Server.send("AdminApi/changeProductFactorStatus", param, SCallBack, ECallBack)

  }
  onHide(event) {
    this.setState({ selectedFactor: null, showProductStatus: 0,SelectPayk:false });
    this.GetFactors(this.state.Filter);
  }
  onHide2(event) {
    this.setState({ SelectPayk:false });
  }
  selectedFactorChange(value) {

    let that = this;
    var p = [];
    for (let i = 0; i < value.products.length; i++) {
      value.products[i].credit = value.products[i].credit ? value.products[i].credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
      value.products[i].price = value.products[i].price ? value.products[i].price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
      value.products[i].UnitPrice = value.products[i].UnitPrice ? value.products[i].UnitPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;

      value.products[i].detail = "";
      value.products[i].edit = <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => that.EditFactor(value._id, value.products[i]._id, value.products[i].title, "del")}></i>
      if (value.products[i].color)
        value.products[i].detail += "رنگ : " + value.products[i].color + "\n";
      if (value.products[i].size)
        value.products[i].detail += "اندازه : " + value.products[i].size;

    }
    this.setState({
      selectedUsername: value.username,
      selectedId: value._id,
      selectedFactor: value.products,
      newStatus: value.status
    })

  }
  EditFactor(FactorId, ProductId, title, type, product) {
    let that = this;
    if (type == "edit") {
      let param = {
        token: localStorage.getItem("api_token"),
        FactorId: FactorId,
        ProductId: ProductId,
        type: type,
        product: product
      };

      let SCallBack = function (response) {


      };
      let ECallBack = function (error) {
        console.log(error)
      }
      this.Server.send("AdminApi/EditFactor", param, SCallBack, ECallBack)
      return;
    }
    confirmAlert({
      title: <span className="yekan">حذف سفارش</span>,
      message: <span className="yekan">  آیا از حذف  {title} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let param = {
              token: localStorage.getItem("api_token"),
              FactorId: FactorId,
              ProductId: ProductId,
              type: type
            };
            let SCallBack = function (response) {
              if (type == "del" && !ProductId) {
                that.GetFactors(that.state.Filter);
              }
            };
            let ECallBack = function (error) {
              console.log(error)
            }
            this.Server.send("AdminApi/EditFactor", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });


  }

  GetFactors(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: Filter,
      SellerId: this.state.SellerId,
      isMainShop: this.state.isMainShop
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
        v.Amount = !v.Amount ? "0" : v.Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.Credit = !v.Credit ? "0" : v.Credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.paykAmount = !v.paykAmount ? "0" : v.paykAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        v.finalAmount = !v.finalAmount ? "0" : v.finalAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (v.status == "1")
          NewFactors++;
        if (v.status == "-2")
          v.statusDesc = "لغو محصول توسط فروشنده"
        if (v.status == "-2")
          v.statusDesc = "درخواست لغو توسط خریدار"
        if (v.status == "-1")
          v.statusDesc = "لغو شده"
        if (v.status == "0")
          v.statusDesc = "ناموفق"
        if (v.status == "1")
          v.statusDesc = "ثبت شده"
        if (v.status == "2")
          v.statusDesc = "آماده ارسال"
        if (v.status == "3")
          v.statusDesc = "ارسال شده"
        if (v.status == "4")
          v.statusDesc = "تحویل شده"
        if (v.status == "5")
          v.statusDesc = "تسویه شده"
        if (v.InPlace)
          v.InPlace = <span className="text-warning">در محل</span>
        else
          v.InPlace = <span className="text-success">نقدی</span>  
        if (v.userData && v.userData[0]) {
          v.name = v.userData[0].name;
          v.company = v.userData[0].company;
        }
        v.delete = <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => that.EditFactor(v._id, null, null, "del")}></i>
        v.share_address = <i className="fa fa-share" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => that.shareAddress(v)}></i>

      })
      that.setState({
        GridDataFactors: response.data.result.result,
        LastAmount: response.data.result.finalPrice,
        LastCredit: response.data.result.finalCredit,
        NewFactors: NewFactors
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
  shareAddress(p){
    let that = this;
    let address = p.userData[0].city + "،" + p.userData[0].subCity+"،"+p.userData[0].address;
    this.Server.send("AdminApi/getuserInformation", {map:'payk'}, function (response) {
      
      debugger;
      if(response.data.result.length > 1 ){
        that.setState({
          SelectPayk:true,
          paykList:{data:response.data.result,address:address,name:p.userData[0].username,username:response.data.result[0].username}
        })
      }else{
        if(response.data.result.length == 1)
          that.sendSms(address,p.userData[0].name,p.userData[0].username,response.data.result[0].username);
        else
          that.toast.current.show({ severity: 'warn', summary: 'عدم معرفی پیک', detail: <div> برای ارسال مشخصات خریدار به پیک از طریق فرم لیست کاربران حداقل یک کاربر با دسترسی پیک (payk) ثبت کنید </div>, life: 8000 });

      }




    }, function (error) {
      that.setState({
        loading: 0
      })

    })
  }
  sendSms(address,name,username,paykMob){
    let googleAddress = "https://www.google.com/maps/search/"+address;
    if(this.state.ActiveSms=="smart"){
      axios.post(this.state.url+'sendsms_smartSms', {
        text: "نام خریدار : " +name+"\n"+"شماره تلفن : "+ username+ "\n"+"آدرس : " + address + "\n" + googleAddress ,
        mobileNo : paykMob.trim()
      })
      .then(response => {
        this.toast.current.show({ severity: 'success', summary: 'اطلاعات با موفقیت ارسال شد', detail: <div></div>, life: 8000 });
        this.onHide();

      
      })
      .catch(error => {
        alert(error)

      })
    }else if(this.state.ActiveSms=="smsir"){
     
            axios.post(this.state.url+'sendsms_SmsIr', {
              text: "نام خریدار : " +name+"\n"+"شماره تلفن : "+ username+ "\n"+"آدرس : " + address + "\n" ,
              mobileNo : paykMob.trim()  
            })
            .then(response => {
                this.toast.current.show({ severity: 'success', summary: 'اطلاعات با موفقیت ارسال شد', detail: <div></div>, life: 8000 });
                this.onHide();
            
            })
            .catch(error => {
             
             alert(error)
            })
        
    }
  }
  inputTextEditor(field, props) {

    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value, field)} />;
  }
  gridEditor(field, props) {
    return this.inputTextEditor(field, props);
  }
  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.GetFactors(that.state.Filter);
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        let resp = response.data.result[0];
        that.setState({
          CreditSupport: resp.CreditSupport,
          ActiveSms: response.data.result ? resp.ActiveSms : "none",
          STitle: response.data.result ? resp.STitle : "",
          AccessAfterReg: response.data.result ? resp.AccessAfterReg : 0,
          RegSmsText: response.data.result ? resp.RegSmsText : ''
        })
      }




    }, function (error) {
      that.GetFactors(that.state.Filter);
      that.setState({
        loading: 0
      })

    })


  }

  onEditorValueChange(props, value, field) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    /*if((props.field=="relativeLevel" ||  props.field=="off") && value=="-")
      return;
    if((props.field=="relativeLevel" ||  props.field=="off") && isNaN(value) && value != "")
      return;  */
    // this.TableLayoutGetSet(updatedProducts[props.rowIndex],updatedProducts,props.rowIndex);
    this.setState({
      selectedFactor: updatedProducts
    })

    this.EditFactor(this.state.selectedId, updatedProducts[props.rowIndex]._id, updatedProducts[props.rowIndex].title, "edit", updatedProducts[props.rowIndex])

  }
  
  render() {
    const BodyTemplate = (rowData,props) => {
      return (
          <React.Fragment>
              <span className="p-column-title">{props.header}</span>
              {rowData[props.field]}
          </React.Fragment>
      );
    }
    const ProductBodyTemplate = (rowData,props) => {
      return (
          <React.Fragment>
              <span className="p-column-title">{props.header}</span>
              <span style={{paddingRight:20}}>{rowData[props.field]}</span>
              
          </React.Fragment>
      );
    }
    let statusDesc = [
      { label: "لغو شده", value: "لغو شده" },
      { label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار" },
      { label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار" },
      { label: "ناموفق", value: "ناموفق" },
      { label: "ثبت شده", value: "ثبت شده" },
      { label: "آماده ارسال", value: "آماده ارسال" },
      { label: "ارسال شده", value: "ارسال شده" },
      { label: "تحویل شده", value: "تحویل شده" },
      { label: "تسویه شده", value: "تسویه شده" },
      { label: "همه", value: null }


    ];
    let StatusFilter = <Dropdown style={{ width: '100%' }}
      value={this.state.statusDesc} options={statusDesc} onChange={this.onStatusChange} />
    return (
      <div style={{ direction: 'rtl' }}>
        <div style={{ display: "none" }}>
          <ComponentToPrint param={this.state.printParam} ref={el => (this.componentRef = el)} />
        </div>

        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>
            <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />
            <div className="section-title " style={{ display: 'none', textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >موجودی : {this.persianNumber(parseInt(this.state.LastAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  تومان</span></div>
            
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست فاکتورها (آماده ارسال)</span></div>
            
            <div className="datatable-responsive-demo">
              <DataTable  resizableColumns={true} paginator={true} className="p-datatable-responsive-demo" rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedFactor} onSelectionChange={e => { if (e.originalEvent.target.tagName != "I") this.selectedFactorChange(e.value) }} >
                <Column field="name" header="نام خریدار"  body={BodyTemplate}   className="yekan" style={{ textAlign: "right" }} />
                {this.state.isMainShop == 1 &&
                <Column field="username" header="نام کاربری" body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                }
                {this.state.isMainShop == 1 &&
                <Column field="company" header="شرکت" body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                }
                <Column field="finalAmount" header="مبلغ فاکتور"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                {this.state.isMainShop == 1 &&
                  <Column field="paykAmount" header="هزینه پیک"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                }
                {this.state.CreditSupport && this.state.isMainShop == 1 &&
                  <Column field="Credit" header="کسر از کیف پول"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                }
                {this.state.isMainShop == 1 &&
                <Column field="refId" header="رسید تراکنش"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                }
                <Column field="Date" header="تاریخ"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />
                <Column field="InPlace" header=" پرداخت"  body={BodyTemplate} className="yekan" style={{ textAlign: "right" }} />

                <Column field="statusDesc" filter={false} header="وضعیت"  body={BodyTemplate} filterElement={StatusFilter} className="yekan" style={{ textAlign: "right" }} />
                {this.state.isMainShop == 1 &&
                  <Column field="delete" filter={false} header="حذف"  className="yekan" style={{ textAlign: "right" }} />
                }
                <Column field="share_address" filter={false} header="اشتراک آدرس"  className="yekan" style={{ textAlign: "right" }} />

              </DataTable>
            </div>
          </div>

        </div>
        <Dialog header="انتخاب پیک" visible={this.state.SelectPayk}  onHide={this.onHide2} maximizable={false} maximized={false}>
          <div className="row">
            <div className="col-12">
              <select style={{width:'100%'}} className="yekan" onChange={(event)=>this.setState({
              paykMob : event.target.value
              })} value={this.state.paykMob}>
                <option value=""></option>

                {this.state.paykList && this.state.paykList.data.map(function(item,index){
                    return(
                      <option value={item.username} className="yekan" >{item.name}</option>
                    )
                })
                }
              </select>
            </div>
            <div className="col-12">
              {this.state.paykList &&
            <button className="btn btn-success YekanBakhFaMedium" disabled={!this.state.paykMob} style={{marginTop:40,marginBottom:10,width:'100%'}} onClick={()=>this.sendSms(this.state.paykList.address,this.state.paykList.name,this.state.paykList.username,this.state.paykMob)}>اشتراک گذاری اطلاعات کاربر</button>
              }
            </div>
          </div>
        </Dialog>
        <Dialog header="جزئیات فاکتور" visible={this.state.selectedFactor} style={{ width: '80vw' }} minY={70} onHide={this.onHide} maximizable={false} maximized={true}>
          <div style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: 400 }}>
            <div style={{position:'fixed',backgroundColor:'#fff',zIndex:2,width:'100%'}} >
            {this.state.isMainShop == 1 &&
              <div>
                <p className="yekan" style={{ float: "right" }}>تغییر وضعیت سفارش</p>
                <select className="custom-select yekan" value={this.state.newStatus} name="status" onChange={this.handleChangeStatus} >
                  <option value="-3" style={{display:'none'}}>لغو محصول توسط فروشنده</option>
                  <option value="-2" style={{display:'none'}}>درخواست لغو توسط خریدار</option>
                  <option value="-1" style={{display:'none'}}>لغو شده</option>
                  <option value="0">ناموفق</option>
                  <option value="1">ثبت شده</option>
                  <option value="2">آماده ارسال</option>
                  <option value="3">ارسال شده</option>
                  <option value="4">تحویل شده</option>
                  <option value="5">تسویه شده</option>

                </select>
                <br /><br />
                <hr />
              </div>

            }
            {this.state.showProductStatus == 1 ?
              <div>
                <p className="yekan" style={{ float: "right", color: 'red' }}>تغییر وضعیت {this.state.ProductSelectedTitle || "محصول"}</p>
                <select className="custom-select yekan" value={this.state.ProductStatus} name="status" onChange={this.handleProductStatusChange} >

                  <option value="0" disabled={this.state.isMainShop ? false : true}>منتظر تایید</option>
                  <option value="1" disabled={this.state.isMainShop ? false : true}>در حال پردازش</option>
                  <option value="2" disabled={(this.state.isMainShop || this.state.AllowChangeStatusReadyToSend) ? false : true }>آماده ارسال</option>
                  <option value="3" >تحویل شده</option>
                  <option value="-1" disabled={this.state.isMainShop ? false : true}>لغو</option>
                  


                </select>
                <br /><br />
              </div>
              :
              <div>
                <p className="yekan" style={{ float: "right" }}>برای تغییر وضعیت هر محصول روی سطر آن کلیک کنید</p><br /><br />
              </div>
            }
            </div>
            <div className="datatable-responsive-demo" style={{marginTop:this.state.isMainShop == 1 ? 250 : 100}}>

            <DataTable onRowSelect={this.onRowSelect} className="p-datatable-responsive-demo" responsive selection={this.state.selectedProduct1} onSelectionChange={e => {
              for (let i = 0; i < this.state.selectedFactor.length; i++) {
                if (this.state.selectedFactor[i]._id == e.value._id) {
                  this.setState({
                    ProductSelectedIndex: i,
                    selectedProductId: e.value._id
                  })
                }
              }
            }} selectionMode="single" dataKey="id" body={ProductBodyTemplate} resizableColumns={true} paginator={true} rows={10} value={this.state.selectedFactor}  >
              <Column field="title" header="عنوان" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              <Column field="subTitle" header="عنوان دوم" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              {this.state.isMainShop == 1 &&
              <Column field="SellerName" header="فروشنده" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              }
              {this.state.isMainShop == 1 &&
              <Column field="desc" header="شرح" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} />
              }
              {this.state.isMainShop == 1 ?
              <Column field="number" body={ProductBodyTemplate} editor={(props) => this.gridEditor('number', props)} header="تعداد" className="yekan" style={{ textAlign: "right" }} />
                :
                <Column field="number" body={ProductBodyTemplate} header="تعداد" className="yekan" style={{ textAlign: "right" }} />
            }
              <Column field="status" header="وضعیت" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              <Column field="price" header="مبلغ پرداختی" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />

              {this.state.CreditSupport && 
                <Column field="credit" header="کسر از کیف پول" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              }
              <Column field="detail" header="جزئیات" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              {this.state.isMainShop == 1 &&
                <Column field="edit" header="حذف" body={ProductBodyTemplate} className="yekan" style={{ textAlign: "right" }} />
              }

            </DataTable>
            </div>
          </div>
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
  connect(mapStateToProps)(Sales_Registered)
);

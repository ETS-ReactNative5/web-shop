import React, { Component } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

import Server from '../Server.js'
import { connect } from "react-redux"
import { Dropdown } from 'primereact/dropdown';
import { Sidebar } from 'primereact/sidebar';
import { SelectButton } from 'primereact/selectbutton';

import Header from '../Header.js'
import { withRouter, Redirect, Link } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const FilterItems = [
    { label: 'همه', value: 'All' },
    { label: 'ثبت شده', value: '1' },
    { label: 'آماده ارسال', value: '2' },
    { label: 'ارسال شده', value: '3' },
    { label: 'تحویل شده', value: '4' },
    { label: 'تسویه شده', value: '5' },
    { label: 'لغو شده', value: '-1' },
  
  
  
  ];
class Factors extends React.Component {
  constructor(props){
    super(props);  
    this.Server = new Server();
    this.state={
      AccountNumber:this.props.location.search.split("account=")[1],
      Place:this.props.place,
      listViewData:[],
      Sort:"",
      Filter:"1",
      loading:false,
      SelectedProduct:[],
      SelectedFactor:[],
      productStatus:["منتظر تایید","در حال پردازش","آماده ارسال","تحویل شده"],
      statusDropDown:[{
          value:"0",
          label:"منتظر تایید"

      },
      {
        value:"1",
        label:"در حال پردازش"

    },
    {
        value:"2",
        label:"آماده ارسال"

    },
    {
        value:"3",
        label:"تحویل شده"

    }
    ],
      IsSeller:-1
    }     

    this.handleProductStatusChange = this.handleProductStatusChange.bind(this);

    this.itemTemplate = this.itemTemplate.bind(this)
  }
  componentDidMount() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
    };
     
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        UId: response.data.authData.userId,
        loading: 0
      })
      that.getuserInformation(response.data.authData.userId);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getuserInformation(UId){

    let that = this;
    let param = {
      user_id:UId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        shopId:response.data.result[0].shopId,
        loading: 0
      })
      that.getShop(response.data.result[0].shopId);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/getuserInformation", param, SCallBack, ECallBack)

  }
  getShop(shopId){
    if(!shopId){
      this.setState({
        IsSeller:0
      })
      return;
    }
    let that = this;
    let param = {
      ShopId:shopId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        shop:response.data.result[0],
        credit:response.data.result[0]?.credit||0,
        isMainShop:response.data.result[0].main,
        loading: 0,
        IsSeller:1
      })
      that.GetFactors("1")
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)

  }
  GetFactors(Filter) {
    let that = this;
     
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: Filter,
      SellerId: this.state.shopId,  
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
        if (v.status == "-3")
          v.statusDesc = "مرجوع شده"
        if (v.status == "-2")
          v.statusDesc = "درخواست مرجوعی"
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
          v.InPlace = !v.ChequeList ? <span className="text-warning">در محل</span> : <span className="text-warning">  چک _ در محل</span>
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
  itemTemplate(car, layout) {
    let linkUser = "https://www.google.com/maps/search/"+car.address;
    
    if (car) {
      return (
          <div>
            <div className="row">
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20,fontSize:20,background:'#eee'}}>
                فروشنده : {car.products[0].SellerName}
              </div>
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20}}>
                شماره سفارش : {car.OrderId}
              </div>
              
              <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:20,marginTop:20}}>
                {car.name}
              </div>
              <div className="col-lg-6 col-12 yekan text-danger mt-lg-0 mt-3" style={{textAlign:'right',fontSize:25,marginTop:20}}>
                  <a style={{color:'red'}} href={"tel:+98"+car.username}>{car.username}</a>
              </div>
              <div className="col-12">
                  {car.products.map((item,index)=>{
                      return(
                        <div>

                        <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:17,marginTop:10}}>
                        {item.title}
                        </div>
                        <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:14}}>
                        {item.subTitle}
                        </div>
                        <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10}}>
                         تعداد : {item.number}
                        </div>
                        <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10}}>
                         قیمت واحد : {item.UnitPrice} تومان
                        </div>
                        <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10}}>
                         قیمت  : {item.price} تومان
                        </div>
                        <div>
                            <Button className="YekanBakhFaMedium" style={{marginTop:50}}>
                                <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} onClick={()=>{this.setState({status:item.status,SelectedFactor:car,SelectedProduct:item,displayChangeStatus:true})}} >تغییر وضعیت محصول</span>
                            </Button>
                        </div>
                        </div>
                      )
                     
                  })}
              </div>
              

              
            </div>

            </div>
        );
    } 
}
handleProductStatusChange(event) {
    let that = this;
    that.setState({ status: event.target.value });
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedFactorId: that.state.SelectedFactor._id,
      statusDesc: event.target.name,
      UserId: that.state.UId,
      SelectedProductId: that.state.SelectedProduct._id

    };
    that.state.SelectedProduct.status = event.target.value;

    let SCallBack = function (response) {

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    that.Server.send("AdminApi/changeProductFactorStatus", param, SCallBack, ECallBack)

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
      
    return (   

      <div>
            <Header credit={this.state.credit} ComponentName="مدیریت سفارشات" />

             
       <div> 
       <div style={{maxHeight:'calc(100% - 210px)',overflow:'auto'}}>    
        {this.state.IsSeller == 0 &&
            <div>
            <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center',color:'red' }}>
               شما به عنوان پذیرنده در سیستم تعریف نشده اید
             </p>
             <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>
               برای ثبت نام به عنوان پذیرنده و استفاده از امکانات فروش نقدی و اقساطی محصولات خود به صورت حضوری و آنلاین با پشتیبانان سیستم تماس بگیرید
             </p>

            </div>
        }
        {this.state.IsSeller == 1 &&
            <div>
             <div style={{direction:'rtl',margin:20}} className="factors">
                <SelectButton value={this.state.Filter} options={FilterItems} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { this.setState({ Filter: e.value||"1" }); this.GetFactors(e.value||"1") }}></SelectButton>
            </div>
            <DataView value={this.state.GridDataFactors} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>

            
             
            </div>
        }
        {this.state.IsSeller == -1 &&
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
            <ProgressSpinner style={{paddingTop:150}}/>
        </div>
        
        }
             
        </div>
       </div>

       <Sidebar header="تغییر وضعیت محصول " visible={this.state.displayChangeStatus} style={{ fontFamily: 'YekanBakhFaBold' }}  onHide={() => this.setState({displayChangeStatus:false,SelectedFactor:[],SelectedProduct:[]})}>
             <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10}}>

                {this.state.SelectedProduct.title}
            </div>
            <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10}}>

                {this.state.SelectedProduct.subTitle}
            </div>
            <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:16,marginTop:10,color:'blue'}}>
               وضعیت :  {this.state.productStatus[this.state.SelectedProduct.status == "-1" ? 4 : parseInt(this.state.SelectedProduct.status)]} 
            </div>
            <Dropdown style={{ width: '90%', textAlign: 'right',marginTop:100 }} value={this.state.status} options={this.state.statusDropDown} onChange={this.handleProductStatusChange} placeholder="وضعیت جدید را انتخاب کنید" />


            
        </Sidebar >
          
    </div>
    );
  }
}
function mapStateToProps(state) {        
  return {
    username : state.username,
    password : state.password,
    ip : state.ip,
    account:state.account,
    place:state.place,
    fullname : state.fullname,
    mobile : state.mobile
  }
}
export default connect(mapStateToProps)(Factors)  


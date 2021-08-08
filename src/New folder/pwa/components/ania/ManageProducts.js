import React, { Component } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

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
class ManageProducts extends React.Component {
  constructor(props){
    super(props);  
    this.Server = new Server();
    this.toast = React.createRef();

    this.state={
      AccountNumber:this.props.location.search.split("account=")[1],
      Place:this.props.place,
      listViewData:[],
      Sort:"",
      Filter:"1",
      loading:false,
      SelectedProduct:[],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(),
      SelectedFactor:[],
      IsSeller:-1,
      GridDataOrg:[]
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
      that.GetProduct()
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)

  }
  GetProduct() {
    
    let that = this;

    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.shopId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        GridData: response.data.result,
        GridDataOrg: response.data.result,
        loading: 0
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/getProducts", param, SCallBack, ECallBack)
  }
  itemTemplate(car, layout) {
    let linkUser = "https://www.google.com/maps/search/"+car.address;
    
    if (car) {
      return (
          <div onClick={()=>{
            this.setState({PrepareTime:car.PrepareTime,number:car.number,price:car.price,title:car.title,id:car.product_id,off:car.off,SelectedProduct:car,displayChangeStatus:true})
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}} >
            <div>
                <img src={this.state.absoluteUrl + "/" + car.fileUploaded?.split("public")[1]} style={{width:100,height:100}} />
            </div>
            <div style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>
                {car.title}
            </div>
           
            <div>
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
  EditProduct(){
    let that = this;
    let param = {
        token: localStorage.getItem("api_token"),
        SellerEdit:1,
        title:this.state.title,
        id:this.state.id,
        price:this.state.price,
        number:this.state.number,
        off:this.state.off,
        PrepareTime:this.state.PrepareTime,
        SeveralShop:true,
        set:0,
        SellerId:this.state.shopId,
        Tags:[]
      };
  
      let SCallBack = function (response) {
          that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium">عملیات موفق</div>, detail: <div className="YekanBakhFaMedium">مشخصات محصول اصلاح شد</div>, life: 8000 });
          that.GetProduct();

      };
      let ECallBack = function (error) {
        console.log(error)
      }
      that.Server.send("AdminApi/setOrUpdateProduct", param, SCallBack, ECallBack)

  }
  render() {         
 
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
            <Header credit={this.state.credit} ComponentName="مدیریت محصولات" />

             
       <div> 
       <div style={{maxHeight:'calc(100% - 210px)',overflow:'auto'}}>    
       <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />

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

            <input className="form-control YekanBakhFaMedium" autocomplete="off" placeholder="... جستجو" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '3px solid #eee', height: 40,fontSize:20 }}  id="search" value={this.state.search} name="search" onChange={(e) => {
              
              this.setState({ search: e.target.value });
              let res=[];
              this.state.GridDataOrg.find(element =>{
                if((element.title && element.title.match(new RegExp(e.target.value, "i"))) || (element.subTitle && element.subTitle.match(new RegExp(e.target.value, "i")))){
                  res.push(element)
                }
                
              });
              this.setState({
                GridData:res
              })
              
            }} required />

            <DataView value={this.state.GridData} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>

            
             
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
            
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative',marginTop:50,alignItems:'center' }}>
              <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} type="number" id="price" value={this.state.price} name="price" onChange={(e) => this.setState({ price: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>قیمت</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative',alignItems:'center' }}>
              <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} type="number" id="off" value={this.state.off} name="off" onChange={(e) => this.setState({ off: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>تخفیف</label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative',alignItems:'center' }}>
              <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} type="number" id="number" value={this.state.number} name="number" onChange={(e) => this.setState({ number: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>موجودی</label>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative',alignItems:'center' }}>
              <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 0, borderBottom: '3px solid #eee', height: 40,fontSize:20 }} type="number" id="PrepareTime" value={this.state.PrepareTime} name="PrepareTime" onChange={(e) => this.setState({ PrepareTime: e.target.value })} required />
              <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>زمان آماده سازی</label>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative',alignItems:'center' }}>

            <Button className="YekanBakhFaMedium" style={{marginTop:50}}>
                <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} onClick={()=>{this.EditProduct()}} >اصلاح</span>
            </Button>
            </div>

            
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
export default connect(mapStateToProps)(ManageProducts)  


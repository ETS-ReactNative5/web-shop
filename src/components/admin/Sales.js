import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog} from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ComponentToPrint } from './../ComponentToPrint.js';

import { connect } from 'react-redux';
import {Dropdown} from 'primereact/dropdown';   
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import GoogleMapReact from 'google-map-react';
import ReactToPrint from 'react-to-print';

const FilterItems = [
  {label: 'تسویه شده', value: '5'},
  {label: 'پایان', value: '4'},
  {label: 'ارسال شده', value: '3'},
  {label: 'آماده ارسال', value: '2'},
  {label: 'ثبت شده', value: '1'},
  {label: 'ناموفق', value: '0'},
  {label: 'لغو شده', value: '-1'},
  {label: 'درخواست لغو توسط کاربر', value: '-2'},
  {label: 'همه', value: 'All'}


];
class Sales extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],  
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],  
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      Filter:'All',
      GridDataUsers:[], 
      GridDataFactors:[],
      selectedFactor:null,
      newStatus:null,
      selectedId:null,
      statusDesc:null,
      SellerId:null,
      LastAmount:0,
      LastCredit:0,
      loading:0,
      isMainShop:0,
      showProductStatus:0
      
    }
    this.selectedFactorChange = this.selectedFactorChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleProductStatusChange = this.handleProductStatusChange.bind(this);   
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);



  }
  componentDidMount(){
    let param={
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      that.setState({
        SellerId : response.data.authData.shopId,
        UserId : response.data.authData.userId
      })
      setTimeout(function(){
        that.getSettings();

      },0)

      that.Server.send("AdminApi/ShopInformation",{ShopId:that.state.SellerId},function(response){
        that.setState({
          isMainShop:response.data.result[0].main
        })

      },function(error){

        that.getSettings();
      })

    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
  }
  onRowSelect(event) {
    this.setState({
      ProductStatus:event.data.status,
      showProductStatus:true
    })
  }
  persianNumber(input){
    var persian = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
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
    this.setState({statusDesc: event.value});
  }
  handleChangeStatus(event){
    let that = this;
    that.setState({
      newStatus:event.target.value
    })
    let param={
      token: localStorage.getItem("api_token"),
      newStatus:event.target.value,
      selectedId:this.state.selectedId,
      statusDesc:event.target.options[event.target.selectedIndex].innerText,
      selectedUsername:this.state.selectedUsername
    };
    let SCallBack = function(response){
      
    };
    let ECallBack = function(error){
      console.log(error)
    }
    this.Server.send("AdminApi/changeFactorStatus",param,SCallBack,ECallBack)
    return false;
  }
  handleProductStatusChange(event){
    let that=this;
      that.setState({ProductStatus: event.target.value});
    let param={
      token: localStorage.getItem("api_token"),
      newStatus:event.target.value,
      selectedFactorId:that.state.selectedId,
      statusDesc:event.target.options[event.target.selectedIndex].innerText,
      UserId:that.state.UserId,
      SelectedProductId:that.state.selectedProductId

    };
    that.state.selectedFactor[that.state.ProductSelectedIndex].status=event.target.value;

      let SCallBack = function(response){
        
      };
      let ECallBack = function(error){
        console.log(error)
      }
      that.Server.send("AdminApi/changeProductFactorStatus",param,SCallBack,ECallBack)
    
  }
  onHide(event) {
    this.setState({selectedFactor: null,showProductStatus:0});
    //window.location.reload();
    this.GetFactors(this.state.Filter);
  }
  selectedFactorChange(value){

    let that = this;
    var p=[];
    
    for(let i=0;i<value.products.length;i++){
      value.products[i].detail="";
      value.products[i].edit=<i class="fa fa-times" style={{cursor:'pointer'}} aria-hidden="true" onClick={()=>that.EditFactor(value._id,value.products[i]._id,value.products[i].title,"del")}></i>
      if(value.products[i].color)
        value.products[i].detail +="رنگ : " + value.products[i].color + "\n";
      if(value.products[i].size)
        value.products[i].detail +="اندازه : " + value.products[i].size;  

    }
    this.setState({
      selectedUsername:value.username,
      selectedId:value._id,
      selectedFactor:value.products,
      newStatus:value.status
    })
    
  }
  EditFactor(FactorId,ProductId,title,type,product){
    let that=this;
    if(type=="edit"){
      let param={
        token: localStorage.getItem("api_token"),
        FactorId:FactorId,
        ProductId:ProductId,
        type:type,
        product:product
      };
      let SCallBack = function(response){
        
      };
      let ECallBack = function(error){
        console.log(error)
      }
      this.Server.send("AdminApi/EditFactor",param,SCallBack,ECallBack)
      return;
    }
    confirmAlert({
      title: <span className="yekan">حذف سفارش</span>,
      message: <span className="yekan">  آیا از حذف  {title} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () =>{
            let param={
              token: localStorage.getItem("api_token"),
              FactorId:FactorId,
              ProductId:ProductId,
              type:type
            };
            let SCallBack = function(response){
              if(type=="del" && !ProductId){
                that.GetFactors(that.state.Filter);
              }
            };
            let ECallBack = function(error){
              console.log(error)
            }
            this.Server.send("AdminApi/EditFactor",param,SCallBack,ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });
    
      
  }
  
  GetFactors(Filter){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      Filter:Filter,
      SellerId:this.state.SellerId,
      isMainShop:this.state.isMainShop
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      let NewFactors = 0;
      response.data.result.result.map(function(v,i){
        if(v.status=="1")
          NewFactors++;
        if(v.status=="-2")
          v.statusDesc="لغو محصول توسط فروشنده"
        if(v.status=="-2")
          v.statusDesc="درخواست لغو توسط خریدار"
        if(v.status=="-1")
          v.statusDesc="لغو شده"
        if(v.status=="0")
          v.statusDesc="ناموفق"
        if(v.status=="1")
          v.statusDesc="ثبت شده"  
        if(v.status=="2")
          v.statusDesc="آماده ارسال"  
        if(v.status=="3")
          v.statusDesc="ارسال شده"
        if(v.status=="4")
          v.statusDesc="پایان"  
        if(v.status=="5")
          v.statusDesc="تسویه شده" 
        if(v.userData && v.userData[0]){
          v.name = v.userData[0].name;
          v.company = v.userData[0].company;
        }
        v.delete = <i class="fa fa-times" style={{cursor:'pointer'}} aria-hidden="true" onClick={()=>that.EditFactor(v._id,null,null,"del")}></i>  
        v.print = <ReactToPrint
        trigger={() => {
          return <i class="far fa-print" style={{cursor:'pointer'}} aria-hidden="true" onClick={()=>that.state.printParam=v}></i> ;
        }}
        content={() => that.componentRef}
      /> 

      })
      that.setState({
        GridDataFactors : response.data.result.result,
        LastAmount:response.data.result.finalPrice,
        LastCredit:response.data.result.finalCredit,
        NewFactors:NewFactors
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors",param,SCallBack,ECallBack)
  }
  inputTextEditor(field,props) {
   
    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value,field)} />;
  }
  gridEditor(field,props){
    return this.inputTextEditor(field,props);
  }   
  getSettings(){
    let that = this;
    that.setState({
      loading:1
    })
    that.Server.send("AdminApi/getSettings",{},function(response){
      that.GetFactors("All");
      that.setState({
        loading:0
      })
      if(response.data.result){
        that.setState({
          CreditSupport : response.data.result[0].CreditSupport
        })
      }

      

      
    },function(error){
      that.GetFactors("All");
      that.setState({
        loading:0
      })

    })

  
}
  onEditorValueChange(props, value,field) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    
    /*if((props.field=="relativeLevel" ||  props.field=="off") && value=="-")
      return;
    if((props.field=="relativeLevel" ||  props.field=="off") && isNaN(value) && value != "")
      return;  */
   // this.TableLayoutGetSet(updatedProducts[props.rowIndex],updatedProducts,props.rowIndex);
    this.setState({
      selectedFactor:updatedProducts
    })
    
    this.EditFactor(this.state.selectedId,updatedProducts[props.rowIndex]._id,updatedProducts[props.rowIndex].title,"edit",updatedProducts[props.rowIndex])

  }
    render(){
      let statusDesc = [
        {label: "لغو شده", value: "لغو شده"},
        {label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار"},
        {label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار"},
        {label: "ناموفق", value: "ناموفق"},
        {label: "ثبت شده" , value: "ثبت شده"},
        {label: "آماده ارسال" , value: "آماده ارسال"},
        {label: "ارسال شده", value: "ارسال شده"},
        {label: "پایان", value: "پایان"},
        {label: "تسویه شده", value: "تسویه شده"},
        {label: "همه", value: null}


     ];
       let StatusFilter = <Dropdown style={{width: '100%'}}
       value={this.state.statusDesc} options={statusDesc} onChange={this.onStatusChange}/>
     return (
      <div style={{direction:'rtl'}}>
                <div style={{ display: "none" }}>
                  <ComponentToPrint param={this.state.printParam} ref={el => (this.componentRef = el)} />
                </div>

        {this.state.loading == 1 &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px'}}>
                <Loader content="لطفا صبر کنید ..." className="yekan"  />
              </div>
            }
      <div className="row justify-content-center">
    <div  className="col-12 col-md-4 col-lg-3 ">

    <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
     </div>
      <div className="col-lg-9 col-md-8 col-12"  style={{marginTop:20,backgroundColor:'#fff'}}>
     <div className="section-title " style={{display:'none',textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >موجودی نقدی : {this.persianNumber(parseInt(this.state.LastAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  تومان</span></div>
     {this.state.CreditSupport && 
        <div className="section-title " style={{display:'none',textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >موجودی اعتباری : {this.persianNumber(parseInt(this.state.LastCredit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  تومان</span></div>
     }
     <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >لیست فاکتورها</span></div>
     <div style={{textAlign:'right',marginBottom:10}}>
     <SelectButton value={this.state.Filter} options={FilterItems} style={{fontFamily:'Yekan'}} className="yekan" onChange={(e) => {this.setState({Filter: e.value});this.GetFactors(e.value)}}></SelectButton>

       </div>
              <DataTable responsive resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedFactor} onSelectionChange={e => {if(e.originalEvent.target.tagName !="I")this.selectedFactorChange(e.value)}} >
                        <Column field="name"  header="نام خریدار" className="yekan" style={{textAlign:"center"}} />
                        <Column field="username"  header="نام کاربری" className="yekan" style={{textAlign:"center"}} />
                        <Column field="company"  header="شرکت" className="yekan" style={{textAlign:"center"}} />
                        <Column field="Amount" header="مبلغ پرداختی" className="yekan" style={{textAlign:"center"}} />
                        {this.state.CreditSupport && 
                          <Column field="Credit" header="کسر از اعتبار" className="yekan" style={{textAlign:"center"}} />
                        }
                        <Column field="refId" header="رسید تراکنش"  className="yekan" style={{textAlign:"center"}}/>
                        <Column field="Date" header="تاریخ"  className="yekan" style={{textAlign:"center"}}/>


                        
                        <Column field="statusDesc" filter={false} header="وضعیت" filterElement={StatusFilter}  className="yekan" style={{textAlign:"center"}}/>
                        {this.state.isMainShop==1 &&
                          <Column field="delete" filter={false} header="حذف" className="yekan" style={{textAlign:"center"}}/>
                        }
                        {this.state.isMainShop==1 &&
                          <Column field="print" filter={false} header="چاپ" className="yekan" style={{textAlign:"center"}}/>
                        }
              </DataTable>
      </div>
     
    </div>
 
    <Dialog header="جزئیات فاکتور"  visible={this.state.selectedFactor} style={{width: '80vw'}}  minY={70} onHide={this.onHide} maximizable={true}>
      <div style={{overflowY:'auto',overflowX:'hidden',height:400}}>
      {this.state.isMainShop==1 &&
      <div>
      <p className="yekan" style={{float:"right"}}>تغییر وضعیت سفارش</p>
      <select className="custom-select yekan"  value={this.state.newStatus} name="status" onChange={this.handleChangeStatus} >
        <option value="-3">لغو محصول توسط فروشنده</option>
        <option value="-2">درخواست لغو توسط خریدار</option>
        <option value="-1">لغو شده</option>
        <option value="0">ناموفق</option>
        <option value="1">ثبت شده</option>
        <option value="2">آماده ارسال</option>
        <option value="3">ارسال شده</option>
        <option value="4">پایان</option>
        <option value="5">تسویه شده</option>
       
      </select>
      <br/><br/>
      <hr/>
      </div>
      
      }
      <p className="yekan" style={{float:"right"}}>برای تغییر وضعیت هر محصول روی سطر آن کلیک کنید</p><br/><br/>
      {this.state.showProductStatus==1 &&
      <div>
      <p className="yekan" style={{float:"right"}}>تغییر وضعیت محصول</p>
      <select className="custom-select yekan"  value={this.state.ProductStatus} name="status" onChange={this.handleProductStatusChange} >
      
        <option value="0">منتظر تایید</option>
        <option value="1">در حال پردازش</option>
        <option value="2">آماده ارسال</option>
        <option value="3">پایان</option>
        <option value="-1">لغو</option>

       
      </select>
      <br/><br/>
      </div>
      }

      <DataTable onRowSelect={this.onRowSelect} responsive selection={this.state.selectedProduct1} onSelectionChange={e =>{
        for(let i=0;i<this.state.selectedFactor.length;i++){
          if(this.state.selectedFactor[i]._id==e.value._id){
             this.setState({
               ProductSelectedIndex:i,
               selectedProductId:e.value._id
             })
          }
        }
        } } selectionMode="single" dataKey="id" resizableColumns={true} paginator={true} rows={10} value={this.state.selectedFactor}  >
                        <Column field="title" header="عنوان" className="yekan" style={{textAlign:"center"}} />
                        <Column field="subTitle" header="عنوان دوم"  className="yekan" style={{textAlign:"center"}}/>
                        <Column field="SellerName" header="فروشنده"  className="yekan" style={{textAlign:"center"}}/>

                        <Column field="desc" header="شرح" className="yekan" style={{textAlign:"center",whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}} />
                        <Column field="number" editor={(props) => this.gridEditor('number', props)} header="تعداد" className="yekan" style={{textAlign:"center"}} />
                        <Column field="status" header="وضعیت" className="yekan" style={{textAlign:"center"}} />
                        <Column field="price" header="مبلغ پرداختی" className="yekan" style={{textAlign:"center"}} />

                        {this.state.CreditSupport && 
                          <Column field="credit" header="کسر از اعتبار" className="yekan" style={{textAlign:"center"}} />
                        }
                        <Column field="detail" header="جزئیات" className="yekan" style={{textAlign:"center"}} />
                        {this.state.isMainShop==1 &&
                          <Column field="edit"  header="حذف" className="yekan" style={{textAlign:"center"}} />
                        }

     </DataTable>
     </div>
     </Dialog> 
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
  connect(mapStateToProps)(Sales)
);

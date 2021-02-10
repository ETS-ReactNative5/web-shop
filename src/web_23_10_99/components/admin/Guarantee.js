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
import { Button,Alert } from 'reactstrap';
import {ProgressBar} from 'primereact/progressbar';

import { connect } from 'react-redux';
import {Dropdown} from 'primereact/dropdown';
import {AutoComplete} from 'primereact/autocomplete';
import { Steps,Notification } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
class Guarantee extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],  
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],  
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,

      GridData:[],
      selectedId:'',
      SellerId:null,
      LastAmount:0,
      brandSuggestions: null,
      StepNumber:1,
      StepVertical:0,
      mobile:'',
      title:'',
      desc:'',
      selectedId:'',
      statusCode:'',
      statusDesc:''

    }
    this.onHide = this.onHide.bind(this);
    this.selectedListChange = this.selectedListChange.bind(this);
    this.SetGuarantee = this.SetGuarantee.bind(this);
    this.GetGuarantee = this.GetGuarantee.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);

    this.OpenDialog = this.OpenDialog.bind(this);

    
  }
  handleChangeStatus(event){
      let statusDesc="";
      if(event.target.value=="0")
        statusDesc="لغو شده";
      if(event.target.value=="1")
        statusDesc="دریافت شده";  
      if(event.target.value=="2")
        statusDesc="در حال تکمیل"; 
      if(event.target.value=="3")
        statusDesc="آماده تحویل";
      if(event.target.value=="4")
        statusDesc="تحویل شده"; 
      this.setState({statusCode: event.target.value,statusDesc:statusDesc});
  }
  itemTemplate(brand) {
		this.state.Count++;
		return (
		    <div className="p-clearfix" >
			   <div style={{ margin: '10px 10px 0 0' }} className="row" _id={this.state._id[this.state.Count]} >
			   <div _id={this.state._id[this.state.Count]} className="col-lg-6">{this.state.img[this.state.Count] && 
			   <img src={this.state.absoluteUrl + this.state.img[this.state.Count].split("public")[1]} style={{width:100,height:100,minWidth:100}}  _id={this.state._id[this.state.Count]}  />
			   } </div>
			   <div className="col-lg-6" _id={this.state._id[this.state.Count]}>{this.state.desc[this.state.Count] && 
			   <span className="yekan" style={{textAlign:'right'}}  _id={this.state._id[this.state.Count]} >
			   <span _id={this.state._id[this.state.Count]}>{brand}</span><br />
			   <span _id={this.state._id[this.state.Count]}>{this.state.desc[this.state.Count].slice(0, 20)}</span> 
			   </span>
			   }
			   </div></div>
		    </div>
		);

   }
   onSelect(event){
    this.setState({brand:event.value,selectedproductId:event.originalEvent.target.getAttribute("_id")})
    setTimeout(function(){
      window.location.reload();
    },0)
    }
   
  componentDidMount(){
    
  }

  onHide(event) {
    this.setState({selectedId: null});
  }
  selectedListChange(value){
    let that = this;
    this.setState({
      selectedId:value.code,
      mobile:value.mobile,
      title:value.title,
      desc:value.desc,
      statusCode:value.statusCode,
      statusDesc:value.statusDesc
    })
    
  }
  SetGuarantee(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      mobile:this.state.mobile,
      title:this.state.title,
      desc:this.state.desc,
      statusCode:this.state.statusCode,
      code:this.state.selectedId==1 ? null : this.state.selectedId
    };
    let SCallBack = function(response){
      let code = response.data.result.value ? response.data.result.value.code : response.data.result.ops[0].code;
      Notification.open({
        title: '',
        placement:'bottomEnd',
        duration: 3500,
        description: (
          <div>
            <p className="yekan text-success">عملیات با موفقیت انجام شد</p>
          </div>
        )
      });
      
      let statusDesc=that.state.selectedId==1 ? "دریافت شده" : that.state.statusDesc;
      that.Server.send("MainApi/GetSmsToken",{},function(response){
        that.Server.send("MainApi/sendsms2",{
          token: response.data.result.TokenKey,
          text: "مشتری گرامی محصول شما با کد رهگیری "+code+" در مرحله "+statusDesc+" قرار گرفت",
          mobileNo : that.state.mobile
        }, function(response){
          console.log(response)
        },function(error){})
        },function(error){})
        /*that.Server.send("MainApi/sendsms3",{
          text: "مشتری گرامی محصول شما با کد رهگیری "+code+" در مرحله "+statusDesc+" قرار گرفت",
          mobileNo : that.state.mobile
        }, function(response){
        },function(error){
        })*/
        that.onHide();
      that.GetGuarantee(that.state.mobile);
    };
    let ECallBack = function(error){
      Notification.open({
        title: '',
        placement:'bottomEnd',
        duration: 3500,
        description: (
          <div>
            <p className="yekan text-danger">محصول ثبت نشد لطفا مجددا امتحان کنید</p>
          </div>
        )
      });
    }
    this.Server.send("AdminApi/SetGuarantee",param,SCallBack,ECallBack)
  }
  GetGuarantee(mobile){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      mobile:mobile
    };
    let SCallBack = function(response){
      that.setState({
        GridData : response.data.result
      })
      
    };
    let ECallBack = function(error){
    }
    this.Server.send("AdminApi/GetGuarantee",param,SCallBack,ECallBack)
  }
  OpenDialog(){
    this.setState({selectedId: 1});

  }

 
    render(){
      
     return (
      <div style={{direction:'rtl'}}>
      <div className="row justify-content-center">
       
    <div className="col-12 col-md-4 col-lg-3 ">

    <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
     </div>
      <div className="col-lg-9 col-md-8 col-12" style={{marginTop:20,background:'#fff'}}>
      <div className="row" >
      <div className="col-12">
          <div className="row justify-content-center" >
              <div  className="col-8">
                <input className="form-control yekan" style={{marginTop:20}} autoComplete="off"  type="text" value={this.state.search} name="mobile" onChange={(event)=> {
                  if((event.target.value.length==0)||(event.target.value.length == 6 && event.target.value.substr(0,1) != 0 && event.target.value.substr(0,1) != 9) || (event.target.value.length == 10 && event.target.value.substr(0,1) != 0) || (event.target.value.length == 11))
                   {
                    this.GetGuarantee(event.target.value)
                   }
                   this.setState({search: event.target.value})
                }} placeholder="کد رهگیری یا شماره موبایل مشتری را وارد کنید"  required="true"/>
  
              </div>
              <div className="col-3">
                <button  className="btn btn-primary irsans" onClick={this.OpenDialog}  style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}> ثبت </button>

              </div>

              
              
          </div>
        </div>
      </div>
      <div className="row justify-content-center" style={{direction:'ltr',background:'radial-gradient(#eef1c9, transparent)',marginBottom:50,marginTop:30}}  >
        <div className="col-12  yekan" style={{display:'none'}} >
            <Steps current={this.state.StepNumber}  vertical={this.state.StepVertical} >
                <Steps.Item  title="دریافت" />
                <Steps.Item title="در حال تکمیل" />
                <Steps.Item title="آماده تحویل" />
                <Steps.Item title="تحویل شده" status="wait" />    
            </Steps>
        </div>
        <div className="col-12" >
              <DataTable responsive resizableColumns={true} paginator={true} rows={10} value={this.state.GridData} selectionMode="single" selection={this.state.selectedId} onSelectionChange={e => this.selectedListChange(e.value)} >
                        <Column field="code"  header="کد رهگیری" className="yekan" style={{textAlign:"center"}} />
                        <Column field="time"  header="زمان" className="yekan" style={{textAlign:"center"}} />
                        <Column field="date"  header="تاریخ" className="yekan" style={{textAlign:"center"}} />
                        <Column field="statusCode" header="وضعیت" className="yekan" style={{textAlign:"center",display:'none'}} />
                        <Column field="statusDesc" header="وضعیت" className="yekan" style={{textAlign:"center"}} />
                        <Column field="mobile"  header="تلفن همراه"  className="yekan" style={{textAlign:"center"}}/>
                        <Column field="desc" header="شرح"   className="yekan" style={{textAlign:"center"}}/>
                        <Column field="title" header="عنوان"   className="yekan" style={{textAlign:"center"}}/>

              </DataTable>
        </div>
        </div>        
      </div>
     
    </div>
 
    <Dialog header="ثبت محصول جدید"  visible={this.state.selectedId} style={{width: '60vw'}}  minY={70} onHide={this.onHide} maximizable={true}>
    <form  >
      
        {this.state.selectedId != 1 &&
        <div className="row">
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.selectedId} name="selectedId" disabled onChange={(event)=> this.setState({selectedId: event.target.value})}  required="true"/>
      </div>
      </div>
    
      <div className="col-lg-6">
      <div className="group">
      <select className="custom-select yekan"  value={this.state.statusCode} name="statusCode" onChange={this.handleChangeStatus} >
      
        <option value="0">لغو شده</option>
        <option value="1">دریافت شده</option>
        <option value="2">در حال تکمیل</option>
        <option value="3">آماده تحویل</option>
        <option value="4">تحویل شده</option>
       
      </select>

      </div>
      </div>
      </div>
      }
      <div className="row">
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.mobile} name="mobile" onChange={(event)=> this.setState({mobile: event.target.value})}  required="true"/>
        <label className="yekan">شماره تلفن همراه</label>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group">

        <input className="form-control yekan"  autoComplete="off"  type="text" value={this.state.title} name="title" onChange={(event)=> this.setState({title: event.target.value})} required="true" />
        <label className="yekan">عنوان محصول</label>

      </div>
      </div>
      </div>
      <div className="row">
      <div className="col-lg-12">
      <div className="group">

        <textarea className="form-control yekan"  autoComplete="off"  type="text" value={this.state.desc} name="desc" onChange={(event)=> this.setState({desc: event.target.value})} required="true" />
        <label className="yekan">شرح</label>

      </div>
      </div>
      </div>
      <div className="row">
      
      <div className="col-lg-12">
      <Button style={{marginLeft:5,marginTop:10}} color="primary" className="yekan" onClick={this.SetGuarantee}>ثبت اطلاعات</Button>
      </div>
      </div>
    
    </form>
     
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
  connect(mapStateToProps)(Guarantee)
);
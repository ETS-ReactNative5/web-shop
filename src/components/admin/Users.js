import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import {Dialog} from 'primereact/dialog';

import { connect } from 'react-redux';
import { max } from 'moment-jalaali';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class Users extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      layout: 'list',
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],  
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],  
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,

      GridDataUsers:[], 
      GridDataFactors:[],
      visibleCreateUser:false,
      selectedId:null,
      selectedUser:null,
      levelFilter:null,
      level:"1",
      name:null,
      username:null,
      pass:null,
      pass2:null,
      address:null,
      mail:null,
      company:null,
      username:null,
      status:null,
      map:null,
      HasError:null,
      mapList:[],
      levelOfUser:null,
      off:null,
      levelOfUserArray:[],
      ShowNewLevelOfUser:0,
      levelOfUser2:-1,
      Offs:[],
      PriceOfLevels:[],
      formuls:[],
      formul:null,
      formul_level:'',
      formul_off:'',
      formul_opr:'',
      PriceOfLevel:null,
      loading:0
  
    }
    this.onLevelChange = this.onLevelChange.bind(this);
    this.CreateUser = this.CreateUser.bind(this);
    this.SetOff = this.SetOff.bind(this);

    this.onHide = this.onHide.bind(this);
    this.selectedUserChange = this.selectedUserChange.bind(this);
    this.handleChangeLevel = this.handleChangeLevel.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangeCompany= this.handleChangeCompany.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleChangePass2 = this.handleChangePass2.bind(this); 
    this.handleChangeAddress = this.handleChangeAddress.bind(this);   
    this.handleChangeCredit = this.handleChangeCredit.bind(this);   
    this.SetOrEditUser = this.SetOrEditUser.bind(this);   
    this.handleChangeStatus = this.handleChangeStatus.bind(this);   
    this.handleChangeMap = this.handleChangeMap.bind(this);
    
  }
  
  GetMaps(){
    let that = this;
    this.setState({
      loading:1
    })
    let param={
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function(response){
      that.setState({
        mapList: response.data.result,
        loading:0
      })
      that.GetOffs();
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetMaps",param,SCallBack,ECallBack)
  }
  GetOffs(){
    let that = this;
    this.setState({
      loading:1
    })
    this.setState({
        off:'',
        formul_level:'',
        formul_off:'',
        formul_opr:'',
        levelOfUser2:"-1"
    })
    let param={
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      let levelOfUserArray=[],
          levelOfUserArrayName=[],
          Offs=[],
          PriceOfLevels=[],
          formuls=[];
      for(let i=0;i<response.data.result.length;i++){
        levelOfUserArray[i]=response.data.result[i].level;
        levelOfUserArrayName[i]=response.data.result[i].levelName;
        Offs[i]=response.data.result[i].off;
        PriceOfLevels[i]=response.data.result[i].PriceOfLevel ? response.data.result[i].PriceOfLevel  : 0
        formuls[i]=response.data.result[i].formul ? response.data.result[i].formul  : ''
      }
      that.setState({
        levelOfUserArray: levelOfUserArray,
        levelOfUserArrayName: levelOfUserArrayName,
        Offs:Offs,
        PriceOfLevels:PriceOfLevels,
        formuls:formuls
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetOffs",param,SCallBack,ECallBack)
  }
  getSettings(){
      let that = this;
      that.setState({
        loading:1
      })
      that.Server.send("AdminApi/getSettings",{},function(response){
        that.GetUsers();
        that.setState({
          loading:0
        })
        if(response.data.result){
          that.setState({
            CreditSupport : response.data.result[0].CreditSupport
          })
        }

        

        
      },function(error){
        that.GetUsers();
        that.setState({
          loading:0
        })

      })

    
  }
  SetOff(){
    let that = this;
    if(this.state.off != "" &&(this.state.formul_level != "" || this.state.formul_off != "" || this.state.formul_opr != ""))
    {
      Alert.warning('تخفیف و آیتم های دیگر نمیتوانند همزمان پر باشند', 5000);
      return;
    }
    
    this.setState({
      loading:1
    })
    
    let param={
      token: localStorage.getItem("api_token"),
      off:this.state.off,
      levelOfUser : this.state.levelOfUser2,
      PriceOfLevel:this.state.PriceOfLevel,
      formul:this.state.off != ""  ? "" : '{"level":"'+this.state.formul_level+'","off":"'+this.state.formul_off+'","opr":"'+this.state.formul_opr+'"}'
    };
    
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      that.GetUsers();
      that.setState({
        visibleOffDialog: false
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.error('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("AdminApi/SetOffForLevel",param,SCallBack,ECallBack)
  }
  SetOrEditUser(del,id){
    let that = this;
    this.setState({
      loading:1
    })
    if(del){

      this.Server.send("AdminApi/ManageUsers",{_id:id},function(response){

        that.setState({
          loading:0
        })
        that.GetUsers();
      }, function(error){ 

        that.setState({
          loading:0
        })
      })

    }
    if(this.state.pass != this.state.pass2){
      this.setState({
        HasError: "کلمه عبور و تکرار آن متفاوت اند"
      })
      return;
    }
    this.setState({
      HasError: null
    })
    if(this.state.level=="1" && !this.state.ShopId){
      Alert.warning('فروشگاه مربوط به مدیر را انتخاب کنید',5000);
      return;
    }
    let param={
      token: localStorage.getItem("api_token"),
      name:this.state.name,
      mail:this.state.mail,
      company:this.state.company,
      username:this.state.username,
      level:this.state.level,
      status:this.state.status,
      pass:this.state.pass,
      address:this.state.address,
      credit:this.state.credit ? this.state.credit.replace(/,/g,"") : 0,
      map:this.state.map,
      levelOfUser : this.state.levelOfUser,
      ShopId:this.state.ShopId,
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.GetUsers();
      that.setState({
        visibleCreateUser: false
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.error('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("AdminApi/ManageUsers",param,SCallBack,ECallBack)
  }
  handleChangeLevel(event){
    this.setState({level: event.target.value});
  }
  handleChangeMail(event){
    this.setState({mail: event.target.value});
  }
  handleChangeCompany(event){
    this.setState({company: event.target.value});
  }
  handleChangeUsername(event){
    this.setState({username: event.target.value});
  }
  handleChangeName(event){
    this.setState({name: event.target.value});
  }
  handleChangePass(event){
    this.setState({pass: event.target.value});
  }
  handleChangePass2(event){
    this.setState({pass2: event.target.value});
  }
  handleChangeAddress(event){
    this.setState({address: event.target.value});
  }
  handleChangeCredit(event){
    this.setState({credit: event.target.value.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")});


  }
  handleChangeStatus(event){
    this.setState({status: event.target.value});

  }
  handleChangeMap(event){
    this.setState({map: event.target.value});

  }
  
  onHide(event) {
    this.setState({
      visibleCreateUser: false,
      selectedId:null,
      name : "",
      mail : "",
      company : "",
      level:"1",
      username:"",
      pass:"",
      pass2:"",
      address:"",
      credit:0,
      HasError:null,
      ShopId:null
    });

  }
  CreateUser(){
    this.setState({
      visibleCreateUser : true,
      selectedId : null,
      selectedUser : null
    })
  }
  onLevelChange(event) {
    this.dt.filter(event.value, 'level', 'equals');
    this.setState({levelFilter: event.value});
  }
  selectedUserChange(value){
    let that = this;
    var p=[];
    this.setState({
      selectedId:value._id,
      name : value.name,
      mail : value.mail,
      company : value.company,
      level:value.level=="کاربر" ? "0" : "1",
      username:value.username,
      pass:value.password,
      pass2:value.password,
      address:value.address,
      credit:value.credit ? value.credit.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value.credit,
      ShopId:value.shopId,
      selectedUser:value.products,
      status:value.status=="فعال" ? "1" : "0",
      map:value.map,
      visibleCreateUser : true,
      levelOfUser:value.levelOfUser,
      NewLevelOfUser:value.levelOfUser
    })
    
  }
  componentDidMount() {
    let that=this;
    this.Server.send("MainApi/checktoken",{
			token: localStorage.getItem("api_token")
		},function(response){
      that.setState({
				ShopId : response.data.authData.shopId
      })
      that.GetShopList();
    },function(error){
      console.log(error)
      that.GetShopList();
    })
  
		    
    
  }
  GetShopList(){
    let that = this;
    let param={
      
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response){
      let ShopArray=[],
      ShopArrayName=[];
      for(let i=0;i<response.data.result.length;i++){
        ShopArray[i]=response.data.result[i]._id;
        ShopArrayName[i]=response.data.result[i].name;
      }
      that.setState({
        ShopArray : ShopArray,
        ShopArrayName :ShopArrayName,
        ShopId:ShopArray[0],
        loading:0
      })
      that.getSettings();

    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      that.getSettings();

    }
    this.Server.send("AdminApi/ShopInformation",param,SCallBack,ECallBack)
  }
  GetUsers(){
    let that = this;
    this.setState({
      loading:1
    })
    let param={
      token: localStorage.getItem("api_token"),
      GetAll:1
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      that.GetMaps();
      let NewUsers=0;
      response.data.result.map(function(v,i){
        if(v.level=="0" && (v.levelOfUser == -1 || v.levelOfUser==null))
          NewUsers++;
        if(v.level=="0")
          v.level="کاربر";
        else
          v.level="مدیر";
        if(v.status == "1")
          v.status="فعال"
        else
          v.status="غیر فعال" ;
        v.delete = <button className="btn btn-primary irsans" onClick={()=>that.DelUser(v._id,v.name)}>حذف</button>  
      })
      that.setState({
        GridDataUsers : response.data.result,
        NewUsers:NewUsers
      })
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getuser",param,SCallBack,ECallBack)
  }
  DelUser(id,name){
    confirmAlert({
      title: <span className="yekan">حذف کاربر</span>,
      message: <span className="yekan">  آیا از حذف  {name} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () =>{
            this.SetOrEditUser(1,id)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });
    
      
  }
  rowClass(data) {
    return {
        'row-highlight1': ((data.levelOfUser == '-1' || !data.levelOfUser) && data.level !="مدیر")
    }
  }
    render(){
      let level = [
        {label: 'همه', value: null},
        {label: 'مدیر', value: 'مدیر'},
        {label: 'کاربر', value: 'کاربر'}
    ];

    let levelFilter = <Dropdown style={{width: '100%'}}
    value={this.state.levelFilter} options={level} className="irsans" onChange={this.onLevelChange}/>
    const footer = (
      <div>
              <button  className="btn btn-primary irsans" onClick={this.SetOrEditUser}  style={{width:"200px",marginTop : "5px" , marginBottom : "5px"}}> اعمال </button>
              
      </div>
  );
  const footer2 = (
    <div>
            <button  className="btn btn-primary irsans" onClick={this.SetOff}  style={{width:"200px",marginTop : "5px" , marginBottom : "5px"}}> اعمال </button>
            
    </div>
);
     return (
             
          <div style={{direction:'rtl'}}>
            {this.state.loading == 1 &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px'}}>
                <Loader content="لطفا صبر کنید ..." className="yekan"  />
              </div>
            }
            <div className="row justify-content-center">
          <div className="col-12 col-md-4 col-lg-3 ">

          <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
           </div>
            <div className="col-lg-9 col-md-8 col-12" style={{marginTop:20,background:'#fff'}}> 
            <div className="row" >
              <div className="col-6" style={{textAlign:'center'}}>
                <button  className="btn btn-info irsans" onClick={this.CreateUser}  style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}> ساخت کاربر جدید </button>
              </div>
              <div className="col-6" style={{textAlign:'center'}}>
                <button  className="btn btn-warning irsans" onClick={()=>{
                this.setState({
                  visibleOffDialog:true
                })
                this.GetOffs();
                }}  style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}> تخفیف کلی </button>
              </div>
            </div>
               

              <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍لیست اعضا</span></div>
              <DataTable  rowClassName={this.rowClass} rows={15} paginator={true}   responsive ref={(el) => this.dt = el} value={this.state.GridDataUsers} selectionMode="single" selection={this.state.selectedUser} onSelectionChange={e => this.selectedUserChange(e.value)}>
                        <Column field="username" filter={true} header="نام کاربری" className="irsans" style={{textAlign:"center"}} />
                        <Column field="name" filter={true}  header="نام" className="irsans" style={{textAlign:"center"}} />
                        <Column field="status" header="وضعیت"  className="irsans" style={{textAlign:"center"}}/>
                        <Column field="level" header="نوع" className="irsans" style={{textAlign:"center"}}   />
                        <Column field="levelOfUser" header="سطح کاربری" className="irsans" style={{textAlign:"center"}}   />
                        <Column field="map" header="دسترسی" className="irsans" style={{textAlign:"center"}} />
                        <Column field="delete" header="حذف" className="irsans" style={{textAlign:"center"}} />

                    </DataTable>
            </div>
           
          </div>
  <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت کاربر جدید"}  visible={this.state.visibleCreateUser} width="800px" footer={footer} minY={70} maxY={400}  onHide={this.onHide} maximizable={true}>

<form style={{maxWidth:800,maxHeight:450,marginBottom:10,maxWidth:1000}}  >
  <div className="row">
  <div className="col-lg-6 col-12">

<div className="group">
  <input  className="form-control irsans" autoComplete="off"  type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername}  required="true"  />
  <label >نام کاربری</label>

</div>
</div>
  <div className="col-lg-6 col-12">
  <div className="group">
    <input className="form-control irsans" autoComplete="off"  type="text" value={this.state.name} name="name" onChange={this.handleChangeName}  required="true"/>
    <label>نام و نام خانوادگی</label>
  </div>
  </div>
  <div className="col-lg-6 col-12">
  <div className="group">
    <input className="form-control irsans" autoComplete="off"  type="text" value={this.state.mail} name="mail" onChange={this.handleChangeMail}  required="true"/>
    <label>پست الکترونیکی</label>
  </div>
  </div>
  <div className="col-lg-6 col-12">
  <div className="group">
    <input className="form-control irsans" autoComplete="off"  type="text" value={this.state.company} name="company" onChange={this.handleChangeCompany}  required="true"/>
    <label>نام شرکت</label>
  </div>
  </div>
  <div className="col-lg-6">
  <div className="group">
    <input className="form-control irsans" autoComplete="off" type="password" value={this.state.pass} name="pass" onChange={this.handleChangePass}  required="true"/>
    <label>رمز عبور</label>
  </div>
  </div>
  
  <div className="col-lg-6">
  <div className="group">
    <input className="form-control irsans" autoComplete="off" type="password" value={this.state.pass2} name="pass2" onChange={this.handleChangePass2}  required="true" />
    <label>تکرار رمز عبور</label>
  </div>
  </div> 
  {this.state.level == "0" &&
  <div className="col-lg-6" style={{textAlign:'center'}}>
  
    <div >
    <label className="labelNoGroup irsans">درجه ی کاربری</label>
    <select className="custom-select irsans"  value={this.state.levelOfUser} name="levelOfUser" onChange={(event)=>this.setState({
      levelOfUser: event.target.value,
      status : event.target.value > -1 ? "1" :"0"
      })} >
    {
                    this.state.levelOfUserArray && this.state.levelOfUserArray.map((v,i) => {
                      
                      return (   <option value={v} >{this.state.levelOfUserArrayName[i]}</option> )
                  })
    }
  </select>
  </div>
    
  </div>
    }
 {this.state.level=="1" &&
  <div className="col-lg-6">
  <label className="labelNoGroup irsans">دسترسی</label>

  <select className="custom-select irsans"  value={this.state.map} name="map" onChange={this.handleChangeMap} >
    {
      this.state.mapList && this.state.mapList.map((v, i) => {
        return (   <option value={v._id} >{v._id}</option> )
      })
    }
  </select>
  </div>
  }

  {this.state.level == "1" &&
  <div className="col-lg-6" style={{textAlign:'center'}}>
  
    <div >
    <label className="labelNoGroup irsans">لیست فروشگاهها</label>
    <select className="custom-select irsans"  value={this.state.ShopId} name="ShopId" onChange={(event)=>this.setState({
      ShopId: event.target.value
      })} >
        <option value="null" >فروشگاه مربوط به مدیر را انتخاب کنید</option>
      {
        this.state.ShopArray && this.state.ShopArray.map((v,i) => {
          return (   <option value={v} >{this.state.ShopArrayName[i]}</option> )
        })
      }
  </select>
  </div>
    
  </div>
    }

  <div className="col-lg-6">
  <label className="labelNoGroup irsans">وضعیت</label>

  <select className="custom-select irsans"  value={this.state.status} name="status" onChange={this.handleChangeStatus} >
    <option value="1">فعال</option>
    <option value="0">غیر فعال</option>
  </select>
  </div>
  
    <div className="col-lg-6">
  <label className="labelNoGroup irsans">سطح</label>

  <select className="custom-select irsans"  value={this.state.level} name="level" onChange={this.handleChangeLevel} style={{marginBottom:20}} >
    <option value="1">مدیر</option>
    <option value="0">کاربر</option>
  </select>
  </div>
  {this.state.CreditSupport &&
    <div className="col-lg-6">
    <div className="group">
      <input className="form-control irsans" autoComplete="off" type="text" value={this.state.credit} name="credit" onChange={this.handleChangeCredit}  required="true" />
      <label>موجودی اعتباری</label>
    </div>
    </div>
  }
  
  <div className="col-lg-12">
  <div className="group">
    <input className="form-control irsans" autoComplete="off" type="text" value={this.state.address} name="address" onChange={this.handleChangeAddress}  required="true" />
    <label>آدرس کامل پستی</label>
  </div>
  </div> 
   
  </div>
</form>
</Dialog>
       
<Dialog header={"ثبت تخفیف بر اساس درجه کاربری"}  visible={this.state.visibleOffDialog} width="800px" footer={footer2} minY={70} maxY={400}  onHide={()=>{
  this.setState({
    visibleOffDialog: false
  });
}} maximizable={true}>
 <div>
       <p className="yekan" style={{textAlign:'right'}}>راهنمای درجه کاربری : ثبت نام اولیه (-1)    کاربر عادی (0)    همکار1 (1)    همکار 2 (2) عمده 1 (3)    عمده 2 (4)    سوپر (5)</p>
     </div>
<form style={{maxWidth:800,maxHeight:450,marginBottom:10}}  >
  <div className="row">
  <div className="col-lg-6" style={{textAlign:'center'}}>
    <label className="labelNoGroup irsans">درجه ی کاربری</label>
    <select className="custom-select irsans"  value={this.state.levelOfUser2} name="levelOfUser2" onChange={(event)=>{
        let formul_level='',
        formul_off='',
        formul_opr='';
        let json = this.state.formuls[this.state.levelOfUserArray.indexOf(event.target.value)] != "" ? JSON.parse(this.state.formuls[this.state.levelOfUserArray.indexOf(event.target.value)]) : "";
        if(json != ""){
          formul_level=json.level;
          formul_off=json.off;
          formul_opr=json.opr;
        }
        this.setState({
          levelOfUser2: event.target.value,
          PriceOfLevel:this.state.PriceOfLevels[this.state.levelOfUserArray.indexOf(event.target.value)],
          off:this.state.Offs[this.state.levelOfUserArray.indexOf(event.target.value)],
          formul_level:formul_level,
          formul_off:formul_off,
          formul_opr:formul_opr
        })}
      } >
      {
                      this.state.levelOfUserArray && this.state.levelOfUserArray.map((v,i) => {
                        
                        return (   <option value={v} >{this.state.levelOfUserArrayName[i]}</option> )
                    })
      }
    </select>
  </div>

 
  <div className="col-lg-6">
  <div className="group">
    <input className="form-control irsans" disabled={(this.state.levelOfUser2=="-1") ? true : false} autoComplete="off" type="text" value={this.state.off} name="off" onChange={(event)=>this.setState({
      off:event.target.value
    })}  required="true" />
    <label>تخفیف</label>
  </div>
  </div> 
  <div className="col-lg-6" style={{display:'none'}}>
  <div className="group">
    <input className="form-control irsans" autoComplete="PriceOfLevel" type="text" value={this.state.PriceOfLevel} name="off" onChange={(event)=>this.setState({
      PriceOfLevel:event.target.value
    })}  required="true" />
    <label>حداقل خرید (تومان)</label>
  </div>
  </div> 
  <div className="col-lg-12">
  <div className="row">
     
        <div className="col-4">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_level} name="formul_level" disabled={(this.state.levelOfUser2=="0" || this.state.levelOfUser2=="-1") ? true : false} onChange={(event)=>this.setState({formul_level: event.target.value})}  required="true" />
        <label>نسبت به</label>
        </div>
        </div>
        <div className="col-4">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_off} name="formul_off" disabled={(this.state.levelOfUser2=="0" || this.state.levelOfUser2=="-1") ? true : false} onChange={(event)=>this.setState({formul_off: event.target.value})}  required="true" />
        <label>درصد</label>
        </div>
        </div>
        <div className="col-4">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_opr} name="formul_opr" disabled={(this.state.levelOfUser2=="0" || this.state.levelOfUser2=="-1") ? true : false} onChange={(event)=>this.setState({formul_opr: event.target.value})}  required="true" />
        <label>عمل</label>
        </div>
        </div>
      </div>
  <div className="group" style={{display:'none'}}>
    <input className="form-control irsans" dir="ltr" disabled={(this.state.levelOfUser2=="0" || this.state.levelOfUser2=="-1") ? true : false} autoComplete="formul" type="text" value={this.state.formul} name="formul" onChange={(event)=>this.setState({
      formul:event.target.value
    })}  required="true" />
    <label>فرمول محاسبه تخفیف</label>
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
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Users)
);

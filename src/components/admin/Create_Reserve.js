import React, { Component } from 'react';
import axios from 'axios'
import moment from 'moment-jalaali'
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method
import { Sidebar } from 'primereact/sidebar';

import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { AutoComplete } from 'primereact/autocomplete';
import DatePicker from 'react-datepicker2';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import Button from 'reactstrap/lib/Button';

class Create_Reserve extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FieldRef = React.createRef();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideReserveDialog = this.onHideReserveDialog.bind(this);
    this.SetReserve = this.SetReserve.bind(this);
    this.FileUpload = this.FileUpload.bind(this);
    this.ManualReserveSet = this.ManualReserveSet.bind(this);

    
    
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      confirm:false,
      active:false,
      TableRecords:{},
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)

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
      
      that.GetFields(["fromDate","untilDate"])

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetReserve() {
    let that = this;
    
    let TableRecords=[];

    for(let i=0;i<this.state.Keys.length;i++){
      TableRecords.push({
        day:this.state.Keys[i], 
        price: (!this.state.TableRecords["price_"+this.state.Keys[i]] || this.state.price == this.state.TableRecords["price_"+this.state.Keys[i]] || this.state.Oldprice == this.state.TableRecords["price_"+this.state.Keys[i]]) ? null : (this.state.TableRecords["price_"+this.state.Keys[i]]).toString().replace(/,/g, ""),
        checked: this.state.TableRecords["checked_"+this.state.Keys[i]]||false,
        free: this.state.TableRecords["free_"+this.state.Keys[i]]||false,
        username: this.state.TableRecords["username_"+this.state.Keys[i]]||"",
        name: this.state.TableRecords["name_"+this.state.Keys[i]]||"",
        account: this.state.TableRecords["account_"+this.state.Keys[i]]||"",
        mobile: this.state.TableRecords["mobile_"+this.state.Keys[i]]||"",
        SystemConfirmed: this.state.TableRecords["SystemConfirmed_"+this.state.Keys[i]]||false,
        SetDate: this.state.TableRecords["SetDate_"+this.state.Keys[i]]||"",
        UserConfirmed: this.state.TableRecords["UserConfirmed_"+this.state.Keys[i]]||false,
        IsConfirm: this.state.TableRecords["IsConfirm_"+this.state.Keys[i]]||false,
        weekName: typeof this.state.TableRecordArray[i].WeekName != undefined ? this.state.TableRecordArray[i].WeekName : this.state.TableRecords["WeekName_"+this.state.Keys[i]],
        number:this.state.number
      })
    }
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      type: this.state.type,
      name: this.state.name,
      latinName: this.state.latinName,
      number: this.state.number,
      desc:this.state.desc,
      minDay:this.state.minDay,
      maxDay:this.state.maxDay,
      managerMobile:this.state.managerMobile,
      confirm:this.state.confirm,
      active:this.state.active,
      price:this.state.price.toString().replace(/,/g, ""),
      status:this.state.status,
      fromDate:this.state.fromDate,
      untilDate:this.state.untilDate,
      DetailRecords:TableRecords

    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideReserveDialog();
      that.GetReserve();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetReserve", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      name: "",
      type: "1",
      type: "",
      number: "",
      latinName: "",
      selectedId: null,
      minDay: "",
      maxDay:"",
      managerMobile:"",
      confirm:false,
      active:false,
      price:"",
      desc:""
    })

  }
  onHideReserveDialog(event) {
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
    let m = moment;
    let p = {
      name: value.name,
      latinName: value.latinName,
      number: value.number,
      selectedId: value._id,
      FieldSelected:value.Fields,
      visibleManageField: true,
      desc:value.desc,
      minDay:value.minDay,
      maxDay:value.maxDay,
      managerMobile:value.managerMobile,
      confirm:value.confirm,
      active:value.active,
      price:value.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      Oldprice:value.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      status:value.status


    }
    if(value.fromDate)
      p.fromDate = m(new Date(value.fromDate)).local("fa");
    if(value.untilDate)
      p.untilDate = m(new Date(value.untilDate)).local("fa");   
    this.setState(p)
    this.GetReserve(value.number);


    

  }
  GetReserve(number) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1,
      number:number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      
      that.setState({
        GridDataReserve: !number ? response.data.result : that.state.GridDataReserve,
        pic1: response.data.result[0].pic ? that.state.absoluteUrl + response.data.result[0].pic?.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
        extraPic1: response.data.result[0].extraPic1 ? that.state.absoluteUrl + response.data.result[0].extraPic1?.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
        extraPic2: response.data.result[0].extraPic2 ? that.state.absoluteUrl + response.data.result[0].extraPic2?.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
        extraPic3: response.data.result[0].extraPic3 ? that.state.absoluteUrl + response.data.result[0].extraPic3?.split("public")[1] : that.state.absoluteUrl + 'nophoto.png',
        extraPic4: response.data.result[0].extraPic4 ? that.state.absoluteUrl + response.data.result[0].extraPic4?.split("public")[1] : that.state.absoluteUrl + 'nophoto.png'

      })
      that.setState({
        loading: 0
      })
      if(number){
        that.GetReserveDetails(number);
      }
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserve", param, SCallBack, ECallBack)
  }

  GetReserveDetails(number) {
    let that = this;
    let param = {
      number: number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      
      let TableRecords = {};
      for(let item of response.data.result){
        TableRecords["checked_"+item.day] = item.checked;
        TableRecords["account_"+item.day] = item.account;
        TableRecords["name_"+item.day] = item.name;
        TableRecords["username_"+item.day] = item.username;
        TableRecords["WeekName_"+item.day] = item.WeekName;
        TableRecords["mobile_"+item.day] = item.mobile;
        TableRecords["price_"+item.day] = item.price ? item.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : that.state.price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        TableRecords["SystemConfirmed_"+item.day] = item.SystemConfirmed;
        TableRecords["SetDate_"+item.day] = item.SetDate;

        TableRecords["UserConfirmed_"+item.day] = item.UserConfirmed;
        TableRecords["IsConfirm_"+item.day] = item.IsConfirm;
      }
      that.setState({
        loading: 0,
        TableRecords:TableRecords
      })
      that.setTable();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReserveDetails", param, SCallBack, ECallBack)
  }

  FileUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage', e.target.files[0]);
    if (this.state.number) {
      formData.append('number', this.state.number);
      formData.append('pic', e.target.name);
    }else{
        return;
    }
    formData.append('ReservePic', "1");

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = parseInt((loaded * 100) / total)
        this.setState({
          showLoadedCount: 1,
          loadedCount: `${loaded} byte of ${total}byte | ${percent}%`
        })
        if (percent == "100") {
          this.setState({
            showLoadedCount: 0
          })
        }

      }
    };
    axios.post(this.state.url + 'uploadFile', formData, config)
      .then((response) => {
            
          let p = this.state.currentImage;
          if (p == "pic1")
            this.setState({
              pic1: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if (p == "pic2")
            this.setState({
              pic2: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if (p == "pic3")
            this.setState({
              pic3: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if (p == "pic4")
            this.setState({
              pic4: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if (p == "pic5")
            this.setState({
              pic5: this.state.absoluteUrl + response.data.split("public")[1]
            })

      })
      .catch((error) => {
        console.log(error);
      });
  }  
  getCode(ids){
    let that = this;
    let CodeParam=[];
    
    let param = {
      id:ids
    };

    this.setState({
      loading: 1
    })

    let SCallBack = function (response) {
      let x=[];
      for(let i=0;i<response.data.result.length;i++){
        x.push({values:response.data.result[i].values,MultiSelect:response.data.result[i].MultiSelect});
      }
      for(let item of that.state.Fields){
        if(item.type=="6"){
          for(let i=0;i<CodeParam.length;i++){
            if(item.FId == CodeParam[i].FId){
              item.Code = x
            }
          }
        }
        
        
      }

      that.setState({
        Fields:that.state.Fields,
        loading: 0
      })
      

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetCodes", param, SCallBack, ECallBack)
  }
  GetFields(latinName) {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token"),
      latinName:latinName
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      
      let ShowParam=[];
        let ComboParam = [];
        let CodeParam = [];
        let AutoCompleteParam = [];
        let count=0;
        let HiddenFields=[];
        for(let item of response.data.result){
          ShowParam.push({name:item.name,latinName:item.latinName,type:item.type,required:item.required,title:item.name});
          if(item.type=="2"){
            if(item.Default && item.CheckOkFields){
              for(let j=0;j<item.CheckOkFields.split(",").length;j++){
                HiddenFields.push(item.CheckOkFields.split(",")[j])
              }
            }    
            if(!item.Default && item.CheckNOkFields){
              for(let j=0;j<item.CheckNOkFields.split(",").length;j++){
                HiddenFields.push(item.CheckNOkFields.split(",")[j])
              }
            }
            that.setState({[item.latinName]:item.Default})
          } 
          if(item.type=="3"){
            ComboParam.push({DBTableFieldLabel:item.DBTableFieldLabel,DBTableFieldValue:item.DBTableFieldValue,DbTableName:item.DbTableName,FId:item.FId})
          } 
          if(item.type=="6"){
            CodeParam.push({CodeNum:item.CodeNum,FId:item.FId})
          }   
          if(item.type=="4"){
            item.index = count;
            AutoCompleteParam.push({index:count,latinName:item.latinName,DBTableFieldLabel:item.DBTableFieldLabel,DBTableFieldValue:item.DBTableFieldValue,DbTableName:item.DbTableName,FId:item.FId})
            count++;
          }
        }
        that.setState({
          loading: 0,
          Fields:response.data.result,
          ShowParam:ShowParam,
          ComboParam:ComboParam,
          CodeParam:CodeParam,
          AutoCompleteParam:AutoCompleteParam,
          HiddenFields:HiddenFields
        })
        that.GetReserve();

      

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFields", param, SCallBack, ECallBack)
  }
  setTable(){
    let tt=0;
                            if(this.state.untilDate && this.state.fromDate ){
                              let untilDate = this.state.untilDate.local ? this.state.untilDate.local("fa").format("jYYYY/jM/jD") : this.state.untilDate ,
                              fromDate =  this.state.fromDate.local ? this.state.fromDate.local("fa").format("jYYYY/jM/jD") : this.state.fromDate;
                              tt = (untilDate.split("/")[1] - fromDate.split("/")[1])*31 + (untilDate.split("/")[2] - fromDate.split("/")[2]);
                              let TableRecordArray = [];
                              let WeekName = parseInt(this.state.fromDate.local("fa").format('d'));
                              let WeekNameTemp = WeekName;
                              let Day = "",
                                  DayName = "";
                              let d=parseInt(fromDate.split("/")[2]); 
                              let m=parseInt(fromDate.split("/")[1]);   
                              let monthPriod = 31;
                              let Keys=[];
                              let counter=0;
                              for(let i=0;i < tt ; i++){

                                WeekName = (WeekNameTemp+counter <= 6 ?  WeekNameTemp+counter : 0);
                                counter++;
                                if(WeekName == 6){
                                  counter=0;
                                  WeekNameTemp=0;
                                }
                                if(i !=0)
                                  d = d < monthPriod ? d+1 : 1;
                                m = (d == 1 && i !=0 && m < 12) ? m+1 : m;
                                if(m > 6)
                                  monthPriod = 30;
                                Day= fromDate.split("/")[0]+ "/"+m+"/"+ d;
                                DayName= fromDate.split("/")[0]+ "_"+m+"_"+ d
                                let param = {
                                  Day:Day,
                                  Checked:this.state.TableRecords["checked_"+DayName]
                                }   
                                param["checkedName"] = "checked_"+DayName;
                                param["freeName"] = "free_"+DayName;

                                param["checked_"+DayName] = this.state.TableRecords["checked_"+DayName];
                                param["price_"+DayName] = this.state.TableRecords["price_"+DayName]||this.state.price;
                                param["priceName"] = "price_"+DayName;
                                param["WeekName"] = WeekName;

                                param["mobile"] = this.state.TableRecords["mobile_"+DayName];
                                param["name"] = this.state.TableRecords["name_"+DayName];
                                param["SystemConfirmed"] = this.state.TableRecords["SystemConfirmed_"+DayName];
                                param["SetDate"] = this.state.TableRecords["SetDate_"+DayName];


                                param["UserConfirmed"] = this.state.TableRecords["UserConfirmed_"+DayName];
                                param["IsConfirm"] = this.state.TableRecords["IsConfirm_"+DayName];

                                

                                

                                TableRecordArray.push(param);
                                Keys.push(DayName)
                              }
                              this.setState({
                                TableRecord:tt,
                                TableRecordArray: TableRecordArray,
                                Keys:Keys
                              })
                            }

                            
  }
  ManualReserve(item,checked){
        this.setState({
          currentItem:item,
          currentStatus:checked,
          SidebarVisible:true
        })

  }
  ManualReserveSet(){
    let TableRecords = this.state.TableRecords; 
    let DayName = this.state.currentItem.checkedName.split("checked_")[1];
    TableRecords[this.state.currentItem.checkedName] = this.state.currentStatus;
    TableRecords["mobile_"+DayName] = this.state.ReserveMobile;
    TableRecords["name_"+DayName] = this.state.ReserveName;
    TableRecords["account_"+DayName] = this.state.ReserveAcc;

    this.setState({TableRecords:TableRecords,ReserveName:"",ReserveMobile:"",ReserveAcc:"",SidebarVisible:false});


}
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetReserve} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت رکورد جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست رکورد ها</span></div>

            <DataTable responsive value={this.state.GridDataReserve} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="number" header="شماره فرم" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت فرم جدید"} visible={this.state.visibleManageField} footer={footer} onHide={this.onHideReserveDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row">
              <div className="col-lg-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.number} name="number" onChange={(event) => this.setState({ number: event.target.value })} required="true" />
                  <label>شماره فرم</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.latinName} name="latinName" onChange={(event) => this.setState({ latinName: event.target.value })} required="true" />
                  <label>نام لاتین</label>
                </div>
              </div>
              
              <div className="col-lg-6">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                  <label >نام فارسی</label>

                </div>
              </div>
             
              
              <div className="col-lg-12">

                <div className="group">
                  <textarea className="form-control irsans" autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={(event) => this.setState({ desc: event.target.value })} required="true" ></textarea>
                  <label >توضیح</label>

                </div>
              </div>
              <div className="col-lg-6">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.minDay} name="minDay" onChange={(event) => this.setState({ minDay: event.target.value })} required="true" />
                  <label >حداقل تعداد شب اقامت</label>

                </div>
              </div>
              <div className="col-lg-6">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.maxDay} name="maxDay" onChange={(event) => this.setState({ maxDay: event.target.value })} required="true" />
                  <label >حداکثر تعداد شب اقامت</label>

                </div>
              </div>

              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.price} name="price"
                   onChange={(event) => {
                      let price =  event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
                      /*for(let i=0;i<this.state.Keys.length;i++)
                        this.state.TableRecords["price_"+this.state.Keys[i]] = this.state.TableRecords["price_"+this.state.Keys[i]] || price;*/
                      this.setState({ price: price })
                  }} required="true" />
                  <label >قیمت عادی به ازای هر شب اقامت</label>

                </div>
              </div>
              <div className="col-12">

                <div className="group" >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox inputId="active" value={this.state.active} checked={this.state.active} onChange={e => this.setState({ active: e.checked })}></Checkbox>
                        <label htmlFor="active" className="p-checkbox-label yekan" style={{ paddingRight: 5,marginBottom:0 }}>فعال</label>
                      </div>
                </div>
                </div>
                <div className="col-6">

                <div className="group" >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox inputId="confirm" value={this.state.confirm} checked={this.state.confirm} onChange={e => this.setState({ confirm: e.checked })}></Checkbox>
                        <label htmlFor="confirm" className="p-checkbox-label yekan" style={{ paddingRight: 5,marginBottom:0 }}>به تایید سیستم نیاز دارد</label>
                      </div>
                </div>
                </div>
                {this.state.confirm &&
                
                  <div className="col-lg-6">

                  <div className="group">
                    <input className="form-control irsans" autoComplete="off" type="text" value={this.state.managerMobile} name="managerMobile" onChange={(event) => this.setState({ managerMobile: event.target.value })} required="true" />
                    <label >تلفن همراه مسئول رزرو (جهت دریافت پیامک)</label>

                  </div>
                  </div>
                }
              <div className="col-12" style={{marginTop:25}}>

              </div>
              {this.state.ShowParam && this.state.ShowParam.map((item, index)=>{
                if(item.type=="1"){
                  return(
                    <div className="col-12 col-lg-6">
                      <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="2"){
                  return(
                    <div className="col-12 col-lg-6">
                      <div style={{display:'flex'}} >
                      <Checkbox inputId={item.latinName} value={item.latinName} checked={this.state[item.latinName]} onChange={(event)=>{this.setState({[item.latinName]:event.checked})}} ></Checkbox>

                      <label htmlFor={item.latinName} className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="3"){
                  return(
                    <div className="col-12 col-lg-6" style={{textAlign:'right',marginBottom:20,marginTop:20}}>
                      <select style={{width:'100%'}} placeholder={item.name} className="form-control YekanBakhFaBold" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}} >
                      return(
                        <option value="" >{item.name}</option>
                      )
                      {item.Combo && item.Combo.map(function(item,index){
                          return(
                            <option className="YekanBakhFaBold" value={item.DBTableFieldValue} >{item.DBTableFieldLabel}</option>
                          )
                      })
                      }
                      </select>
                     
                    </div>
                  )   
                }
                if(item.type=="4"){
                  return(
                    <div className="col-12 col-lg-6">
                      <div className="group" >
                      <AutoComplete placeholder={item.name}  style={{ width: '100%' }} onChange={(event)=>{this.setState({[item.latinName]:event.value,AutoCompleteIndex:item.index,[item.latinName+"_val"]:''})}} itemTemplate={this.itemTemplate.bind(this)} value={this.state[item.latinName]} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />

                      </div>
                    </div>
                  )
                }
                if(item.type=="5"){
                  return(
                    <div className="col-12 col-lg-6">
                      <DatePicker
                        onChange={value => {
                          this.setState({[item.latinName]:value})
                          setTimeout(()=>{
                            this.setTable();
                              
                          },0)
                        }}
                        isGregorian={false}
                        timePicker={false}
                        placeholder={item.name}
                        persianDigits={false}
                        value={this.state[item.latinName]} 

                      />
                    </div>
                  )
                }
                
              })}
             
              
              <div className="col-12" style={{marginTop:50}}>
              {this.state.TableRecordArray && this.state.TableRecordArray.length > 0 &&
              <div className="row" style={{alignItems:'baseline',backgroundColor:'#ccc'}}>
                  <div className="col-2 YekanBakhFaBold" style={{textAlign:'center'}} >
                    تعطیل
                  </div>
                  <div className="col-2 YekanBakhFaBold" style={{textAlign:'center'}} >
                    روز
                  </div>
                  <div className="col-2 YekanBakhFaBold" style={{textAlign:'center'}} >
                      قیمت
                    
                  </div>
                  <div className="col-3 YekanBakhFaBold" style={{textAlign:'center'}} >
                  رزرو شده
                  </div>    
                </div>
                }
               {this.state.TableRecordArray && this.state.TableRecordArray.map((item, index)=> {
                 let style = index%2 ? {alignItems:'baseline',backgroundColor:'#eee',marginTop:5} :  {alignItems:'baseline',backgroundColor:'rgb(216 239 234 / 53%)',marginTop:5}
                 return(
                <div className="row" style={style}>
                  <div className="col-2" >
                  <div style={{display:'flex',justifyContent:'center'}} >
                      <Checkbox inputId={item.freeName} value={this.state.TableRecords[item.freeName]||item[item.freeName]} checked={this.state.TableRecords[item.freeName]} onChange={(event)=>{
                        let TableRecords = this.state.TableRecords; TableRecords[item.freeName] = event.checked; this.setState({TableRecords:TableRecords});

                      }} ></Checkbox>

                      </div>
                  </div>
                  <div className="col-2 YekanBakhFaBold" style={{textAlign:'right'}} >
                    {item.Day}
                  </div>
                  <div className="col-2" >
                      <div  >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.priceName} name={item.priceName} value={this.state.TableRecords[item.priceName]||item[item.priceName]}  onChange={(event)=>{
                            let price =  event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); 

                            let TableRecords = this.state.TableRecords; TableRecords[item.priceName] = price; this.setState({TableRecords:TableRecords})
                          }}   required  />
                      </div>
                    
                  </div>
                  <div className="col-2" >
                  <div style={{display:'flex',justifyContent:'center'}} >
                      <Checkbox inputId={item.checkedName} value={this.state.TableRecords[item.checkedName]||item[item.checkedName]} checked={this.state.TableRecords[item.checkedName]} onChange={(event)=>{
                        this.ManualReserve(item,event.checked)
                        /*let TableRecords = this.state.TableRecords; TableRecords[item.checkedName] = event.checked; this.setState({TableRecords:TableRecords});*/
                        
                      }} ></Checkbox>

                      </div>
                  </div>    
                  <div className="col-2 YekanBakhFaBold" >
                  {item.name}
                  </div> 
                  <div className="col-2 YekanBakhFaBold" >
                  {item.mobile}
                  </div> 
                </div>
                 )
               })
               }
                
              </div>
              <div className="col-12" style={{marginTop:50}}>
                    <div className="row">
                      <div className="col-6">
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="pic1" />
                          <label>آپلود عکس اصلی</label>
                        </div>
                      </div>
                      <div className="col-6">
                      <img src={this.state.pic1} style={{ width: 200,padding:10 }} />

                      </div>
                      <div className="col-6">
                        <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="pic2" />
                        <label>1 آپلود عکس</label>
                        </div>
                      </div>
                      <div className="col-6">
                      <img src={this.state.extraPic1} style={{ width: 200,padding:10 }} />

                      </div>
                      <div className="col-6">
                        <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="pic3" />
                        <label>2 آپلود عکس</label>
                        </div>
                      </div>
                      <div className="col-6">
                      <img src={this.state.extraPic2} style={{ width: 200,padding:10 }} />

                      </div>
                      <div className="col-6">
                        <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="pic4" />
                        <label>3 آپلود عکس</label>
                        </div>
                      </div>
                      <div className="col-6">
                      <img src={this.state.extraPic3} style={{ width: 200,padding:10 }} />

                        
                      </div>
                      <div className="col-6">
                        <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="pic5" />
                        <label>4 آپلود عکس</label>
                        </div>
                      </div>
                      <div className="col-6">
                      <img src={this.state.extraPic4} style={{ width: 200,padding:10 }} />

                        
                      </div>
                    </div>
                    
                    
                    
                    
                    
              </div>
              
              
             



            </div>
          </form>
          
        </Dialog>
        <Sidebar visible={this.state.SidebarVisible} onHide={() => 
            this.setState({
              currentItem:"",
              currentStatus:"",
              SidebarVisible:false,
              ReserveMobile:"",
              ReserveName:"",
              ReserveAcc:""
    
    
            })
        
          }>

        <div style={{textAlign:'center',marginTop:70}} >
       {this.state.currentItem &&

        <div>
        <div className="YekanBakhFaBold" style={{textAlign:'center',color:'red'}}>{!this.state.currentStatus ? "لغو رزرو روز "+ this.state.currentItem.Day : " رزرو روز "+this.state.currentItem.Day}</div>
        {this.state.currentStatus ?
        <div>
        <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id="ReserveName" name="ReserveName" value={this.state.ReserveName}  onChange={(event)=>{this.setState({ReserveName:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">نام</label>
        </div>
        <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id="ReserveMobile" name="ReserveMobile" value={this.state.ReserveMobile}  onChange={(event)=>{this.setState({ReserveMobile:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">تلفن همراه</label>
        </div>
        <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id="ReserveAcc" name="ReserveAcc" value={this.state.ReserveAcc}  onChange={(event)=>{this.setState({ReserveAcc:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">شماره حساب</label>
        </div>
        </div>
        :
      <div>
        <div className="YekanBakhFaBold" style={{textAlign:'center'}}>این روز قبلا توسط <span style={{fontSize:22}}>{this.state.currentItem.name}</span> رزرو شده است</div>
        <div className="YekanBakhFaBold" style={{textAlign:'center'}}>در صورت لغو رزرو امکان برگشت وجود نخواهد داشت</div>

        </div>
        }
        
      </div>
      }
        <button className="btn btn-primary irsans" onClick={this.ManualReserveSet} style={{ marginTop: "20px", marginBottom: "20px" }}> ثبت اولیه </button>
        <div className="YekanBakhFaBold" >برای نهایی شدن تغییرات باید حتما گزینه اعمال فرم را کلیک کنید</div>
        </div>    
          </Sidebar>
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
  connect(mapStateToProps)(Create_Reserve)
);

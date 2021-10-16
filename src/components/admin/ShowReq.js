import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Link } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import UpFile from './../UpFile';


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { confirmAlert } from 'react-confirm-alert';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { TabView,TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Panel } from 'primereact/panel';

class ShowReq extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.GetReq = this.GetReq.bind(this);
    this.SetAnswer = this.SetAnswer.bind(this);
    this.toast = React.createRef();

    
    this.selectedComponentChange = this.selectedComponentChange.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.state = {
      name: "",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      activeIndex:0,
      latinName: "",
      IntroducedPrice: "",
      creditAmount: "",
      debtorAmount: "",
      users:[],
      CodeFile:[],
      type:'1',
      draft:false,
      edit: false
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
      //["مدیر سیستم","پشتیبان","پشتیبان ارشد","کارمند سیستم","مدیر پشتیبانی"]
      that.setState({
        user_Id: response.data.authData.userId,
        user: response.data.authData.name,
        shopId:response.data.authData.shopId,
        username: response.data.authData.username,
        loading: 0
      })
      that.GetMaps();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  GetMaps() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      mobile: this.state.username,
      Key:"username"
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0,
        map:response.data.result[0].map
      })
      that.GetUserOfMaps();

    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("MainApi/getUserData", param, SCallBack, ECallBack)
  }
 
  CreateForm() {
    this.setState({
      visibleManageAction: true,
      desc: '',
      attach: '',
      title: '',
      RequestPriority: '',
      RequestReciever: '',
      type: '',
      _id:null
    })
  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageAction: false,
      selectedId: null,
      edit:false
    });
  }
  onHideMapsDialog(event) {
    this.setState({
      visibleManageMaps: false,
      HasErrorForMaps: null
    });
  }
  selectedComponentChange(value) {
    this.setState({
      edit: true,
      visibleManageAction: true,
      title: value.title,
      RequestPriority: value.Priority,
      RequestReciever: value.Reciever,
      desc: value.desc,
      attach: value.attach,
      selectedId: value._id
    })
  }
  GetReq(reqNumber,type) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      username:this.state.username,
      limit:10,
      reqNumber:reqNumber,
      InShow:1,
      type:type
    };
    this.setState({
      loading: 1,
      visibleManageAction:false
    })
    let SCallBack = function (response) {
      for(let i=0;i<response.data.result.length;i++){
        response.data.result[i].User = response.data.result[i].OriginalSender ? response.data.result[i].OriginalSender[0].name : response.data.result[i].user[0]?.name;
        response.data.result[i].SenderName = response.data.result[i].sender[0]?.name;
        response.data.result[i].RecieverName = response.data.result[i].reciever[0]?.name;
        response.data.result[i].Reciever = response.data.result[i].reciever[0]?.username;

      }
      that.setState({
        GridData: response.data.result
      })
      that.getCodes(['4','5']);

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
    this.Server.send("CompanyApi/getRequest", param, SCallBack, ECallBack)
  }
  
  getCodes(id) {
    let that = this;
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        CodeFile:response.data.result,
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetCodes", { id: id }, SCallBack, ECallBack)
  }
  getUnit(All) {
    let that = this;



    let condition = {};
    this.Server.send("AdminApi/getUnitsList", { condition: condition }, function (response) {

      let SendToArray = [];
      for (let i = 0; i < response.data.result.length; i++) {
        SendToArray.push({ value: response.data.result[i].lTitle, desc: response.data.result[i].fTitle })
      }
      that.setState({
        Units: response.data.result,
        SendToArray: SendToArray,
        ShowLoading: false

      })
      that.GetReq();




    }, function (error) {
      that.setState({
        ShowLoading: false
      })
    })
    this.setState({
      ShowLoading: true
    })
  }
  GetAnswer(item){
    let item_1 = item.request ? item.request[0] : item;
    let that = this;
    this.setState({
        loading: 1,
        visibleManageAction: true,
        selectedId: item_1._id,
        Sender: item_1.Sender,
        Reciever: item_1.Reciever,
        changeSender:false,
        desc:"",
        draft:false
      })
    let SCallBack = function (response) {    
      that.setState({
        request_details:response.data.result,
        loading: 0
      })
      for(let i=0;i<response.data.result.length;i++){
        if(response.data.result[i].draft){
          that.setState({
            attach:response.data.result[i].attach,
            desc:response.data.result[i].answer,
            draft:true
          })
        }
      }
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("CompanyApi/getRequestDetail", { 
        selectedId: item_1._id,
        user:this.state.username }, SCallBack, ECallBack)

  }
  SetAnswer(){
    let that = this;
    if(!this.state.desc){
      this.toast.current.show({ severity: 'warn', summary: <div>مقداری برای پاسخ ثبت کنید</div>, life: 8000 });
      return;
    }
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.GetReq();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    let param = {};
    if(this.state.changeSender && (this.state.RequestReciever || this.state.SelectedUnit)){
      let RequestReciever = [];
      if(this.state.SelectedUnit){
        for(let unit of this.state.Units){
          if(unit.lTitle == this.state.SelectedUnit){
            for(let user of unit.usersList){
              RequestReciever.push(user.username)
            }
          }
        }
      }else{
        RequestReciever = this.state.RequestReciever;
      }
      param = { id: this.state.selectedId,answer:this.state.desc,attach:this.state.attach,username:this.state.username,Sender:this.state.username,Reciever:RequestReciever,Priority:this.state.RequestPriority,changeSender:1,draft:this.state.draft };


    }
    else{
      let Reciever = this.state.Reciever.indexOf(this.state.username) > -1 ? this.state.Sender : this.state.Reciever;
      param = { id: this.state.selectedId,answer:this.state.desc,attach:this.state.attach,username:this.state.username,Sender:this.state.username,Reciever:Reciever,draft:this.state.draft };
    }
    this.Server.send("CompanyApi/SetAnswer", param, SCallBack, ECallBack)

  }
  GetUserOfMaps() {
    let that = this;
    let maps = [];
    if(this.state.map == "مدیر سیستم"){
      maps = ["کارمند","کارمند ارشد","کاربر","مدیر واحد"]
    }else if(this.state.map == "مدیر واحد"){
      maps = ["مدیر سیستم","کارمند","کارمند ارشد","کارمند سیستم"]
    }else if(this.state.map == "کارمند ارشد"){
      maps = ["کارمند"]
    }
    let param = {};
    if(maps.length > 0 ){
      param = {
        token: localStorage.getItem("api_token"),
        maps: maps,
        shopId:this.state.shopId
      };
      this.setState({
        loading: 1
      })
      let SCallBack = function (response) {
        that.setState({
          users: response.data.result
        })
        that.setState({
          loading: 0
        })
        that.getUnit();
  
      };
      let ECallBack = function (error) {
        console.log(error)
        that.setState({
          loading: 0
        })
      }
      this.Server.send("AdminApi/GetUserOfMaps", param, SCallBack, ECallBack)

    }
    that.GetReq();
  }
  itemTemplate(car, layout) {
    if (!car)
      return (
        <div className="p-col-12 p-md-3">
          <div></div>
        </div>
      );

    if (layout === 'list') {
      return (
        <div className="row">
          <div className="col-lg-12 " >
            <div className="row" style={{ margin: 20 }}>
              
              <div className="col-lg-7 col-12 yekan" style={{ textAlign: "right",backgroundColor:'#f5f5f54a',padding:10,borderRadius:10 }}>
                <p className="yekan" style={{fontSize:15,color:'blue'}}>{car.request ? car.request[0].title : car.title}</p>
                <p className="yekan" style={{fontSize:18}}>{car.request ? car.request[0].desc : car.desc}</p>

              </div>
              <div className="col-lg-3 col-12 yekan" style={{ textAlign: "right" }}>
                <div>شماره درخواست : {car.request ? car.request[0].number : car.number}</div>

                <p className="yekan" >فرستنده : {car.User}</p>
                <p className="yekan" style={{color:'#34d634',display:'none'}} >گیرنده : {car.RecieverName}</p>

                <p className="yekan" >اولویت : {car.request ? car.request[0].Priority : car.Priority}</p>
                <p className="yekan" >{car.request ? car.request[0].Time : car.Time} : {car.request ? car.request[0].Date : car.Date}</p>
                {((car.request && car.request[0].status != 1) || (!car.request && car.status != 1) ) &&

                  <p className="yekan" style={{color:'red'}} >وضعیت : بایگانی</p>

                }
                {((car.request && car.request[0].attach) || car.attach) &&

                <a href={car.request ? car.request[0].attach : car.attach} className="yekan" target="_blank"  >
                  <i className="fa fa-paperclip" style={{paddingLeft:5}} />
                  دانلود فایل ضمیمه
                </a>

                }


              </div>
              <div className="col-lg-2 col-12 yekan" style={{ textAlign: "center" }}>
                {this.state.activeIndex == 1 ?
                <button className="btn btn-secondary yekan" onClick={() => {this.GetAnswer(car) }} style={{ marginTop: "5px", marginBottom: "5px" }}>مشاهده</button>
                :
                <button className="btn btn-secondary yekan" onClick={() => {this.GetAnswer(car) }} style={{ marginTop: "5px", marginBottom: "5px" }}>پاسخ</button>

                }
              </div>

            </div>
            <hr />
          </div>

        </div>
      );
    }
    if (layout === 'grid') {
      return (
        <div className="p-col-12 p-md-3">
          <div>{car.brand}</div>
        </div>
      );
    }
  }
  render() {
    const footer = (
      <div>
        {this.state.activeIndex == 0 ?
        <button className="btn btn-primary irsans" onClick={this.SetAnswer} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>
         :
        <span> </span>
        }

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delAction(rowData)}></i>;
    }
    return (

      <div style={{ direction: 'rtl' }}>
         <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center AdminProduct">

          <div className="col-12" style={{ background: '#fff' }}>
            <div className="row" style={{ alignItems: 'baseline' }} >
              <div className="col-lg-3 col-12">
              <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.reqNumber} name="reqNumber" onChange={(event) => this.setState({ reqNumber: event.target.value })}  />
                  <label>شماره درخواست</label>
                </div>
              </div>
              <div className="col-lg-3 col-12" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={()=>this.GetReq(this.state.reqNumber)}  style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>جستجو</button>
              </div>

            </div>
            <TabView style={{marginTop:60}} activeIndex={this.state.activeIndex} onTabChange={(event)=>{
              this.setState({
                activeIndex:event.index
              })
              this.GetReq(null,event.index)
            }}>
            <TabPanel header="درخواست ها">
              <DataView value={this.state.GridData} layout={this.state.layout} paginator={true}  rows={10} itemTemplate={this.itemTemplate}></DataView>
            </TabPanel>
            <TabPanel header="رونوشت ها">
              <DataView value={this.state.GridData} layout={this.state.layout} paginator={true}  rows={10} itemTemplate={this.itemTemplate}></DataView>
            </TabPanel>
            
        </TabView>
            

          </div>

        </div>


        <Dialog style={{ width: '60vw' }}  header={this.state.activeIndex == 1 ? "مشاهده" : "مشاهده و پاسخ"}  visible={this.state.visibleManageAction} footer={footer}  onHide={this.onHideFormsDialog} maximizable={true} maximized={false}>
          <div>
            { 
                this.state.request_details && this.state.request_details.map((item,index) => {
                    let header = <div style={{display:'flex',justifyContent:'center'}}><span style={{paddingLeft:10}}>{item.userData[0].name}</span><span style={{paddingLeft:10}}>{item.Date}</span><span style={{paddingLeft:10}}>{item.Time}</span></div>
                    if(!item.draft){
                      return(
                        (item.user==this.state.username || this.state.activeIndex == 1) ? 
                        <Panel header={header} style={{marginTop:10}}>
                            <i className="fa fa-check" style={{color:item.read ? '#00d000' : 'gainsboro'}}  />
                            <i className="fa fa-check" style={{color:item.read ? '#00d000' : 'gainsboro'}}  />


                            <p style={{textAlign:'right',fontSize:17,whiteSpace:'pre-wrap'}} className="yekan">{item.answer}</p>
                            {item.attach &&

                              <a href={item.attach} className="yekan" target="_blank"  >
                                <i className="fa fa-paperclip" style={{paddingLeft:5}} />
                                دانلود فایل ضمیمه
                              </a>

                            }

                        </Panel>  
                        :
                        <Panel header={header} style={{marginTop:10}}>
                            
                            <p style={{textAlign:'right',fontSize:17,backgroundColor:'#b9e4d93b',padding:20,whiteSpace:'pre-wrap'}} className="yekan">{item.answer}</p>
                            {item.attach &&

                              <a href={item.attach} className="yekan" target="_blank"  >
                                <i className="fa fa-paperclip" style={{paddingLeft:5}} />
                                دانلود فایل ضمیمه
                              </a>

                            }


                        </Panel> 
                        
                        
                    )
                    }
                    
                })
            }   
            {this.state.activeIndex == 0 &&    
              <div className="row">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0,marginRight:5 }}>
                <div className="group" style={{width:'100%'}} >
                  <textarea className="form-control irsans" autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={(event) => this.setState({ desc: event.target.value })}  style={{height:200}} ></textarea>
                  <label>پاسخ</label>
                </div>
                </div>
                <div className="col-12" style={{ textAlign: 'right'}}>
                      <Checkbox inputId="draft" value={this.state.draft} checked={this.state.draft} onChange={e => this.setState({ draft: e.checked })}></Checkbox>
                      <label htmlFor="draft" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> پیشنویس</label>
                </div>
                {this.state.users.length > 0 &&
                  <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0,marginRight:5 }}>
                  <Checkbox inputId="changeSender" value={this.state.changeSender} checked={this.state.changeSender} onChange={e => this.setState({ changeSender: e.checked })}></Checkbox>
                  <label htmlFor="changeSender" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> ارجاع به دیگران</label>
                  </div>
                }
                
                
                {this.state.changeSender && 
                   <div className="col-lg-4" style={{ marginBottom: 20 }}>
                   <div>
                     <label className="labelNoGroup irsans">ارجاع به</label>
                     <select className="custom-select irsans" value={this.state.RequestReciever} disabled={this.state.SelectedUnit} onChange={(event) => {this.setState({ RequestReciever: event.target.value }) }} >
                     <option value=""></option>
   
                       {this.state.users.map((v, i) => {
                         return(
                           
                           <option value={v.username}>{v.name}</option>
   
                         )
                       })}
                   </select>
                       </div>
                  </div>
                }
                {this.state.changeSender &&  this.state.map == "مدیر سیستم" &&

                <div className="col-lg-4" style={{ marginBottom: 20 }}>
                <label className="labelNoGroup irsans">واحد</label>
                <select className="custom-select irsans" placeholder="" disabled={this.state.RequestReciever} className="form-control iranyekanwebmedium" id={this.state.SelectedUnit} name="SelectedUnit" value={this.state.SelectedUnit} onChange={(event) => { this.setState({ SelectedUnit: event.target.value })}} >
                  <option value="" ></option>
                  {this.state.SendToArray && this.state.SendToArray.map((item, index) => {
                    return (
                      <option value={item.value} >{item.desc}</option>

                    )
                  })}
                </select>
              </div>
              }
              <UpFile label={
                <div style={{ textAlign: 'center' }}><div>فایل مورد نظر خود را انتخاب کنید
                  </div>
                  

                </div>
              } className="col-lg-12 col-12 mt-3" large={true} uploadImage={this.state.attach} buttonLabel="انتخاب فایل" callback={(v) => {
                this.setState({
                  attach: v.uploadImage
                })
              }
              } />
               
                </div>
                }
                

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
  connect(mapStateToProps)(ShowReq)
);

import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Link, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import UpFile from './../UpFile';


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';
import { Toast } from 'primereact/toast';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { MultiSelect } from 'primereact/multiselect';

class Company_Request extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.toast = React.createRef();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetReq = this.SetReq.bind(this);
    this.GetReq = this.GetReq.bind(this);
    this.DelReq = this.DelReq.bind(this);
    this.selectedComponentChange = this.selectedComponentChange.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.state = {
      name: "",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      latinName: "",
      IntroducedPrice: "",
      creditAmount: "",
      users: [],
      debtorAmount: "",
      CodeFile: [],
      type: '1',
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
      that.setState({
        user_Id: response.data.authData.userId,
        user: response.data.authData.name,
        username: response.data.authData.username,
        shopId: response.data.authData.shopId,
        loading: 0
      })
      that.getCodes(['4']);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
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
  GetUserOfMaps() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      maps: ["مدیر سیستم", "کارمند", "کارمند ارشد", "کاربر", "مدیر واحد"],
      shopId: this.state.shopId
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
  SetReq() {
    let that = this;
    debugger;

    if (!this.state.RequestReciever && !this.state.SelectedUnit) {
      this.toast.current.show({ severity: 'warn', summary: <div>گیرنده درخواست را مشخص کنید</div>, life: 8000 });
      return;
    }
    if (this.state.RequestReciever == this.state.username) {
      this.toast.current.show({ severity: 'warn', summary: <div>نمیتوانید درخواست را به خودتان ارجاع دهید !</div>, life: 8000 });
      return;
    }
    if (!this.state.desc) {
      this.toast.current.show({ severity: 'warn', summary: <div>توضیحی برای درخواست ثبت کنید</div>, life: 8000 });
      return;
    }
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
    let param = {
      _id: this.state.selectedId,
      desc: this.state.desc,
      attach: this.state.attach,
      title: this.state.title,
      Priority: this.state.RequestPriority,
      Reciever: RequestReciever,
      Sender: this.state.username,
      Copy: this.state.RequestRecieverMulti,
      status: 1,
    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      if (response.data.error) {
        that.setState({
          loading: 0
        })
        Alert.warning(response.data.error[0], 5000);
        return;
      }
      that.onHideFormsDialog();
      that.GetReq();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("CompanyApi/setRequest", param, SCallBack, ECallBack)
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
      _id: null
    })
  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageAction: false,
      selectedId: null,
      edit: false
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
  GetReq(reqNumber) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.username,
      limit: 10,
      reqNumber: reqNumber
    };
    this.setState({
      loading: 1,
      visibleManageAction: false
    })
    let SCallBack = function (response) {
      for (let i = 0; i < response.data.result.length; i++) {
        response.data.result[i].OrgSenderName = response.data.result[i].OriginalSender[0]?.name;
        response.data.result[i].SenderName = response.data.result[i].sender[0]?.name;
      }
      that.setState({
        GridData: response.data.result
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
    this.Server.send("CompanyApi/getRequest", param, SCallBack, ECallBack)
  }
  EndReq(_id) {
    this.setState({
      visibleManageAction: false
    })
    confirmAlert({
      title: <span className="yekan">تغییر وضعیت</span>,
      message: <span className="yekan">  درخواست بایگانی شود ؟   </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: _id,
              End: 1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetReq();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("CompanyApi/setRequest", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });
  }
  DelReq(_id) {
    this.setState({
      visibleManageAction: false
    })
    confirmAlert({
      title: <span className="yekan">حذف ردیف</span>,
      message: <span className="yekan">  آیا از حذف مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: _id,
              del: 1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetReq();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("CompanyApi/setRequest", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });
  }
  getCodes(id) {
    let that = this;
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        CodeFile: response.data.result,
        loading: 0
      })
      that.GetUserOfMaps();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetCodes", { id: id }, SCallBack, ECallBack)
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

              <div className="col-lg-7 col-12 yekan" style={{ textAlign: "right", backgroundColor: '#f5f5f54a', padding: 10, borderRadius: 10 }}>
                <p className="yekan" style={{ fontSize: 15, color: 'blue' }}>{car.title}</p>
                <p className="yekan" style={{ fontSize: 18, whiteSpace: 'pre-wrap' }} >{car.desc}</p>


              </div>
              <div className="col-lg-3 col-12 yekan" style={{ textAlign: "right" }}>
                <div>شماره درخواست : {car.number}</div>
                <p className="yekan" >فرستنده : {car.OrgSenderName}</p>
                <p className="yekan" >آخرین ارجاع دهنده : {car.SenderName}</p>
                <p className="yekan" >اولویت : {car.Priority}</p>
                <p className="yekan" >{car.Time} : {car.Date}</p>
                {car.status != 1 &&

                  <p className="yekan" style={{ color: 'red' }} >وضعیت : بایگانی</p>

                }
                {car.attach &&

                  <a href={car.attach} className="yekan" target="_blank"  >
                    <i className="fa fa-paperclip" style={{ paddingLeft: 5 }} />
                  دانلود فایل ضمیمه
                </a>

                }
              </div>
              <div className="col-lg-2 col-12 yekan" style={{ textAlign: "center" }}>
                {car.Sender == this.state.username &&
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button className="btn btn-secondary yekan" onClick={() => { this.selectedComponentChange(car) }} style={{ marginTop: "5px", marginBottom: "5px" }}>ویرایش درخواست</button>
                    <button className="btn btn-danger yekan" onClick={() => this.DelReq(car._id)} style={{ marginTop: "5px", marginBottom: "5px" }}  >حذف درخواست</button>
                    <button className="btn btn-info yekan" onClick={() => this.EndReq(car._id)} style={{ marginTop: "5px", marginBottom: "5px" }}  >پایان</button>

                  </div>
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
        <button className="btn btn-primary irsans" onClick={this.SetReq} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
        <div className="row justify-content-center">

          <div className="col-12" style={{ background: '#fff' }}>
            <div className="row" style={{ alignItems: 'baseline' }} >
              <div className="col-lg-3 col-12">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.reqNumber} name="reqNumber" onChange={(event) => this.setState({ reqNumber: event.target.value })} required="true" />
                  <label>شماره درخواست</label>
                </div></div>
              <div className="col-lg-3 col-12" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={() => this.GetReq(this.state.reqNumber)} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>جستجو</button>
              </div>
              <div className="col-lg-6 col-12" style={{ textAlign: 'center' }}>
                <button className="btn btn-info irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ثبت درخواست جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >درخواست ها</span></div>
            <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={10} itemTemplate={this.itemTemplate}></DataView>

          </div>

        </div>


        <Dialog style={{ width: '60vw' }} header={this.state.selectedId ? "اصلاح" : "ثبت درخواست"} visible={this.state.visibleManageAction} footer={footer} onHide={this.onHideFormsDialog} maximizable={true} maximized={false}>
          <div>

            <div className="row" style={{ alignItems: "center" }}>
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
              <div className="col-lg-4" style={{ marginBottom: 20 }}>
              <div>
                <label className="labelNoGroup irsans">ارجاع به</label>
                <select className="custom-select irsans" disabled={this.state.SelectedUnit} value={this.state.RequestReciever} onChange={(event) => { this.setState({ RequestReciever: event.target.value }) }} >
                  <option value=""></option>

                  {this.state.users.map((v, i) => {
                    return (

                      <option value={v.username}>{v.name}</option>

                    )
                  })}
                </select>
              </div>
            </div>
            
              


              {this.state.CodeFile.map((v, i) => {
                //this.setState({ [v.Etitle]: v.values[0].value });
                return (
                  <div className="col-lg-4" style={{ marginBottom: 20 }}>
                    {v.MultiSelect ?
                      <div>

                        <p className="yekan" style={{ textAlign: "right", paddingRight: 10 }}>{v.title}</p>
                        <MultiSelect value={this.state[v.Etitle]} optionLabel="desc" style={{ width: '100%' }} optionValue="value" options={v.values} onChange={(event) => { this.setState({ [v.Etitle]: event.value }) }} />
                      </div>
                      :
                      <div>
                        <label className="labelNoGroup irsans">{v.title}</label>
                        <select className="custom-select irsans" value={this.state[v.Etitle]} onChange={(event) => { this.setState({ [v.Etitle]: event.target.value }) }} >
                          {
                            v.values.map(function (u, j) {
                              return (
                                <option value={u.value}>{u.desc}</option>
                              )
                            })


                          }
                        </select>
                      </div>
                    }
                  </div>
                )
              })}
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.title} name="title" onChange={(event) => this.setState({ title: event.target.value })} required="true" />
                  <label>عنوان {this.state.type == '1' ? 'درخواست' : 'پیام'}</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="group">
                  <textarea className="form-control irsans" style={{ height: 200 }} autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={(event) => this.setState({ desc: event.target.value })} required="true" ></textarea>
                  <label>توضیح</label>
                </div>
              </div>
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
  connect(mapStateToProps)(Company_Request)
);

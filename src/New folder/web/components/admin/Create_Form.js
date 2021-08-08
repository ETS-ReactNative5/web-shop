import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';
import { OrderList } from 'primereact/orderlist';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Create_Forms extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FieldRef = React.createRef();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetForms = this.SetForms.bind(this);
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: ""

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

      that.GetForms();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  
  SetForms() {
    let that = this;
    let Filters = []

    this.state.FilterListForDropDown.map((v,index)=>{
      if(v.checked){
        Filters.push({
          id:v.id,
          name:v.name
        })
      }
        
    })
    debugger;

    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      name: this.state.name,
      number: this.state.number,
      Fields : Filters,
      method:this.state.method,
      method2:this.state.method2,
      OkMsg:this.state.OkMsg,
      Active:this.state.Active,
      ForEdit:this.state.ForEdit,
      Key:this.state.Key,
      desc:this.state.desc,
      icon:this.state.icon,
    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetForms();
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
    this.Server.send("AdminApi/SetForms", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      OutputField: "",
      selectedId: null,
      method:"",
      method2:"",
      OkMsg:"",
      ForEdit:false,
      Active:false,
      Key:"",
      icon:"",
      desc:""
    })

  }
  onHideFormsDialog(event) {
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
    let that = this;
    var FilterSelectedIds = [];
    value.Fields.map((v,index)=>{
      FilterSelectedIds.push(v.id)
    })
    let FilterListForDropDown = this.state.FilterListForDropDown;
    FilterListForDropDown.map((v,index)=>{
      if(FilterSelectedIds.indexOf(v.id) > -1)
        v.checked = true;
      else
        v.checked = false;  
    })

    for(let i=0;i<FilterSelectedIds.length;i++){
      for(let j=0;j<FilterListForDropDown.length;j++){
        if(FilterListForDropDown[j].id == FilterSelectedIds[i])
          FilterListForDropDown[j].order=i;
      }
    }
    FilterListForDropDown.sort((a,b) => ((a.order||-1) > (b.order||-1)) ? 1 : (((b.order||-1) > (a.order||-1)) ? -1 : 0))

    var p = [];
    this.setState({
      name: value.name,
      number: value.number,
      selectedId: value._id,
      FieldSelected:value.Fields,
      visibleManageField: true,
      method:value.method,
      method2:value.method2,
      OkMsg:value.OkMsg,
      ForEdit:value.ForEdit,
      FilterListForDropDown:FilterListForDropDown,
      FilterSelected:value.Fields,
      Active:value.Active,
      Key:value.Key,
      icon:value.icon,
      desc:value.desc
    })

  }
  GetForms() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.GetFields();
      that.setState({
        GridDataFields: response.data.result
      })
      that.setState({
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.GetFields();
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetForms", param, SCallBack, ECallBack)
  }
  delField(rowData) {

    this.setState({
      visibleManageField:false
    })
    confirmAlert({
      title: <span className="yekan">حذف کاربر</span>,
      message: <span className="yekan">  آیا از حذف  {rowData.name} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: rowData._id,
              del:1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetForms();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetForms", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  GetFields() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        FieldList: response.data.result
      })
      let FieldList = [];
      for (let i = 0; i < that.state.FieldList.length; i++) {
        FieldList.push({ name: that.state.FieldList[i].name, id: that.state.FieldList[i]._id })
      }
      
      that.setState({
        FilterListForDropDown: FieldList,
        OrgFilterListForDropDown: FieldList,
        FieldListForDropDown: FieldList,
        loading: 0
      })

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFields", {}, SCallBack, ECallBack)



  }
  
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetForms} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delField(rowData)}></i>;
    }

    const itemTemplate = (item) => {
      let id = "cb" + item.id;
      return (
        <div className="product-item">

          <div className="product-list-detail" style={{ display: 'flex' }}>
            <Checkbox inputId={id} value={item.id} style={{ verticalAlign: 'text-bottom' }} onChange={this.ChangeFilterCheckBoxs} checked={this.state.FilterListForDropDown.filter(function (v) { return v.id == item.id })[0]?.checked == false ? false : true}></Checkbox>

            <h5 className="p-mb-2">{item.name}</h5>
          </div>

        </div>
      );
    }
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت فرم جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست فرم ها</span></div>

            <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="number" header="شماره فرم" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت فرم جدید"} visible={this.state.visibleManageField} footer={footer} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row">
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.number} name="number" onChange={(event) => this.setState({ number: event.target.value })} required="true" />
                  <label>شماره فرم</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.method} name="method" onChange={(event) => this.setState({ method: event.target.value })} required="true" />
                  <label>نام متد</label>
                </div>
              </div>
              
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                  <label >عنوان</label>

                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.icon} name="icon" onChange={(event) => this.setState({ icon: event.target.value })} required="true" />
                  <label >آیکن</label>

                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <textarea className="form-control irsans" autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={(event) => this.setState({ desc: event.target.value })} required="true" ></textarea>
                  <label >توضیح بالای فرم</label>

                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.OkMsg} name="OkMsg" onChange={(event) => this.setState({ OkMsg: event.target.value })} required="true" />
                  <label >پیغام موفقیت ارسال</label>

                </div>
              </div>
              <div className="col-lg-6">
                <div className="group"  style={{display:"none"}}>
                <Multiselect
                      placeholder="فیلد ها"
                      ref={this.FieldRef}
                      options={this.state.FieldListForDropDown} // Options to display in the dropdown
                      selectedValues={this.state.FieldSelected} // Preselected value to persist in dropdown
                      displayValue="name" // Property name to display in the dropdown options
                    />

                 </div>
                 <OrderList value={this.state.FilterListForDropDown} itemTemplate={itemTemplate} header="مشخصات محصول" onChange={(e) => {this.setState({ FilterListForDropDown: e.value })}}></OrderList>

              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.Active} checked={this.state.Active} onChange={e => this.setState({ Active: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> فعال</label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline',padding:0 }}>
                      <Checkbox inputId="ShowPriceAftLogin" value={this.state.ForEdit} checked={this.state.ForEdit} onChange={e => this.setState({ ForEdit: e.checked })}></Checkbox>
                      <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}> در حالت ویرایش</label>
                </div>
              </div>
              {this.state.ForEdit &&
                <div className="col-lg-12">

                  <div className="group">
                    <input className="form-control irsans" autoComplete="off" type="text" value={this.state.Key} name="Key" onChange={(event) => this.setState({ Key: event.target.value })} required="true" />
                    <label >کلید دیتابیس</label>

                  </div>
                </div>

              }
              {this.state.ForEdit &&
                <div className="col-lg-12">

                  <div className="group">
                    <input className="form-control irsans" autoComplete="off" type="text" value={this.state.method2} name="method2" onChange={(event) => this.setState({ method2: event.target.value })} required="true" />
                    <label >متد دریافت اطلاعات</label>

                  </div>
                </div>

              }



            </div>
          </form>
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
  connect(mapStateToProps)(Create_Forms)
);

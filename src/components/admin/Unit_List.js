import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import './Dashboard.css'
import { Panel } from 'primereact/panel';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';
import { AutoComplete } from 'primereact/autocomplete';
import { Chip } from 'primereact/chip';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Unit_List extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();


    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetUnit = this.SetUnit.bind(this);

    this.state = {
      layout: 'list',
      name: "",
      ShopsList: [],
      type: "1",
      FId: "",
      DbTableName: "",
      usersList: [],
      DBTableField: "",
      latinName: ""

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
      that.getUnitsList();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetUnit() {
    let that = this;
    let usersList = this.state.usersList.filter(e => e.remove != "1");


    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      fTitle: this.state.fTitle,
      lTitle: this.state.lTitle,
      enable: this.state.enable,
      usersList: usersList
    };
    this.setState({
      HasErrorForMaps: null,
      loading: 1
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.getUnitsList();
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
    this.Server.send("AdminApi/setUnitList", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageField: true,
      fTitle: "",
      enable: true,
      lTitle: "",
      usersList: [],
      selectedId: null
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
    var p = [];
    this.setState({
      fTitle: value.fTitle,
      lTitle: value.lTitle,
      enable: value.enable,
      usersList: value.usersList,
      selectedId: value._id,
      visibleManageField: true



    })

  }
  getUnitsList() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      that.setState({
        GridDataFields: response.data.result
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
    this.Server.send("AdminApi/getUnitsList", param, SCallBack, ECallBack)
  }
  delField(rowData) {
    this.setState({
      visibleManageField: false
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
              del: 1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.getScoreList();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            //this.Server.send("AdminApi/SetWallets", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  onSelect(event) {
    let List = this.state.usersList.filter(e => e.remove != "1");
    List.push({
      title: event.value.name,
      username: event.value.username
    })
    var flags = [], output = [], l = List.length, i;
    for (i = 0; i < l; i++) {
      if (flags[List[i].title]) continue;
      flags[List[i].title] = true;
      output.push(List[i]);
    }


    this.setState({
      searchName: event.value.name,
      searchId: event.value.username,
      usersList: output

    })
  }
  suggestBrands(event) {
    let that = this;
    this.setState({ brand: event.query, Count: 0 });
    let param = {};
    param = {
      title: event.query,
      table: "users",
      name: ["name", "username", "RaymandAcc", "RaymandUser"]
    };


    let SCallBack = function (response) {
      let brandSuggestions = [];
      response.data.result.reverse().map(function (v, i) {
        brandSuggestions.push({ _id: v._id, name: v.name, username: v.username })
      })
      that.setState({ brandSuggestions: brandSuggestions });
    };

    let ECallBack = function (error) {

    }
    that.Server.send("AdminApi/searchItems", param, SCallBack, ECallBack)


  }
  itemTemplate(brand) {
    return (
      <div className="p-clearfix" style={{ direction: 'rtl', maxWidth: '100%' }} >
        <div style={{ margin: '10px 10px 0 0' }} className="row" username={brand.username} >
          <div className="col-8" username={brand.username} style={{ textAlign: 'right' }}>
            <span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} username={brand.username} >
              <span style={{ whiteSpace: 'pre-wrap' }} username={brand.username}>{brand.name}</span><br />
            </span>
          </div>

        </div>
      </div>
    );
  }
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetUnit} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

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
        <div className="row justify-content-center mt-5">

          <div className="col-12" style={{ background: '#fff' }}>
            <Panel header="لیست واحدها" style={{ textAlign: 'right', fontFamily: 'yekan' }}>
              <div className="row" >
                <div className="col-6" style={{ textAlign: 'right' }}>
                  <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت ردیف جدید</button>
                </div>

              </div>

              <DataTable responsive value={this.state.GridDataFields} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
                <Column field="fTitle" header="شماره" className="irsans" style={{ textAlign: "center" }} />
                <Column field="lTitle" header="نام" className="irsans" style={{ textAlign: "center" }} />
                <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
              </DataTable>
            </Panel>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت ردیف جدید"} visible={this.state.visibleManageField} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row" style={{ alignItems: 'baseline' }}>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.fTitle} name="fTitle" onChange={(event) => this.setState({ fTitle: event.target.value })} required="true" />
                  <label>نام فارسی</label>
                </div>
              </div>
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.lTitle} name="lTitle" onChange={(event) => this.setState({ lTitle: event.target.value })} required="true" />
                  <label >نام لاتین</label>

                </div>
              </div>


              <div className="col-lg-12">
                <div className="group">

                  <AutoComplete disabled={this.state.all} placeholder="بخشی از نام / شماره موبایل / شناسه کاربری / شماره حساب  را وارد کنید" style={{ width: '100%' }} onChange={(event) => { this.setState({ searchName: event.value }) }} itemTemplate={this.itemTemplate.bind(this)} value={this.state.searchName} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />
                  <div style={{ marginTop: 10, textAlign: 'right', marginBottom: 10 }}>
                    {typeof this.state.usersList == "object" && this.state.usersList.map((v, i) => {
                      if ((v.title || v.username) && !v.remove) {
                        return (<Chip label={v.title || v.username} _id={v._id} style={{ marginLeft: 5 }} removable={true} onRemove={(event) => {
                          let title = event.target.parentElement.getElementsByClassName("p-chip-text")[0].textContent;
                          let List = this.state.usersList;
                          for (let i = 0; i < List.length; i++) {
                            if (List[i].title == title || List[i].username == title) {
                              List[i].remove = 1;
                            }
                          }

                        }} />)
                      }

                    })
                    }
                  </div>



                </div>
              </div>


              <div className="col-lg-12">

                <div className="group" >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox inputId="active" value={this.state.enable} checked={this.state.enable} onChange={e => this.setState({ enable: e.checked })}></Checkbox>
                    <label htmlFor="active" className="p-checkbox-label yekan" style={{ paddingRight: 5, marginBottom: 0 }}>فعال</label>
                  </div>
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
  return {
    username: state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Unit_List)
);

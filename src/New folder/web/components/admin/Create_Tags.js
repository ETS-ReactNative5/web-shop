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
import { AutoComplete } from 'primereact/autocomplete';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
let Cound = 0;

class Create_Tags extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FilterRef = React.createRef();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetTags = this.SetTags.bind(this);
    this.New = this.New.bind(this);
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
			absoluteUrl: this.Server.getAbsoluteUrl(),
			url: this.Server.getUrl(),

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

      //that.GetTags();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetTags() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      title: this.state.brand
    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
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
    this.Server.send("AdminApi/SetTags", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageTag: true,
      selectedId: null,
      brand:"",
      brandTemp:""
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageTag: false,
      selectedId: null
    });
    //this.GetTags();


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
      name: value.name,
      number: value.number,
      selectedId: value._id,
      FilterSelected:value.Filters,
      visibleManageTag: true,
      method:value.method
    })

  }
  GetTags() {
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
        GridDataFilters: response.data.result
      })
      that.setState({
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetTags", param, SCallBack, ECallBack)
  }
  delTags(rowData) {

    this.setState({
      visibleManageTag:false
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
              //that.GetTags();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetReports", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  onSelect(event) {
		
		this.setState({
			brand: event.value.title,
      brandTemp: event.value.title,
      selectedId:event.value._id
		})
	}
  suggestBrands(event) {
		let that = this;
		this.setState({ brand: event.query, Count: 0 });
		axios.post(this.state.url + 'searchTags', {
			title: event.query
		})
			.then(response => {
				let brandSuggestions = response.data.result;
				that.setState({ brandSuggestions: brandSuggestions,brand:event.query });
			})
			.catch(error => {
				console.log(error)
			})

	}
  itemTemplate(brand) {
		Cound = 0;
			return (
				<div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
					<div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >
	
						<div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>
								<span style={{whiteSpace:'pre-wrap'}} className="yekan" _id={brand._id}>{brand.title}</span><br />
						</div>
					</div>
				</div>
			);
		
		

	}
  New(){
    this.setState({selectedId:null,brandTemp:""});
    return false;
  }
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetTags} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> {this.state.selectedId ? "اصلاح "+this.state.brandTemp+" " : "ساخت"} </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" ></i>;
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
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت / ویرایش تگ </button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست تگ ها</span></div>

            <DataTable responsive value={this.state.GridDataFilters} >
              <Column field="title" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>
        <Dialog header={this.state.selectedId ? "اصلاح "+this.state.brandTemp+" " : "ساخت"} visible={this.state.visibleManageTag} footer={footer} onHide={this.onHideFormsDialog} maximizable={true} style={{width: '50vw'}} >
          <form style={{minHeight:300}}>
            <div className="row" style={{alignItems:'baseline'}}>
              <div className="col-md-8 col-12">
                  <AutoComplete placeholder="جستجو کنید ... " inputStyle={{ fontFamily: 'iranyekanwebregular', textAlign: 'right', fontSize: 16, padding: 7 }} style={{ width: '100%' }} onChange={(e) => {this.setState({ brand: e.value })}} itemTemplate={this.itemTemplate.bind(this)} value={this.state.brand} onSelect={(e) => this.onSelect(e)}  suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />
              </div>
              <div className="col-md-4 col-12">
              <button className="btn btn-primary irsans" onClick={this.New} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>جدید</button>
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
  connect(mapStateToProps)(Create_Tags)
);

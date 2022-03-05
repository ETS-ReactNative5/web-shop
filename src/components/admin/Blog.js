import React, { Component, useRef } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import JoditEditor from "jodit-react";
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Link } from 'react-router-dom'

const config = {
  readonly: false,
  controls: {
    font: {
        list: {
            'yekan': 'yekan',
            'YekanBakhFaMedium':'YekanBakhFaMedium',
            'YekanBakhFaLight':'YekanBakhFaLight',
            'YekanBakhFaBold':'YekanBakhFaBold'
        }
    }
    }
}
class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      GridDataBlogs: [],
      selectedId: null,
      content: null,
      title: null,
      BlogId: null,
      address: null,
      FixPage: false,
      draft:false,
      loading: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    this.getBlogs();


    this.RemContent = this.RemContent.bind(this);

    this.SetContent = this.SetContent.bind(this);

  }

  getBlogs() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {

      that.setState({
        user_id: response1.data.authData.userId
      })
      that.Server.send("AdminApi/getBlogs", {}, function (response) {
        that.setState({
          loading: 0
        })
        var result = [];
        response.data.result.map(function (v, i) {
          result.push({
            _id: v._id,
            title: v.title,
            content: v.content,
            FixPage: v.FixPage,
            draft:v.draft,
            address: "Blogs/?id=" + v._id


          })
        })
        that.setState({
          GridDataBlogs: result

        })
      }, function (error) {
        that.setState({
          loading: 0
        })
        console.log(error)
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  selectedBlogsChange(e) {
    this.setState({
      BlogId: e._id,
      address: e.address,
      title: e.title,
      content: e.content,
      FixPage: e.FixPage,
      draft:e.draft
    })
  }
  RemContent() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      BlogId: this.state.BlogId
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })
      that.getBlogs();
    };
    let ECallBack = function (error) {
      Alert.danger('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/RemBlog", param, SCallBack, ECallBack)
  }
  SetContent() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      title: this.state.title,
      content: this.state.content,
      BlogId: this.state.BlogId,
      FixPage: this.state.FixPage,
      draft: this.state.draft
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })
      that.getBlogs();
    };
    let ECallBack = function (error) {
      Alert.danger('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/SetContentBlog", param, SCallBack, ECallBack)
  }



  render() {

    return (
      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center mt-5">

          <div className="col-12" style={{ background: '#fff' }}>
            <Panel header="ثبت مطلب جدید" style={{  textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <form  >
                <div className="row">

                  <div className="col-lg-6" style={{ marginTop: 10 }}>
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.title} name="title" onChange={(event) => this.setState({ title: event.target.value })} required="true" />
                      <label className="yekan">عنوان</label>
                    </div>

                  </div>
                  <div className="col-lg-12" style={{ marginTop: 10 }}>
                    <div >
                      <Link to={`${process.env.PUBLIC_URL}/admin/pics?uploadExtraImage=1`} target="_blank" >بارگزاری تصویر و فایل</Link>
                      <br /><label className="yekan">پس از بارگزاری تصویر یا فایل ، لینک به دست آمده را در قسمت مربوط به لینک تصویر یا فایل در جعبه متن زیر قرار دهید</label>

                    </div>
                  </div>
                </div>
                <div className="row">

                  <div className="col-lg-12" style={{ marginTop: 10 }}>
                    <div className="group">
                      <JoditEditor
                        value={this.state.content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onChange={(value) => {
                          if(value)
                            this.setState({ content: value })
                        }}
                      />

                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-lg-12" >
                    <div style={{ paddingRight: 8,display:'flex' }}>

                      <Checkbox inputId="laon" value={this.state.FixPage} checked={this.state.FixPage} onChange={e => this.setState({ FixPage: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label" style={{ paddingRight: 5 }}>صفحه مستقل</label>

                    </div>
                  </div>
                  <div className="col-lg-12" >
                    <div style={{ paddingRight: 8,display:'flex' }}>

                      <Checkbox inputId="laon" value={this.state.draft} checked={this.state.draft} onChange={e => this.setState({ draft: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label" style={{ paddingRight: 5 }}>پیش نویس</label>

                    </div>
                  </div>
                  <div className="col-lg-8" >
                    <div >
                      <input className="form-control yekan" autoComplete="off" disabled type="text" value={this.state.address} name="address" onChange={(event) => this.setState({ address: event.target.value })} required="true" />
                      <p className="yekan">این لینک جهت آدرس دهی به صفحه در بخش های مختلف سایت میتواند استفاده شود</p>
                    </div>
                  </div>

                </div>

                <div className="row">



                  <div className="col-lg-12" style={{ marginTop: 10 }}>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.SetContent}>ثبت اطلاعات</Button>
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="warning" onClick={() => {
                      this.setState({
                        title: '',
                        content: '',
                        BlogId: null,
                        address: ''
                      })
                    }}>پاک کردن</Button>
                    {this.state.BlogId &&
                      <Button style={{ marginLeft: 5, marginTop: 10 }} color="danger" onClick={() => {
                        if (window.confirm("آیا از حذف این مطلب مطمئنید ؟"))
                          this.RemContent()
                      }}>حذف</Button>
                    }

                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12" style={{ marginTop: 10 }}>
                    {
                      this.state.Message &&
                      <Alert color={this.state.Message.type} style={{ textAlign: "center", fontSize: 18 }} className="yekan">
                        {this.state.Message.text}
                      </Alert>
                    }

                  </div>
                </div>


              </form>
            </Panel>
            <DataTable responsive value={this.state.GridDataBlogs} selectionMode="single" selection={this.state.BlogId} onSelectionChange={e => this.selectedBlogsChange(e.value)}>
              <Column field="title" header="عنوان" className="yekan" style={{ textAlign: "center" }} />
              <Column field="content" header="متن" className="yekan" style={{ textAlign: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
              <Column field="address" header="لینک" className="yekan" style={{ textAlign: "center" }} />
            </DataTable>

          </div>

        </div>

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
  connect(mapStateToProps)(Blog)
);

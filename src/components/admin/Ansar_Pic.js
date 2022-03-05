import React, { Component } from 'react';
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
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { RadioButton } from 'primereact/radiobutton';

class Pics extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      uploadExtraImage: this.props.location.search.split("uploadExtraImage=")[1],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      address: null,
      name: null,
      showInSite: true,
      BrandId: null,
      Message: null,
      logo1: null,
      logo2: null,
      logo3: null,
      logo4: null,
      logo5: null,
      logo6: null,
      logo7: null,
      logo8: null,
      logo9: null,
      logo11: null,
      link1: null,
      link2: null,
      link3: null,
      link4: null,
      link5: null,
      link6: null,
      link7: null,
      link8: null,
      link9: null,
      text1: null,
      text2: null,
      text3: null,
      text4: null,
      text5: null,
      text6: null,
      text7: null,
      text8: null,
      text9: null,
      TypeOfFile: "1",
      extraImageLink: null,
      extraImageText: null,
      currentImage: '',
      GridDataComponents: [],
      selectedId: null,
      GridDataExtra: [],
      loading: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    this.getPics();
    this.FileUpload = this.FileUpload.bind(this);
    this.LinkChange = this.LinkChange.bind(this);



  }
  deletePic(_id, OldImage) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.Server.send("AdminApi/RemPics", {
        _id: _id
      }
        , function (response) {
          let state = { loading: 0 };
          state[OldImage] = '';
          that.setState({
            ...state
          })
          Alert.success('عملیات با موفقیت انجام شد', 5000);

        }, function (error) {
          that.setState({
            loading: 0
          })
          Alert.error('عملیات انجام نشد', 5000);
          console.log(error)
        })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)

  }
  LinkChange(e) {
    let that = this;
    let name = "extra-file" + e.target.name.split("link")[1];
    let link = e.target.value
    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.Server.send("AdminApi/setPicsLink", {
        name: name,
        link: link
      }
        , function (response) {
          that.setState({
            loading: 0
          })
          Alert.success('عملیات با موفقیت انجام شد', 5000);
        }, function (error) {
          that.setState({
            loading: 0
          })
          Alert.error('عملیات انجام نشد', 5000);
          console.log(error)
        })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('PagePics', "1");
    formData.append('name', name);
    formData.append('myImage', e.target.files[0]);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    this.setState({
      loading: 1
    })
    axios.post(this.state.url + 'uploadFile', formData, config)
      .then((response) => {
        Alert.success('عملیات با موفقیت انجام شد', 5000);
        this.setState({
          loading: 0
        })
        if (name == "extra-file1")
          this.setState({
            logo1: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "extra-file2")
          this.setState({
            logo2: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "extra-file3")
          this.setState({
            logo3: this.state.absoluteUrl + response.data.split("public")[1]
          })

        this.getPics();

      })
      .catch((error) => {
        this.setState({
          loading: 0
        })
        Alert.error('عملیات انجام نشد', 5000);
        console.log(error);
      });
  }
  getPics() {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token")
    };
    let SCallBack = function (response1) {
      that.setState({
        user_id: response1.data.authData.userId
      })
      that.Server.send("AdminApi/getPics", {}, function (response) {
        that.setState({
          loading: 0
        })
        response.data.result.map(function (item, key) {

          if (item.name == "extra-file1")
            that.setState({
              logo1: that.state.absoluteUrl + item?.fileUploaded?.split("public")[1],
              link1: item.link,
              id1: item._id
            })
          if (item.name == "extra-file2")
            that.setState({
              logo2: that.state.absoluteUrl + item?.fileUploaded?.split("public")[1],
              link2: item.link,
              id2: item._id
            })
          if (item.name == "extra-file3")
            that.setState({
              logo3: that.state.absoluteUrl + item?.fileUploaded?.split("public")[1],
              link3: item.link,
              id3: item._id
            })
        })
        that.setState({
          GridDataBrands: response.data.result

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
            <div> <Panel header="تصاویر اسلایدر نرم افزار" style={{  textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <div className="row">

                <div className="col-2" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="extra-file1" />
                    <label>تصویر اول اسلایدر</label>
                  </div>

                </div>
                <div className="col-4">
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link1} name="link1" onChange={(e) => this.setState({ link1: e.value })} onBlur={(e) => this.LinkChange(e)} />
                    <label>لینک</label>
                  </div>
                </div>
                <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                  <img src={this.state.logo1} style={{ width: 200 }} />
                  <br /><button className="btn btn-primary yekan" onClick={() => this.deletePic(this.state.id1, 'logo1')} style={{ width: "100px", marginTop: "5px", marginBottom: "5px" }}  >حذف</button>

                </div>
                <div className="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>
                <div className="col-2" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="extra-file2" />
                    <label>تصویر دوم اسلایدر</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link2} name="link2" onChange={(e) => this.setState({ link2: e.value })} onBlur={(e) => this.LinkChange(e)} />
                    <label>لینک</label>
                  </div>
                </div>
                <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                  <img src={this.state.logo2} style={{ width: 200 }} />
                  <br /><button className="btn btn-primary yekan" onClick={() => this.deletePic(this.state.id2, 'logo2')} style={{ width: "100px", marginTop: "5px", marginBottom: "5px" }}  >حذف</button>

                </div>
                <div className="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                <div className="col-2" >
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="extra-file3" />
                    <label>تصویر سوم اسلایدر</label>
                  </div>
                </div>
                <div className="col-4">
                  <div className="group">
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link3} name="link3" onChange={(e) => this.setState({ link3: e.value })} onBlur={(e) => this.LinkChange(e)} />
                    <label>لینک</label>
                  </div>
                </div>
                <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                  <img src={this.state.logo3} style={{ width: 200 }} />
                  <br /><button className="btn btn-primary yekan" onClick={() => this.deletePic(this.state.id3, 'logo3')} style={{ width: "100px", marginTop: "5px", marginBottom: "5px" }}  >حذف</button>

                </div>



              </div>

            </Panel>





            </div>

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
  connect(mapStateToProps)(Pics)
);

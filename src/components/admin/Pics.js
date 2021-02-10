import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
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
    this.TextChange = this.TextChange.bind(this);
    this.SetExtre = this.SetExtre.bind(this);
    this.ShowExtre = this.ShowExtre.bind(this);



  }
  ShowExtre() {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.Server.send("AdminApi/showFiles",
        {
          limit: 200,
          TypeOfFile: that.state.TypeOfFile
        }
        , function (response) {
          that.setState({
            loading: 0,
            GridDataExtra: response.data.result
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
  SetExtre(e) {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.Server.send("AdminApi/setFile",
        {
          TypeOfFile: that.state.TypeOfFile,
          extraImageText: that.state.extraImageText,
          extraImageLink: that.state.extraImageLink
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
  LinkChange(e) {
    let that = this;
    let name = "file" + e.target.name.split("link")[1];
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
  TextChange(e) {
    let that = this;
    let name = "file" + e.target.name.split("text")[1];
    let text = e.target.value
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.Server.send("AdminApi/setPicsText", {
        name: name,
        text: text
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
    formData.append('name', name);
    formData.append('PagePics', "1");
    if (name == "file10") {
      formData.append('ExtraFile', "1");
      formData.append('typeOfFile', this.state.TypeOfFile);
    }
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
        if (name == "file10")
          this.setState({
            extraImageLink: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file1")
          this.setState({
            logo1: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file2")
          this.setState({
            logo2: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file3")
          this.setState({
            logo3: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file4")
          this.setState({
            logo4: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file5")
          this.setState({
            logo5: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file6")
          this.setState({
            logo6: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file7")
          this.setState({
            logo7: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file8")
          this.setState({
            logo8: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file9")
          this.setState({
            logo9: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "file11")
          this.setState({
            logo11: this.state.absoluteUrl + response.data.split("public")[1]
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


          if (item.name == "file1")
            that.setState({
              logo1: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link1: item.link,
              text1: item.text
            })
          if (item.name == "file2")
            that.setState({
              logo2: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link2: item.link,
              text2: item.text
            })
          if (item.name == "file3")
            that.setState({
              logo3: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link3: item.link,
              text3: item.text
            })
          if (item.name == "file4")
            that.setState({
              logo4: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link4: item.link,
              text4: item.text
            })
          if (item.name == "file5")
            that.setState({
              logo5: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link5: item.link,
              text5: item.text
            })
          if (item.name == "file6")
            that.setState({
              logo6: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link6: item.link,
              text6: item.text
            })
          if (item.name == "file7")
            that.setState({
              logo7: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link7: item.link,
              text7: item.text
            })
          if (item.name == "file8")
            that.setState({
              logo8: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link8: item.link,
              text8: item.text
            })
          if (item.name == "file9")
            that.setState({
              logo9: that.state.absoluteUrl + item.fileUploaded.split("public")[1],
              link9: item.link,
              text9: item.text
            })
          if (item.name == "file11")
            that.setState({
              logo11: that.state.absoluteUrl + item.fileUploaded.split("public")[1]
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
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            {!this.state.uploadExtraImage ?
              <div> <Panel header="تصاویر بالای صفحه" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                <form  >
                  <div className="row">

                    <div className="col-2" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file1" />
                        <label>تصویر اول اسلایدر</label>
                      </div>

                    </div>
                    <div className="col-4">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link1} name="link1" onChange={(e) => this.setState({ link1: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                        <label>لینک</label>
                      </div>
                      <div className="group">
                        <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.text1} name="text1" onChange={(e) => this.setState({ text1: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                        <label>متن روی تصویر</label>
                      </div>
                    </div>
                    <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                      <img src={this.state.logo1} style={{ width: 200 }} />
                    </div>
                    <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>
                    <div className="col-2" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file2" />
                        <label>تصویر دوم اسلایدر</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link2} name="link2" onChange={(e) => this.setState({ link2: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                        <label>لینک</label>
                      </div>
                      <div className="group">
                        <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.text2} name="text2" onChange={(e) => this.setState({ text2: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                        <label>متن روی تصویر</label>
                      </div>
                    </div>
                    <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                      <img src={this.state.logo2} style={{ width: 200 }} />
                    </div>
                    <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                    <div className="col-2" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file3" />
                        <label>تصویر سوم اسلایدر</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link3} name="link3" onChange={(e) => this.setState({ link3: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                        <label>لینک</label>
                      </div>
                      <div className="group">
                        <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.text3} name="text3" onChange={(e) => this.setState({ text3: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                        <label>متن روی تصویر</label>
                      </div>
                    </div>
                    <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                      <img src={this.state.logo3} style={{ width: 200 }} />
                    </div>
                    <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                    <div className="col-2" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file4" />
                        <label>تصویر اول سمت چپ</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link4} name="link4" onChange={(e) => this.setState({ link4: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                        <label>لینک</label>
                      </div>
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text4} name="text4" onChange={(e) => this.setState({ text4: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                        <label>متن روی تصویر</label>
                      </div>
                    </div>
                    <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                      <img src={this.state.logo4} style={{ width: 200 }} />
                    </div>
                    <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                    <div className="col-2" >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file5" />
                        <label>تصویر دوم سمت چپ</label>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link5} name="link5" onChange={(e) => this.setState({ link5: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                        <label>لینک</label>
                      </div>
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text5} name="text5" onChange={(e) => this.setState({ text5: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                        <label>متن روی تصویر</label>
                      </div>
                    </div>
                    <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }}  >
                      <img src={this.state.logo5} style={{ width: 200 }} />
                    </div>
                    <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>


                  </div>

                </form>
              </Panel>

                <Panel header="تصاویر بین اسلایدر دوم و حراج روز" style={{ marginTop: 50, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                  <form  >
                    <div className="row">

                      <div className="col-2" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file6" />
                          <label>تصویر اول </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link6} name="link6" onChange={(e) => this.setState({ link6: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                          <label>لینک</label>
                        </div>
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text6} name="text6" onChange={(e) => this.setState({ text6: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                          <label>متن روی تصویر</label>
                        </div>
                      </div>

                      <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                        <img src={this.state.logo6} style={{ width: 200 }} />
                      </div>
                      <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                      <div className="col-2" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file7" />
                          <label>تصویر دوم </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link7} name="link7" onChange={(e) => this.setState({ link7: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                          <label>لینک</label>
                        </div>
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text7} name="text7" onChange={(e) => this.setState({ text7: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                          <label>متن روی تصویر</label>
                        </div>
                      </div>
                      <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }}  >
                        <img src={this.state.logo7} style={{ width: 200 }} />
                      </div>
                      <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                      <div className="col-2" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file8" />
                          <label>تصویر سوم </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link8} name="link8" onChange={(e) => this.setState({ link8: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                          <label>لینک</label>
                        </div>
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text8} name="text8" onChange={(e) => this.setState({ text8: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                          <label>متن روی تصویر</label>
                        </div>
                      </div>
                      <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                        <img src={this.state.logo8} style={{ width: 200 }} />
                      </div>
                      <div class="col-12" style={{ borderTop: '1px solid #c3c3c3' }}><hr /></div>

                      <div className="col-2" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file9" />
                          <label>تصویر چهارم </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.link9} name="link9" onChange={(e) => this.setState({ link9: e.value })} onBlur={(e) => this.LinkChange(e)} required="true" />
                          <label>لینک</label>
                        </div>
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.text9} name="text9" onChange={(e) => this.setState({ text9: e.value })} onBlur={(e) => this.TextChange(e)} required="true" />
                          <label>متن روی تصویر</label>
                        </div>
                      </div>
                      <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                        <img src={this.state.logo9} style={{ width: 200 }} />
                      </div>





                    </div>

                  </form>
                </Panel>

                <Panel header="تصویر شگفت انگیز" style={{ marginTop: 50, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                  <form  >
                    <div className="row">
                      <div className="col-6" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file11" />
                          <label>تصویر  </label>
                        </div>
                      </div>
                      <div className="col-6" style={{ textAlign: 'center', marginTop: 10 }} >
                        <img src={this.state.logo11} style={{ width: 200 }} />
                      </div>




                    </div>

                  </form>
                </Panel>


              </div>
              :
              <div>
                <Panel header="بارگزاری فایل و دریافت لینک" style={{ marginTop: 50, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                  <form  >
                    <div className="row">
                      <div className="col-12" style={{ textAlign: 'right' }}>
                        <RadioButton inputId="TypeOfFile1" name="TypeOfFile" value="1" onChange={(e) => this.setState({ TypeOfFile: e.value, GridDataExtra: [] })} checked={this.state.TypeOfFile === '1'} />
                        <label htmlFor="TypeOfFile1" className="p-checkbox-label yekan"> تصویر </label>
                        <RadioButton inputId="TypeOfFile2" name="TypeOfFile" value="2" onChange={(e) => this.setState({ TypeOfFile: e.value, GridDataExtra: [] })} checked={this.state.TypeOfFile === '2'} />
                        <label htmlFor="TypeOfFile2" className="p-checkbox-label yekan"> فایل </label>
                      </div>
                      <div className="col-2" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file10" />
                          <label>بارگزاری </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div >
                          <label>لینک</label>

                          <input className="form-control yekan" disabled autoComplete="off" type="text" value={this.state.extraImageLink} name="extraImageLink" onChange={(event) => this.setState({ extraImageLink: event.target.value })} required="true" />
                        </div>
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.extraImageText} name="extraImageText" onChange={(event) => this.setState({ extraImageText: event.target.value })} required="true" />
                          <label>عنوان</label>
                        </div>

                      </div>


                      <div className="col-12"  >
                        <Button style={{ marginLeft: 5, marginTop: 10 }} disabled={this.state.extraImageLink ? false : true} color="primary" onClick={this.SetExtre}>ثبت اطلاعات</Button>

                      </div>
                      <div className="col-12" style={{ marginTop: 50 }}>
                        <p style={{ cursor: 'pointer' }} onClick={this.ShowExtre} className="yekan">لیست تصاویر و فایلها موجود در سایت</p>
                      </div>
                    </div>
                  </form>
                </Panel>
                {this.state.GridDataExtra.length > 0 &&
                  <Panel header="لیست تصاویر و فایلها" style={{ marginTop: 50, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                    <DataTable responsive value={this.state.GridDataExtra} selectionMode="single" >
                      <Column field="text" header="عنوان" className="yekan" style={{ textAlign: "center" }} />
                      <Column field="link" header="لینک" className="yekan" style={{ textAlign: "center", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} />
                      <Column field="type" header="نوع" className="yekan" style={{ textAlign: "center" }} />
                    </DataTable>
                  </Panel>
                }
              </div>
            }
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

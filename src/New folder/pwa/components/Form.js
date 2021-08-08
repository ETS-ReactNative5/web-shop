import React, { Component } from 'react';
import { Toast } from 'primereact/toast';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './Server.js'
import { AutoComplete } from 'primereact/autocomplete';
import Header from './Header.js'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { ProgressBar } from 'primereact/progressbar';
import DatePicker from 'react-datepicker2';
import axios from 'axios'

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      loading: 0,
      output: '',
      HiddenFields: [],
      FormNumber: this.props.location ? this.props.location.search.split("number=")[1].split("&")[0] : null,
      FormName: this.props.location ? this.props.location.search.split("name=")[1] : null,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(),
      url2: this.Server.getUrl(1)


    }
    this.SetForm = this.SetForm.bind(this);
    this.toast = React.createRef();
    this.FileUpload = this.FileUpload.bind(this);

  }
  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage', e.target.files[0]);
    formData.append('ExtraFile', 1);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = parseInt((loaded * 100) / total)
        this.setState({
          showLoadedCount: 1,
          disableForm: true,
          loadedCount: percent
        })
        if (percent == "100") {
          this.setState({
            disableForm: false,
            showLoadedCount: 0
          })
        }

      }
    };
    axios.post(this.state.url2 + 'uploadFile', formData, config)
      .then((response) => {
        debugger;
        let stat = [];
        stat[name] = this.state.absoluteUrl + response.data.split("public")[1];
        this.setState(stat)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetFields() {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token"),
      number: this.state.FormNumber
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let FilterIds = [];
      that.setState({
        method: response.data.result[0].method,
        desc: response.data.result[0].desc,
        OkMsg: response.data.result[0].OkMsg,
        FormNumber: that.state.FormNumber
      })
      for (let item of response.data.result[0].Fields) {
        FilterIds.push(item.id);
      }
      that.Server.send("AdminApi/GetFields", { _id: FilterIds }, function (response) {
        let ShowParam = [];
        let ComboParam = [];
        let CodeParam = [];
        let AutoCompleteParam = [];
        let count = 0;
        let HiddenFields = [];

        for (let item of response.data.result) {


          ShowParam.push({ name: item.latinName, type: item.type, required: item.required, title: item.name });
          if (item.type == "2") {
            let def = that.state.Data ? that.state.Data[item.latinName] : item.Default;
            if (def && item.CheckOkFields) {
              for (let j = 0; j < item.CheckOkFields.split(",").length; j++) {
                HiddenFields.push(item.CheckOkFields.split(",")[j])
              }
            }
            if (!def && item.CheckNOkFields) {
              for (let j = 0; j < item.CheckNOkFields.split(",").length; j++) {
                HiddenFields.push(item.CheckNOkFields.split(",")[j])
              }
            }

            that.setState({ [item.latinName]: def })
          }
          if (item.type == "3") {
            ComboParam.push({ DBTableFieldLabel: item.DBTableFieldLabel, DBTableFieldValue: item.DBTableFieldValue, DbTableName: item.DbTableName, FId: item.FId })
          }
          if (item.type == "6") {
            CodeParam.push({ CodeNum: item.CodeNum, FId: item.FId })
          }
          if (item.type == "4") {
            item.index = count;
            AutoCompleteParam.push({ index: count, latinName: item.latinName, DBTableFieldLabel: item.DBTableFieldLabel, DBTableFieldValue: item.DBTableFieldValue, DbTableName: item.DbTableName, FId: item.FId })
            count++;
          }
          if (that.state.Data)
            that.setState({ [item.latinName]: that.state.Data[item.latinName] })

        }
        that.setState({
          loading: 0,
          Fields: response.data.result,
          ShowParam: ShowParam,
          ComboParam: ComboParam,
          CodeParam: CodeParam,
          AutoCompleteParam: AutoCompleteParam,
          HiddenFields: HiddenFields
        })
        if (ComboParam.length > 0)
          that.getCombo();
        else if (CodeParam.length > 0)
          that.getCode();
      }, function (error) {
        that.setState({
          loading: 0
        })
      })



    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFields", param, SCallBack, ECallBack)
  }
  getCombo() {
    let that = this;
    let ComboParam = this.state.ComboParam.pop();
    let param = {
      token: localStorage.getItem("api_token"),
      DBTableFieldLabel: ComboParam.DBTableFieldLabel,
      DBTableFieldValue: ComboParam.DBTableFieldValue,
      DbTableName: ComboParam.DbTableName
    };


    

    let SCallBack = function (response) {
      let x = [];
      for (let i = 0; i < response.data.result.length; i++) {
        x.push({ DBTableFieldLabel: response.data.result[i][ComboParam.DBTableFieldLabel], DBTableFieldValue: response.data.result[i][ComboParam.DBTableFieldValue] });
      }
      for (let item of that.state.Fields) {
        if (item.FId == ComboParam.FId) {
          item.Combo = x
        }
      }
      that.setState({
        Fields: that.state.Fields,
        loading: 0
      })
      that.getCode();


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/GetCombo", param, SCallBack, ECallBack)
  }
  getCode() {
    let that = this;
    let CodeParam = [];
    let ids = [];
    for (let i = 0; i < this.state.CodeParam.length; i++) {
      ids.push(this.state.CodeParam[i].CodeNum)
      CodeParam.push({ CodeNum: this.state.CodeParam[i].CodeNum, FId: this.state.CodeParam[i].FId });

    }
    let param = {
      id: ids
    };

    
    let SCallBack = function (response) {
      let C = [];
      for (let i = 0; i < response.data.result.length; i++) {
        C.push({ id: response.data.result[i].id, values: response.data.result[i].values, MultiSelect: response.data.result[i].MultiSelect });
      }
      for (let item of that.state.Fields) {
        if (item.type == "6") {
          for (let i = 0; i < CodeParam.length; i++) {
            if (item.FId == CodeParam[i].FId) {
              for (let c of C) {
                if (c.id == item.CodeNum)
                  item.Code = c;

              }
            }
          }
        }


      }

      that.setState({
        Fields: that.state.Fields,
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
  SetForm() {
    let that = this;
    if (this.state.loading)
      return;
    this.setState({
      output: ''
    })
    let param = { Edit: this.state.ForEdit, RaymandUsername: this.props.username, mobileInRaymand: this.props.mobile };
    for (let item of this.state.ShowParam) {
      if (item.required && (!this.state[item.name] || this.state[item.name] == "")) {
        this.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium"><span> ثبت {item.title} اجباری است</span></div>, life: 4000 });
        return;
      }/*
      if(item.type == "5" && this.state[item.name]){
        param[item.name]=this.state[item.name].local("fa").format("jYYYY/jM/jD");

      }*/else if (item.type == "4") {
        param[item.name.split("_")[0]] = this.state[item.name + "_val"];
      } else {
        param[item.name] = this.state[item.name];
      }
    }

    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      if (!response.data.error) {
        that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium"><span>{response.data.result}</span> <br /> <span>{that.state.OkMsg}</span></div>, life: 40000 });

      } else {
        that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium"><span>{response.data.result}</span> </div>, life: 40000 });

      }

      that.setState({
        loading: 0
      })
      debugger;

      if (that.props.callback) {
        that.props.callback()
      }



    };
    let ECallBack = function (error) {

      that.setState({
        loading: 0
      })
    }
    this.Server.send("MainApi/" + this.state.method, param, SCallBack, ECallBack)
  }
  componentDidMount() {
    let FormNumber = this.state.FormNumber,
      FormName = this.state.FormName;
    if (!this.state.FormNumber)
      FormNumber = this.props.number;
    if (!this.state.FormName)
      FormName = this.props.name;
    this.setState({
      FormName: FormName,
      FormNumber: FormNumber
    })

    this.init(FormNumber);
  }
  init(number) {

    let that = this;
    let param = {
      number: number || this.state.FormNumber,
    };
    this.setState({
      output: '',
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        ForEdit: response.data.result[0].ForEdit,
        Key: response.data.result[0].ForEdit ? response.data.result[0].Key : null,
        EditMethod: response.data.result[0].ForEdit ? response.data.result[0].method2 : null
      })
      if (!response.data.result[0].ForEdit)
        that.GetFields();
      else
        that.Search();


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetForms", param, SCallBack, ECallBack)
  }
  Search() {
    let that = this;
    let param = {
      Key: this.state.Key,
      number: this.state.FormNumber,
      username: this.props.username,
      ip: this.props.ip,
      account: this.props.account,
      place: this.props.place,
      mobile: this.props.mobile
    };

    let SCallBack = function (response) {
      that.setState({
        Data: response.data.result[0]
      })
      that.GetFields();

    };

    let ECallBack = function (error) {

    }
    that.Server.send("MainApi/" + this.state.EditMethod, param, SCallBack, ECallBack)
  }
  getMainShopInfo() {
    let that = this;
    let param = {
      main: true
    };

    let SCallBack = function (response) {
      that.setState({
        MainShopInfo: response.data.result
      })

    };

    let ECallBack = function (error) {

    }
    that.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
  }
  onSelect(event) {
    let latinName = this.state.AutoCompleteParam[this.state.AutoCompleteIndex].latinName;
    this.setState({ [latinName]: event.value.name, [latinName + "_val"]: event.value._id })
  }


  suggestBrands(event) {
    let f = this.state.AutoCompleteParam[this.state.AutoCompleteIndex];
    let that = this;
    this.setState({ brand: event.query, Count: 0 });
    let param = {
      title: event.query,
      table: f.DbTableName,
      name: f.latinName.split("_")[1]
    };
    let SCallBack = function (response) {
      let brandSuggestions = [];
      response.data.result.reverse().map(function (v, i) {
        brandSuggestions.push({ _id: v[f.DBTableFieldValue], name: v[f.DBTableFieldLabel] })
      })
      that.setState({ brandSuggestions: brandSuggestions });
    };

    let ECallBack = function (error) {

    }
    that.Server.send("ReportApi/searchItems", param, SCallBack, ECallBack)


  }
  itemTemplate(brand) {
    return (
      <div className="p-clearfix" style={{ direction: 'rtl', maxWidth: '100%' }} >
        <div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >
          <div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>
            <span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _id={brand._id} >
              <span style={{ whiteSpace: 'pre-wrap' }} _id={brand._id}>{brand.name}</span><br />
            </span>
          </div>

        </div>
      </div>
    );
  }
  componentWillReceiveProps(nextProps) {
    this.init();
  }
  render() {

    return (
      <div >
        {!this.props.NoHeader &&
          <Header ComponentName={this.state.FormName} close="1" />
        }
        <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />

        {!this.state.loading ?
          <div className="row justify-content-center" style={{ direction: 'rtl' }}>
            {this.state.showLoadedCount > 0 &&
              <ProgressBar value={this.state.loadedCount} />
            }
            <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
              <p style={{ fontFamily: 'YekanBakhFaMedium', padding: 10, whiteSpace: 'pre-wrap' }}>
                {this.state.desc}
              </p>

              <div className="row" style={{ alignItems: 'baseline' }}>
                {this.state.Fields && this.state.Fields.map((item, index) => {
                  if (item.type == "1" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div style={{ padding: 8, display: item.hidden ? "none" : "block" }}>
                        <div floatingLabel>
                          <div style={{ fontFamily: 'YekanBakhFaMedium' }} >{item.name}</div>
                          <InputText value={this.state[item.latinName]} disabled={item.readOnly} keyboardType="number-pad" name={item.latinName} onChange={(event) => {
                            let value = event.target.value;
                            if (item.Separator) {
                              value = event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                            this.setState({ [item.latinName]: value })
                          }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />
                        </div>

                      </div>
                    )
                  }
                  if (item.type == "2" && this.state.HiddenFields.indexOf(item.FId) == -1) {

                    return (
                      <div className="col-12 col-lg-3" style={{ padding: 8, display: item.hidden ? "none" : "block" }}>
                        <div style={{ display: 'flex' }} >
                          <Checkbox inputId={item.latinName} disabled={item.readOnly} value={item.latinName} checked={this.state[item.latinName]} onChange={(event) => {
                            let HiddenFields = [];
                            let OldHiddenFields = this.state.HiddenFields;
                            if (event.checked) {
                              if (item.CheckOkFields) {
                                HiddenFields = item.CheckOkFields.split(",")
                              }
                              if (item.CheckNOkFields) {
                                for (let i = 0; i < OldHiddenFields.length; i++) {
                                  if (item.CheckNOkFields.split(",").indexOf(OldHiddenFields[i]) != -1)
                                    OldHiddenFields.splice(i, 1);
                                }
                              }


                            }
                            if (!event.checked) {
                              if (item.CheckNOkFields) {
                                HiddenFields = item.CheckNOkFields.split(",")
                              }
                              if (item.CheckOkFields) {
                                for (let i = 0; i < OldHiddenFields.length; i++) {
                                  if (item.CheckOkFields.split(",").indexOf(OldHiddenFields[i]) != -1)
                                    OldHiddenFields.splice(i, 1);
                                }
                              }
                            }
                            for (let i = 0; i < OldHiddenFields.length; i++) {
                              HiddenFields.push(OldHiddenFields[i]);
                            }
                            this.setState({ [item.latinName]: event.checked, HiddenFields: HiddenFields }

                            )
                          }} ></Checkbox>

                          <label htmlFor={item.latinName} className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{item.name}</label>
                        </div>
                      </div>
                    )
                  }
                  if (item.type == "3" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div className="col-12 col-lg-3" style={{ textAlign: 'right', marginBottom: 20, marginTop: 20, display: item.hidden ? "none" : "block" }}>

                        <select style={{ width: '100%', height: 40 }} disabled={item.readOnly} placeholder={item.name} className="form-control YekanBakhFaMedium" id={item.latinName} name={item.latinName} value={this.state[item.latinName]} onChange={(event) => { this.setState({ [item.latinName]: event.target.value }) }} >
                          return(
                        <option value="" >{item.name}</option>
                      )
                      {item.Combo && item.Combo.map(function (item, index) {
                          return (
                            <option className="YekanBakhFaMedium" value={item.DBTableFieldValue} >{item.DBTableFieldLabel}</option>
                          )
                        })
                          }
                        </select>

                      </div>
                    )
                  }
                  if (item.type == "4" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div className="col-12 col-lg-3" style={{ display: item.hidden ? "none" : "block" }}>
                        <div className="group" >
                          <AutoComplete placeholder={item.name} disabled={item.readOnly} style={{ width: '100%' }} onChange={(event) => { this.setState({ [item.latinName]: event.value, AutoCompleteIndex: item.index, [item.latinName + "_val"]: '' }) }} itemTemplate={this.itemTemplate.bind(this)} value={this.state[item.latinName]} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />

                        </div>
                      </div>
                    )
                  }
                  if (item.type == "5" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div style={{ padding: 8, display: item.hidden ? "none" : "block" }}>
                        <div floatingLabel>
                          <div style={{ fontFamily: 'YekanBakhFaMedium' }} >{item.name}</div>
                          <InputText placeholder="1400/00/00" disabled={item.readOnly} value={this.state[item.latinName]} keyboardType="number-pad" name={item.latinName} onChange={(event) => {
                            let value = event.target.value;
                            if (item.Separator) {
                              value = event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                            this.setState({ [item.latinName]: value })
                          }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />
                        </div>

                      </div>

                    )
                  }
                  if (item.type == "6" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div className="col-12 col-lg-3" style={{ textAlign: 'right', marginBottom: 20, marginTop: 20, padding: 8, display: item.hidden ? "none" : "block" }}>

                        <select disabled={item.readOnly} style={{ width: '100%', height: 40 }} placeholder={item.name} className="form-control YekanBakhFaMedium" id={item.latinName} name={item.latinName} value={this.state[item.latinName]} onChange={(event) => { this.setState({ [item.latinName]: event.target.value }) }} >
                          return(
                          <option value="" >{item.name}</option>
                        )
                        {item.Code && item.Code && item.Code.values && item.Code.values.map(function (item, index) {

                          return (
                            <option className="YekanBakhFaMedium" value={item.value} >{item.desc}</option>
                          )
                        })
                          }
                        </select>

                      </div>
                    )
                  }

                  if (item.type == "7" && this.state.HiddenFields.indexOf(item.FId) == -1) {
                    return (
                      <div style={{ padding: 8, display: item.hidden ? "none" : "block" }}>
                        <div floatingLabel>
                          <div style={{ fontFamily: 'YekanBakhFaMedium' }} >{item.name}</div>
                          <InputText  disabled={item.readOnly}  id={item.latinName} name={item.latinName} onChange={this.FileUpload} type="file" style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />
                        </div>

                      </div>
                    )
                  }



                })}

              </div>
              <div className="row" style={{ marginTop: 50, textAlign: 'center' }}>
                <div className="col-lg-3 col-12">
                  {!this.state.loading &&
                    <Button disabled={this.state.ForEdit && !this.state.Data} info rounded style={{ marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10, width: '80%', textAlign: 'center' }} onClick={this.SetForm}>
                      {this.state.ForEdit && !this.state.Data ?
                        <span style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, width: '100%' }}>در حال حاضر امکان ثبت فرم جدید وجود ندارد</span>
                        :
                        <span style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, width: '100%' }}>ارسال فرم</span>
                      }
                    </Button>
                  }
                </div>

              </div>

              <div style={{ fontFamily: 'YekanBakhFaMedium', fontSize: 15, textAlign: 'center', marginTop: 15 }} >
                {this.state.output}
              </div>

            </div>

          </div>
          :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <ProgressSpinner style={{ paddingTop: 150 }} />
          </div>
        }

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    username: state.username,
    password: state.password,
    ip: state.ip,
    account: state.account,
    place: state.place,
    fullname: state.fullname,
    mobile: state.mobile
  }
}
export default connect(mapStateToProps)(Form)

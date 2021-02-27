import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { connect } from 'react-redux';
import 'react-persian-calendar-date-picker/lib/DatePicker.css';
import moment from 'moment-jalaali';
import { Alert } from 'rsuite';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import DatePicker from 'react-datepicker2';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Loader } from 'rsuite';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { MultiSelect } from 'primereact/multiselect';

class AdminProduct extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      username: null,
      CatsChoosen: '',
      setCategory: 'ایجاد',
      CategoryList: [],
      CategoryOrder: '',
      CategoryId: "",
      Spec: [],
      SelectedSpecs: [],
      InsertSpec:1,
      EditSpec:0,
      DelSpec:0,
      CodeFile:[],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)

    }
    this.DeleteCategory = this.DeleteCategory.bind(this);

    this.ChangeSpecsCheckBoxs = this.ChangeSpecsCheckBoxs.bind(this);

    this.onClick = this.onClick.bind(this);

    this.FileUpload = this.FileUpload.bind(this);

    this.handleChangeChooseCategory = this.handleChangeChooseCategory.bind(this);
    this.handleChangeChooseCategoryForEdit = this.handleChangeChooseCategoryForEdit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeCategoryOrder = this.handleChangeCategoryOrder.bind(this);

    this.setCategory = this.setCategory.bind(this);



  }
  getMainShopInfo() {
    let that = this;
    let param = {
      main: true
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        ShopInfo: response.data.result
      })
      that.setState({
        loading: 0
      })
      that.getCodes("3")
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/ShopInformation", { UserId: that.state.SellerId }, SCallBack, ECallBack)
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
      that.GetSpecifications("All")
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/GetCodes", { id: id }, SCallBack, ECallBack)
  }
  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage', e.target.files[0]);
    if (this.state.currentId) {
      formData.append('id', this.state.currentId);
      formData.append('pic', this.state.currentImage);
    }
    /*if(this.state.ShopInfo[0] && this.state.ShopInfo[0].logoCopyRight)
      formData.append('AddLogo',this.state.absoluteUrl+this.state.ShopInfo[0].logoCopyRight.split("public")[1]);*/
    if (name == "CatPic") {
      formData.append('CatId', this.state.CategoryId);

    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(this.state.url + 'uploadFile', formData, config)
      .then((response) => {
        if (name == "picFile") {
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
        }
        if (name == "file")
          this.setState({
            fileUploaded: response.data
          })
        if (name == "file1")
          this.setState({
            fileUploaded1: response.data
          })
        if (name == "file2")
          this.setState({
            fileUploaded2: response.data
          })
        if (name == "file3")
          this.setState({
            fileUploaded3: response.data
          })
        if (name == "file4")
          this.setState({
            fileUploaded4: response.data
          })
        if (name == "CatPic")
          this.setState({
            CatPicPreview: this.state.absoluteUrl + response.data.split("public")[1]
          })

        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
        loading: 0,
        SellerId: response.data.authData.shopId
      })
      that.setState({
        loading: 0
      })
      that.GetCategory();
      that.setState({
        loading: 0
      })


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      //Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  onClick(event) {
    this.setState({ visible: true });
  }
  roundPrice(price) {
    price = parseInt(price).toString();
    let C = "500";
    let S = 3;
    if (price.length <= 4) {
      C = "100";
      S = 2;
    }
    if (price.length <= 4) {
      C = "100";
      S = 2;
    }
    let A = price.substr(price.length - S, S)
    if (A == C || A == "000" || A == "00")
      return price;
    if (parseInt(A) > parseInt(C)) {
      let B = parseInt(A) - parseInt(C);
      return (parseInt(price) - B + parseInt(C)).toString();
    } else {
      let B = parseInt(C) - parseInt(A);
      return (parseInt(price) + B).toString();
    }


  }

  handleChangeChooseCategory(event) {
    this.setState({ CatsChoosen: event.target.value });
  }
  handleChangeChooseCategoryForEdit(event) {
    this.setState({ CatsChoosen_edit: event.target.value });
    if (event.target.value != "0") {
      document.getElementById("DeleteCategory").style.display = "inline";
      debugger;
      this.setState(
        {
          CategoryOrder: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].order || '',
          showInSite: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].showInSite || false,
          setCategory: "ویرایش",
          Category: event.nativeEvent.target[event.nativeEvent.target.selectedIndex].text,
          CategoryId: event.target.value,
          ParentCat: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].Parent || '',
          CatPicPreview: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].pic ? this.state.absoluteUrl + this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].pic.split("public")[1] : this.state.absoluteUrl + '/nophoto.png',
          SelectedSpecs: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].Spec ? this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].Spec : [],
          SendToCity: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].SendToCity || '',
          SendToNearCity: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].SendToNearCity || '',
          SendToState: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].SendToState || '',
          SendToCountry: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].SendToCountry || '',
          MergeableInPeyk: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].MergeableInPeyk || '',
          CumputeByNumberInPeyk: this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].CumputeByNumberInPeyk || '',
        }
      );
      let state={}
      for(let code of this.state.CodeFile)
      {
        state[code.Etitle] = this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1][code.Etitle];
      }
      this.setState({
        showSpecs: false,
        ...state
      })
      this.GetSpecifications(this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].Spec ? this.state.CategoryList[event.nativeEvent.target.selectedIndex - 1].Spec : [])

    } else {
      document.getElementById("DeleteCategory").style.display = "none";
      this.setState({
        setCategory: "ایجاد",
        Category: "",
        CategoryId: "",
        showInSite: false,
        ParentCat: ''
      });
    }
  }
  handleChangeCategory(event) {
    this.setState({ Category: event.target.value });
  }
  handleChangeCategoryOrder(event) {
    this.setState({ CategoryOrder: event.target.value });

  }

  DeleteCategory(event) {
    let that = this;
    let param = {
      Category: "",
      id: this.state.CategoryId,
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {

      this.GetCategory();
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/setCategory", param, SCallBack, ECallBack)

    event.preventDefault();
  }

  setCategory(GetSpecs) {
    let param = {
      Category: this.state.Category,
      id: this.state.CategoryId,
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId,
      ParentCat: this.state.ParentCat,
      CategoryOrder: this.state.CategoryOrder,
      showInSite: this.state.showInSite,
      pic: this.state.CatPic,
      Spec: this.state.SelectedSpecs,
      CodeFile:this.state.CodeFile
    };
    for(let code of this.state.CodeFile)
    {
      param[code.Etitle] = this.state[code.Etitle];
    }
    this.setState({
      loading: 1
    })
    let that = this;
    let SCallBack = function (response) {
      if (response.data.result.insertedCount)
        that.GetCategory(response);
        
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })
      if (GetSpecs) {

        that.GetSpecifications("All", that.state.SelectedSpecs)

      }
    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/setCategory", param, SCallBack, ECallBack)
  }
  setPeykSettings() {
    let param = {
      CategoryId: this.state.CategoryId,
      SendToCity: this.state.SendToCity,
      SendToNearCity: this.state.SendToNearCity,
      SendToState: this.state.SendToState,
      SendToCountry: this.state.SendToCountry,
      MergeableInPeyk: this.state.MergeableInPeyk,
      CumputeByNumberInPeyk: this.state.CumputeByNumberInPeyk
    };
    this.setState({
      loading: 1
    })
    let that = this;
    let SCallBack = function (response) {

      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/setCatPeykSettings", param, SCallBack, ECallBack)
  }
  setSpec(event) {
    let param = {
      title: this.state.NewLabel,
      _id: (this.state.DelSpec || this.state.EditSpec) ? parseInt(this.state.NewId) : this.state.LastId,
      DelSpec: this.state.DelSpec,
      EditSpec: this.state.EditSpec,
      InsertSpec: this.state.InsertSpec
    };
    this.setState({
      loading: 1,
      showSpecs: false
    })
    let that = this;
    let SCallBack = function (response) {

      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading: 0
      })
      that.state.SelectedSpecs.push(that.state.LastId);
      that.GetSpecifications("All", that.state.SelectedSpecs)

      //if (!that.state.DelSpec)
      //  that.setCategory(1)
    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/SetSpecifications", param, SCallBack, ECallBack)
  }
  GetSpecifications(All, SelectedSpecs,Edit) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Spec: All
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      var Spec = [];
      let ids = [];
      if(Edit){
        that.setState({
          NewLabel: response.data.result[0]?.title,
          loading: 0
        })
        return;
      }
      response.data.result.map(function (v, i) {
        Spec[i] = { id: v._id, title: v.title };
        ids.push(v._id)
      })
      if (All == "All") {
        that.setState({
          LastId: ids.length > 0 ? (Math.max(...ids) + 1) : 1,
        })
      }

      that.setState({
        Spec: Spec,
        GridDataComponents: response.data.result
      })
      that.setState({
        loading: 0
      })
      if (SelectedSpecs) {
        debugger;
        that.setState({
          showSpecs: false
        })
        that.GetSpecifications(SelectedSpecs)
      } else {
        that.setState({
          showSpecs: true
        })
      }
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetSpecifications", param, SCallBack, ECallBack)
  }
  GetCategory() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      SellerId: this.state.SellerId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        CategoryList: response.data.result
      })
      that.setState({
        loading: 0
      })
      that.getMainShopInfo()


    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetCategory", param, SCallBack, ECallBack)



  }
  ChangeSpecsCheckBoxs(e) {
    let SelectedSpecs = this.state.SelectedSpecs;
    if (e.checked)
      SelectedSpecs.push(e.value);
    else
      SelectedSpecs.splice(SelectedSpecs.indexOf(e.value), 1);

    this.setState({
      SelectedSpecs: SelectedSpecs
    })
  }
  render() {

    return (

      <div className="row">
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }

        <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>



          <div className="row" >
            <div className="col-lg-9 col-md-12 col-12" style={{ padding: 10 }}>
              <Fieldset legend="مدیریت دسته بندی ها" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>


                <form onSubmit={this.setCategory} >
                  <select className="custom-select yekan" value={this.state.ChooseCategoryForEdit} name="status" onChange={this.handleChangeChooseCategoryForEdit} >
                    <option value="0" selected="">برای اصلاح دسته بندی انتخاب کنید</option>
                    {

                      this.state.CategoryList.map((v, i) => {
                        return (<option value={v._id} >{v.name}</option>)
                      })


                    }
                  </select>

                  <div className="group">
                    <i className="far fa-trash-alt" id="DeleteCategory" style={{ cursor: "pointer", display: "none" }} onClick={this.DeleteCategory}></i>
                    <input className="form-control yekan" autoComplete="off" type="text" value={this.state.Category} name="Category" onChange={this.handleChangeCategory} required="true" />
                    <label>دسته بندی</label>
                  </div>
                  {this.state.Category &&
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.CategoryOrder} name="CategoryOrder" onChange={this.handleChangeCategoryOrder} required="true" />
                      <label> ترتیب نمایش  </label>
                    </div>
                  }
                  <div className="col-lg-12" >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox inputId="laon" value={this.state.showInSite} checked={this.state.showInSite} onChange={e => this.setState({ showInSite: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>نمایش در صفحه اول سایت</label>
                    </div>
                  </div>
                  {this.state.CategoryId &&
                    <div className="col-lg-6" style={{ paddingRight: 7, marginTop: 20 }}>
                      <div style={{ textAlign: 'right' }}>
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="CatPic" />
                      </div>
                    </div>
                  }{this.state.CategoryId &&
                    <div className="col-lg-6" style={{ marginTop: 20 }}>
                      <img src={this.state.CatPicPreview} style={{ width: 150, height: 150 }} />
                    </div>

                  }
                  {this.state.CategoryId && this.state.CodeFile.map((v, i) => {
                    
                      return(
                        <div className="col-lg-12" style={{ marginBottom: 20 }}>
                          <p className="yekan" style={{ textAlign: "right", marginTop: 20, paddingRight: 10 }}>{v.title}</p>
                          <MultiSelect value={this.state[v.Etitle]} optionLabel="desc" style={{width:'100%'}} optionValue="value" options={v.values} onChange={(event) => { this.setState({ [v.Etitle]: event.value }) }} />
                          
                        </div>
                      )
                  })}
                  
                  <div className="col-lg-12" style={{ marginBottom: 20 }}>
                    <p className="yekan" style={{ textAlign: "right", marginTop: 20, paddingRight: 10 }}>این دسته بندی زیر مجموعه دسته زیر است</p>
                    <select className="custom-select yekan" value={this.state.ParentCat} name="ParentCat" onChange={(e) => this.setState({ ParentCat: e.target.value })} >
                      <option value="" selected=""></option>

                      {

                        this.state.CategoryList.map((v, i) => {
                          if (this.state.CategoryId != v._id)
                            return (<option value={v._id} >{v.name}</option>)
                        })


                      }
                    </select>
                  </div>
                  <div>
                    {this.state.CategoryId && this.state.showSpecs &&
                      <div className="row">

                        <div className="col-lg-12">
                          <div className="row" >
                            {
                              this.state.Spec && this.state.Spec.map((v, i) => {
                                let id = "cb" + v.id;
                                return (
                                  <div className="col-lg-4 " style={{ textAlign: 'right' }}>
                                    <Checkbox inputId={id} value={v.id} style={{ verticalAlign: 'text-bottom' }} onChange={this.ChangeSpecsCheckBoxs} checked={this.state.SelectedSpecs.indexOf(v.id) !== -1}></Checkbox>
                                    <label htmlFor={id} className="irsans">{v.title}({v.id})</label>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>



                      </div>
                    }
                  </div>

                  <input className="form-control yekan" autoComplete="off" type="hidden" value={this.state.CategoryId} name="CategoryId" required="true" />

                  <button className="btn btn-primary yekan" type="button" onClick={() => { this.setCategory() }} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }} >{this.state.setCategory}</button>

                </form>
              </Fieldset>



              <Fieldset legend="اضافه کردن / حذف جزئیات فنی" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>

                <div className="row" >
                  <div className="col-lg-12">
                  </div>
                  <div className="col-lg-12">
                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox inputId="laon" value={this.state.DelSpec} checked={this.state.DelSpec} onChange={e => this.setState({ DelSpec: e.checked,EditSpec:0,InsertSpec:0 })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>حذف</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox inputId="laon" value={this.state.EditSpec} checked={this.state.EditSpec} onChange={e => this.setState({ EditSpec: e.checked,DelSpec:0,InsertSpec:0 })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>ویرایش</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox inputId="laon" value={this.state.InsertSpec} checked={this.state.InsertSpec} onChange={e => this.setState({ InsertSpec: e.checked,DelSpec:0,EditSpec:0 })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>ایجاد</label>
                    </div>
                    </div>
                    
                    <div className="row" >
                    {(this.state.DelSpec == 1 || this.state.EditSpec == 1) &&
                      <div className="col-12" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.NewId} name="NewId" onChange={e => {
                            this.setState({ NewId: e.target.value,NewLabel:'' })

                            this.GetSpecifications([parseInt(e.target.value)],null,1)
                          }
                          } required="true" />
                          <label>شناسه   </label>
                        </div>
                      </div>
                    }
                      {(this.state.EditSpec == 1 || this.state.InsertSpec ==1) &&
                      <div className="col-12" >
                        <div className="group">
                          <input className="form-control yekan" autoComplete="off" type="text" value={this.state.NewLabel} name="NewLabel" onChange={e => this.setState({ NewLabel: e.target.value })} required="true" />
                          <label>عنوان  </label>
                        </div>
                      </div>
                      }
                      <div className="col-12" >
                        <button className="btn btn-primary yekan" type="button" onClick={() => { this.setSpec() }} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }} >اعمال تغییرات</button>

                      </div>



                    </div>
                  </div>
                </div>
              </Fieldset>
              <Fieldset legend="هزینه پیک" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>

                <div className="row" >

                  <div className="col-lg-3">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SendToCity} name="SendToCity" onChange={e => this.setState({ SendToCity: e.target.value })} required="true" />
                      <label> درون شهری </label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SendToNearCity} name="SendToNearCity" onChange={e => this.setState({ SendToNearCity: e.target.value })} required="true" />
                      <label> شهرهای مجاور </label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SendToState} name="SendToState" onChange={e => this.setState({ SendToState: e.target.value })} required="true" />
                      <label> استانی </label>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.SendToCountry} name="SendToCountry" onChange={e => this.setState({ SendToCountry: e.target.value })} required="true" />
                      <label> سراسری </label>
                    </div>
                  </div>
                  <div className="col-lg-12 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox onChange={e => this.setState({ MergeableInPeyk: e.checked })} checked={this.state.MergeableInPeyk}></Checkbox>
                    <label style={{ paddingRight: 5, marginTop: 5 }}>قابل ادغام</label>
                  </div>
                  <div className="col-lg-12 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox onChange={e => this.setState({ CumputeByNumberInPeyk: e.checked })} checked={this.state.CumputeByNumberInPeyk}></Checkbox>
                    <label style={{ paddingRight: 5, marginTop: 5 }}>محاسبه ضریب تعداد</label>
                  </div>
                  <div className="col-lg-12">

                    <button className="btn btn-primary yekan" type="button" onClick={() => { this.setPeykSettings() }} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }} >اعمال تغییرات</button>




                  </div>
                </div>
              </Fieldset>
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
  connect(mapStateToProps)(AdminProduct)
);

import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header1 from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { PanelMenu } from 'primereact/panelmenu';
import { TabMenu } from 'primereact/tabmenu';
import { ProgressSpinner } from 'primereact/progressspinner';
import Footer from './Footer.js'
import Header2 from './Header2.js'
import { DataTable } from 'primereact/datatable';
import './User.css'
import { Alert } from 'rsuite';
import { Link } from 'react-router-dom'
import Cities from './Cities.js'


import Mapir from "mapir-react-component";
let markerArray=new Array(),lat,lon;

const Api_Code="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIn0.eyJhdWQiOiIxMTY2NCIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIiwiaWF0IjoxNjA2NjQyOTU4LCJuYmYiOjE2MDY2NDI5NTgsImV4cCI6MTYwOTE0ODU1OCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.VSdlmcGeLgctdaKhNHycuQjk3AZoPovTnREv40kb5bQDBxRXSoXHhxNbQCLEAO6lLWE61Db2RMpT7KBK1gzsP0EWy4u6-19Ya9OJO39sGABrvEYmkIJ9k0MSdBvZCI8Uz9kLdmoU8Osfk31dMJY6Bo__KjK72kdzB7fuhMWskVvB_X7V_EgXu4ex_1rj79GtZc54qjw08trxHZ4MnCUu3-FUVhxHmeC9Qw85i1q-cvF8oFcU7WHD3AhrcnDt59DO-Qk9DXdxEENHIREdtw5KtzCkDlst8eK8tA-sNQ6d9VR06lIJH5IbXvYcDPb02oO8clAFiIDROBgUSUmrSso4cA";

const Maps = Mapir.setToken({
  transformRequest: (url) => {
      return {
          url: url,
          headers: { 
            'x-api-key': Api_Code, //Mapir api key
            'Mapir-SDK': 'reactjs'        
          },
      }
  }
});
class User extends React.Component {

  constructor(props) {
    super(props);
    this.Server = new Server();
    this.GetFactors = this.GetFactors.bind(this);
    this.selectedFactorChange = this.selectedFactorChange.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
    this.itemTemplatePayment = this.itemTemplatePayment.bind(this);
    this.reverseFunction = this.reverseFunction.bind(this);
    this.EditMap = this.EditMap.bind(this);

    this.onHide = this.onHide.bind(this);
    this.state = {
      id: null,
      GridDataFactors: [],
      layout: 'list',
      newStatus: null,
      SelectedCity:"-1",
			SelectedSubCity:"-1",
      ActiveLi: this.props.location.search.split("Active=")[1]||3,
      PayActiveLi:1,
      selectedFactor: null,
      GridDataPayment: [],
      username: null,
      newPassword: null,
      newPassword2: null,
      oldPassword: null,
      name: null,
      address: null,
      logout: false,
      mail: null,
      company: null,
      sidebarOpen: true,
      visible: false,
      activeItem: 0,
      loading: 0,
      levelName: "",
      FactorActiveLi: 1,
      markerArray: [],
      lat: 35.72,
      lon: 51.42,
      PanelVisible: 'edit',
      MenuModel: [
        { label: 'ویرایش مشخصات', icon: 'pi pi-fw pi-pencil', className: 'YekanBakhFaBold', type: 'edit' },
        { label: 'سفارشات در حال پردازش', icon: 'pi pi-fw pi-home', className: 'YekanBakhFaBold', type: 'progress' },
        { label: 'سفارشات تحویل داده شده', icon: 'pi pi-fw pi-calendar', className: 'YekanBakhFaBold', type: 'done' },
        { label: 'سفارشات لغو شده', icon: 'pi pi-fw pi-file', className: 'YekanBakhFaBold', type: 'cancel' },
        { label: 'گزارش تراکنشها', icon: 'pi pi-fw pi-cog', className: 'YekanBakhFaBold', type: 'pay' }/*,
              {label: 'سایر', icon: 'pi pi-fw pi-cog',className:'YekanBakhFaBold',type:'SideBar'}*/
      ],
      url: this.Server.getUrl(),
      absoluteUrl: this.Server.getAbsoluteUrl(),
      fromCart: window.location.hash.indexOf("fromCart=1") > -1 ? "1" : "0"

    }

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {


      })
      .catch(error => {
        this.setState({
          logout: true
        })
        //Alert.error('عملیات انجام نشد', 2500);
      })
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeoldPassword = this.handleChangeoldPassword.bind(this);
    this.handleChangenewPassword = this.handleChangenewPassword.bind(this);
    this.handleChangenewPassword2 = this.handleChangenewPassword2.bind(this);

    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeMail = this.handleChangeMail.bind(this);
    this.handleChangeCompany = this.handleChangeCompany.bind(this);
    this.Edituser = this.Edituser.bind(this);
    this.changePass = this.changePass.bind(this);


  }
  EditMap(){
    let that = this;
      let param={
        token: localStorage.getItem("api_token_admin"),
        username:this.state.username,
        address:this.state.Address + (this.state.Pelak ? "  پلاک  " + this.state.Pelak : "") + (this.state.CodePosti  ? "  کد پستی  " + this.state.CodePosti : "") ,
        MyAccount:"1",
        level:"0",
        inMap:1
      };
      let SCallBack = function(response){
        that.setState({
          GotoUser:true
        })
        Alert.success('عملیات با موفقیت انجام شد', 2500);
      };
      let ECallBack = function(error){
        Alert.error('عملیات انجام نشد', 2500);
       
        console.log(error)
      }
      this.Server.send("AdminApi/ManageUsers",param,SCallBack,ECallBack)
  }
  reverseFunction(map, e) {
    var url = `https://map.ir/reverse/no?lat=${e.lngLat.lat}&lon=${e.lngLat.lng}`
    fetch(url,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Api_Code
        }
      })
      .then(response => response.json())
      .then(data => { 

        
        this.setState({
          address:data.address
        })
        Alert.warning('برای ثبت نهایی آدرس دکمه ویرایش اطلاعات را کلیک کنید',5000);
        
        console.log(data) 
      
      
      
      })
      const array = [];
      array.push(<Mapir.Marker
        coordinates={[e.lngLat.lng, e.lngLat.lat]}
        anchor="bottom">
      </Mapir.Marker>);
      markerArray=array;
      lat= e.lngLat.lat;
      lon= e.lngLat.lng ;

  }
  getResponse(value){
    this.setState({
      SelectedCity:value.SelectedCity,
      SelectedSubCity:value.SelectedSubCity
    })
  }
  itemTemplate(car, layout) {
    if (layout === 'list' && car && car.products[0]) {
      let pic = (car.products[0].fileUploaded && car.products[0].fileUploaded.split("public")[1]) ? this.state.absoluteUrl + car.products[0].fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
      let rowPrice = car.price//car.products[0].getFromCredit ? car.products[0].price : (car.products[0].price - (car.products[0].price * ((!car.products[0].NoOff ? parseInt(this.props.off) : 0)+car.products[0].off))/100);

      return (
        <div>
          <div className="row" style={{ alignItems: 'center' }}>

            <div className="col-lg-12 col-md-6 col-12 YekanBakhFaLight" style={{ textAlign: 'right' }} >

              <div className="row" style={{ alignItems: 'center' }}>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                  <span>تاریخ سفارش : </span><span>{car.Date}</span>
                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                  <span>شماره سفارش : </span><span>{car.OrderId}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                  <span>وضعیت : </span><span>{car.statusDesc}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                  <span>شماره پیگیری بانک: </span><span>{car.refId}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center',color:'#c7b800' }}>
                  <span>کسر از اعتبار : </span><span>{car.Credit}</span>

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'center',color:'#c7b800' }}>
                  <span>مبلغ نقدی : </span><span>{car.Amount}</span>

                </div>
                <div className="col-lg-3 col-md-3  col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                  <Link target="_blank" to={`${process.env.PUBLIC_URL}/Products?id=` + car.product_detail_id || car.products[0]._id} >
                    <img src={pic} style={{ height: "140px" }} name="pic3" onClick={this.Changepic} alt="" />
                  </Link>
                </div>
                <div className="col-9">
                  {car.products[0].title}
                </div>
              </div>


              <br />
            </div>



          </div> 


        </div>
      );
    } else {
      return (
        <div></div>
      )

    }
  }
  itemTemplatePayment(car, layout) {
    if (layout === 'list' && car) {

      return (
        <div>
          <div className="row" style={{ alignItems: 'center' }}>

            <div className="col-lg-12 col-md-6 col-12 YekanBakhFaLight" style={{ textAlign: 'right' }} >

              <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-lg-12 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>وضعیت : </span>{car.refId ? <span style={{color:'#00d200'}}>موفق</span> : <span style={{color:'#d20000'}}>ناموفق</span>}  

                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>تاریخ سفارش : </span><div>{car.Date}</div>
                </div>
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>شناسه سفارش : </span><div>{car._id}</div>

                </div>
                {car.refId ?
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>شماره پیگیری بانک: </span><div>{car.refId}</div>

                </div>
                :
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>

                </div>
                }
                
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>مبلغ نقدی : </span><span  style={{fontSize:17}}>{car.amount} تومان</span>

                </div>
                {car.Credit &&
                <div className="col-lg-4 col-12 YekanBakhFaMedium" style={{ textAlign: 'right',marginBottom:10 }}>
                  <span style={{color:'#b5b5b5'}}>کسر از اعتبار : </span><span style={{fontSize:17}}>{car.Credit} تومان</span>

                </div>
                }
              </div>


              <br />
            </div>



          </div> 


        </div>
      );
    } else {
      return (
        <div></div>
      )

    }
  }
  componentDidMount() {
    let that = this;
    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        this.setState({
          id: response.data.authData.userId
        })


        axios.post(this.state.url + 'getSettings', {
          token: localStorage.getItem("api_token")
        })
          .then(response => {
            this.getUser();
          })
          .catch(error => {
            console.log(error)
          })
      })
      .catch(error => {
        console.log(error)
      })
  }
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangenewPassword(event) {
    this.setState({ newPassword: event.target.value });
  }
  handleChangenewPassword2(event) {
    this.setState({ newPassword2: event.target.value });
  }
  handleChangeoldPassword(event) {
    this.setState({ oldPassword: event.target.value });
  }
  handleChangeAddress(event) {
    this.setState({ address: event.target.value });
  }
  handleChangeCompany(event) {
    this.setState({ company: event.target.value });
  }
  handleChangeMail(event) {
    this.setState({ mail: event.target.value });
  }
  selectedFactorChange(value) {
    let that = this;
    var p = [];
    this.setState({
      selectedId: value._id,
      newStatus: value.status,
      selectedFactor: value.products,
    })

  }
  handleChangeStatus(event) {
    let that = this;
    this.setState({ newStatus: event.target.value });
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedId: this.state.selectedId
    };
    let SCallBack = function (response) {
      that.GetFactors();

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 2500);
    }
    this.Server.send("AdminApi/changeFactorStatus", param, SCallBack, ECallBack)

  }
  onHide(event) {

    this.setState({ selectedFactor: null });
  }
  GetFactors(Stat) {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      user_id: this.state.id,
      Stat: Stat
    };
    let SCallBack = function (response) {
      response.data.result.map(function (v, i) {
        v.radif = i + 1;
        if (v.status == "-2")
          v.statusDesc = "درخواست لغو توسط خریدار"
        if (v.status == "-1")
          v.statusDesc = "لغو شده"
        if (v.status == "0")
          v.statusDesc = "پرداخت نشده"
        if (v.status == "1")
          v.statusDesc = "پرداخت شده"
        if (v.status == "2")
          v.statusDesc = "آماده ارسال"
        if (v.status == "3")
          v.statusDesc = "ارسال شده"
        if (v.status == "4")
          v.statusDesc = "پایان"
      })
      that.setState({
        GridDataFactors: response.data.result,
        loading: 0
      })
      //Alert.success('عملیات با موفقیت انجام شد', 2500);
      //that.GetPayment();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 2500);
    }
    this.Server.send("MainApi/getFactors", param, SCallBack, ECallBack)
  }
  GetPayment(ok) {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      user_id: this.state.id,
      OkPayment: ok
    };
    let SCallBack = function (response) {
      debugger;
      response.data.result.map(function (v, i) {
        v.radif = i + 1;
      })
      that.setState({
        GridDataPayment: response.data.result,
        loading: 0
      })
      //Alert.success('عملیات با موفقیت انجام شد', 2500);
      //that.getUser();

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 2500);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("MainApi/getPayment", param, SCallBack, ECallBack)
  }
  getUser() {
    let that = this;
    this.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      user_id: this.state.id,
      level: "0"
    };
    let SCallBack = function (response) {
      that.setState({
        username: response.data.result[0].username,
        name: response.data.result[0].name,
        address: response.data.result[0].address,
        SelectedCity:response.data.result[0].city,
        SelectedSubCity:response.data.result[0].subCity,
        mail: response.data.result[0].mail,
        company: response.data.result[0].company,
        loading: 0,
        levelName: (response.data.result[0].offs && response.data.result[0].offs.length > 0) ? response.data.result[0].offs[0].levelName : "تعیین نشده"
      })
      //Alert.success('عملیات با موفقیت انجام شد', 2500);
    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 2500);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("MainApi/getuserInformation", param, SCallBack, ECallBack)
  }
  logout(e) {
		
		localStorage.setItem("api_token", "")
		localStorage.setItem("CartNumber", 0)
		this.props.dispatch({
			type: 'LoginTrueUser',
			userId: null,
			CartNumber: 0,
			off: 0
		})
		this.setState({
			userId: null,
			logout: true
		})
		

	}
  Edituser() {
    let that = this;
    that.setState({
      loading: 1
    })
    
    if(this.state.ActiveLi !=3){
      if(!this.state.SelectedCity || this.state.SelectedCity == "-1" || !this.state.SelectedSubCity || this.state.SelectedSubCity == "-1"){
        Alert.warning('استان و شهر  را انتخاب کنید',2500);
        return;
      }
    }
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.username,
      nopass: 1,
      name: this.state.name,
      address: this.state.address,
      city:this.state.SelectedCity,
      subCity:this.state.SelectedSubCity,
      company: this.state.company,
      mail: this.state.mail,
      MyAccount: "1",
      level: "0",
      inMap:this.state.ActiveLi==3 ? 0 : 1
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 2500);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 2500);
      console.log(error)
    }
    this.Server.send("AdminApi/ManageUsers", param, SCallBack, ECallBack)
  }
  changePass() {
    let that = this;
    if (this.state.newPassword != this.state.newPassword2) {
      Alert.warning('رمز عبور جدید و تکرار آن متفاوتند', 2500);
      return
    }
    if (this.state.newPassword == "" || this.state.newPassword2 == "" || this.state.oldPassword == "") {
      Alert.warning('همه فیلدها را تکمیل کنید', 2500);
      return
    }
    that.setState({
      loading: 1
    })
    let param = {
      token: localStorage.getItem("api_token"),
      username: this.state.username,
      nopass: 0,
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      MyAccount: "1",
      level: "0"
    };
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      if (response.data.err) {
        Alert.error(response.data.err, 2500);

        return
      }
      Alert.success('عملیات با موفقیت انجام شد', 2500);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 2500);
      console.log(error)
    }
    this.Server.send("AdminApi/ManageUsers", param, SCallBack, ECallBack)
  }

  render() {
    if (this.state.logout) {
      return <Redirect to={"/"} push={true} />;
    }
   

    return (
      <div style={{ direction: 'rtl' }}>

        <Header1 />
        <Header2 />
        <div className="row justify-content-center firstInPage" style={{ minHeight: 600 }}>
          <div className="col-md-1 col-12">
            <div>

            </div>
          </div>
          <div className="col-md-3 col-12">
            <div style={{ minHeight: 250, background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right' }}>
              <ul>
                <li>            <img src='https://www.kalaoma.com/lib/themes/kalaoma/assets/test/avatar.png' style={{ width: 100, marginBottom: 30 }} />

                          <p className="YekanBakhFaBold" >{this.state.name}</p>

                        <p className="YekanBakhFaBold" style={{fontSize:17}}>موجودی اعتباری : {this.props.credit} تومان</p>
                </li>

                <li><hr /></li>

                <li onClick={() => { this.setState({ ActiveLi: 1 });this.GetFactors(['1']) }}><p className={this.state.ActiveLi == 1 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-shopping-bag" style={{ marginLeft: 10, fontSize: 17 }}></i> سفارش های من  </p> </li>
                <li onClick={() => { this.setState({ ActiveLi: 2 });this.GetPayment(1); }}><p className={this.state.ActiveLi == 2 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-id-card" style={{ marginLeft: 10, fontSize: 17 }}></i> گزارش تراکنش ها</p> </li>
                <li onClick={() => { this.setState({ ActiveLi: 3 }); }}><p className={this.state.ActiveLi == 3 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-user" style={{ marginLeft: 10, fontSize: 17 }}></i> ویرایش مشخصات</p> </li>
                <li style={{display:'none'}} onClick={() => { this.setState({ ActiveLi: 4 }); }}><p className={this.state.ActiveLi == 4 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-comments" style={{ marginLeft: 10, fontSize: 17 }}></i> نظرات</p> </li>
                <li onClick={() => { this.setState({ ActiveLi: 5 }); }}><p className={this.state.ActiveLi == 5 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-map-marker" style={{ marginLeft: 10, fontSize: 17 }}></i> آدرس</p> </li>
                <li onClick={() => { this.setState({ ActiveLi: 6 }); }}><hr /></li>
                <li onClick={() => { this.setState({ ActiveLi: 7 });this.logout(); }}><p className={this.state.ActiveLi == 6 ? 'YekanBakhFaBold side-active' : 'YekanBakhFaBold'} style={{ fontSize: 17 }} ><i class="fal fa-times" style={{ marginLeft: 10, fontSize: 17 }}></i> خروج از حساب</p> </li>


              </ul>
            </div>
          </div>
          <div className="col-md-8 col-12 YekanBakhFaBold" style={{ dir: 'rtl' }} >
            {this.state.ActiveLi == 1 &&
              <div style={{ minHeight: 500, background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right' }}>
                <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <li onClick={() => { this.setState({ FactorActiveLi: 1 }); this.GetFactors(['1']) }} ><span className={this.state.FactorActiveLi == 1 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>در حال پردازش</span></li>
                  <li onClick={() => { this.setState({ FactorActiveLi: 2 }); this.GetFactors(['2']) }} ><span className={this.state.FactorActiveLi == 2 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>در حال ارسال</span></li>
                  <li onClick={() => { this.setState({ FactorActiveLi: 3 }); this.GetFactors(['3']) }} ><span className={this.state.FactorActiveLi == 3 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>ارسال شده</span></li>
                  <li onClick={() => { this.setState({ FactorActiveLi: 4 }); this.GetFactors(['4', '5']) }} ><span className={this.state.FactorActiveLi == 4 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>تحویل شده</span></li>
                </ul>

                <div>

                  <DataView value={this.state.GridDataFactors} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>

                </div>


              </div>
            }
            {this.state.ActiveLi == 2 &&

              <div style={{ minHeight: 500, background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right' }}>
                <ul style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <li onClick={() => { this.setState({ PayActiveLi: 1 }); this.GetPayment(1) }} ><span className={this.state.PayActiveLi == 1 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>تراکنش های موفق</span></li>
                  <li onClick={() => { this.setState({ PayActiveLi: 2 }); this.GetPayment(0) }} ><span className={this.state.PayActiveLi == 2 ? 'YekanBakhFaBold btn-active' : 'YekanBakhFaBold'}>تراکنش های ناموفق</span></li>
                </ul>

                <div>

                  <DataView value={this.state.GridDataPayment} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplatePayment}></DataView>

                </div>


              </div>
            }
            {this.state.ActiveLi == 3 &&

                    <div className="row" style={{ minHeight: 500, background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right' }}>
                      <div className="col-lg-6">
                        <div >
                          <label className="labelNoGroup YekanBakhFaBold">نام کاربری</label>

                          <input className="form-control YekanBakhFaBold" disabled autoComplete="off" type="text" value={this.state.username} name="username" style={{ textAlign: 'right' }} onChange={this.handleChangeUsername} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.name} name="name" onChange={this.handleChangeName} style={{ textAlign: 'right' }} required="true" />
                          <label>نام و نام خانوادگی</label>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.mail} name="mail" onChange={this.handleChangeMail} style={{ textAlign: 'right' }} required="true" />
                          <label>پست الکترونیکی</label>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.company} name="company" onChange={this.handleChangeCompany} style={{ textAlign: 'right' }} required="true" />
                          <label>نام شرکت</label>
                        </div>
                      </div>
                     

                      <div className="col-lg-12" style={{textAlign:'right'}}>
                        <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.Edituser}>ویرایش اطلاعات</Button>
                        
                      </div>

                      <div className="col-12">
                        <hr />
                      </div>
                      <div className="col-12" style={{textAlign:'right'}}>
                        <h2 className="YekanBakhFaBold">تغییر رمز عبور</h2>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.handleChangeoldPassword} style={{ textAlign: 'right' }} required="true" />
                          <label>رمز عبور فعلی</label>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.newPassword} name="newPassword" onChange={this.handleChangenewPassword} style={{ textAlign: 'right' }} required="true" />
                          <label>رمز عبور جدید</label>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.newPassword2} name="newPassword2" onChange={this.handleChangenewPassword2} style={{ textAlign: 'right' }} required="true" />
                          <label>تکرار رمز عبور جدید</label>
                        </div>
                      </div>
                      <div className="col-lg-12" style={{textAlign:'right'}}>
                        <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.changePass}>تغییر رمز</Button>

                      </div>


                    </div>
                  
            }
            {this.state.ActiveLi == 4 &&

              <p className="YekanBakhFaBold" style={{textAlign:'center',marginTop:80}}>نظرات</p>

            }
            {this.state.ActiveLi == 5 &&
              <div style={{ minHeight: 500, background: '#fff', borderRadius: 10, padding: 20, textAlign: 'right' }}>
                

                
                <div className="col-lg-12">
                <Cities  callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity}/>

                <div className="group" style={{marginTop:50}}>
                  <textarea className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.address} name="address" onChange={this.handleChangeAddress} style={{ textAlign: 'right' }} required="true" />
                  <label>آدرس  پستی</label>

                </div>
                </div>
                <div className="col-lg-12" style={{textAlign:'right',display:'none'}}>
                <div style={{ marginRight: 10 }}>
                  <Link to={`${process.env.PUBLIC_URL}/Map?fromCart=` + this.state.fromCart}  >ثبت آدرس با استفاده از نقشه</Link>
                </div>
                </div>

                <div className="col-lg-12" style={{textAlign:'right'}}>
                <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.Edituser}>ویرایش آدرس</Button>
                {this.state.fromCart == "1" &&
                  <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={() => this.setState({ GoToCart: true })}>ادامه فرآیند خرید</Button>
                }
                </div>
                <div className="col-12" style={{marginTop:30,overflow:'hidden'}}>
                <Mapir
                  center={[this.state.lon, this.state.lat]}
                  onClick={this.reverseFunction}
                  Map={Maps}
                  userLocation
                      
                >
                  {this.state.markerArray}
                </Mapir>
                </div>
              </div>
            }

























            <div style={{ display: 'none' }}>
              <TabMenu model={this.state.MenuModel} activeItem={this.state.activeItem} onTabChange={(e) => {
                if (e.value.type == "SideBar") {
                  this.setState({
                    visible: true
                  })
                }
                if (e.value.type == "progress") {
                  this.GetFactors(["1", "2", "3"]);
                }
                if (e.value.type == "done") {
                  this.GetFactors(["4"]);
                }
                if (e.value.type == "cancel") {
                  this.GetFactors(["0"]);
                }
                if (e.value.type == "pay") {
                  this.GetPayment();
                }
                if (e.value.type == "edit") {
                  this.getUser();
                }
                if (e.value.type != "SideBar")
                  this.setState({ activeItem: e.value, PanelVisible: e.value.type })


              }} />

              {this.state.loading == 1 &&
                <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }}>
                  <ProgressSpinner style={{ width: 40, height: 40 }} />

                </div>
              }

              <Sidebar visible={this.state.visible} position="right" onHide={() => this.setState({ visible: false })}>

              </Sidebar>

              {this.state.PanelVisible == "edit" &&
                <Panel header=" اطلاعات شخصی " style={{ marginTop: 5, textAlign: 'right', fontFamily: 'YekanBakhFaBold' }}>
                  <form  >
                    <div className="row">
                      <div className="col-lg-6">
                        <div >
                          <label className="labelNoGroup YekanBakhFaBold">نام کاربری</label>

                          <input className="form-control YekanBakhFaBold" disabled autoComplete="off" type="text" value={this.state.username} name="username" style={{ textAlign: 'right' }} onChange={this.handleChangeUsername} />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.name} name="name" onChange={this.handleChangeName} style={{ textAlign: 'right' }} required="true" />
                          <label>نام و نام خانوادگی</label>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.mail} name="mail" onChange={this.handleChangeMail} style={{ textAlign: 'right' }} required="true" />
                          <label>پست الکترونیکی</label>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.company} name="company" onChange={this.handleChangeCompany} style={{ textAlign: 'right' }} required="true" />
                          <label>نام شرکت</label>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="group">
                          <textarea className="form-control YekanBakhFaBold" autoComplete="off" type="text" value={this.state.address} name="address" onChange={this.handleChangeAddress} style={{ textAlign: 'right' }} required="true" />
                          <label>آدرس کامل پستی</label>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div style={{ marginRight: 10 }}>
                          <Link to={`${process.env.PUBLIC_URL}/Map?fromCart=` + this.state.fromCart}  >ثبت آدرس با استفاده از نقشه</Link>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.Edituser}>ویرایش اطلاعات</Button>
                        {this.state.fromCart == "1" &&
                          <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={() => this.setState({ GoToCart: true })}>ادامه فرآیند خرید</Button>
                        }
                      </div>

                      <div className="col-12">
                        <hr />
                      </div>
                      <div className="col-12">
                        <h2 className="YekanBakhFaBold">تغییر رمز عبور</h2>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.handleChangeoldPassword} style={{ textAlign: 'right' }} required="true" />
                          <label>رمز عبور فعلی</label>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.newPassword} name="newPassword" onChange={this.handleChangenewPassword} style={{ textAlign: 'right' }} required="true" />
                          <label>رمز عبور جدید</label>
                        </div>
                      </div>
                      <div className="col-lg-7">
                        <div className="group">
                          <input className="form-control YekanBakhFaBold" autoComplete="off" type="password" value={this.state.newPassword2} name="newPassword2" onChange={this.handleChangenewPassword2} style={{ textAlign: 'right' }} required="true" />
                          <label>تکرار رمز عبور جدید</label>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.changePass}>تغییر رمز</Button>

                      </div>


                    </div>
                  </form>
                </Panel>
              }
              {(this.state.PanelVisible == "cancel" || this.state.PanelVisible == "progress" || this.state.PanelVisible == "done") &&
                <Panel header="   لیست سفارشات - برای مشاهده جزئیات سفارش روی سطر مربوط به آن کلیک کنید" style={{ marginTop: 50, textAlign: 'right', fontFamily: 'YekanBakhFaBold' }}>

                  <DataTable resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedFactor} onSelectionChange={e => this.selectedFactorChange(e.value)}  >
                    <Column field="radif" header="ردیف" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="Amount" header="قیمت (تومان)" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="refId" header="رسید تراکنش" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="statusDesc" header="وضعیت" className="YekanBakhFaBold" style={{ textAlign: "center" }} />

                  </DataTable>



                </Panel>
              }
              {this.state.PanelVisible == "pay" &&
                <Panel header="صورتحساب های ثبت شده" style={{ marginTop: 50, textAlign: 'right', fontFamily: 'YekanBakhFaBold' }}>
                  <DataTable resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataPayment}  >
                    <Column field="radif" header="ردیف" className="YekanBakhFaBold" style={{ textAlign: "center", width: 100 }} />
                    <Column field="refId" header="رسید تراکنش" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="Date" header="زمان پرداخت" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="desc" header="شرح" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="amount" header="مبلغ(تومان)" className="YekanBakhFaBold" style={{ textAlign: "center" }} />



                  </DataTable>
                </Panel>
              }
              <Dialog header="جزئیات" visible={this.state.selectedFactor} style={{ width: '60vw' }} minY={70} onHide={this.onHide} maximizable={true}>
                <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 400 }}>
                  {(this.state.newStatus == "1" || this.state.newStatus == "-2") &&
                    <div style={{ display: 'none' }}><p className="YekanBakhFaBold" style={{ float: "right" }}>تغییر وضعیت</p>
                      <select className="custom-select YekanBakhFaBold" value={this.state.newStatus} name="status" onChange={this.handleChangeStatus} >
                        <option value="1">پرداخت شده</option>
                        <option value="-2">لغو سفارش</option>
                      </select>
                    </div>
                  }
                  <br /><br />

                  <DataTable resizableColumns={true} paginator={true} rows={10} value={this.state.selectedFactor}  >
                    <Column field="_id" header="شناسه" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="title" header="عنوان" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="subTitle" header="عنوان دوم" className="YekanBakhFaBold" style={{ textAlign: "center" }} />
                    <Column field="desc" header="شرح" className="YekanBakhFaBold" style={{ textAlign: "center", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} />
                    <Column field="number" header="تعداد" className="YekanBakhFaBold" style={{ textAlign: "center" }} />

                  </DataTable>
                </div>
              </Dialog>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return {
		CartNumber: state.CartNumber,
		off: state.off,
		credit: state.credit
	}
}
export default withRouter(
	connect(mapStateToProps)(User)
);
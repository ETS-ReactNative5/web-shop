import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import { ComponentToPrint } from './../ComponentToPrint.js';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { confirmAlert } from 'react-confirm-alert'; // Import
import GoogleMapReact from 'google-map-react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import './DataTableDemo.css';
import { Sidebar } from 'primereact/sidebar';
 
import Mapir from "mapir-react-component";
let markerArray = new Array(), lat, lon;

const Api_Code = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIn0.eyJhdWQiOiIxMTY2NCIsImp0aSI6IjlmN2UwM2I4M2QxNTczNTE1ZjUyNDc0OGMxNTFlMzliYWViZDBjOGMzMjg3YjAwNTZlYWEyZmQ2NGJlZGVhODQ1MGM4MTlkYTAxOTJkMzgyIiwiaWF0IjoxNjA2NjQyOTU4LCJuYmYiOjE2MDY2NDI5NTgsImV4cCI6MTYwOTE0ODU1OCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.VSdlmcGeLgctdaKhNHycuQjk3AZoPovTnREv40kb5bQDBxRXSoXHhxNbQCLEAO6lLWE61Db2RMpT7KBK1gzsP0EWy4u6-19Ya9OJO39sGABrvEYmkIJ9k0MSdBvZCI8Uz9kLdmoU8Osfk31dMJY6Bo__KjK72kdzB7fuhMWskVvB_X7V_EgXu4ex_1rj79GtZc54qjw08trxHZ4MnCUu3-FUVhxHmeC9Qw85i1q-cvF8oFcU7WHD3AhrcnDt59DO-Qk9DXdxEENHIREdtw5KtzCkDlst8eK8tA-sNQ6d9VR06lIJH5IbXvYcDPb02oO8clAFiIDROBgUSUmrSso4cA";

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

class Sales_Payk extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.itemTemplate = this.itemTemplate.bind(this);

    
    this.state = {
      layout: 'list',
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      Filter: '2',
      GridDataUsers: [],
      GridDataFactors: [],
      selectedFactor: null,
      newStatus: null,
      selectedId: null,
      statusDesc: null,
      SellerId: null,
      LastAmount: 0,
      LastCredit: 0,
      loading: 0,
      isMainShop: 0,
      showProductStatus: 0,
      url: this.Server.getUrl()

    }
    this.selectedFactorChange = this.selectedFactorChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onHide2 = this.onHide2.bind(this);

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleProductStatusChange = this.handleProductStatusChange.bind(this);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);



  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    let that = this;
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      that.setState({
        SellerId: response.data.authData.shopId,
        UserId: response.data.authData.userId
      })
      setTimeout(function () {
        that.getSettings();

      }, 0)
      this.getuserInformation(response.data.authData.userId);


    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getuserInformation(UId){

    let that = this;
    let param = {
      user_id:UId
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        shopId:response.data.result[0].shopId,
        loading: 0
      })
      that.getSettings();
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/getuserInformation", param, SCallBack, ECallBack)

  }
  getRout(origin,destination){

      var url = 'https://map.ir/routes/route/v1/driving/'+origin+';'+destination+'?alternatives=true&steps=true'
      fetch(url,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Api_Code
        }
      })
      .then(response => response.json())
      .then(data => {
        let routs=[];

        for(let i=0; i < data.routes[0].legs[0].steps.length ; i++){
          routs.push({title:data.routes[0].legs[0].steps[i].name})
        }
        this.setState({
          ShowRout:true,
          Routs:routs
        })

        console.log(data)



      })
    
  }
  getMapStatic(origin,destination){

    var url = 'https://map.ir/shiveh/shiveh?service=WMS&version=1.1.1&request=GetMap&layers=Shiveh:Shiveh&width:500&height:500&format:image/png&bbox='+origin;
    fetch(url,
    {
      headers: {
        'x-api-key': Api_Code
      }
    })
    .then(response => {
      response.blob()
    } )
    .then(images => {

        // Then create a local URL for that image and print it 
        let outside = URL.createObjectURL(images)
      this.setState({
        imageStatic:outside
      })
      })
  
}
  itemTemplate(car, layout) {
    let linkUser = "https://www.google.com/maps/search/"+car.address;

    if (car) {
      return (
          <div>
            <div className="row">
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20,fontSize:20,background:'#eee'}}>
                فروشنده : {car.products[0].SellerName}
              </div>
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20}}>
                شماره سفارش : {car.OrderId}
              </div>
              
              <div className="col-lg-6 col-12 yekan text-primary" style={{textAlign:'right',fontSize:20,marginTop:20}}>
                {car.name}
              </div>
              <div className="col-lg-6 col-12 yekan text-danger mt-lg-0 mt-3" style={{textAlign:'right',fontSize:25,marginTop:20}}>
                  <a style={{color:'red'}} href={"tel:+98"+car.username}>{car.username}</a>
              </div>
              <div className="col-lg-6 col-12 yekan" style={{textAlign:'right',marginTop:20}}>
                استان : {car.city}
              </div>
              <div className="col-lg-6 col-12 yekan" style={{textAlign:'right',marginTop:20}}>
                شهر : {car.subCity}
              </div>
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20,fontSize:20}}>
                آدرس : {car.address}
              </div>
              <div className="col-12 yekan" style={{textAlign:'right',marginTop:20,marginBottom:10}}>
                <a href={linkUser} className="yekan" target="_blank" ><i className="fa fa-link " />لینک نقشه آدرس خریدار</a>


                <button onClick={()=>this.getMapStatic(car.products[0].SellerLat+","+car.products[0].SellerLon,car.userData[0]?.longitude+","+car.userData[0]?.latitude)} style={{display:'none'}} className="yekan" target="_blank" ><i className="fa fa-link " /> مسیر ازفروشگاه تا خریدار</button>

              </div>

              {
                !this.state.SaleFromMultiShops ?
                    <div className="col-12 yekan" style={{textAlign:'right',marginBottom:20}}>
                    <a href={"https://www.google.com/maps/search/"+car.products[0].SellerAddress} className="yekan" target="_blank" ><i className="fa fa-link " /> لینک نقشه آدرس فروشنده</a>
                    </div>

                :
                <div>
                  </div>

              }
              {
                !this.state.SaleFromMultiShops ?
                    <div className="col-12 yekan" style={{textAlign:'right',marginBottom:20}}>
                    <button onClick={()=>this.getRout(car.products[0].SellerLon+","+car.products[0].SellerLat,car.userData[0]?.longitude+","+car.userData[0]?.latitude)} className="yekan" target="_blank" ><i className="fa fa-link " /> مسیر ازفروشگاه تا خریدار</button>
                    </div>

                :
                <div>
                  </div>

              }
              <div className="col-12" >
                <img src = {this.state.imageStatic} />
              </div>
              
            </div>

            </div>
        );
    } 
}
  onRowSelect(event) {
    //Math.floor((Date.now() - response.data.result.result[0].products[0].LastChangeDate_num) / 3600000) > 20
    this.setState({
      ProductSelectedTitle: event.data.title,
      ProductStatus: event.data.status,
      showProductStatus: true
    })
    
  }
  persianNumber(input) {
    var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
    var string = (input + '').split('');
    var count = string.length;
    var num;
    for (var i = 0; i <= count; i++) {
      num = string[i];
      if (persian[num]) {
        string[i] = persian[num];
      }
    }
    return string.join('');
  }
  onStatusChange(event) {
    this.dt.filter(event.value, 'statusDesc', 'equals');
    this.setState({ statusDesc: event.value });
  }
  handleChangeStatus(event) {
    let that = this;
    that.setState({
      newStatus: event.target.value
    })
    let msg = "";
    if (event.target.value == "2" || event.target.value == "3" || event.target.value == "4") {
      msg = event.target.value == "2" ? "سفارش شما توسط فروشنده تامین و آماده ارسال گردید" + "\n" + that.state.STitle :
        (event.target.value == "3" ? "سفارشتان به مامور ارسال تحویل گردید.این سفارش به زودی به دستتان خواهد رسید" + "\n" + that.state.STitle :
          "سفارش شما تحویل شد ." + "\n" + "از خریدتان ممنونیم" + "\n" + that.state.STitle)
    }
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedId: this.state.selectedId,
      statusDesc: event.target.options[event.target.selectedIndex].innerText,
      selectedUsername: this.state.selectedUsername,
      msg: msg
    };
    let SCallBack = function (response) {

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    this.Server.send("AdminApi/changeFactorStatus", param, SCallBack, ECallBack)
    return false;
  }
  handleProductStatusChange(event) {
    let that = this;
    that.setState({ ProductStatus: event.target.value });
    let param = {
      token: localStorage.getItem("api_token"),
      newStatus: event.target.value,
      selectedFactorId: that.state.selectedId,
      statusDesc: event.target.options[event.target.selectedIndex].innerText,
      UserId: that.state.UserId,
      SelectedProductId: that.state.selectedProductId

    };
    that.state.selectedFactor[that.state.ProductSelectedIndex].status = event.target.value;

    let SCallBack = function (response) {

    };
    let ECallBack = function (error) {
      console.log(error)
    }
    that.Server.send("AdminApi/changeProductFactorStatus", param, SCallBack, ECallBack)

  }
  onHide(event) {
    this.setState({ selectedFactor: null, showProductStatus: 0 });
    //window.location.reload();
    this.GetFactors(this.state.Filter);
  }
  selectedFactorChange(value) {

    let that = this;
    var p = [];
    for (let i = 0; i < value.products.length; i++) {
      value.products[i].credit = value.products[i].credit ? value.products[i].credit.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
      value.products[i].price = value.products[i].price ? value.products[i].price.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
      value.products[i].UnitPrice = value.products[i].UnitPrice ? value.products[i].UnitPrice.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;

      value.products[i].detail = "";
      value.products[i].edit = <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => that.EditFactor(value._id, value.products[i]._id, value.products[i].title, "del")}></i>
      if (value.products[i].color)
        value.products[i].detail += "رنگ : " + value.products[i].color + "\n";
      if (value.products[i].size)
        value.products[i].detail += "اندازه : " + value.products[i].size;

    }
    this.setState({
      selectedUsername: value.username,
      selectedId: value._id,
      selectedFactor: value.products,
      newStatus: value.status
    })

  }
  EditFactor(FactorId, ProductId, title, type, product) {
    let that = this;
    if (type == "edit") {
      let param = {
        token: localStorage.getItem("api_token"),
        FactorId: FactorId,
        ProductId: ProductId,
        type: type,
        product: product
      };

      let SCallBack = function (response) {


      };
      let ECallBack = function (error) {
        console.log(error)
      }
      this.Server.send("AdminApi/EditFactor", param, SCallBack, ECallBack)
      return;
    }
    confirmAlert({
      title: <span className="yekan">حذف سفارش</span>,
      message: <span className="yekan">  آیا از حذف  {title} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let param = {
              token: localStorage.getItem("api_token"),
              FactorId: FactorId,
              ProductId: ProductId,
              type: type
            };
            let SCallBack = function (response) {
              if (type == "del" && !ProductId) {
                that.GetFactors(that.state.Filter);
              }
            };
            let ECallBack = function (error) {
              console.log(error)
            }
            this.Server.send("AdminApi/EditFactor", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });


  }

  GetFactors(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: Filter,
      SellerId: this.state.SellerId,
      isMainShop: this.state.isMainShop
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      let NewFactors = 0;
      response.data.result.result.map(function (v, i) {
        v.city = v.userData[0].city;
        v.subCity = v.userData[0].subCity;
        v.address = v.userData[0].address;
        let link = "https://www.google.com/maps/search/"+v.userData[0].city + "،" + v.userData[0].subCity+"،"+v.userData[0].address;
        v.link = <a href={link} target="_blank" ><i className="fa fa-link" /></a>
        v.name = v.userData[0].name;
        v.username = v.username;
        v.refId = v.refId;
        v.OrderId = v.OrderId;

        



      })
        that.setState({
        GridDataFactors: response.data.result.result,
        LastAmount: response.data.result.finalPrice,
        LastCredit: response.data.result.finalCredit,
        NewFactors: NewFactors
      })
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("AdminApi/getFactors", param, SCallBack, ECallBack)
  }
  inputTextEditor(field, props) {

    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value, field)} />;
  }
  gridEditor(field, props) {
    return this.inputTextEditor(field, props);
  }
  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.GetFactors(that.state.Filter);
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        let resp = response.data.result[0];
        that.setState({
          CreditSupport: resp.CreditSupport,
          ActiveSms: response.data.result ? resp.ActiveSms : "none",
          STitle: response.data.result ? resp.STitle : "",
          AccessAfterReg: response.data.result ? resp.AccessAfterReg : 0,
          RegSmsText: response.data.result ? resp.RegSmsText : '',
          SaleFromMultiShops:resp.SaleFromMultiShops,          
          InRaymand:  response.data.result ? response.data.result[0].Raymand : false,
          SeveralShop: response.data.result ? resp.SeveralShop : false
        })
      }




    }, function (error) {
      that.GetFactors(that.state.Filter);
      that.setState({
        loading: 0
      })

    })


  }

  onEditorValueChange(props, value, field) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;

    /*if((props.field=="relativeLevel" ||  props.field=="off") && value=="-")
      return;
    if((props.field=="relativeLevel" ||  props.field=="off") && isNaN(value) && value != "")
      return;  */
    // this.TableLayoutGetSet(updatedProducts[props.rowIndex],updatedProducts,props.rowIndex);
    this.setState({
      selectedFactor: updatedProducts
    })

    this.EditFactor(this.state.selectedId, updatedProducts[props.rowIndex]._id, updatedProducts[props.rowIndex].title, "edit", updatedProducts[props.rowIndex])

  }
  onHide2(event) {

    this.setState({ ShowRout:false,Routs:[] });
  }
  render() {
    const BodyTemplate = (rowData,props) => {
      return (
          <React.Fragment>
              <span className="p-column-title">{props.header}</span>
              {rowData[props.field]}
          </React.Fragment>
      );
    }
    const ProductBodyTemplate = (rowData,props) => {
      return (
          <React.Fragment>
              <span className="p-column-title">{props.header}</span>
              <span style={{paddingRight:20}}>{rowData[props.field]}</span>
              
          </React.Fragment>
      );
    }
    let statusDesc = [
      { label: "لغو شده", value: "لغو شده" },
      { label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار" },
      { label: "درخواست لغو توسط خریدار", value: "درخواست لغو توسط خریدار" },
      { label: "ناموفق", value: "ناموفق" },
      { label: "ثبت شده", value: "ثبت شده" },
      { label: "آماده ارسال", value: "آماده ارسال" },
      { label: "ارسال شده", value: "ارسال شده" },
      { label: "تحویل شده", value: "تحویل شده" },
      { label: "تسویه شده", value: "تسویه شده" },
      { label: "همه", value: null }


    ];
    let StatusFilter = <Dropdown style={{ width: '100%' }}
      value={this.state.statusDesc} options={statusDesc} onChange={this.onStatusChange} />
    return (
      <div style={{ direction: 'rtl' }}>
        <div style={{ display: "none" }}>
        <ComponentToPrint SeveralShop={this.state.SeveralShop} param={this.state.printParam} ref={el => (this.componentRef = el)} />
        </div>

        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff' }}>
            <div className="section-title " style={{ display: 'none', textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >موجودی : {this.persianNumber(parseInt(this.state.LastAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}  تومان</span></div>
            
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست فاکتورها (تحویل پیک شده)</span></div>
            <DataView value={this.state.GridDataFactors} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>

          </div>

        </div>
        <Sidebar header="مسیر دسترسی" visible={this.state.ShowRout} style={{ fontFamily: 'YekanBakhFaBold' }} onHide={() => this.onHide2()}>
        {this.state.Routs && this.state.Routs.map((v,i) => {
          return(
            <div className="col-12" style={{textAlign:'right'}}>
              <i className="far fa-arrow-from-top" /><label style={{ fontFamily: 'YekanBakhFaBold' }} >{v.title}</label>
            </div>
          )
        })}

        </Sidebar>
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
  connect(mapStateToProps)(Sales_Payk)
);

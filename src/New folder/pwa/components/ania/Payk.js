import React, { Component } from 'react';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { ComponentToPrint } from './../ComponentToPrint.js';
import Header from '../Header.js'

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Sidebar } from 'primereact/sidebar';
 
import Mapir from "mapir-react-component";

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

class Payk extends React.Component {
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
      status:"0",
      newStatus: null,
      selectedId: null,
      statusDesc: null,
      SellerId: null,
      LastAmount: 0,
      LastCredit: 0,
      statusDropDown:[{
          value:"0",
          label:"آنیافود"

      },
      {
        value:"1",
        label:"آنیاشاپ"

    }
    ],
      loading: 0,
      isMainShop: 0,
      showProductStatus: 0,
      url: this.Server.getUrl()

    }

    this.handleStatusChange = this.handleStatusChange.bind(this);



  }
  handleStatusChange(event) {
    if(event.target.value == "0"){
        localStorage.setItem("food","1");
    }else{
        localStorage.removeItem("food");
    }
    this.setState({
        status:event.target.value
    })
    this.GetFactors(this.state.Filter);


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
        SellerId:response.data.result[0].shopId,
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
  componentDidMount() {
    this.init();
  }
  init(){
      
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
          UserId: response.data.authData.userId
        })
        that.getuserInformation(response.data.authData.userId);
  
  
        that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.SellerId }, function (response) {
          that.setState({
            isMainShop: response.data.result[0].main
          })
  
        }, function (error) {
  
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
                فروشنده : {car.products[0].SellerName} ({car.products[0].SellerMobile})
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

  GetFactors(Filter) {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      Filter: Filter,
      isMainShop:1
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
  getHeaderResponse(){
    localStorage.removeItem("food");

}
  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      if(that.state.status == "0")  
        localStorage.setItem("food","1");
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
          SaleFromMultiShops:resp.SaleFromMultiShops
        })
      }




    }, function (error) {
      that.GetFactors(that.state.Filter);
      that.setState({
        loading: 0
      })

    })


  }


  render() {
    return (
      <div >
         <Header credit={this.state.credit} ComponentName="پیک" />

        
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff',textAlign:'center' }}>

            <Dropdown style={{ width: '90%', textAlign: 'right',marginBottom:5 }} value={this.state.status} options={this.state.statusDropDown} onChange={this.handleStatusChange} placeholder="وضعیت جدید را انتخاب کنید" />

            <DataView value={this.state.GridDataFactors} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>

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
  connect(mapStateToProps)(Payk)
);

import React, { Component } from 'react';
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import axios from 'axios'  
import Server  from './Server.js'
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Alert } from 'rsuite';
import {Dialog} from 'primereact/dialog';
import { Button } from 'reactstrap';

import Mapir from "mapir-react-component";

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
let markerArray=new Array(),lat,lon;
class Map extends React.Component {
  
    constructor(props){
        super(props);
        this.Server = new Server();

        this.state={
          markerArray: [],
          lat: 35.72,
          lon: 51.42,
          CodePosti:"",
          Pelak:"",
          Address:"",
          url: this.Server.getUrl(),
          visibleDialog:false,
          GotoUser:false,
          fromCart:window.location.hash.indexOf("fromCart=1") > -1 ? "1" : "0"

    

        }
        this.reverseFunction = this.reverseFunction.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangePelak = this.handleChangePelak.bind(this);
        this.handleChangeCodePosti = this.handleChangeCodePosti.bind(this);
        this.EditMap = this.EditMap.bind(this);
        this.onHide = this.onHide.bind(this);

        
        

       
       
    }
    onHide(event) {
      this.setState({
        visibleDialog: false
      });
  
    }
    handleChangeAddress(event){
      this.setState({Address: event.target.value});
  
    }
    handleChangePelak(event){
      this.setState({Pelak: event.target.value});
  
    }
    handleChangeCodePosti(event){
      this.setState({CodePosti: event.target.value});
  
    }
    
    componentDidMount(){
      let that = this;
      axios.post(this.state.url+'checktoken', {
        token: localStorage.getItem("api_token")
      })
      .then(response => {
        this.setState({
          username : response.data.authData.username
        })
      
      })
      .catch(error => {
        console.log(error)
      })
      
     
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
            Address:data.address,
            visibleDialog:true
          })
          
          
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
    render(){
      if(this.state.GotoUser){
        return <Redirect to={`${process.env.PUBLIC_URL}/User?fromCart=`+this.state.fromCart} />;

      }  
    return (
      <div className="App">
        <Mapir
          center={[this.state.lon, this.state.lat]}
          onClick={this.reverseFunction}
          Map={Maps}
          userLocation
              
        >
          {this.state.markerArray}
        </Mapir>
        <Dialog header={"ثبت آدرس انتخاب شده"}  visible={this.state.visibleDialog}  onHide={this.onHide} width="800px" style={{minWidth:600}} minY={70} maxY={400}  maximizable={true}>
            <p className="yekan" style={{textAlign:'right',maxWidth:600,whiteSpace:'pre-wrap',padding:4}}>{this.state.Address }</p>
              <div className="row" >
              <div className="col-lg-12">
                <div className="group">
                  <textarea className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.Address} name="Address" onChange={this.handleChangeAddress}  style={{textAlign:'right'}} required="true"/>
                  <label>آدرس</label>
                </div>
                <div className="group">
                  <input className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.Pelak} name="Pelak" onChange={this.handleChangePelak}  style={{textAlign:'right'}} required="true"/>
                  <label>پلاک</label>
                </div>
                <div className="group">
                  <input className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.CodePosti} name="CodePosti" onChange={this.handleChangeCodePosti}  style={{textAlign:'right'}} required="true"/>
                  <label>کد پستی</label>
                </div>
                <div>
                <Button style={{marginLeft:5,marginTop:10}} color="primary"  className="iranyekanweblight" onClick={this.EditMap}>ثبت اطلاعات</Button>

                </div>
              </div>
              </div>


            </Dialog>
      </div >

    )
    }
}

export default withRouter(Map);

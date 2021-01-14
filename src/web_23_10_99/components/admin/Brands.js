import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dropdown} from 'primereact/dropdown';
import {Dialog} from 'primereact/dialog';
import { Button } from 'reactstrap';
import {Panel} from 'primereact/panel';
import { connect } from 'react-redux';
import {Checkbox} from 'primereact/checkbox';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class ShopInformation extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      dashData : (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],  
      dashList : (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],  
      NewFactors : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers : (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      address:null,
      name:null,
      showInSite:true,
      BrandId:null,
      Message:null,
      logoTemp:'',
      currentImage:'',
      GridDataComponents:[],
      selectedId:null,
      loading:0,
      absoluteUrl:this.Server.getAbsoluteUrl(),
      url:this.Server.getUrl(1)
    }
    this.getBrands();
    
    this.FileUpload = this.FileUpload.bind(this);

    this.SetBrand = this.SetBrand.bind(this);

  }
  
  FileUpload(e){
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage',e.target.files[0]);
    if(this.state.BrandId){
      formData.append('BrandId',this.state.BrandId);
    }

      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
    axios.post(this.state.url+'uploadFile', formData , config)
      .then( (response) => {
        if(name=="file")
          this.setState({
            logo : this.state.absoluteUrl + response.data.split("public")[1]
          })
          this.getBrands();
       
      })
      .catch( (error) => {
        console.log(error);
      });
  }
  getBrands(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response1){
      that.setState({
        user_id : response1.data.authData.userId
      })
      that.Server.send("AdminApi/getBrands",{},function(response){
        var result=[]
        that.setState({
          loading:0
        })
        response.data.result.map(function(v,i){
          var logo = v.logo ?  that.state.absoluteUrl + v.logo.split("public")[1] : that.state.absoluteUrl+'nophoto.png';
          result.push({
            _id:v._id,
            name:v.name,
            address:v.address,
            logo:logo ? <img  src={logo} style={{height:80}}  alt="" /> : null,
            logoTemp:logo ? logo:null,
            showInSite:v.showInSite ? <i class="fa fa-check text-success" style={{fontSize:18}} /> : null

          })
        })
        that.setState({
          GridDataBrands : result
          
        })
      },function(error){
        that.setState({
          loading:0
        })
        console.log(error)
      })

    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
  }
  selectedBrandsChange(e){
    this.setState({
            BrandId:e._id,
            name:e.name,
            address:e.address,
            logo:!e.logoTemp ? '' : e.logoTemp,
            showInSite:!e.showInSite ? false : true 
    })
  }
  SetBrand(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      address:this.state.address,
      name:this.state.name,
      showInSite:this.state.showInSite,
      BrandId:this.state.BrandId
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.getBrands();
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.danger('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetBrands",param,SCallBack,ECallBack)
  }

  
 
    render(){
     
     return (
          <div style={{direction:'rtl'}}>
            {this.state.loading == 1 &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px'}}>
                <Loader content="لطفا صبر کنید ..." className="yekan"  />
              </div>
            }
            <div className="row justify-content-center">
          <div  className="col-12 col-md-4 col-lg-3 ">
          <Dashboard list={this.state.dashList} data={this.state.dashData} NewUsers={this.state.NewUsers} NewFactors={this.state.NewFactors} />
          </div>
            <div className="col-lg-9 col-md-8 col-12" style={{marginTop:20,background:'#fff'}}> 
         <Panel header="ثبت برند جدید" style={{marginTop:20,textAlign:'right',marginBottom:50,fontFamily: 'yekan'}}>
         <form  >
      <div className="row">

      <div className="col-lg-6" style={{marginTop:10}}>
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.name} name="name" onChange={(event)=> this.setState({name: event.target.value})}  required="true"/>
        <label className="yekan">نام برند</label>
      </div>
      </div>
      <div className="col-lg-6" style={{marginTop:10}}>
      <div className="group">

        <input className="form-control yekan"  autoComplete="off"  type="text" value={this.state.address} name="address" onChange={(event)=> this.setState({address: event.target.value})} required="true" />
        <label className="yekan">آدرس سایت</label>

      </div>
      </div>
      <div className="col-lg-12">
      <div style={{paddingRight:8}}>

      <Checkbox inputId="laon" value={this.state.showInSite} checked={this.state.showInSite} onChange={e => this.setState({showInSite: e.checked})}></Checkbox>
      <label htmlFor="laon" className="p-checkbox-label" style={{paddingRight:5}}>نمایش در صفحه اول سایت</label>
      
      </div>
      </div>

      
      
      
      <div className="col-6" style={{display:this.state.BrandId ? 'block' : 'none'}} >
      <div className="group">
            <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  type="file"  name="file"    />
                 <label>آپلود لوگو</label>
			</div>
      </div>
      <div className="col-6" style={{display:this.state.BrandId ? 'block' : 'none'}} >
      <img src={this.state.logo}  />
      </div>

      
      
      
      <div className="col-lg-12" style={{marginTop:10}}>
      <Button style={{marginLeft:5,marginTop:10}} color="primary"  onClick={this.SetBrand}>ثبت اطلاعات</Button>
      <Button style={{marginLeft:5,marginTop:10}} color="warning"  onClick={()=>{
        this.setState({
          name:'',
          address:'',
          logo:'',
          logoTemp:'',
          BrandId:null,
          showInSite:false
        })
      }}>پاک کردن</Button>

      </div>

      <div className="col-lg-12" style={{marginTop:10}}>
        {
          this.state.Message &&
      <Alert color={this.state.Message.type} style={{textAlign:"center",fontSize:18}} className="yekan">
                    {this.state.Message.text}
      </Alert>   
    }   

      </div>

      </div>
      
    </form>
    </Panel>
    <DataTable responsive value={this.state.GridDataBrands} selectionMode="single" selection={this.state.BrandId} onSelectionChange={e => this.selectedBrandsChange(e.value)}>
                        <Column field="name"  header="نام برند" className="yekan" style={{textAlign:"center"}} />
                        <Column field="address" header="آدرس سایت"  className="yekan" style={{textAlign:"center"}}/>
                        <Column field="logo" header="لوگو" className="yekan" style={{textAlign:"center"}}  />
                        <Column field="showInSite" header="نمایش در سایت" className="yekan" style={{textAlign:"center"}} />
                    </DataTable>
          
          </div>

          </div>
          
          </div>    

        )
    }
}
const mapStateToProps = (state) => {
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(ShopInformation)
);

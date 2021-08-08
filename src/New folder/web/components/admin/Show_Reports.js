import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './report.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';

import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Checkbox } from 'primereact/checkbox';
import { Fieldset } from 'primereact/fieldset';
import DatePicker from 'react-datepicker2';
import { ComponentToPrint } from '../ComponentToPrint.js';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';

class Show_Reports extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      loading: 0,
      output:'',
      legend: " فیلتر گزارش شماره " + this.props.number
      

    }
    
    this.generateExcel = this.generateExcel.bind(this);
    this.showReports = this.showReports.bind(this);
    this.Clear = this.Clear.bind(this);

    
  }
  GetFilters() {
    let that = this;

    let param = {
      token: localStorage.getItem("api_token"),
      number:this.props.number
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      let FilterIds=[];
      that.setState({
        method:response.data.result[0].method,
        number:that.props.number
      })
      for(let item of response.data.result[0].Filters){
        FilterIds.push(item.id);
      }
      that.Server.send("AdminApi/GetFilters", {_id:FilterIds}, function (response) {
        debugger;

        let ShowParam=[];
        let ComboParam = [];
        let AutoCompleteParam = [];
        let count=0;
        for(let item of response.data.result){
          ShowParam.push({name:item.latinName,type:item.type});
          if(item.type=="3"){
            ComboParam.push({DBTableFieldLabel:item.DBTableFieldLabel,DBTableFieldValue:item.DBTableFieldValue,DbTableName:item.DbTableName,FId:item.FId})
          }  
          if(item.type=="4"){
            item.index = count;
            AutoCompleteParam.push({index:count,latinName:item.latinName,DBTableFieldLabel:item.DBTableFieldLabel,DBTableFieldValue:item.DBTableFieldValue,DbTableName:item.DbTableName,FId:item.FId})
            count++;
          }
        }
        that.setState({
          loading: 0,
          Filters:response.data.result,
          ShowParam:ShowParam,
          ComboParam:ComboParam,
          AutoCompleteParam:AutoCompleteParam
        })
        if(ComboParam.length > 0)
          that.getCombo();
      }, function (error) {
        Alert.error('عملیات انجام نشد', 5000);
        that.setState({
          loading: 0
        })
      })
      
      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFilters", param, SCallBack, ECallBack)
  }
  getCombo(){
    let that = this;
    let ComboParam = this.state.ComboParam.pop();
    let param = {
      token: localStorage.getItem("api_token"),
      DBTableFieldLabel:ComboParam.DBTableFieldLabel,
      DBTableFieldValue:ComboParam.DBTableFieldValue,
      DbTableName:ComboParam.DbTableName
    };


    this.setState({
      loading: 1
    })

    let SCallBack = function (response) {
      let x=[];
      for(let i=0;i<response.data.result.length;i++){
        x.push({DBTableFieldLabel:response.data.result[i][ComboParam.DBTableFieldLabel],DBTableFieldValue:response.data.result[i][ComboParam.DBTableFieldValue]});
      }
      for(let item of that.state.Filters){
        if(item.FId == ComboParam.FId){
          item.Combo = x
        }
      }
      that.setState({
        Filters:that.state.Filters,
        loading: 0
      })
      if(that.state.ComboParam.length > 0)
          that.getCombo();
      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/GetCombo", param, SCallBack, ECallBack)
  }
  Clear(){
    this.setState({
      Filters:[]
    })
    this.GetFilters();
  }
  showReports() {
    let that = this;
    this.setState({
      output:''
    })
    let param = {
      token: localStorage.getItem("api_token"),
      number:this.state.number,
      SeveralShop:this.state.SeveralShop
    };
    for(let item of this.state.ShowParam){
      if(item.type == "5" && this.state[item.name]){
        param[item.name]=this.state[item.name].local("fa").format("jYYYY/jM/jD");

      }else if(item.type == "4"){
        param[item.name.split("_")[0]]=this.state[item.name+"_val"];
      }else{
        param[item.name]=this.state[item.name];
      }
    }


    this.setState({
      loading: 1
    })

    let SCallBack = function (response) {
      that.setState({
        output:response.data.result,
        ExcelRep:response.data.ExcelRep,
        loading: 0
      })

      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/"+this.state.method, param, SCallBack, ECallBack)
  }
  getSettings() {
    let that = this;
    that.setState({
      loading: 1
    })
    that.Server.send("AdminApi/getSettings", {}, function (response) {
      that.setState({
        loading: 0
      })
      if (response.data.result) {
        that.setState({
          SeveralShop: response.data.result[0].SeveralShop
        })
      }
      that.init();

    }, function (error) {

      that.init();
      that.setState({
        loading: 0
      })

    })


  }
  componentDidMount() {
    this.getSettings();
  }
  generateExcel(){
    if(!this.state.ExcelRep)
      return;
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      ExcelRep:this.state.ExcelRep
    };


    this.setState({
      loading: 1
    })

    let SCallBack = function (response) {
      that.setState({
        loading: 0

      })
      window.open(response.data.result)

      

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("ReportApi/generateExcel", param, SCallBack, ECallBack)

  }
  init(){
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      output:'',
      loading: 1
    })
    let SCallBack = function (response) {
      
      that.setState({
        loading: 0
      })
      that.GetFilters();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getMainShopInfo(){
    let that = this;
    let param = {
        main: true
    };
    
    let SCallBack = function (response) {
        that.setState({
            MainShopInfo:response.data.result
        })

    };

    let ECallBack = function (error) {

    }
    that.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
}
onSelect(event) {
  let latinName = this.state.AutoCompleteParam[this.state.AutoCompleteIndex].latinName;
  this.setState({[latinName]:event.value.name,[latinName+"_val"]:event.value._id})
}


suggestBrands(event) {
    let f = this.state.AutoCompleteParam[this.state.AutoCompleteIndex];
    let that = this;
    this.setState({ brand: event.query, Count: 0 });
    let param = {
      title: event.query,
      table:f.DbTableName,
      name:f.latinName.split("_")[1]
    };
    let SCallBack = function (response) {
      let brandSuggestions = [];
      response.data.result.reverse().map(function (v, i) {
        brandSuggestions.push({ _id: v[f.DBTableFieldValue],name:v[f.DBTableFieldLabel]})
      })
      that.setState({ brandSuggestions: brandSuggestions });
    };

    let ECallBack = function (error) {

    }
    that.Server.send("ReportApi/searchItems", param, SCallBack, ECallBack)


}
itemTemplate(brand) {
    return (
      <div className="p-clearfix" style={{ direction: 'rtl',maxWidth:'100%' }} >
        <div style={{ margin: '10px 10px 0 0' }} className="row" _id={brand._id} >
          <div className="col-8" _id={brand._id} style={{ textAlign: 'right' }}>
            <span className="iranyekanwebregular" style={{ textAlign: 'right', overflow: 'hidden' }} _id={brand._id} >
              <span style={{whiteSpace:'pre-wrap'}} _id={brand._id}>{brand.name}</span><br />
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
      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">
              <div className="row">
                    <div className="col-12" style={{ display: "none" }}>
                      <ComponentToPrint htmlParam={this.state.output} forUser="1" ref={el => (this.componentRef = el)} />
                    </div>
                  </div>
          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>

          <Fieldset legend={this.state.legend} toggleable collapsed={this.state.panelCollapsed} onToggle={(e) => this.setState({panelCollapsed: e.value})}>
          <div className="row" style={{alignItems:'baseline'}}>
              {this.state.Filters && this.state.Filters.map((item, index)=>{
                if(item.type=="1"){
                  return(
                    <div className="col-12 col-lg-3">
                      <div className="group" >
                          <input className="form-control YekanBakhFaBold" style={{textAlign:'center'}} type="text" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}}   required  />
                          <label className="YekanBakhFaBold">{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="2"){
                  return(
                    <div className="col-12 col-lg-3">
                      <div style={{display:'flex'}} >
                      <Checkbox inputId={item.latinName} value={item.latinName} checked={this.state[item.latinName]} onChange={(event)=>{this.setState({[item.latinName]:event.checked})}} ></Checkbox>

                      <label htmlFor={item.latinName} className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{item.name}</label>
                      </div>
                    </div>
                  )
                }
                if(item.type=="3"){
                  return(
                    <div className="col-12 col-lg-3" style={{textAlign:'right',marginBottom:20,marginTop:20}}>
                      <select style={{width:'100%'}} placeholder={item.name} className="form-control YekanBakhFaBold" id={item.latinName} name={item.latinName} value={this.state[item.latinName]}  onChange={(event)=>{this.setState({[item.latinName]:event.target.value})}} >
                      return(
                        <option value="" >{item.name}</option>
                      )
                      {item.Combo && item.Combo.map(function(item,index){
                          return(
                            <option className="YekanBakhFaBold" value={item.DBTableFieldValue} >{item.DBTableFieldLabel}</option>
                          )
                      })
                      }
                      </select>
                     
                    </div>
                  )   
                }
                if(item.type=="4"){
                  return(
                    <div className="col-12 col-lg-3">
                      <div className="group" >
                      <AutoComplete placeholder={item.name}  style={{ width: '100%' }} onChange={(event)=>{this.setState({[item.latinName]:event.value,AutoCompleteIndex:item.index,[item.latinName+"_val"]:''})}} itemTemplate={this.itemTemplate.bind(this)} value={this.state[item.latinName]} onSelect={(e) => this.onSelect(e)} suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />

                      </div>
                    </div>
                  )
                }
                if(item.type=="5"){
                  return(
                    <div className="col-12 col-lg-3">
                      <DatePicker
                        onChange={value =>{this.setState({[item.latinName]:value})}}
                        value={this.state[item.latinName]}
                        isGregorian={false}
                        timePicker={false}
                        placeholder={item.name}
                        persianDigits={false}

                      />
                    </div>
                  )
                }
                
              })}
              
            </div>
            <div className="row" style={{marginTop:50}}>
                <button className="btn btn-primary irsans" onClick={this.showReports} style={{ width: "200px", marginTop: "5px", marginBottom: "5px",marginLeft:10 }}> مشاهده گزارش </button>
             

              
              <button className="btn btn-secondary irsans" onClick={this.Clear} style={{ width: "200px", marginTop: "5px", marginBottom: "5px",marginLeft:10 }}>شروع مجدد </button>
              {this.state.output != '' && this.state.ExcelRep &&
                <button className="btn btn-success irsans" onClick={this.generateExcel} style={{ width: "200px", marginTop: "5px", marginBottom: "5px",marginLeft:10,marginRight:10 }}> ساخت خروجی اکسل </button>
              }
              {this.state.output != '' &&
              <ReactToPrint
                        content={() => this.componentRef}
                      >
                        <PrintContextConsumer>
                          {({ handlePrint }) => (
                            

                            <Button label="چاپ گزارش"  onClick={() => {

                              setTimeout(function () {
                                handlePrint();

                              }, 0)
                            }} style={{ cursor: 'pointer',marginTop: "5px", marginBottom: "5px" }} aria-hidden="true"></Button>
                          )}
                        </PrintContextConsumer>
                      </ReactToPrint>
              }
            </div>
            </Fieldset>
            
            <div className="report-container" dangerouslySetInnerHTML={{ __html: this.state.output}} > 
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
  connect(mapStateToProps)(Show_Reports)
);
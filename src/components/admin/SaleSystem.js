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
import { connect } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Toast } from 'primereact/toast';
import GoogleMapReact from 'google-map-react';
import { Checkbox } from 'primereact/checkbox';
import './DataTableDemo.css';

class SaleSystem extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.state = {
            layout: 'list',
            dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
            dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
            NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
            NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
            system: "فروشگاهی",
            c0: true,
            c1: true,
            price: {
                "c0": 6000000,
                "c1": 2000000,
                "c2": 500000,
                "c3": 800000,
                "c4": 1000000,
                "c5": 350000,
                "c6": 400000,
                "c7": 400000,
                "c8": 400000,
                "c9": 5000000,
                "c10": 1000000,
                "c11": 500000,
                "c12": 500000,
                "c13": 300000,
                "c14": 300000,
                "c15": 350000,
                "c16": 300000,
                "c17": 500000,
                "c18": 800000,
                "c19": 1000000,
                "c20": 150000,
                "c21": 150000,
            },
            map: {
                "c0": "امکانات پایه ای",
                "c1": "سبد خرید",
                "c2": "کد تخفیف",
                "c3": "کیف پول",
                "c4": "سطح بندی کاربران",
                "c5": "پرداخت با چک",
                "c6": "پرداخت آنلاین",
                "c7": "تعیین هزینه پیک",
                "c8": "مرجوعی",
                "c9": "امکانات چند فروشگاهی",
                "c10": "اتصال به پنل پیامک",
                "c11": "خرید بر پایه محصول",
                "c12": "خرید بر پایه فروشگاه",
                "c13": "مدیریت دسترسی مدیران",
                "c14": "وبلاگ",
                "c15": "تنظیم جزئیات فنی محصولات",
                "c16": "مدیریت تگ ها",
                "c17": "امکانات ویژه مدیران",
                "c18": "سیستم ثبت کارکرد کارکنان",
                "c19": "سیستم ثبت درخواست (پشتیبانی)",
                "c20": "نمایش برندها",
                "c21": "مدیریت نظرات"
            },
            showProductStatus: 0,
            url: this.Server.getUrl()

        }
        this.Compute = this.Compute.bind(this);
        this.Sale = this.Sale.bind(this);
        this.toast = React.createRef();




    }
    Sale() {
        let result = [];
        for (let state in this.state) {
            if (state.indexOf("c") == 0) {
                if (this.state[state]) {
                    result.push({ id: state, title: this.state.map[state] });
                }
            }
        }
        let param = {
            price: this.state.priceComputed,
            detail:result,
            system:this.state.system,
            username:this.state.username,
            name:this.state.name
        };
        let that = this;
        this.setState({
            loading: 1
        })
        let SCallBack = function (response) {
            that.setState({
                loading: 0,
                priceComputed:null
            })
            that.toast.current.show({severity: 'success', summary: 'موفقیت', detail: <div><div>درخواست شما ثبت شد</div><div>کارشناسان ما در کوتاهترین زمان برای انجام ادامه مراحل خرید با شما تماس خواهند گرفت</div></div>, life: 8000});

        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
        }
        this.Server.send("CompanyApi/SaleSystem", param, SCallBack, ECallBack)
    }
    Compute() {
        let p = 0;

        for (let state in this.state) {
            if (state.indexOf("c") == 0) {
                if (this.state[state]) {
                    p += this.state.price[state];
                }


            }

        }
        this.setState({
            priceComputed: p
        })

    }
    componentDidMount() {
        debugger;
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
            username: response.data.authData.username,
            name: response.data.authData.name||""
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
                <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                <div className="row justify-content-center">

                    <div className="col-12" style={{ marginTop: 20, backgroundColor: '#fff', padding: 0, backgroundColor: '#f7f7f7', marginBottom: 50 }}>
                        <select className="custom-select YekanBakhFaBold" value={this.state.system} name="system" onChange={(event) => {


                            let C = {}
                            for (let c in this.state.map) {
                                if (c != "c0" && c != "c1")
                                    C[c] = false
                                else {
                                    if (event.target.value == "شرکتی")
                                        C["c1"] = false
                                    else
                                        C["c1"] = true
                                }
                            }
                            this.setState({ priceComputed: null, system: event.target.value, ...C })


                        }} >
                            <option value="فروشگاهی">فروشگاهی</option>
                            <option value="شرکتی">شرکتی</option>

                        </select>
                    </div>
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                        <Checkbox inputId="c0" value={this.state.c0} disabled={true} checked={this.state.c0} onChange={e => this.setState({ c0: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c0"]}</label>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c0"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c1" value={this.state.c1} disabled={true} checked={this.state.c1} onChange={e => this.setState({ c1: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c1"]}</label>
                            <label htmlFor="c1" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c1"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c2" value={this.state.c2} checked={this.state.c2} onChange={e => this.setState({ c2: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c2"]}</label>
                            <label htmlFor="c2" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c2"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c3" value={this.state.c3} checked={this.state.c3} onChange={e => this.setState({ c3: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c3"]}</label>
                            <label htmlFor="c3" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c3"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c4" value={this.state.c4} checked={this.state.c4} onChange={e => this.setState({ c4: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c4"]}</label>
                            <label htmlFor="c4" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c4"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c5" value={this.state.c5} checked={this.state.c5} onChange={e => this.setState({ c5: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c5"]}</label>
                            <label htmlFor="c5" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c5"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c6" value={this.state.c6} checked={this.state.c6} onChange={e => this.setState({ c6: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c6"]}</label>
                            <label htmlFor="c6" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c6"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c7" value={this.state.c7} checked={this.state.c7} onChange={e => this.setState({ c7: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c7"]}</label>
                            <label htmlFor="c7" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c7"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c8" value={this.state.c8} checked={this.state.c8} onChange={e => this.setState({ c8: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c8"]}</label>
                            <label htmlFor="c8" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c8"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c9" value={this.state.c9} checked={this.state.c9} onChange={e => this.setState({ c9: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c9"]}</label>
                            <label htmlFor="c9" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c9"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                        <Checkbox inputId="c10" value={this.state.c10} checked={this.state.c10} onChange={e => this.setState({ c10: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c10"]}</label>
                        <label htmlFor="c10" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c10"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c11" value={this.state.c11} checked={this.state.c11} onChange={e => this.setState({ c11: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c11"]}</label>
                            <label htmlFor="c11" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c11"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&
                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c12" value={this.state.c12} checked={this.state.c12} onChange={e => this.setState({ c12: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c12"]}</label>
                            <label htmlFor="c12" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c12"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                        <Checkbox inputId="c13" value={this.state.c13} checked={this.state.c13} onChange={e => this.setState({ c13: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c13"]}</label>
                        <label htmlFor="c13" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c13"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                        <Checkbox inputId="c14" value={this.state.c14} checked={this.state.c14} onChange={e => this.setState({ c14: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c14"]}</label>
                        <label htmlFor="c14" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c14"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c15" value={this.state.c15} checked={this.state.c15} onChange={e => this.setState({ c15: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c15"]}</label>
                            <label htmlFor="c15" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c15"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c16" value={this.state.c16} checked={this.state.c16} onChange={e => this.setState({ c16: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c16"]}</label>
                            <label htmlFor="c16" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c16"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                        <Checkbox inputId="c17" value={this.state.c17} checked={this.state.c17} onChange={e => this.setState({ c17: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c17"]}</label>
                        <label htmlFor="c17" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c17"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                        <Checkbox inputId="c18" value={this.state.c18} checked={this.state.c18} onChange={e => this.setState({ c18: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c18"]}</label>
                        <label htmlFor="c18" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c18"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                        <Checkbox inputId="c19" value={this.state.c19} checked={this.state.c19} onChange={e => this.setState({ c19: e.checked })}></Checkbox>
                        <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c19"]}</label>
                        <label htmlFor="c19" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c19"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                    </div>
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#f7f7f7' }} >
                            <Checkbox inputId="c20" value={this.state.c20} checked={this.state.c20} onChange={e => this.setState({ c20: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c20"]}</label>
                            <label htmlFor="c20" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c20"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    {this.state.system != "شرکتی" &&

                        <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, backgroundColor: '#e0e0e0' }} >
                            <Checkbox inputId="c21" value={this.state.c21} checked={this.state.c21} onChange={e => this.setState({ c21: e.checked })}></Checkbox>
                            <label htmlFor="c0" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>{this.state.map["c21"]}</label>
                            <label htmlFor="c21" className="p-checkbox-label yekan" style={{ paddingRight: 5 }}>({this.state.price["c21"].toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}تومان)</label>

                        </div>
                    }
                    <div className="col-12" style={{ textAlign: 'center', display: 'flex', alignItems: 'end', padding: 0, marginTop: 30 }} >

                        <div className="row" style={{width:'100%'}}>
                            <div className="col-lg-12 col-12" style={{ textAlign: 'center' }}>
                                <button className="btn btn-info irsans" onClick={this.Compute} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}>محاسبه قیمت</button>
                            </div>

                        </div>
                    </div>
                    {this.state.priceComputed && this.state.loading != 1 &&
                        <div className="col-12" style={{ textAlign: 'center', display: 'flex', alignItems: 'end', padding: 0, marginTop: 30 }} >

                            <div className="row" style={{width:'100%'}}>
                                <div className="col-lg-12 col-12" >
                                    <p className="yekan" style={{ fontSize: 23 }}>درخواست خرید سیستم <span style={{ color: 'red' }}>{this.state.system}</span></p>
                                    <p className="yekan" style={{ fontSize: 23 }}> مبلغ قابل پرداخت  <span style={{ color: 'red' }}>{this.state.priceComputed.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> تومان </p>
                                </div>
                                <div className="col-12" style={{ textAlign: 'right', display: 'flex', alignItems: 'end', padding: 0, marginTop: 30 }} >

                                    <div className="row" style={{width:'100%'}}>
                                        <div className="col-lg-12 col-12" style={{ textAlign: 'center' }}>
                                            <button className="btn btn-success irsans" onClick={this.Sale} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}>ثبت درخواست خرید</button>
                                        </div>

                                    </div>
                                </div>


                            </div>
                        </div>

                    }



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
    connect(mapStateToProps)(SaleSystem)
);

import React, { Component } from 'react';
import { connect } from "react-redux"
import Server from '../Server.js'
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';

import Header from '../Header.js'
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import DatePicker from 'react-datepicker2';
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'

class New extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.toast = React.createRef();
        this.FileUpload = this.FileUpload.bind(this);

        this.state = {
            edit: this.props.location.search.split("edit=")[1],
            basic: true,
            ButtonText: "ثبت درخواست",
            listViewData: [],
            Accounts: [],
            ChequeNember: 0,
            disableForm:false,
            ShowLoading: 1,
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl(),
            url2: this.Server.getUrl(1)


        };
    }

    ConvertNumToFarsi(text) {
        if (!text)
            return text;
        var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return text.toString().replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    }
    componentDidMount() {

        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                this.setState({
                    UId: response.data.authData.userId
                })
                this.GetAccounts();
            })
            .catch(error => {
                this.GetAccounts();

            })

    }
    GetAccounts(RefreshVam) {
        let that = this;
        let param = {
            token: localStorage.getItem("api_token"),
            UId: this.state.UId
        };
        let SCallBack = function (response) {
            that.setState({
                ShowLoading: false
            })
        }
        let ECallBack = function (error) {
            that.setState({
                ShowLoading: false
            })
        }

        that.setState({
            ShowLoading: true
        })
        this.Server.send("AdminApi/GetAccountReq", param, SCallBack, ECallBack)
    }
    SetAccountReq() {
        let that = this;
        if (!this.state.CodeMelli) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">کد ملی را وارد کنید</div>, life: 4000 });

            return
        }
        if (!this.state.mobile) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div><div className="YekanBakhFaMedium">موبایل را وارد کنید</div></div>, life: 4000 });

            return
        }
        if (!this.state.name) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">نام را وارد کنید</div>, life: 4000 });

            return
        }
        if (!this.state.address) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">آدرس را وارد کنید</div>, life: 4000 });

            return
        }
        if (!this.state.BirthDay) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">تاریخ تولد را وارد کنید</div>, life: 4000 });

            return
        }
        if (!this.state.Shenasname_Pic) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">تصویر شناسنامه را آپلود کنید</div>, life: 4000 });

            return
        }
        if (!this.state.CartMelli_Pic) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium"> تصویر کارت ملی را آپلود کنید</div>, life: 4000 });

            return
        }
        that.setState({
            loading: 1,
            disableForm:true
        })
        let param = {
            token: localStorage.getItem("api_token"),
            CodeMelli: this.state.CodeMelli,
            mobile: this.state.mobile,
            address: this.state.address,
            BirthDay: this.state.BirthDay.local("fa").format("jYYYY/jM/jD"),
            name: this.state.name,
            CartMelli_Pic: this.state.CartMelli_Pic,
            Shenasname_Pic: this.state.Shenasname_Pic,
            UId: this.state.UId
        };
        let SCallBack = function (response) {
            that.setState({
                loading: 0
            })
            that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات با موفقیت انجام شد</div>, life: 4000 });

        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0,
                disableForm:false
            })
            that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">عملیات انجام نشد</div>, life: 4000 });

            console.log(error)
        }
        this.Server.send("AdminApi/SetAccountReq", param, SCallBack, ECallBack)


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
                    disableForm:true,
                    loadedCount: percent
                })
                if (percent == "100") {
                    this.setState({
                        disableForm:false,
                        showLoadedCount: 0
                    })
                }

            }
        };
        axios.post(this.state.url2 + 'uploadFile', formData, config)
            .then((response) => {
                debugger;
                this.setState({
                    [name]: this.state.absoluteUrl + response.data.split("public")[1]
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {

        return (
            !this.state.ShowLoading ?
                <div>
                    <Header ComponentName="درخواست افتتاح حساب" />
                    <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
                    <div style={{ display: 'flex', height: '100%', justifyContent: 'space-between', flexDirection: 'column', padding: 8 }} >
                        {this.state.showLoadedCount > 0 &&
                            <ProgressBar value={this.state.loadedCount} />
                        }

                        <div>
                            <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>برای افتتاح حساب موارد زیر را به طور کامل تکمیل نمایید</p>
                            <p style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>وضعیت افتتاح حساب شمااز طریق پیامک ارسال خواهد شد</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>کد ملی</label>
                            <InputText disabled={this.state.disableForm} value={this.state.CodeMelli} keyboardType="default" name="CodeMelli" onChange={(text) => {
                                this.setState({
                                    CodeMelli: text.target.value
                                })
                            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

                        </div>
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>تلفن همراه</label>

                            <InputText disabled={this.state.disableForm} value={this.state.mobile} keyboardType="default" placeholder="" name="mobile" onChange={(text) => {
                                this.setState({
                                    mobile: text.target.value
                                })
                            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

                        </div>
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>نام و نام خانوادگی</label>

                            <InputText disabled={this.state.disableForm} value={this.state.name} keyboardType="default" placeholder="" name="name" onChange={(text) => {
                                this.setState({
                                    name: text.target.value
                                })
                            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

                        </div>
                        <div style={{ textAlign: 'right' , marginTop: 15, width: '100%' }} className="DatePicker">
                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>تاریخ تولد</label>

                            <DatePicker
                            onChange={value => this.setState({ BirthDay: value })}
                            value={this.state.BirthDay}
                            style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%', marginTop: 15 }}
                            isGregorian={false}
                            timePicker={false}
                            placeholder=""
                            persianDigits={false}
                            disabled={this.state.disableForm}
                            />
                            </div>
                        <div style={{ textAlign: 'right', marginTop: 15 }}>
                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>آدرس</label>

                            <InputText disabled={this.state.disableForm} value={this.state.address} keyboardType="default" placeholder="" name="address" onChange={(text) => {
                                this.setState({
                                    address: text.target.value
                                })
                            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

                        </div>
                        <div style={{ textAlign: 'right', marginTop: 15 }}>

                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>آپلود تصویر کارت ملی</label>
                            <InputText disabled={this.state.disableForm} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} className="form-control yekan" keyboardType="default" placeholder="" autoComplete="off" onChange={this.FileUpload} type="file" id="CartMelli_Pic" name="CartMelli_Pic" />


                        </div>
                        <div style={{ textAlign: 'right', marginTop: 15 }}>

                            <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>آپلود تصویر شناسنامه</label>
                            <InputText disabled={this.state.disableForm} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} className="form-control yekan" keyboardType="default" placeholder="" autoComplete="off" onChange={this.FileUpload} type="file" id="Shenasname_Pic" name="Shenasname_Pic" />


                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Button disabled={this.state.disableForm} className="YekanBakhFaMedium" style={{ marginTop: 50, padding: 12 }}>
                                <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17, fontFamily: 'YekanBakhFaMedium' }} onClick={() => this.SetAccountReq()} >ثبت درخواست</span>
                            </Button>
                        </div>
                    </div>

                </div>
                :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <ProgressSpinner style={{ paddingTop: 150 }} />
                </div>




        );
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
export default connect(mapStateToProps)(New)  

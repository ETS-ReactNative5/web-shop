import React from 'react';
import { connect } from "react-redux"
import Header from '../Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import Form from '../Form.js'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { InputText } from 'primereact/inputtext';

import Server from '../Server.js'


class Support extends React.Component {

    constructor(props) {
        super(props);

        this.Server = new Server();


        this.state = {
            ShowLoading: true,
            userData: {},
            scoreLog: [],
            scoreRows: [],
            score: -1,
            AccountNumber: !this.props.shop ? this.props.location.search.split("account=")[1] : null,
            offRows: [],
            offRows_temp: [],
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl(),
            url2: this.Server.getUrl(1)

        }

    }

    ConvertNumToFarsi(text) {
        var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        if (!text)
            return text;
        return text.toString().replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    }
    componentDidMount() {

        this.getuserInfo();
    }
    getUnit(All) {
        let that = this;
        let condition = All ? {} : { usersList: { $elemMatch: { "username": this.state.userData.username } } };
        this.Server.send("AdminApi/getUnitsList", { condition: condition }, function (response) {
            if (!All) {
                that.setState({
                    myUnit: response.data.result[0],
                    ShowLoading: false

                })
                that.getCode();
            } else {
                let SendToArray = [];
                for (let i = 0; i < response.data.result.length; i++) {
                    SendToArray.push({ value: response.data.result[i].lTitle, desc: response.data.result[i].fTitle })
                }
                that.setState({
                    Units: response.data.result,
                    SendToArray: SendToArray,
                    ShowLoading: false

                })
                that.getUnit()

            }


        }, function (error) {
            that.setState({
                ShowLoading: false
            })
        })
        this.setState({
            ShowLoading: true
        })
    }
    getCode() {
        let that = this;
        let SCallBack = function (response) {
            let val = response.data.result[0].values;
            let SendToArray = that.state.SendToArray;
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    SendToArray.push({ value: val[i].value, desc: val[i].desc })
                }
            }

            that.setState({
                SendToArray: SendToArray,
                loading: 0
            })
        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
        }
        this.Server.send("AdminApi/GetCodes", { id: "5" }, SCallBack, ECallBack)
    }
    getuserInfo() {
        let that = this;
        this.Server.send("MainApi/getUserData", { Key: "username", mobile: this.props.mobile }, function (response) {
            that.setState({
                userData: response.data.result[0]
            })
            that.getUnit(1);
        }, function (error) {
            that.setState({
                ShowLoading: false
            })
        })
        this.setState({
            getUserData: 0,
            ShowLoading: true
        })

    }
    getResponse() {

        this.getuserInfo();
    }

    render() {

        return (
            !this.state.ShowLoading ?
                <div>
                    <div>
                        <Header credit={this.state.credit} noName={1} ComponentName="سیستم پشتیبانی" />

                    </div>
                    <div>
                        <div style={{ padding: 10 }}>
                            <div style={{ textAlign: 'right', marginTop: 15 }}>
                                <label style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }}>موضوع</label>

                                <InputText disabled={this.state.disableForm} value={this.state.LaonMobile} keyboardType="default" placeholder="" name="LaonMobile" onChange={(text) => {
                                    this.setState({
                                        LaonMobile: text.target.value
                                    })
                                }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />

                            </div>

                            <div>
                                <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5, marginTop: 10 }}>متن پیام</label>

                                <div  >

                                    <textarea className="form-control YekanBakhFaMedium" autocomplete="off" style={{ border: '1px solid #ced4da', borderRadius: 5, textAlign: 'right', width: '100%', height: 150, marginTop: 40 }} type="number" id="NewAddress" value={this.state.NewAddress} name="NewAddress" onChange={(e) => this.setState({ NewAddress: e.target.value })} required />
                                </div>
                            </div>
                            <div className="col-12 col-lg-3" style={{ textAlign: 'right',direction:'rtl'}}>
                            <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5, marginTop: 10 }}>ارجاع به ...</label>
                            <select  style={{ width: '100%', height: 40,marginTop:40 }} placeholder="ارجاع به ..." className="form-control YekanBakhFaMedium" id={this.state.SendTo} name="SendTo" value={this.state.SendTo} onChange={(event) => { this.setState({ SendTo: event.target.value }) }} >
                            <option value="" ></option>
                            {this.state.SendToArray && this.state.SendToArray.map((item, index) => {
                                return (
                                                <option value={item.value} >{item.desc}</option>
                                       
                                )
                            })}
                            </select>

                            </div>
                            <div className="col-12 col-lg-3" style={{ textAlign: 'right',direction:'rtl'}}>

                            <Button className="YekanBakhFaMedium"  style={{ marginTop: 20, padding: 4 }}>
                                <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17, fontFamily: 'YekanBakhFaMedium' }}  >ثبت درخواست</span>
                            </Button>
                            </div>


                        </div>


                        <Dialog header={this.state.DialogHeader} visible={this.state.ShowDialog} maximized={true} onHide={() => {
                            this.setState({
                                ShowDialog: false
                            });
                        }
                        }>
                            <div>

                            </div>

                        </Dialog>



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
export default connect(mapStateToProps)(Support)


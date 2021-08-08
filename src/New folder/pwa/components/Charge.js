
import React, { Component } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import Server from './Server.js'
import { connect } from "react-redux"
import Header from './Header.js'
import { Toast } from 'primereact/toast';

import { ProgressSpinner } from 'primereact/progressspinner';

class Charge extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.toast = React.createRef();

        this.state = {
            AccountNumber: this.props.location.search.split("account=")[1],
            Place: this.props.place,
            listViewData: [],
            Sort: "",
            ShowLoading: false,
            Operators: [{ name: <div style={{padding:5}}><img src='./icons/rightel2.png' style={{ width: 50, padding: 5 }} /></div>, value: 'RTL' }, { name: <div style={{padding:5}}><img src='./icons/mtn2.png' style={{ width: 50 }} /></div>, value: 'MTN' }, { name: <div style={{padding:5}}><img src='./icons/mci2.png' style={{ width: 50 }} /></div>, value: 'MCI' }],
            Operator: 'MCI',
            Amounts: [{ name: "1000 تومانی", value: "1000" }, { name: "2000 تومانی", value: "2000" }, { name: "5000 تومانی", value: "5000" }, { name: "10000 تومانی", value: "10000" }, { name: "20000 تومانی", value: "20000" }],
            mobile: this.props.mobile,
            amount: 0,
            pay_type: "credit",
            charge_type: "normal",
            method: "topup",
            AccList: [],
            TransferAccount: "2045800"
            
        }
        this.Verify = this.Verify.bind(this);
        this.Transfer = this.Transfer.bind(this);
        this.GetAccounts();

    }
    inax(method) {
        let that = this;
        that.setState({
            ShowLoading:true
        })
        that.Server.send("MainApi/inax", {
            "method": method,
            "operator": this.state.Operator,
            "amount": this.state.amount,
            "mobile": this.state.mobile,
            "charge_type": this.state.charge_type,
            "pay_type": this.state.pay_type,
            "order_id": this.state.Order_Id
        }, function (response) {
            if(response.data.result && response.data.result.code != 1){
                let msg = response.data.result.msg ? response.data.result.msg : 'در این لحظه امکان خرید شارژ از سامانه وجود ندارد';
                that.setState({
                    ShowLoading: false,
                    AfterSend:0,
                    AccDialog:0
                })
                that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{msg}</div>, life: 8000 });
                if(method == "topup"){
                    that.savePayment(1,0);
                }
                return;
            }
            if(method == "credit"){
                if(response.data.result && response.data.result.code == 1){
                    that.setState({
                        AccDialog: true,
                        ShowLoading:false
                    })
                }
                else
                {
                    that.setState({
                        ShowLoading:false
                    })
                    that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">در این لحظه امکان خرید شارژ از سامانه وجود ندارد</div>, life: 8000 });

                }
                
            }else{
                if(method == "topup"){
                    
                    that.setState({
                        ShowLoading:false,
                        RefId:response.data.result.ref_code
                    }) 
                    
                    that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium">شارژ انجام شد</div>, detail: <div className="YekanBakhFaMedium">
                    <div>رسید شارژ : {response.data.result.ref_code}</div>
                    <div>رسید تراکنش : {that.state.ResidNumber}</div>
                </div>, life: 8000 });

                }else{
                    that.setState({
                        ShowLoading:false
                    })
                }
                
            }
            
        }, function (error) {
            that.setState({
                loading: 0
            })
        })
    }
    Verify() {
        if(!this.state.amount){
            this.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">مبلغی را انتخاب کنید</div>, life: 8000 });
            return;
        }
        this.inax("credit")
    }
    Transfer() {
        let that = this;
        
        let ip = that.props.ip || "https://ansar24.com";

        if (!this.state.AfterSend) {
            let SCallBack = function (response) {

                that.setState({
                    ShowLoading: false
                })
                let resp = [];
                for (let i = 0; i < response.length; i++) {
                    resp[i] = response[i].children;

                }
                if (resp[0][0].name == "ERROR") {
                    that.setState({
                        AccDialog: false
                    })
                    that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 8000 });

                    return;
                }
                that.setState({
                    ticketNo:resp[0][0] ? resp[0][0].value : '',
                    AfterSend: true
                })
                that.savePayment(null,0);

            }
            let ECallBack = function (error) {
                that.setState({
                    ShowLoading: false
                })
            }
            that.setState({
                ShowLoading: true
            })

            let amount = this.state.amount.toString().replace(/,/g, "")+"0";
            let Param1 = this.state.TransferAccount + ";" + amount + ";";
            var param = '{CommandNo : "72" , AccountNo: "' + that.state.Account + '",Param1: "' + Param1 + '" }';

            that.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

        }
        if (this.state.AfterSend) {
            let SCallBack = function (response) {

                that.setState({
                    ShowLoading: false
                })
                let resp = [];
                for (let i = 0; i < response.length; i++) {
                    resp[i] = response[i].children;

                }
                if (resp[0][0] && resp[0][0].name == "ERROR" || !resp[0][1]) {
                    that.setState({
                        AccDialog: false
                    })
                    that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 8000 });

                    return;
                }
                
                that.setState({
                    SanadNumber: resp[0][0] ? resp[0][0].value : '',
                    ResidNumber: resp[0][1] ? resp[0][1].value : '',
                    AccDialog:false
                })
                that.savePayment(1,1);




            }
            let ECallBack = function (error) {
                that.setState({
                    ShowLoading: false
                })
            }
            that.setState({
                AfterSend:false,
                ShowLoading: true
            })
            var SecCode = this.state.SecCode;
            var FDesLocalChanged = "خرید شارژ";
            let amount = this.state.amount.toString().replace(/,/g, "")+"0";
             
            var Param1 = this.props.username + ';' + this.state.Account + ';' + this.state.TransferAccount + ";" + amount + ";" + FDesLocalChanged + ";;;0;0;;";
            var param = '{CommandNo : "73" , AccountNo: "' + that.state.ticketNo + '",Param1: "' + Param1 + '" }';
            that.Server.sendRaymand("" + that.props.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

        }


    }
    savePayment(edit,status){
        
        let that = this;
        that.setState({
            ShowLoading: true
        })
        that.Server.send("MainApi/extraPayment", {
            username: this.props.mobile,
            RaymandAcc: this.state.Account  ,
            RaymandId: this.props.account,
            Amount:this.state.amount,
            type:2,
            desc:'خرید شارژ'+this.state.Operator + ','+this.state.amount+ ','+this.state.mobile,
            scoreName:"mobile_charge",
            status:status,
            edit:edit,
            RefId:this.state.RefId,
            reqTime:this.state.reqTime,
            reqDate:this.state.reqDate,
        }, function (response) {
            that.setState({
                reqDate:response.data.reqDate,
                reqTime:response.data.reqTime,
                ShowLoading: false,
                Order_Id:that.state.ResidNumber
            })
            if(edit && status){
                 that.inax("topup");
            }
            if(!edit){
                that.Transfer();
            }
            if(edit && !status && that.state.ResidNumber){
                that.FaileTransfer();
           }

        }, function (error) {
            that.setState({
                ShowLoading: 0
            })
        })
    }
    FaileTransfer(){
        this.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در خرید شارژ</div>, detail: <div className="YekanBakhFaMedium">وجه برداشت شده تا 48 ساعت آینده به حساب شما باز خواهد گشت</div>, life: 8000 });

    }
    GetAccounts() {
        let that = this;

        let SCallBack = function (response) {

            let data = [];
            let resp = [];
            for (let i = 0; i < response.length; i++) {
                resp[i] = response[i].children;

            }
            for (let i = 0; i < resp.length; i++) {
                for (let j = 0; j < resp[i].length; j++) {
                    if (resp[i][j].name == "A_Kind") {
                        if (resp[i][j].value == "5")
                            data.push(resp[i])
                    }

                }
            }
            let AccList = [];
            for (let i = 0; i < data.length; i++) {
                AccList[i] = { value: data[i][1].value, label: data[i][3].value + "(" + data[i][1].value + ")" }
            }
            that.setState({
                AccList: AccList,
                Account: AccList.length > 1 ? null : AccList[0].value,
                ShowLoading: false
            })
            that.getUser(1);

        }
        let ECallBack = function (error) {
            that.setState({
                ShowLoading: false
            })
        }

        var param = '{CommandNo : "3" , AccountNo: "' + that.props.account + '",Param1: "' + that.props.password + '" }';
        let ip = that.props.ip || "https://ansar24.com";
        that.setState({
            ShowLoading: true
        })
        that.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack)
    }
    render() {


        return (

            <div>
                <Header credit={this.state.credit} ComponentName="شارژ تلفن همراه" />
                <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
                {!this.state.ShowLoading ?
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50, flexDirection: 'column', alignItems: 'center' }}>
                    
                    <SelectButton optionLabel="name" className="operatorBox" optionValue="value" value={this.state.Operator} options={this.state.Operators} onChange={(e) => {
                        this.setState({ Operator: e.value||"MCI" });

                    }}
                    ></SelectButton>
                    <div className="YekanBakhFaMedium" style={{ marginTop: 30, marginBottom: 30 }}>
                        خرید شارژ {this.state.Operator == "MCI" ? " همراه اول " : (this.state.Operator == "MTN" ? " ایرانسل " : " رایتل ")}
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                        {this.state.Amounts.map((item) => {
                            if (this.state.Operator != "RTL" || item.value != "1000") {
                                return (

                                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '50%' }}>
                                        <div style={{ direction: 'rtl' }}>

                                            <label className="YekanBakhFaMedium" style={{ direction: 'rtl' }} htmlFor={item.name}>{item.name}</label>
                                        </div>
                                        <div>

                                            <RadioButton inputId={item.name} value={item.value} name={item.name} onChange={(e) => this.setState({ amount: e.value })} checked={this.state.amount === item.value} />
                                        </div>
                                    </div>
                                )
                            }


                        })}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center', padding: 20 }}>
                        <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ borderRadius: 5, textAlign: 'center', width: '100%', height: 40 }} type="number" id="mobile" value={this.state.mobile} name="mobile" onChange={(e) => this.setState({ mobile: e.target.value })} required />
                        <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 25 }}>شماره موبایل</label>
                    </div>


                    <div style={{ marginTop: 65, display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Button className="YekanBakhFaMedium p-button-success" onClick={this.Verify} style={{ textAlign: 'center', borderRadius: 15, width: '80%' }}> <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 21 }} >پرداخت و شارژ</span> </Button>

                    </div>
                </div>
                :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
                  <ProgressSpinner style={{ paddingTop: 150 }} />
                </div>
                }

                
                <Dialog header="" visible={this.state.AccDialog} maximized={true} onHide={() => {
                    this.setState({
                        AccDialog: false
                    });
                }
                }>

                    {!this.state.ShowLoading ?
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%', flexDirection: 'column' }} >
                        <div className="YekanBakhFaMedium">
                            شارژ {this.state.Operator == "MCI" ? " همراه اول " : (this.state.Operator == "MTN" ? " ایرانسل " : " رایتل ")}
                        </div>
                        <div className="YekanBakhFaMedium">
                            تلفن همراه : {this.state.mobile}
                        </div>
                        <div className="YekanBakhFaMedium">
                            مبلغ : {this.state.amount} تومان
                    </div>
                        <div className="YekanBakhFaMedium" style={{ height: '50px' }}></div>
                        {this.state.AccList.length > 1 &&
                            <Dropdown style={{ width: '90%', textAlign: 'right' }} value={this.state.Account} options={this.state.AccList} onChange={(e) => this.setState({ Account: e.value })} placeholder="حساب خود را انتخاب کنید" />
                        }
                        {this.state.Account &&
                            <div className="YekanBakhFaMedium" style={{ marginTop: 20 }}>
                                برداشت از حساب : {this.state.Account}
                            </div>
                        }
                        <div style={{ width: '100%', textAlign: 'right', marginTop: 50, display: 'flex', justifyContent: 'center' }}>
                            <Button className="YekanBakhFaMedium p-button-success" onClick={this.Transfer} style={{ textAlign: 'center', borderRadius: 15, width: '80%' }}> <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 21 }} >تایید پرداخت و شارژ</span> </Button>

                        </div>
                    </div>
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
                      <ProgressSpinner style={{ paddingTop: 150 }} />
                    </div>
                    }

                </Dialog>

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
export default connect(mapStateToProps)(Charge)



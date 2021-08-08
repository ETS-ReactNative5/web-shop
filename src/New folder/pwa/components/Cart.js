import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header from './Header.js'
import CartBox from './CartBox.js'
import Cities from './Cities.js'
import { Dropdown } from 'primereact/dropdown';

import { Link } from 'react-router-dom'
import MainBox3 from './MainBox3.js'
import Footer from './Footer.js'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './Cart.css'
import CatList from './CatList.js'
import { InputNumber } from 'primereact/inputnumber';

import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner';

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.Payment = this.Payment.bind(this);
        this.computeReduce = this.computeReduce.bind(this);
        this.Server = new Server();
        this.toast = React.createRef();
        this.Transfer = this.Transfer.bind(this);

        this.state = {
            GridData: [],
            layout: 'list',
            AccList:[],
            lastPrice: 0,
            CartItemsGet: 0,
            CartNumber: 0,
            userId: null,
            ShowLoading: false,
            pleaseWait: false,
            AcceptAddress: false,
            StepNumber: 1,
            Address: "",
            StepVertical: 0,
            refId: null,
            EndMessage: "",
            ActiveBank: "inPlace",
            ActiveSms: "none",
            PriceAfterCompute: 0,
            finalCreditReducer: 0,
            TypeOfPayment: '2',
            TransferAccount: "2045800",
            info: this.Server.getInfo(),
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }


    }
    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    roundPrice(price) {
        return price.toString();
        if (price == 0)
            return price;
        price = parseInt(price).toString();
        let C = "500";
        let S = 3;
        if (price.length <= 5) {
            C = "100";
            S = 2;
        }
        if (price.length <= 4) {
            C = "100";
            S = 2;
        }
        let A = price.substr(price.length - S, S)
        if (A == C || A == "000" || A == "00")
            return price;
        if (parseInt(A) > parseInt(C)) {
            let B = parseInt(A) - parseInt(C);
            return (parseInt(price) - B + parseInt(C)).toString();
        } else {
            let B = parseInt(C) - parseInt(A);
            return (parseInt(price) + B).toString();
        }


    }
    getHeaderResponse(){
        this.setState({
            WaitingPayment: 0
        })
    }
    Payment() {
        let that = this;
        if (!this.state.AcceptAddress) {
            axios.post(this.state.url + 'getuserInformation', {
                user_id: this.state.userId
            })
                .then(response => {
                    that.setState({
                        Address: response.data.result[0].address,
                        SelectedCity: response.data.result[0].city,
                        SelectedSubCity: response.data.result[0].subCity,
                        AcceptAddress: true,
                        StepNumber: 2
                    })
                }).catch(error => {
                    console.log(error)
                })
            return;
        } else {
            if (this.state.ActiveBank == "inRaymand" && !this.state.RaymandPayed) {
                that.setState({
                    AccDialog:true
                })
                return;
            }
            if (this.state.lastPrice != 0) {
                let user_id = that.state.GridData[0].user_id;
                let products_id = [];
                for (let i = 0; i < this.state.GridData.length; i++) {
                    if (this.state.GridData[i].products[0])
                        products_id.push({
                            _id: this.state.GridData[i].product_id, SellerId: ((this.state.GridData[i].product_detail && this.state.GridData[i].product_detail[0]) ? this.state.GridData[i].product_detail[0].SellerId : this.state.GridData[i].products[0].SellerId), SellerName: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].name : "")
                            , SellerAddress: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].address : ""), SellerLat: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].latitude : ""), SellerLon: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].longitude : "")
                            , SellerMobile: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].mobile : ""), number: this.state.GridData[i].number, CatId: this.state.GridData[i].products[0].category_id, title: this.state.GridData[i].products[0].title, subTitle: this.state.GridData[i].products[0].subTitle, desc: this.state.GridData[i].products[0].desc, price: (this.roundPrice(this.state.GridData[i].number * this.state.GridData[i].price)), UnitPrice: this.state.GridData[i].price, credit: this.state.GridData[i].getFromCredit, SellerId: this.state.GridData[i].products[0].SellerId,MehrCommission:this.state.GridData[i].Seller[0].MehrCommission, fileUploaded: this.state.GridData[i].products[0].fileUploaded, status: "0", color: this.state.GridData[i].Color, size: this.state.GridData[i].Size
                        });
                }
                that.setState({
                    StepNumber: 3
                })

                let url = that.state.ActiveBank == "z" ? this.state.url + 'payment' : this.state.url + 'payment2';
                axios.post(url, {
                    paykAmount: this.state.paykAmount,
                    Amount: parseInt(this.state.lastPrice),
                    finalAmount: parseInt(this.state.lastPrice) + parseInt(this.state.paykAmount),
                    Credit: this.state.finalCreditReducer,
                    userId: this.state.userId,
                    products_id: products_id,
                    SaleFromMultiShops: this.state.SaleFromMultiShops,
                    SeveralShop: this.state.SeveralShop,
                    needPay: (that.state.ActiveBank == "none" || that.state.ActiveBank == "inPlace" || that.state.ActiveBank == "inRaymand") ? 0 : 1,
                    InRaymand: that.state.ActiveBank == "inRaymand" ? 1 : 0
                })
                    .then(response => {
                        if (that.state.ActiveBank != "none" && that.state.ActiveBank != "inPlace" && that.state.ActiveBank != "inRaymand") {
                            let res;
                            if (that.state.ActiveBank == "p") {
                                res = response.data.result ? response.data.result.SalePaymentRequestResult : {};
                                if (res.Token > 0 && res.Status == "0") {
                                    that.setState({
                                        WaitingPayment:1
                                    })
                                   
                                    var x = setInterval(function () {
                                        axios.post(that.state.url + 'factorStatus', {
                                            token: localStorage.getItem("api_token"),
                                            paymentId:response.data.insertedId
                                        }).then(response => {
                                            if(response.data.result[0].refId){
                                                that.setState({
                                                    WaitingPayment:0,
                                                    GridData: [],
                                                    refId: response.data.result[0].refId,
                                                    EndMessage: <div className="YekanBakhFaMedium"> کد رهگیری سفارش : {that.persianNumber(response.data.result[0].refId)} <br /><br /><p className="YekanBakhFaMedium" style={{ fontSize: 25 }}>سفارش شما ثبت شد <br /> </p> </div>

                                                })
                                            }
                                            
                                                
                                        }).catch(error => {
                                                console.log(error)
                                        })
                                        if(!that.state.WaitingPayment) 
                                           clearInterval(x);
                                    }, 10000);
                                    window.location = "https://pec.shaparak.ir/NewIPG/?token=" + res.Token;
                                    //window.open("https://pec.shaparak.ir/NewIPG/?token=" + res.Token,"_blank");
                                } else {
                                    this.toast.current.show({ severity: 'error', summary: <div> {res.Message} <br />برای اتمام خرید می توانید در زمان دیگری مراجعه کنید یا از امکان پرداخت در محل استفاده کنید</div>, life: 8000 });
                                }
                            } else if (that.state.ActiveBank == "z") {
                                res = response.data.result;
                                window.location = res;
                            }
                        } else {
                            /* 

                            that.props.dispatch({
                                type: 'LoginTrueUser',
                                CartNumber: 0,
                                off: that.props.off,
                                credit: response.data.credit,
                                username: that.props.username,
                                password: that.props.password,
                                ip: that.props.ip,
                                account: that.props.account,
                                place: that.props.place,
                                placeName: that.props.Logo,
                                fullname: that.props.fullname,
                                Address: that.props.Address,
                                mobile:that.props.mobile

                            })*/
                            that.setState({
                                GridData: [],
                                refId: response.data.refId,
                                EndMessage: <div className="YekanBakhFaMedium"> کد رهگیری سفارش : {that.persianNumber(response.data.refId)} <br /><br /><p className="YekanBakhFaMedium" style={{ fontSize: 25 }}>سفارش شما ثبت شد <br /> </p> </div>

                            })
                            if (this.state.ActiveSms != "none") {

                                    let SmsUrl = this.state.ActiveSms == "smsir" ? this.state.url + 'sendsms_SmsIr' : this.state.url + 'sendsms_smartSms';
                                    axios.post(SmsUrl, {
                                        text: 'سفارش شما ثبت شد . کد رهگیری سفارش : ' + that.persianNumber(response.data.refId) + '' + '\n' + that.state.STitle,
                                        mobileNo: response.data.result
                                    })
                                        .then(response => {


                                        })
                                        .catch(error => {

                                        })
                                

                            }


                        }

                    }).catch(error => {
                        console.log(error)
                    })
            } else {

            }



        }

    }
    componentDidMount() {
        let that = this;
        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                this.setState({
                    userId: response.data.authData.userId,
                    credit: response.data.authData.credit ? response.data.authData.credit.toString().substr(0,response.data.authData.credit.toString().length-1) : 0,
                    levelOfUser: response.data.authData.levelOfUser
                })

                axios.post(this.state.url + 'getSettings', {
                    token: localStorage.getItem("api_token")
                })
                    .then(response => {
                        that.setState({
                            ActiveBank: "inPlace"/*response.data.result ? response.data.result.ActiveBank : "none"*/,
                            OriginalActiveBank: response.data.result ? response.data.result.OriginalActiveBank : "none",
                            ActiveSms: response.data.result ? response.data.result.ActiveSms : "none",
                            STitle: response.data.result ? response.data.result.STitle : "",
                            ProductBase: response.data.result ? response.data.result.ProductBase : false,
                            SaleFromMultiShops: response.data.result ? response.data.result.SaleFromMultiShops : false,
                            SeveralShop: response.data.result ? response.data.result.SeveralShop : false,

                        })
                        that.GetAccounts();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                that.setState({
                    ShowLoading: false
                })
                console.log(error)
            })
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
                    that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

                    return;
                }
                that.setState({
                    ticketNo: resp[0][0] ? resp[0][0].value : '',
                    AfterSend: true
                })
                that.Transfer();

            }
            let ECallBack = function (error) {
                that.setState({
                    ShowLoading: false
                })
            }
            
            let amount = this.state.lastPrice.toString().replace(/,/g, "") + "0";
            var SecCode = this.state.SecCode;
            
            that.setState({
                ShowLoading: true,
                ticketNo:null
            })
            let Param1 = this.state.TransferAccount + ";" + amount + ";";

            var param = '{CommandNo : "72" , AccountNo: "' + that.state.Account + '",Param1: "' + Param1 + '" }';

            that.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

        }
        if (this.state.AfterSend) {
            let SCallBack = function (response) {
                that.setState({
                    ShowLoading: false,
                    AfterSend:false
                })
                let resp = [];
                for (let i = 0; i < response.length; i++) {
                    resp[i] = response[i].children;

                }
                if (resp[0][0] && resp[0][0].name == "ERROR" || !resp[0][1]) {
                    that.setState({
                        AccDialog: false
                    })
                    that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

                    return;
                }
                that.setState({
                   
                })
                that.setState({
                    SanadNumber: resp[0][0] ? resp[0][0].value : '',
                    ResidNumber: resp[0][1] ? resp[0][1].value : '',
                    WaitingPayment:0,
                    refId: resp[0][1] ? resp[0][1].value : '',
                    EndMessage: <div className="YekanBakhFaMedium"> کد رهگیری سفارش : {that.persianNumber(resp[0][1] ? resp[0][1].value : '')} <br /><br /><p className="YekanBakhFaMedium" style={{ fontSize: 25 }}>سفارش شما ثبت شد <br /> </p> </div>,
                    AccDialog: false,
                    RaymandPayed:1
                })
                that.Payment();
                that.toast.current.show({
                    severity: 'success', summary: <div className="YekanBakhFaMedium">خرید انجام شد</div>, detail: <div className="YekanBakhFaMedium">
                        <div>سند : {resp[0][0] ? resp[0][0].value : ''}</div>
                        <div>رسید تراکنش : {resp[0][1] ? resp[0][1].value : ''}</div>
                    </div>, life: 4000
                });



            }
            let ECallBack = function (error) {
                that.setState({
                    ShowLoading: false,
                    AfterSend:false
                })
            }
            that.setState({
                ShowLoading: true
            })
            
             
            var FDesLocalChanged = "خرید از سایت";
            let amount = this.state.lastPrice.toString().replace(/,/g, "") + "0";

            var Param1 = this.props.username + ';' + this.state.Account + ';' + this.state.TransferAccount + ";" + amount + ";" + FDesLocalChanged + ";;;0;0;;";
            var param = '{CommandNo : "73" , AccountNo: "' + that.state.ticketNo + '",Param1: "' + Param1 + '" }';
            that.Server.sendRaymand("" + that.props.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

        }


    }
    
    GetAccounts() {
        let that = this; 
        let SCallBack = function (response) {
            that.getCartItems();
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

        }
        let ECallBack = function (error) {
            that.getCartItems();

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
    
    getCartItems() {
        let that = this;
        this.setState({
            lastPrice: 0,
            orgLastPrice: 0,
            paykAmount: 0
        })
        let param = {
            UId: this.state.userId,
            levelOfUser: this.state.levelOfUser/*,
            token: localStorage.getItem("api_token_admin"),*/

        };
        let SCallBack = function (response) {
            let lastPrice = 0,
                CartNumber = 0;
            let paykAmount = [],
                LastPaykAmount = 0,
                PrepareTime = [],
                forceChangeItem = [];
            response.data.result.map((res) => {

                if (res.price)
                    lastPrice += res.number * parseInt(that.roundPrice(res.price));
                PrepareTime.push(that.state.ProductBase ? res.products[0].PrepareTime : (res.Seller[0].PreparTime || "30"));
                CartNumber += parseInt(res.number);
                if (res.PeykInfo && res.PeykInfo.length > 0) {
                    if (res.Category && res.Category.length > 0) {
                        res.PeykInfo[1].SendToCity = res.Category[0].SendToCity;
                        res.PeykInfo[1].SendToCountry = res.Category[0].SendToCountry;
                        res.PeykInfo[1].SendToNearCity = res.Category[0].SendToNearCity;
                        res.PeykInfo[1].SendToState = res.Category[0].SendToState;
                    }
                    switch (res.PeykInfo[2].userLocation) {
                        case 1: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToCity || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 2: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToNearCity || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 3: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToState || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 4: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToCountry || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                    }
                }

                if (parseInt(res.products[0].price) - (((parseInt(res.products[0].price) * ((parseInt(res.products[0].off || 0))))) / 100) != res.price) {
                    res.price = parseInt(res.products[0].price) - (((parseInt(res.products[0].price) * ((parseInt(res.products[0].off || 0))))) / 100);
                    if (that.toast.current)
                        that.toast.current.show({ severity: 'warn', summary: 'اصلاح سبد خرید', detail: <div> قیمت {res.products[0].title} تغییر کرده است <br /> سبد خرید شما با قیمت جدید به روز شد </div>, life: 8000 });
                    forceChangeItem.push(res);
                }
                if (res.products[0].number == 0) {
                    res.number = '0';
                    if (that.toast.current)
                        that.toast.current.show({ severity: 'warn', summary: 'اصلاح سبد خرید', detail: <div> محصول {res.products[0].title} ناموجود شده است <br /> از سبد خرید شما حذف شد </div>, life: 8000 });
                    forceChangeItem.push(res);
                }


            })
            let MargablePaykAmount = [],
                NotMargablePaykAmount = [];
            for (let i = 0; i < paykAmount.length; i++) {
                if (paykAmount[i].Marge)
                    MargablePaykAmount.push(paykAmount[i].Amount)
                else
                    NotMargablePaykAmount.push(paykAmount[i].Amount)
            }
            LastPaykAmount += NotMargablePaykAmount.reduce((a, b) => a + b, 0);
            LastPaykAmount += MargablePaykAmount.length > 0 ? Math.max(...MargablePaykAmount) : 0;
            that.setState({
                PrepareTime: Math.max(...PrepareTime),
                paykAmount: LastPaykAmount,
                lastPrice: lastPrice,
                orgLastPrice: lastPrice,
                GridData: response.data.result,
                CartNumber: CartNumber,
                CartItemsGet: 1,
                ShowLoading: false,
                CatId: (response.data.result[0] && response.data.result[0].products && response.data.result[0].products.length > 0) ? response.data.result[0].products[0].category_id : null
            })
            /*
            that.props.dispatch({
                type: 'LoginTrue',
                CartNumber: that.state.CartNumber,
                off: that.props.off,
                credit: that.state.credit != "undefined" ? that.state.credit : 0,
                username: that.props.username,
                password: that.props.password,
                ip: that.props.ip,
                account: that.props.account,
                place: that.props.place,
                placeName: that.props.Logo,
                fullname: that.props.fullname,
                Address: that.props.Address,
                mobile:that.props.mobile
            })*/
            /*Notification.open({   
             title: '',
             placement:'bottomStart',
             duration: 3500,
             description: (
               <div>
                 <p className="YekanBakhFaMedium">تعداد کالا ی موجود در سبد خرید <span style={{"color":"green"}}> {that.persianNumber(that.state.CartNumber)} </span> محصول</p>
               </div>
             )
           });*/
            setTimeout(function () {
                that.setState({
                    pleaseWait: false
                })
                if (forceChangeItem.length > 0)
                    that.forceChangeItems(forceChangeItem);
            }, 0)


        };
        let ECallBack = function (error) {
            that.setState({
                CartItemsGet: 1
            })
            console.log(error)
        }
        console.log(param)
        this.Server.send("MainApi/getCartPerId", param, SCallBack, ECallBack)
    }
    forceChangeItems(items) {
        if (items && items.length > 0)
            this.changeCart(items[items.length - 1].number, items[items.length - 1].product_detail_id || items[items.length - 1].product_id, items[items.length - 1].user_id, items, items[items.length - 1], 1);
        else
            this.getCartItems();
    }
    changeCart(number, product_id, user_id, items, item, forceChange) {
        let that = this;

        if (this.state.pleaseWait)
            return;
        this.setState({
            pleaseWait: true
        })
        this.debounce(
            axios.post(this.state.url + 'checktoken', {
                token: localStorage.getItem("api_token")
            })
                .then(response => {
                    let param = {
                        product_id: product_id,
                        user_id: response.data.authData.userId,
                        number: number == "0" ? "0" : number,
                        newPrice: item ? item.price : null
                    };
                    if (items)
                        items.pop();
                    let SCallBack = function (response) {
                        /*if(number == "0" && parseInt(item.getFromCredit) > 0){
                            let Comm = item.Seller[0].CreditCommission ? ((((parseInt(item.Seller[0].CreditCommission))*parseInt(item.getFromCredit))/100)): 0;
                            that.setState({
                                lastPrice:(parseInt(that.state.lastPrice) + parseInt(item.getFromCredit)) + Comm,
                                finalCreditReducer:parseInt(that.state.finalCreditReducer) - parseInt(item.getFromCredit)
                            })
                        }*/
                        //if(number=="0"){
                        that.setState({
                            lastPrice: that.state.orgLastPrice,
                            finalCreditReducer: 0
                        })
                        //}
                        that.setState({
                            pleaseWait: false
                        })
                        if (!forceChange) {
                            that.getCartItems();
                        } else {
                            that.forceChangeItems(items);
                        }

                    };
                    let ECallBack = function (error) {
                        that.setState({
                            pleaseWait: false
                        })
                        console.log(error)
                    }
                    that.Server.send("MainApi/changeCart", param, SCallBack, ECallBack)

                }).catch(error => {
                    that.setState({
                        pleaseWait: false
                    })
                    console.log(error)
                }), 1000)


    }
    itemTemplate(car, layout) {
        if (layout === 'list' && car && car.products[0]) {
            let pic = car.products[0].fileUploaded.split("public")[1] ? this.state.absoluteUrl + car.products[0].fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            let rowPrice = car.price//car.products[0].getFromCredit ? car.products[0].price : (car.products[0].price - (car.products[0].price * ((!car.products[0].NoOff ? parseInt(this.props.off) : 0)+car.products[0].off))/100);

            //let pic = car.products[0].fileUploaded.split("public")[1] ? 'http://localhost:3000/'+car.products[0].fileUploaded.split("public")[1] : 'http://localhost:3000/'+'nophoto.png';
            return (
                <div style={{ marginTop: 15 }}>
                    <div className="row" style={{ alignItems: 'center' }}>

                        <div className="col-lg-3 col-md-3  col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                            <Link  to={`${process.env.PUBLIC_URL}/Products?id=` + car.product_detail_id || car.products[0]._id} >
                                <img src={pic} style={{ height: "140px" }} name="pic3" onClick={this.Changepic} alt="" />
                            </Link>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12 YekanBakhFaLight" style={{ textAlign: 'right' }} >
                            <div style={{ paddingBottom: 5 }} className="YekanBakhFaBold">
                                {car.products[0].title}

                            </div>
                            {car.product_detail && car.product_detail.length > 0 &&
                                <div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>
                                        <i className="fal fa-umbrella" style={{ paddingLeft: 5 }}></i><span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                                    </div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>
                                        <i className="fal fa-id-card-alt" style={{ paddingLeft: 5 }}></i><span>{car.Seller[0].name} </span>
                                    </div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>

                                        <i className="fal fa-rocket" style={{ paddingLeft: 5 }}></i>
                                        {this.state.ProductBase ?
                                            <span>ارسال تا {this.persianNumber(car.product_detail[0].PrepareTime || "3")} روز کاری دیگر</span>
                                            :
                                            <span>ارسال تا {this.persianNumber(car.Seller[0].PrepareTime || "30")} دقیقه بعد از پرداخت</span>

                                        }


                                    </div>
                                </div>
                            }
                            <br />
                        </div>
                        <div className="col-12 mb-3">


                            <div className="col-12 YekanBakhFaMedium" style={{ textAlign: 'right' }}>
                                <InputNumber value={car.number}  inputStyle={{ borderRadius: 0, padding: 0, textAlign: 'center', fontSize: 20, width: 50 }} mode="decimal" showButtons onValueChange={(e) => { if (car.number == e.value) return; this.changeCart(e.value, car.product_detail_id || car.product_id, car.user_id) }} min={1} max={car.products[0].number} />

                            </div>

                            <div className="row" style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginTop: 30, marginBottom: 30 }} >

                                <div className="col-6 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                                    <span style={{ cursor: 'pointer' }} onClick={(e) => this.changeCart("0", car.product_detail_id || car.product_id, car.user_id)}>
                                        <i className="fal fa-trash-alt" style={{ paddingLeft: 5 }}></i><span>حذف</span>
                                    </span>


                                </div>

                                <div className="col-6 YekanBakhFaMedium " style={{ textAlign: 'center' }}>
                                    {car.Seller[0] && car.Seller[0].AllowCredit ?

                                        <div>

                                            <a className="YekanBakhFaMedium" style={{ color: 'green', cursor: 'pointer' }} href="javascript:void(0)" onClick={() => { this.setState({ displayReduse: car, ReducePrice: car.getFromCredit ? car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0, PriceAfterCompute: (car.number * parseInt(rowPrice)) }); return false; }}>کسر از کیف پول</a>

                                        </div>
                                        :
                                        <div>
                                            <label className="YekanBakhFaMedium">خرید آنلاین</label>

                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{ textAlign: 'left' }}>
                                {car.products[0].price != '-' &&
                                    <div>
                                        <div style={{ fontSize: 14 }}>
                                            {this.persianNumber(this.roundPrice(car.number * (parseInt(rowPrice).toString())).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان
                            </div>
                                        {car.getFromCredit != undefined && car.getFromCredit != 0 &&
                                            <div style={{ fontSize: 12, color: '#777', paddingTop: 5 }}>
                                                +{this.persianNumber(car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان از کیف پول
                            </div>
                                        }
                                    </div>
                                }
                            </div>

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
    computeReduce() {
        let item = this.state.displayReduse;
        let redusePrice = this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g, "") : 0;
        let getFromCredit = 0;
        for (let i = 0; i < this.state.GridData.length; i++) {
            if (this.state.GridData[i]._id != this.state.displayReduse._id)
                getFromCredit += this.state.GridData[i].getFromCredit ? this.state.GridData[i].getFromCredit : 0;
        }
        if (parseInt(redusePrice) > (item.OrgPrice ? (item.number * item.OrgPrice) : (item.number * item.price))) {
            alert('مقدار وارد شده از مبلغ محصول بیشتر است', 5000);
            return;
        }
        if (parseInt(redusePrice) > (parseInt(this.state.credit) - getFromCredit)) {
            alert('مقدار وارد شده بیش از مبلغ کیف پول شماست', 5000);
            return;
        }
        let price = item.OrgPrice ? (item.number * item.OrgPrice) : (item.number * item.price);//item.number*(parseInt((item.products[0].price - (item.products[0].price * ((!item.products[0].NoOff ? parseInt(this.props.off) : 0)+item.products[0].off))/100)))
        let Comm = item.Seller[0].CreditCommission ? (((parseInt(item.Seller[0].CreditCommission)) * parseInt(redusePrice)) / 100) : 0;
        //let Comm = 0;
        let lastPrice = price - parseInt(redusePrice) + Comm;
        if (lastPrice >= 0)
            this.setState({
                PriceAfterCompute: this.roundPrice(lastPrice),
                ShowAlarm: true
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
    convertNum(str){
        var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
           arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
         
            if(typeof str === 'string')
            {
              for(var i=0; i<10; i++)
              {
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
              }
            }
            return str;
      }
    EditAddress() {
        let that = this;
        if (!this.props.mobile)
            return;
        let mobile = this.props.mobile.length > 10 ? this.props.mobile.substring(1) : this.props.mobile;

        let param = {
            username: mobile,
            city: that.state.SelectedCity,
            subCity: that.state.SelectedSubCity,
            address: that.state.NewAddress
        };
        let SCallBack = function (response) {
            that.toast.current.show({ severity: 'success', summary: 'ویرایش آدرس', detail: <div className="YekanBakhFaMedium">آدرس با موفقیت ویرایش شد</div>, life: 8000 });
            that.setState({
                ShowDialog: false,
                getAddress: false,
                Address: that.state.NewAddress
            })

        };
        let ECallBack = function (error) {

        }
        that.Server.send("AdminApi/EditAddress", param, SCallBack, ECallBack)

    }
    getResponse(value) {
        this.setState({
            SelectedCity: value.SelectedCity,
            SelectedSubCity: value.SelectedSubCity
        })
    }

    render() {
        const renderDialogFooter = (name) => {
            return (
                <div>
                    <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="انصراف" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                    <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="تایید" disabled={!this.state.ShowAlarm} icon="pi pi-check" onClick={() => onHide(1)} autoFocus />
                </div>
            );
        }
        const onHide = (ok) => {
            let ReducePrice = this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g, "") : 0;


            if (ok) {
                let GridData = this.state.GridData;
                let Comm = 0;
                for (let i = 0; i < GridData.length; i++) {
                    Comm = GridData[i].Seller[0].CreditCommission ? (((parseInt(GridData[i].Seller[0].CreditCommission)) * parseInt(ReducePrice)) / 100) : 0;
                    
                    if (GridData[i]._id == this.state.displayReduse._id) {

                        if (!GridData[i].OrgPrice)
                            GridData[i].OrgPrice = GridData[i].price;


                        GridData[i].price = parseInt(GridData[i].OrgPrice) - (parseInt(ReducePrice) / GridData[i].number) + (Comm / GridData[i].number)
                        GridData[i].getFromCredit = parseInt(ReducePrice)

                    }

                }
                let lastPrice = 0,
                    finalCreditReducer = 0;
                for (let i = 0; i < GridData.length; i++) {
                    if (GridData[i].getFromCredit)
                        finalCreditReducer += parseInt(GridData[i].getFromCredit);
                    lastPrice += parseInt(GridData[i].price * GridData[i].number);
                }
                this.setState({
                    finalCreditReducer: finalCreditReducer,
                    lastPrice: lastPrice/*this.roundPrice(parseInt(this.state.orgLastPrice)+Comm-finalCreditReducer)*/,
                    GridData: GridData
                })
            }
            this.setState({
                displayReduse: false,
                ShowAlarm: false,
                ReducePrice: 0

            })
        }

        return (
            <div>

                <Header callback={this.getHeaderResponse.bind(this)} ComponentName="سبد خرید" small="1" />
                {(!this.state.ShowLoading && !this.state.WaitingPayment) ? 
                    <div>


                        <div className="row justify-content-center firstInPage" style={{ direction: 'rtl' }}   >
                            {this.state.CartNumber > 0 &&
                                <div className="col-12" style={{ textAlign: 'right', marginBottom: 20, padding: 10 }}>
                                    {(this.state.ActiveBank != 'none') && !this.state.refId &&
                                        <div>
                                            <p className="yekan" style={{ paddingTop: 20 }}>شیوه پرداخت</p>
                                        </div>
                                    }
                                    {(this.state.ActiveBank != 'none' && !this.state.refId) ?
                                        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #eee' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                                <RadioButton inputId="TypeOfPayment1" name="TypeOfPayment" value="1" onChange={(e) => { this.setState({ ActiveBank: 'p' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '1'} />
                                                <label htmlFor="TypeOfPayment1" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>
                                                    پرداخت اینترنتی <br />
                                                    آنلاین با تمامی کارت‌های بانکی
                                            </label>
                                            </div>
                                            {this.state.AccList.length > 0 &&
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                                                    <RadioButton inputId="TypeOfPayment3" name="TypeOfPayment" value="3" onChange={(e) => { this.setState({ ActiveBank: 'inRaymand' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '3'} />
                                                    <label htmlFor="TypeOfPayment3" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>
                                                        پرداخت از طریق حساب صندوق انصار الهدی
                                                </label>
                                                </div>
                                            }
                                            <div style={{ display: 'flex', marginBottom: 5 }}>
                                                <RadioButton inputId="TypeOfPayment2" name="TypeOfPayment" value="2" onChange={(e) => { this.setState({ ActiveBank: 'inPlace' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '2'} />
                                                <label htmlFor="TypeOfPayment2" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>پرداخت در محل</label>
                                            </div>
                                        </div>
                                        :
                                        <div>

                                        </div>
                                    }

                                </div>
                            }
                            {this.state.GridData.length > 0 &&
                                <div className="col-lg-3" style={{ textAlign: 'center' }}>

                                    <div style={{ padding: 10, borderRadius: 20 }}>

                                        <div style={{ textAlign: 'center', marginRight: 10, borderBottom: '1px solid #eee' }} >
                                            <p className="YekanBakhFaBold">موجودی کیف پول : {this.state.credit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>

                                        </div>
                                        {
                                            this.state.paykAmount > 0 &&
                                            <p className="YekanBakhFaMedium" style={{ fontSize: 14, textAlign: 'center', marginTop: 10, color: 'slategrey' }}>{this.persianNumber(this.state.paykAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان"} به عنوان هزینه ارسال به مبلغ سفارش اضافه شد</p>

                                        }
                                        <p className="YekanBakhFaMedium" style={{ textAlign: "center", marginTop: 40, borderBottom: "1px solid #eee" }}><span style={{ paddingLeft: 25 }}>مبلغ قابل پرداخت </span> <span style={{ color: '#a01212', fontSize: 25, marginTop: 50 }}> {this.state.lastPrice != "0" ? this.persianNumber((parseInt(this.state.paykAmount) + parseInt(this.state.lastPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان" : "        "}



                                            {
                                                this.state.finalCreditReducer > 0 &&
                                                <p className="YekanBakhFaMedium" style={{ fontSize: 12, marginTop: 10 }}>{this.persianNumber(this.state.finalCreditReducer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان"} از کیف پول شما کسر خواهد شد</p>

                                            }
                                        </span>  </p>
                                        {this.state.AcceptAddress &&

                                            <div>
                                            <p className="YekanBakhFaMedium" style={{ textAlign: 'center' }} >

                                                <span style={{ fontSize: 13 }}>سفارش شما به آدرس زیر ارسال می شود : </span> <br /><br />
                                                <span style={{ fontSize: 20, color: 'rgb(2 125 0)' }}>  {this.state.Address} </span>  <br /><br />
                                                <div onClick={() => {
                                                    this.setState({
                                                        ShowDialog: 1,
                                                        NewAddress: this.state.Address
                                                    })
                                                }} style={{ textDecoration: 'none', fontSize: 18, textDecorationStyle: 'underline' }} className="YekanBakhFaMedium">برای ویرایش آدرس اینجا کلیک کنید</div>
                                            </p>
                                            
                                            {this.state.TypeOfPayment == 3 &&
                                                <div  style={{display:'none'}}>
                                                <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 14 }}>کد انتقال وجه پیامک شده</label>

                                                <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent',border:'1px solid #ccc',  height: 60 }} type="number" id="SecCode" value={this.state.SecCode} name="SecCode" onChange={(e) => this.setState({ SecCode: e.target.value })} required />
                                                </div>
                                            }
                                            </div>
                                        }
                                        {(this.state.ActiveBank != "none" && this.state.ActiveBank != "inPlace" && this.state.ActiveBank != "inRaymand") ?
                                            <Button className="YekanBakhFaBold p-button-success" style={{ marginTop: 40, marginBottom: 10, padding: 10 }} disabled={(this.state.AcceptAddress && (!this.state.Address || this.state.Address == ""))} onClick={this.Payment}>{this.state.AcceptAddress ? <span style={{width:'100%'}}>پرداخت</span> : <span style={{width:'100%'}}>ادامه فرایند خرید</span>}  </Button>

                                            :
                                            <Button className="YekanBakhFaBold p-button-success" style={{ marginTop: 40, marginBottom: 10, padding: 10}} onClick={this.Payment}>{this.state.AcceptAddress ? <span style={{width:'100%'}}>ثبت نهایی</span> : <span style={{width:'100%'}}>ادامه فرایند خرید</span>}  </Button>

                                        }
                                    </div>

                                </div>
                            }
                            <div className="col-lg-8" style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                                <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                                {this.state.GridData.length > 0 ?
                                    <div>


                                        <DataView value={this.state.GridData} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>
                                    </div>
                                    :
                                    (
                                        this.state.refId ?
                                            <p style={{ textAlign: 'center', paddingTop: 50, fontSize: 25 }} className="YekanBakhFaBold">{this.state.EndMessage}</p>
                                            :
                                            (this.state.CartItemsGet
                                                ?
                                                <p style={{ textAlign: 'center', paddingTop: 50, marginBottom: 250, fontSize: 25 }} className="YekanBakhFaBold">سبد خرید شما خالی است</p>
                                                :
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <ProgressSpinner style={{ paddingTop: 150 }} />
                                                </div>

                                            )
                                    )


                                }
                            </div>

                        </div>
                    </div>
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        {this.state.WaitingPayment ?
                            <div style={{textAlign:'center'}}>
                                <p style={{ textAlign: 'center', paddingTop: 50, fontSize: 17,padding:10}} className="YekanBakhFaBold">در حال پردازش پرداخت لطفا منتظر باشید</p>
                                <ProgressSpinner />

                            </div>    
                        :
                            <ProgressSpinner style={{ paddingTop: 150 }} />
                        }
                        
                    </div>
                }


                <Sidebar header="کسر از کیف پول " visible={this.state.displayReduse} style={{ fontFamily: 'YekanBakhFaBold' }} footer={renderDialogFooter()} onHide={() => onHide()}>
                    <div className="col-12 mt-5 mb-3" style={{ textAlign: 'center' }}>
                        <h2 className="YekanBakhFaMedium" style={{ margin: 0 }}>کسر از کیف پول</h2>
                    </div>
                    <div className="row" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="col-12 mt-5" >
                            {this.state.ShowAlarm &&
                                <p className="YekanBakhFaBold" style={{ textAlign: 'center', color: 'red', textAlign: 'center', fontSize: 14 }}>
                                    <span>
                                        برای خرید این محصول مبلغ
                                        <br />
                                        &nbsp;
                    {this.state.PriceAfterCompute.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                    <br />
                     به صورت نقدی پرداخت خواهید کرد
                    </span>
                                    <span>
                                        &nbsp;
                                        و مبلغ
                                        <br />
                                        &nbsp;
                        {this.state.ReducePrice} تومان
                        <br />
                    از کیف پول شما کسر خواهد شد

                    </span>
                                </p>
                            }

                        </div>

                        <div className="col-12">
                            <p className="YekanBakhFaBold" style={{ textAlign: 'center' }}>موجودی کیف پول : <span style={{ fontStyle: 'bold' }}>{(parseInt(this.state.credit)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> تومان</p>
                            <p className="YekanBakhFaBold" style={{ textAlign: 'center' }}>موجودی قابل برداشت : {(parseInt(this.state.credit) - parseInt(this.state.finalCreditReducer)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>
                        </div>

                        <div style={{ marginTop: 35, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center' }}>
                            <input className="form-control YekanBakhFaMedium" autocomplete="off" style={{ textAlign: 'center', width: '100%', background: 'transparent', border: 1, borderBottom: '3px solid #eee', height: 40 }} id="ReducePrice" value={this.state.ReducePrice} name="ReducePrice" onChange={(event) => { 
                                let Amount = this.convertNum(event.target.value);

                                this.setState({ ReducePrice: Amount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","), ShowAlarm: false }) }} required />
                            <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 5 }}>مبلغ را وارد کنید</label>
                        </div>
                        <div className="col-md-12 col-12 mt-5  mb-5" style={{ textAlign: 'center', marginBottom: 25, marginTop: 25 }} >
                            <Button label="محاسبه مبلغ" onClick={this.computeReduce} style={{ fontFamily: 'YekanBakhFaBold' }} className="YekanBakhFaBold p-button-secondary" />

                        </div>

                        <Button style={{ fontFamily: 'YekanBakhFaBold', marginBottom: 25 }} label="انصراف" icon="pi pi-times" onClick={() => onHide()} />
                        <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="تایید" disabled={!this.state.ShowAlarm} icon="pi pi-check" className="btn btn-success" onClick={() => onHide(1)} autoFocus />



                    </div>
                    <div>

                    </div>
                </Sidebar >
                <Dialog header="" visible={this.state.ShowDialog} maximized={true} onHide={() => {
                    this.setState({
                        ShowDialog: false,
                        getAddress: false
                    });
                }
                }>
                    <div>
                        <p className="YekanBakhFaMedium" style={{ textAlign: 'right' }} >آدرس خود را در سیستم ثبت کنید</p>
                        <Cities callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity} />
                        <label className="YekanBakhFaMedium" style={{ position: 'absolute', right: 25,marginTop:10 }}>آدرس کامل پستی</label>

                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-around', width: '100%', position: 'relative', alignItems: 'center', padding: 20 }}>

                            <textarea className="form-control YekanBakhFaMedium" autocomplete="off" style={{ borderRadius: 5, textAlign: 'right', width: '100%', height: 150, marginTop: 20 }} type="number" id="NewAddress" value={this.state.NewAddress} name="NewAddress" onChange={(e) => this.setState({ NewAddress: e.target.value })} required />
                        </div>
                        <div className="button_container" style={{ textAlign: 'center' }}>
                            <Button color="success" style={{ marginBottom: 40, fontFamily: 'YekanBakhFaMedium', padding: 5 }} className="YekanBakhFaMedium p-button-primary" onClick={() => { this.EditAddress() }}>ثبت آدرس</Button>
                        </div>
                    </div>


                </Dialog>
                <Dialog header="" visible={this.state.AccDialog} maximized={true} onHide={() => {
                    this.setState({
                        AccDialog: false
                    });
                }
                }>

                    {!this.state.ShowLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%', flexDirection: 'column' }} >
                            <div className="YekanBakhFaMedium">
                                مبلغ قابل پرداخت {this.state.lastPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                            </div>
                            <div className="YekanBakhFaMedium">
                                کسر از کیف پول : {this.state.finalCreditReducer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
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
                                <Button className="YekanBakhFaMedium p-button-success" onClick={this.Transfer} style={{ textAlign: 'center', borderRadius: 5, width: '80%' }}> <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 21 }} >تایید پرداخت </span> </Button>

                            </div>
                        </div>
                        :
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <ProgressSpinner style={{ paddingTop: 150 }} />
                        </div>
                    }

                </Dialog>
            </div>

        )
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
        mobile: state.mobile,
        LoginAnia:state.LoginAnia
    }
}
export default withRouter(
    connect(mapStateToProps)(Cart)
);
import React, { Component } from 'react';
import Server  from './Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import axios from 'axios'  
import { connect } from 'react-redux';
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Header1  from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import {Link} from 'react-router-dom'  
import { Steps,Notification } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import MainBox3  from './MainBox3.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
import { Alert,Message } from 'rsuite';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './Cart.css'
import CatList from './CatList.js'
import { InputNumber } from 'primereact/inputnumber';


class Cart extends React.Component {
    constructor(props){
        super(props);
        //alert(1)
        this.itemTemplate = this.itemTemplate.bind(this);
        this.Payment = this.Payment.bind(this);
        this.computeReduce = this.computeReduce.bind(this);
        this.Server = new Server();
        this.state={
            GridData:[],
            layout: 'list',
            lastPrice : 0,
            CartItemsGet:0,
            CartNumber:0,
            userId:null,
            pleaseWait:false,
            AcceptAddress:false,
            StepNumber:1,
            Address:"",
            StepVertical:0,
            refId:null,
            EndMessage:"",
            ActiveBank:"none",
            ActiveSms:"none",
            PriceAfterCompute:0,
            finalCreditReducer:0,
            info:this.Server.getInfo(),
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }
      
       
    }
    debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    roundPrice(price){
        return price.toString();
        if(price==0)
            return price;
        price=parseInt(price).toString();
        let C="500";
        let S=3;
        if(price.length <= 5){
            C="100";
            S=2;
        }
        if(price.length <= 4){
            C="100";
            S=2;
        }
        let A = price.substr(price.length-S,S)
        if(A==C || A=="000" || A=="00")
          return price;
        if(parseInt(A) > parseInt(C)){
          let B=parseInt(A)-parseInt(C);
          return (parseInt(price) - B + parseInt(C)).toString();
        }else{
          let B = parseInt(C) - parseInt(A);
          return (parseInt(price) + B).toString();
        }    
    
    
    }
    Payment(){
        let that = this;
        if(!this.state.AcceptAddress){
            axios.post(this.state.url+'getuserInformation' , {
                user_id:this.state.userId
              }) 
              .then(response => {
                that.setState({
                    Address:response.data.result[0].address,
                    AcceptAddress:true,
                    StepNumber:2
                })
              }).catch(error => {
                 console.log(error)
               })
            return;
        }else{
            if(this.state.lastPrice != 0){
                let user_id = this.state.GridData[0].user_id;
                let products_id=[];
                for(let i=0;i<this.state.GridData.length;i++){
                    if(this.state.GridData[i].products[0])
                        products_id.push({_id:this.state.GridData[i].product_id,SellerId:((this.state.GridData[i].product_detail&&this.state.GridData[i].product_detail[0]) ? this.state.GridData[i].product_detail[0].SellerId : this.state.GridData[i].products[0].SellerId),SellerName:((this.state.GridData[i].Seller&&this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].name : ""),number:this.state.GridData[i].number,title:this.state.GridData[i].products[0].title,subTitle:this.state.GridData[i].products[0].subTitle,desc:this.state.GridData[i].products[0].desc,price:(this.roundPrice(this.state.GridData[i].number*this.state.GridData[i].price)),UnitPrice:this.state.GridData[i].price,credit:this.state.GridData[i].getFromCredit,SellerId:this.state.GridData[i].products[0].SellerId,fileUploaded:this.state.GridData[i].products[0].fileUploaded,status:"0",color:this.state.GridData[i].Color,size:this.state.GridData[i].Size});
                }
                that.setState({
                    StepNumber:3
                })
                
                let url = that.state.ActiveBank=="z" ? this.state.url+'payment' : this.state.url+'payment2';
                axios.post(url , {
                    paykAmount: this.state.paykAmount,
                    Amount: parseInt(this.state.lastPrice)+parseInt(this.state.paykAmount),
                    Credit:this.state.finalCreditReducer,
                    userId:this.state.userId,
                    products_id:products_id,
                    needPay:that.state.ActiveBank=="none" ? 0 : 1
                    }) 
                    .then(response => {
                    if(that.state.ActiveBank != "none"){
                        let res;
                        if(that.state.ActiveBank == "p"){
                            res = response.data.result ? response.data.result.SalePaymentRequestResult : {}; 
                            if(res.Token > 0 && res.Status=="0"){
                                window.location = "https://pec.shaparak.ir/NewIPG/?token="+res.Token;
                            }
                        }else if(that.state.ActiveBank == "z"){
                            res = response.data.result; 
                            window.location = res;
                        }
                    }else{
                        that.props.dispatch({
                            type: 'LoginTrueUser',    
                            CartNumber:0,
                            off:that.props.off
                        })
                        that.setState({
                            GridData:[],
                            refId:response.data.refId,
                            EndMessage:<div className="YekanBakhFaMedium"> کد رهگیری سفارش : {that.persianNumber(response.data.refId) } <br/><br/><p className="YekanBakhFaMedium" style={{fontSize:25}}>سفارش شما ثبت شد . جهت ادامه ی عملیات خرید با شما تماس گرفته خواهد شد</p> </div> 
    
                        })
                        if(this.state.ActiveSms != "none"){
                            let SmsUrl = this.state.ActiveSms=="smsir" ? this.state.url+'sendsms_SmsIr' : this.state.url+'sendsms_smartSms';
                            axios.post(SmsUrl, {
                                text: 'سفارش شما ثبت شد . کد رهگیری سفارش : '+that.persianNumber(response.data.refId)+''+'\n'+that.state.STitle,
                                mobileNo : response.data.result
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
            }else{

            }
            

        }
        
      }
    componentDidMount(){
        let that = this;
        axios.post(this.state.url+'checktoken', {
          token: localStorage.getItem("api_token")
        })
        .then(response => {
          this.setState({
            userId : response.data.authData.userId,
            levelOfUser:response.data.authData.levelOfUser
          })

          axios.post(this.state.url+'getSettings', {
            token: localStorage.getItem("api_token")
          })
          .then(response => {
            that.setState({
                ActiveBank:response.data.result ? response.data.result.ActiveBank : "none",
                ActiveSms:response.data.result ? response.data.result.ActiveSms : "none",
                STitle:response.data.result ? response.data.result.STitle : "",
            })
            that.getCartItems();
          })
          .catch(error => {
            console.log(error)
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
    getCartItems(){
        let that=this;
        this.setState({
            lastPrice : 0,
            orgLastPrice:0,
            paykAmount:0
        })
        let param={
            UId : this.state.userId,
            levelOfUser:this.state.levelOfUser/*,
            token: localStorage.getItem("api_token_admin"),*/
    
            };
            let SCallBack = function(response){
                let lastPrice=0,
                    CartNumber=0;
                let paykAmount = [],
                    LastPaykAmount=0,
                    PrepareTime=[];
                response.data.result.map((res) =>{
                    if(res.price)
                        lastPrice+=res.number*parseInt(that.roundPrice(res.price));
                    PrepareTime.push(res.products[0].PrepareTime);
                    CartNumber+=parseInt(res.number);
                    switch(res.PeykInfo[2].userLocation){
                        case 1 :{
                            paykAmount.push({Amount:parseInt(res.PeykInfo[1].SendToCity||"0")*(res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1),Marge:res.PeykInfo[1].MergeableInPeyk?1:0})
                            break;
                        }
                        case 2 :{
                            paykAmount.push({Amount:parseInt(res.PeykInfo[1].SendToNearCity||"0")*(res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1),Marge:res.PeykInfo[1].MergeableInPeyk?1:0})
                            break;
                        }
                        case 3 :{
                            paykAmount.push({Amount:parseInt(res.PeykInfo[1].SendToState||"0")*(res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1),Marge:res.PeykInfo[1].MergeableInPeyk?1:0})
                            break;
                        }
                        case 4 :{
                            paykAmount.push({Amount:parseInt(res.PeykInfo[1].SendToCountry||"0")*(res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1),Marge:res.PeykInfo[1].MergeableInPeyk?1:0})
                            break;
                        }
                    }

                    
                })
                let MargablePaykAmount=[],
                    NotMargablePaykAmount=[];
                for(let i=0;i<paykAmount.length;i++){
                    if(paykAmount[i].Marge)
                        MargablePaykAmount.push(paykAmount[i].Amount)
                    else
                        NotMargablePaykAmount.push(paykAmount[i].Amount)
                }
                LastPaykAmount+=NotMargablePaykAmount.reduce((a, b) => a + b, 0);
                LastPaykAmount+=MargablePaykAmount.length > 0 ? Math.max(...MargablePaykAmount) : 0;
                debugger;
                that.setState({
                    PrepareTime:Math.max(...PrepareTime),
                    paykAmount:LastPaykAmount,
                    lastPrice:lastPrice,
                    orgLastPrice:lastPrice,
                    GridData:response.data.result,
                    CartNumber:CartNumber,
                    CartItemsGet:1,
                    CatId:(response.data.result[0] && response.data.result[0].products && response.data.result[0].products.length>0) ? response.data.result[0].products[0].category_id : null
                })
                that.props.dispatch({
                    type: 'LoginTrueUser',    
                    CartNumber:that.state.CartNumber,
                    off:that.props.off,
                    credit:that.props.credit != "undefined" ? that.props.credit : 0
               })
               Notification.open({
                title: '',
                placement:'bottomStart',
                duration: 3500,
                description: (
                  <div>
                    <p className="YekanBakhFaMedium">تعداد کالا ی موجود در سبد خرید <span style={{"color":"green"}}> {that.persianNumber(that.state.CartNumber)} </span> محصول</p>
                  </div>
                )
              });
    
            };
            let ECallBack = function(error){
                that.setState({
                    CartItemsGet:1
                })
                console.log(error)
            }
            console.log(param)
            this.Server.send("MainApi/getCartPerId",param,SCallBack,ECallBack)
    }
    changeCart(number,product_id,user_id,item){
        let that=this;
        if(this.state.pleaseWait)
            return;
        this.setState({
            pleaseWait:true
        })
        this.debounce(
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
                let param={
                    product_id :  product_id,
                    user_id : response.data.authData.userId,
                    number:number=="0" ? "0" : number
                };
                let SCallBack = function(response){
                    /*if(number == "0" && parseInt(item.getFromCredit) > 0){
                        let Comm = item.Seller[0].CreditCommission ? ((((parseInt(item.Seller[0].CreditCommission))*parseInt(item.getFromCredit))/100)): 0;
                        that.setState({
                            lastPrice:(parseInt(that.state.lastPrice) + parseInt(item.getFromCredit)) + Comm,
                            finalCreditReducer:parseInt(that.state.finalCreditReducer) - parseInt(item.getFromCredit)
                        })
                    }*/
                    //if(number=="0"){
                        that.setState({
                            lastPrice:that.state.orgLastPrice,
                            finalCreditReducer:0
                        })
                    //}
                    that.setState({
                        pleaseWait:false
                    })
                    that.getCartItems();
        
                };
                let ECallBack = function(error){
                    that.setState({
                        pleaseWait:false
                    })
                    console.log(error)
                }
                that.Server.send("MainApi/changeCart",param,SCallBack,ECallBack)

        }).catch(error => {
            that.setState({
                pleaseWait:false
            })
            console.log(error)
       }),1000)
        

    }
    itemTemplate(car, layout) {
        if (layout === 'list' && car && car.products[0]) {
            let pic = car.products[0].fileUploaded.split("public")[1] ? this.state.absoluteUrl+car.products[0].fileUploaded.split("public")[1] : this.state.absoluteUrl+'nophoto.png';
            let rowPrice = car.price//car.products[0].getFromCredit ? car.products[0].price : (car.products[0].price - (car.products[0].price * ((!car.products[0].NoOff ? parseInt(this.props.off) : 0)+car.products[0].off))/100);
                
            //let pic = car.products[0].fileUploaded.split("public")[1] ? 'http://localhost:3000/'+car.products[0].fileUploaded.split("public")[1] : 'http://localhost:3000/'+'nophoto.png';
             return (
                 <div style={{marginTop:15}}>    
                 <div className="row" style={{alignItems:'center'}}>
                 <div className="col-lg-3 col-md-3  col-12 YekanBakhFaMedium" style={{textAlign:'center'}}>
                 <Link target="_blank" to={`${process.env.PUBLIC_URL}/Products?id=`+car.product_detail_id||car.products[0]._id} >
                      <img  src={pic} style={{height:"140px"}} name="pic3" onClick={this.Changepic}  alt="" /> 
                 </Link>
                  </div>
                     <div className="col-lg-4 col-md-6 col-12 YekanBakhFaLight" style={{textAlign:'right'}} >
                      <div style={{paddingBottom:5}} className="YekanBakhFaBold">
                         {car.products[0].title}

                     </div> 
                     {car.product_detail && car.product_detail.length > 0 && 
                        <div>
                            <div style={{paddingBottom:5,fontSize:13}}>
                            <i className="fal fa-umbrella" style={{paddingLeft:5}}></i><span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                            </div> 
                            <div style={{paddingBottom:5,fontSize:13}}>
                            <i className="fal fa-id-card-alt" style={{paddingLeft:5}}></i><span>{car.Seller[0].name} </span>
                            </div> 
                            <div style={{paddingBottom:5,fontSize:13}}>
                            <i className="fal fa-rocket" style={{paddingLeft:5}}></i><span>ارسال تا {this.persianNumber(car.product_detail[0].PrepareTime||"3")} روز کاری دیگر</span>
                            </div> 
                        </div>
                     }
                     <br/>
                     </div>
                     <div className="col-12 mb-3">
                         <div class="row" style={{alignItems:'center'}} >
                         
                         <div className="col-lg-3 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{textAlign:'center'}}>
                 
                        </div>
                     <div className="col-lg-2 col-4 YekanBakhFaMedium" style={{textAlign:'center'}}>
                     <InputNumber value={car.number} inputStyle={{borderRadius:0,padding:0,textAlign:'center',fontSize:20}} mode="decimal" showButtons  onValueChange={(e) => {if(car.number == e.value) return; this.changeCart(e.value,car.product_detail_id||car.product_id,car.user_id,car.number)}} min={1} max={car.products[0].number} />

                     </div>
                     <div className="col-lg-2 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{textAlign:'center'}}>
                         <span style={{cursor:'pointer'}} onClick={(e) =>this.changeCart("0",car.product_detail_id||car.product_id,car.user_id,car)}>
                         <i className="fal fa-trash-alt" style={{paddingLeft:5}}></i><span>حذف</span>
                         </span>                    


                     </div>
                     <div className="col-lg-2 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{textAlign:'center'}}>
                     {car.Seller[0] && car.Seller[0].AllowCredit ? 

                     <div>
                       
                        <a className="YekanBakhFaMedium" style={{color:'green'}} href="javascript:void(0)" onClick={()=>{this.setState({displayReduse:car,ReducePrice:car.getFromCredit ? car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0 ,PriceAfterCompute:(car.number*parseInt(rowPrice))});return false;}}>کسر از اعتبار</a>

                     </div>
                     :
                     <div>
                        <label className="YekanBakhFaMedium">خرید آنلاین</label>

                     </div>
                    }
                     </div>
                     
                     <div className="col-lg-3 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{textAlign:'left'}}>
                     {car.products[0].price != '-' && 
                        <div>   
                            <div style={{fontSize:14}}>
                                    {this.persianNumber(this.roundPrice(car.number*(parseInt(rowPrice).toString())).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان
                            </div>
                            {car.getFromCredit != undefined && car.getFromCredit !=0 && 
                            <div style={{fontSize:12,color:'#777',paddingTop:5}}>
                            +{this.persianNumber( car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان از اعتبار
                            </div>
                            }
                        </div>
                     }
                     </div>
                        
                     </div>
                     </div>
                     
                 </div> 
                 
                    
                 </div>
             );
         }else{
            return (
                <div></div>
            )

         }
    }
    computeReduce(){
            let item = this.state.displayReduse;
            let redusePrice =this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g,"") : 0;
            let getFromCredit = 0;
            for(let i=0;i<this.state.GridData.length;i++){
                if(this.state.GridData[i]._id != this.state.displayReduse._id)
                    getFromCredit+=this.state.GridData[i].getFromCredit ? this.state.GridData[i].getFromCredit : 0;
            }
            if(parseInt(redusePrice) > (item.OrgPrice ? (item.number*item.OrgPrice) : (item.number*item.price))){
                Alert.warning('مقدار وارد شده از مبلغ محصول بیشتر است',5000);
                return;
            }
            if(parseInt(redusePrice) > (parseInt(this.props.credit)-getFromCredit)){
                Alert.warning('مقدار وارد شده بیش از مبلغ اعتبار شماست',5000);
                return;
            }
            let price = item.OrgPrice ? (item.number*item.OrgPrice) : (item.number*item.price);//item.number*(parseInt((item.products[0].price - (item.products[0].price * ((!item.products[0].NoOff ? parseInt(this.props.off) : 0)+item.products[0].off))/100)))
            let Comm = item.Seller[0].CreditCommission ? (((parseInt(item.Seller[0].CreditCommission))*parseInt(redusePrice))/100) : 0;
            let lastPrice = price-parseInt(redusePrice) + Comm;
            if(lastPrice >=0)
                this.setState({
                    PriceAfterCompute:this.roundPrice(lastPrice),
                    ShowAlarm:true
                })
           
             //
    }
    persianNumber(input){
        var persian = {0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹'};
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
    render(){
    const renderDialogFooter = (name) => {
            return (
                <div>
                    <Button style={{fontFamily:'YekanBakhFaBold'}} label="انصراف" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                    <Button style={{fontFamily:'YekanBakhFaBold'}} label="تایید" disabled={!this.state.ShowAlarm} icon="pi pi-check" onClick={() => onHide(1)} autoFocus />
                </div>
            );
    }
    const onHide = (ok) => {
        let ReducePrice=this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g,"") : 0;
        
        
        if(ok){
            let GridData = this.state.GridData;
            let Comm=0;
            for(let i=0;i<GridData.length;i++){
                Comm = GridData[i].Seller[0].CreditCommission ? (((parseInt(GridData[i].Seller[0].CreditCommission))*parseInt(ReducePrice))/100) : 0;

                if(GridData[i]._id == this.state.displayReduse._id){
                    
                    if(!GridData[i].OrgPrice)
                        GridData[i].OrgPrice = GridData[i].price;
                       
          
                    GridData[i].price = parseInt(GridData[i].OrgPrice) - (parseInt(ReducePrice)/GridData[i].number)+(Comm/GridData[i].number)
                    GridData[i].getFromCredit = parseInt(ReducePrice)

                }

            }
            let lastPrice = 0,
                finalCreditReducer=0;
            for(let i=0;i<GridData.length;i++){
                if(GridData[i].getFromCredit)
                    finalCreditReducer+=parseInt(GridData[i].getFromCredit)
            }
            this.setState({
                finalCreditReducer:finalCreditReducer,
                lastPrice:this.roundPrice(parseInt(this.state.orgLastPrice)+Comm-finalCreditReducer),
                GridData:GridData
            })
        }
        this.setState({
            displayReduse:false,
            ShowAlarm:false,
            ReducePrice:0
            
        })
    }
    return (
     <div>
        
        <Header1 /> 
        <Header2 /> 
        <div className="row justify-content-center d-lg-flex d-md-flex d-none" style={{direction:'ltr',marginBottom:50,marginTop:30}}  >
        <div className="col-9  yekan alert-light" style={{padding:20,display:'none'}} >
        {this.state.GridData.length > 0 && 
            <Steps current={this.state.StepNumber}  vertical={this.state.StepVertical} >
                <Steps.Item  title="سبد خرید" />
                <Steps.Item title="تکمیل خرید" />
                <Steps.Item title="تایید آدرس" />
                <Steps.Item title={this.state.ActiveBank !="none" ? "انتقال به سایت بانک" : "ثبت نهایی"} status="wait" />    
            </Steps>
            }
        </div>
        </div>
        
        <div className="row justify-content-center firstInPage" style={{direction:'rtl'}}   >
        
        <div className="col-lg-8">
            
            {this.state.GridData.length > 0 ? 
            <div>
                
            <DataView value={this.state.GridData} layout={this.state.layout}  rows={100} itemTemplate={this.itemTemplate}></DataView>
            </div>
            :
                (
                    this.state.refId ?
                    <p style={{textAlign:'center',paddingTop:50,fontSize:25}} className="YekanBakhFaBold">{this.state.EndMessage}</p>
                    :
                    (this.state.CartItemsGet
                        ?
                    <p style={{textAlign:'center',paddingTop:50,marginBottom:250,fontSize:25}} className="YekanBakhFaBold">سبد خرید شما خالی است</p>
                        :
                        <div style={{ zIndex: 10000 }} >
                        <p style={{ textAlign: 'center' }}>
                          <img src={require('../public/loading.gif')} style={{ width: 320 }} />
                        </p>
              
                         </div>
    
                    )
                )

            
            }
        </div>
        {this.state.GridData.length > 0 &&
        <div className="col-lg-3">
        
        <div className="card mt-md-0 mt-5" style={{padding:10,borderRadius:20}}>
        <div style={{textAlign:'left',marginRight:10,borderBottom:'1px solid #eee'}} >
                <p className="YekanBakhFaBold">موجودی اعتباری : {this.props.credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>

                </div>
                {
                    this.state.paykAmount > 0 &&
                    <p className="YekanBakhFaMedium" style={{fontSize:14,textAlign:'center',marginTop:10,color:'slategrey'}}>{this.persianNumber(this.state.paykAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان" } به عنوان هزینه ارسال به مبلغ سفارش اضافه شد</p>

                }
            <p className="YekanBakhFaMedium" style={{textAlign:"center",marginTop:40,borderBottom:"1px solid #eee"}}><span style={{paddingLeft:25}}>مبلغ قابل پرداخت </span> <span style={{color: '#a01212',fontSize:25,marginTop:50}}> {this.state.lastPrice != "0" ? this.persianNumber((parseInt(this.state.paykAmount) + parseInt(this.state.lastPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان" : "        "} 
                
               
                
                {
                    this.state.finalCreditReducer > 0 &&
                    <p className="YekanBakhFaMedium" style={{fontSize:12,marginTop:10}}>{this.persianNumber(this.state.finalCreditReducer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان" } از اعتبار شما کسر خواهد شد</p>

                }
            </span>  </p>
            {this.state.AcceptAddress ?
            <p className="YekanBakhFaMedium" style={{textAlign:'center'}} >
                
                   <span style={{fontSize:13}}>سفارش شما به آدرس زیر ارسال می شود : </span> <br /><br />
                   <span style={{fontSize:15,color:'#000'}}>  {this.state.Address} </span>  <br /><br />
                    <Link to={`${process.env.PUBLIC_URL}/user?Active=5`}  style={{textDecoration:'none',fontSize:13}} className="YekanBakhFaMedium">برای ویرایش آدرس اینجا کلیک کنید</Link>
            </p>
            :
             <p>

             </p>
            }   
            {this.state.ActiveBank !="none" ?
                <button className="btn btn-success YekanBakhFaMedium" style={{marginTop:40,marginBottom:10}} disabled={(this.state.AcceptAddress && this.state.Address=="")} onClick={this.Payment}>{this.state.AcceptAddress ? <span>پرداخت</span> : <span>ادامه فرایند خرید</span>}  </button>

            :
                <button className="btn btn-success YekanBakhFaMedium" style={{marginTop:40,marginBottom:10}}   onClick={this.Payment}>{this.state.AcceptAddress ? <span>ثبت نهایی</span> : <span>ادامه فرایند خرید</span>}  </button>

            }
        </div>
       
        </div>
         }
        </div>
        {this.state.CatId &&
        <div style={{marginTop:90}}>
                <CatList _id={this.state.CatId} name="پیشنهاد برای شما"  paddingLeft="70" paddingRight="70"  />
        </div>
        }
        <Footer />
        <Dialog header="کسر از اعتبار " visible={this.state.displayReduse} style={{ width: '50vw',fontFamily:'YekanBakhFaBold' }} footer={renderDialogFooter()} onHide={() => onHide()}>
            <p className="YekanBakhFaBold" style={{textAlign:'center'}}>موجودی اعتبار کل : {(parseInt(this.props.credit)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>
            <p className="YekanBakhFaBold" style={{textAlign:'center'}}>موجودی قابل برداشت : {(parseInt(this.props.credit)-parseInt(this.state.finalCreditReducer)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>

            <div className="row">
                <div className="col-md-6 col-12" >
                    <input className="form-control YekanBakhFaBold" placeholder="مبلغ را وارد کنید" autoComplete="off"  type="text" value={this.state.ReducePrice} name="ReducePrice" onChange={(event)=>{this.setState({ReducePrice: event.target.value.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ","),ShowAlarm:false})}}  required="true" />

                </div>
                <div className="col-md-6 col-12" style={{textAlign:'center'}} >
                    <Button label="محاسبه مبلغ"  onClick={this.computeReduce} style={{fontFamily:'YekanBakhFaBold'}} className="p-button-text" />

                </div>
                <div className="col-12" >
                    {this.state.ShowAlarm &&
                    <p className="YekanBakhFaBold" style={{textAlign:'center',color:'red',padding:20,textAlign:'right'}}>
                    <span>
                     برای خرید این محصول مبلغ 
                        &nbsp;
                    {this.state.PriceAfterCompute.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                     به صورت نقدی پرداخت خواهید کرد
                    </span>
                    <span>
                        &nbsp;
                         و مبلغ 
                         &nbsp;
                        {this.state.ReducePrice} تومان
                    از اعتبار شما کسر خواهد شد
                    
                    </span>
                    </p>
                    }
                   
                </div>
            </div>

        </Dialog>
     </div>
     
    )
    }
}
const mapStateToProps = (state) => {
    return{
        CartNumber : state.CartNumber,
        off : state.off,
		credit:state.credit
    }
  }
  export default withRouter(
    connect(mapStateToProps)(Cart)
  );
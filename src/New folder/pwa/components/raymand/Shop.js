import React, { Component } from 'react';
import { Toast } from 'primereact/toast';

import Server from '../Server.js'
import { connect } from "react-redux"
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

import Header from '../Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { SelectButton } from 'primereact/selectbutton';

class Shop extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.Server = new Server();
    this.SendData = this.SendData.bind(this);
    this.SetCredit = this.SetCredit.bind(this);

    
    this.toast = React.createRef();
    this.state = {
      _id:this.props.location.search.split("_id=")[1],
      AccountNumber: this.props.location.search.split("_id=")[1] ? this.props.location.search.split("account=")[1].split("&_id")[0] : this.props.location.search.split("account=")[1],
      Type: this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0],
      Shops: [],
      ShopsList: [],
      selectedShop: null,
      ButtonText:"انجام عملیات",
      SelectItems:[
        {label: 'نقدی', value: ''},
        {label: 'مهرکارت', value: 'credit'}
      ]
    }



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
  SendData() {  

    let that = this;
    let ip = that.props.ip || "https://ansar24.com";
      let TransferAccount = this.state.selectedShop.RaymandAcc;
      if (!this.state.AfterSend) {
        if (!TransferAccount || TransferAccount == "") {
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">شماره حساب فروشگاه در سیستم ثبت نشده است</div>, life: 4000 });

          return;
        }
        if (!this.state.Amount || this.state.Amount == "") {
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">مبلغ را وارد کنید</div>, life: 4000 });

          return;
        }
        let SCallBack = function (response) {
          that.setState({
            ShowLoading: false
          })
          let resp = [];
          for (let i = 0; i < response.length; i++) {
            resp[i] = response[i].children;

          }
          if (resp[0][0].name == "ERROR") {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

            return;
          }
          that.setState({
            ticketNo: resp[0][0] ? resp[0][0].value : '',
            LocalAccKind: resp[0][1] ? resp[0][1].value : '',
            AccPersonName: resp[0][2] ? resp[0][2].value : '',
            ButtonText: "تایید و انتقال",
            IconName: "md-checkmark",
            AfterSend: true
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
        let Amount = this.state.Amount.toString().replace(/,/g, "");
        Amount = this.convertNum(Amount);
        let Param1 = TransferAccount + ";" + Amount + ";" + this.state.SecCode;
        var param = '{CommandNo : "72" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + Param1 + '" }';

        this.Server.sendRaymand("" + ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

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
          if ((resp[0][0] && resp[0][0].name == "ERROR") || !resp[0][1]) {
            that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

            return;
          }
          that.setState({
            SanadNumber: resp[0][0] ? resp[0][0].value : '',
            ResidNumber: resp[0][1] ? resp[0][1].value : '',
            AfterFinalSend: true,
            shareOptions: {
              title: "",
              message: "همراه بانک رایمند - رسید تراکنش" + "\n" + "نام صاحب حساب مقصد : " + that.state.AccPersonName + "\n" + "کد پیگیری:" + resp[0][1].value + "\n" + "شماره ثبت سند:" + resp[0][0].value + "\n" + "مبلغ:" + that.state.Amount + "ریال" + "\n" + "کد شعبه:" + that.props.place + "\n" + "",
              url: "http://r-bank.ir",
              subject: "aaaaa"   //  for email    
            }
          })


        }
        let ECallBack = function (error) {
          that.setState({
            ShowLoading: false
          })
        }
        var SecCode = this.state.SecCode;
        if(!SecCode || SecCode=="")
        {
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">کد انتقال وجه پیامک شده را وارد کنید</div>, life: 4000 });
          return;
        }
        that.setState({
          ShowLoading: true
        })
        
        var FDesLocalChanged = " درگاه پرداخت انصارالهدی ";
        var Param1 = this.props.username + ';' + this.state.AccountNumber + ';' + TransferAccount + ";" + this.state.Amount.toString().replace(/,/g, "") + ";" + FDesLocalChanged + ";;;0;0;;";
        var param = '{CommandNo : "73" , AccountNo: "' + that.state.ticketNo + '",Param1: "' + Param1 + '" }';
        that.Server.sendRaymand("" + that.props.ip + "/MobileBank.aspx/MobileBankSp", param, SCallBack, ECallBack);

      }


  }



  SetCredit() {
    let that = this;
    if(this.props.mobile)
      var mobile = this.props.mobile.charAt(0) == "0" ? this.props.mobile.substr(1) : this.props.mobile;
    else{
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">نام کاربری سیستم پیدا نشد</div>, life: 4000 });
      return;
    }
    if (!this.state.Amount || this.state.Amount == "") {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">مبلغ را وارد کنید</div>, life: 4000 });

      return;
    }
    
    
    

    let SCallBack = function (response) {
      if (that.state.Step != 2) {
        if (response.data.error) {
          that.setState({
            ShowLoading: false
          })
          that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{response.data.message}</div>, life: 4000 });

          return;
        }
        that.setState({
          ShowLoading: false,
          Step: 2,
          ButtonText:"تایید پرداخت",
          commission: response.data.result.Comm,
          ShopName:response.data.result.ShopName
        })
      } else {
        that.setState({
          Step: 3,
          selectedShop:null,
          ShowLoading: false
        })
        that.toast.current.show({ severity: 'success', summary: <div className="YekanBakhFaMedium">پرداخت موفق</div>, detail: <div className="YekanBakhFaMedium">خرید محصول با موفقیت انجام شد</div>, life: 4000 });
        that.getUser();

      }


    }
    let ECallBack = function (error) {
      that.toast.current.show({ severity: 'error', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">خطا - خرید انجام نشد</div>, life: 4000 });

      that.setState({
        ShowLoading: false
      })
    }
    
    let Amount = this.state.Amount.toString().replace(/,/g, "");
    Amount = this.convertNum(Amount);
    if (!this.state.credit || this.state.credit < parseInt(Amount)) {
      that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium"></div>, detail: <div className="YekanBakhFaMedium">موجودی کافی نیست</div>, life: 4000 });

      return;
    }
    this.setState({
      ShowLoading: true
    })
    this.Server.send2("https://marketapi.sarvapps.ir/MainApi/setCredit", { ShopId: this.state.selectedShop._id,ShopName:this.state.ShopName, username: mobile, Amount: Amount, Step: this.state.Step, commission: this.state.commission }, SCallBack, ECallBack)
  }


  getUser(getShops){
    let that = this;
    this.Server.send("MainApi/getuser", { username: this.props.mobile, noPass: 1 }, function (response) {
      if (!response.data.error) {
        that.setState({
          credit: response.data.result.credit
        })
      }
      if(getShops)
        that.getShops(that.state._id);


    }, function (error) {
      that.setState({
        ShowLoading: false
      })
      if(getShops)
        that.getShops(that.state._id);
    })
  }

  componentDidMount() {
    if(this.state.AccountNumber == "undefined" && this.state.Type !="credit"){
      this.GetAccounts();
    }else
      this.getUser(1);
  }
  GetAccounts(RefreshVam){
    let that = this;

    let SCallBack = function(response){

      let data=[];
      let resp=[];
     for(let i=0;i<response.length;i++){
       resp[i] = response[i].children;
      
     }
     for(let i=0;i<resp.length;i++){
      for(let j=0;j<resp[i].length;j++){
        if(resp[i][j].name=="A_Kind"){
          if(resp[i][j].value=="5")
          data.push(resp[i])
        }
   
      }   
     }
     let AccList=[];
     for(let i=0;i<data.length;i++){
      AccList[i] = {value:data[i][1].value,label:data[i][3].value + "(" + data[i][1].value + ")"}
     }
     that.setState({
      AccList: AccList,
      AccDialog : AccList.length > 1 ? 1 : 0,
      AccountNumber: AccList.length > 1 ? null : AccList[0].value,
      ShowLoading:false
     })  
     that.getUser(1);
    
    } 
    let ECallBack = function(error){
      that.setState({
        ShowLoading:false
      })
    }
    
    var param = '{CommandNo : "3" , AccountNo: "' + that.props.account + '",Param1: "' + that.props.password + '" }';
    let ip = that.props.ip || "https://ansar24.com";
    that.setState({
      ShowLoading:true  
    })
    that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack)
  }
  getShops(_id) {
    let that = this;
    that.setState({
      ShowLoading: true
    })
    let SCallBack = function (response) {
      let res = [];
      for (let i = 0; i < response.data.result.length; i++) {
        let temp = response.data.result[i];
        temp.server = "https://marketapi.sarvapps.ir/"
        res.push(temp)
      }
      that.setState({
        Shops: response.data.result,
        ShopsList: response.data.result,
        selectedShop: response.data.result.length == 1 ? response.data.result[0] : null,
        ShowLoading: false,
        AccDialog: _id ? 1 : that.state.AccDialog
      })

      /*that.Server.send2("https://foodapi.sarvapps.ir/AdminApi/ShopInformation", {ShopId:_id}, function (response2) {
        let res = [];
        for (let i = 0; i < response2.data.result.length; i++) {
          let temp = response2.data.result[i];
          temp.server = "https://foodapi.sarvapps.ir/"
          res.push(temp)
        }
        that.setState({
          Shops: that.state.Shops.concat(res),
          ShopsList: that.state.ShopsList.concat(res),
          ShowLoading: false

        })

      }, ECallBack)*/


    }
    let ECallBack = function (error) {
      alert(error)

    }
    this.Server.send2("https://marketapi.sarvapps.ir/AdminApi/ShopInformation", {ShopId:_id,InCredit:this.state.Type=="credit" ? 1 : 0}, SCallBack, ECallBack)


  }
  render() {
    return (
      <div style={{ height: '100%' }}>
        <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />
        <Sidebar visible={this.state.selectedShop && !this.state.AccDialog} onHide={() => this.setState({
          selectedShop: null,
          AfterSend:null,
          AfterFinalSend:null,
          ButtonText:"انجام عملیات",
          Amount:'',
          Step:null
        })}>
          {!this.state.ShowLoading ?
          <div>
          {this.state.selectedShop &&
            <div style={{marginBottom:50}}>

             <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
               <div>
              {this.state.selectedShop.logo &&
                  <img src={this.state.selectedShop.server + this.state.selectedShop.logo.split("public")[1]} style={{ height: 50 }} />
              }
              </div>
              <div style={{marginTop:10}}>
                  <span className="YekanBakhFaMedium">نام فروشگاه : </span> <span className="YekanBakhFaMedium">{this.state.selectedShop.name}</span>
              </div>
             </div>
             {this.state.Type=="credit" &&
              <div style={{display:'flex',justifyContent:'center',backgroundColor:'#ececec',borderRadius:5,marginTop:50}}>
              <div>
                  <span className="YekanBakhFaMedium">موجودی مهر کارت شما : </span> 
                  {this.state.credit ?
                  <span className="YekanBakhFaMedium">{(this.state.credit.toString().replace(",", "")).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال</span>
                  :
                  <span className="YekanBakhFaMedium">
                    0 ریال
                  </span>
                  }
              </div>
              </div>
            }
           

            {this.state.Step == 2 &&

            <div style={{marginTop:40,textAlign:'center',color:'#650d0d'}}>
              
              <div>
                <span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>
                  در صورت تایید {this.state.Amount.toString().replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  } ریال از موجودی مهرکارت شما کسر خواهد شد
                </span>
              </div>
              {this.state.commission != "0" &&
                <div style={{marginTop:20}}>
                  <span style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'center' }}>
                    مبلغ {this.state.commission.toString().replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال به عنوان کارمزد خرید اقساطی به فروشنده پرداخت نمایید
                  </span>
                </div>
              }
            </div>

            }
            
            </div>


          }
          {!this.state.AfterFinalSend &&
            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          
          <InputText value={this.state.Amount} keyboardType="default" placeholder="مبلغ مورد نظر ( ریال )" name="Amount" onChange={(text) => {
            let txt=text.target.value.replace(/,/g,""); this.setState({
              AfterSend:null,
              Step:null,
              Amount:txt.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />
            {this.state.Type!="credit" &&
            <InputText value={this.state.SecCode} keyboardType="default" placeholder="کد انتقال وجه پیامک شده" name="SecCode" onChange={(text) => {
              this.setState({
                SecCode:text.target.value
              })
            }} style={{ textAlign: "center", fontFamily: 'YekanBakhFaMedium', width: '100%',marginTop:15 }} />
            }
          {this.state.Type=="credit" ?  
            <Button className="YekanBakhFaMedium" style={{marginTop:50}}>
              <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} onClick={this.SetCredit} >{this.state.ButtonText}</span>
            </Button>
            :
            <Button className="YekanBakhFaMedium" style={{marginTop:50}}>
              <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} onClick={this.SendData}  >{this.state.ButtonText}</span>
            </Button>
          }
          </div>
      }
      <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          {!this.state.AfterFinalSend && this.state.AfterSend && this.state.AccPersonName &&
          
          <div>
          <div style={{textAlign:'center',marginTop:30}}>
            <p className="YekanBakhFaMedium">نوع حساب : {this.state.LocalAccKind}</p>

            <p className="YekanBakhFaMedium">نام صاحب حساب: {this.state.AccPersonName}</p>

          </div>
          </div>
          
          }

          {this.state.AfterFinalSend&&
              <div><div style={{textAlign:'center'}}>
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,color:'green'}} >انتقال وجه با موفقیت انجام شد</span></div>  
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:18,color:'blue',marginTop:30}} >رسید تراکنش</span></div>  
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:30}} >نام صاحب حساب مقصد : {this.state.AccPersonName}</span></div>  
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>مبلغ : {this.state.Amount} ریال</span></div>  
                  
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>رسید : {this.state.ResidNumber}</span></div> 
                  <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>شماره ثبت سند :{this.state.SanadNumber}</span></div>  
              </div>     
           
           </div>
          }
          </div>
          </div>
          :
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ProgressSpinner style={{ paddingTop: 150 }} />
            </div>
          }
        </Sidebar>
        <Dialog header="خرید از فروشگاهها" visible={this.state.AccDialog} maximized={true}   onHide={() => {
          this.setState({
          AccDialog:false
        });
        window.history.back();
        }
        }>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60%',flexDirection:'column'}} >
          {this.state._id &&
            <div style={{flexDirection:'column',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <p className="YekanBakhFaMedium" >نوع خرید را نتخاب کنید</p>
            <SelectButton  value={this.state.Type}  options={this.state.SelectItems} onChange={(e) => this.setState({Type:e.value})}></SelectButton>

            {this.state.AccountNumber &&
            <Button onClick={()=>{
                this.setState({
                  AccDialog:false
                });              
                }} className="YekanBakhFaMedium p-button-secondary" style={{marginTop:100}}>
              <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 20 }} >ادامه فرآیند خرید </span>
            </Button>
            }
            </div>
          }
          <div style={{height:'100px'}}></div>
          {!this.state.AccountNumber &&
          <Dropdown style={{width:'90%',textAlign:'right'}} value={this.state.AccountNumber} options={this.state.AccList} onChange={(e) => this.setState({AccountNumber:e.value,AccDialog:false})} placeholder="حساب خود را انتخاب کنید"/>
          }
          </div>

        </Dialog>
        <div>
          <Header credit={this.state.credit} ComponentName={this.state.Type != "credit" ? "درگاه پرداخت" : "مهر کارت"} />
        </div>
        <div style={{ direction: 'rtl', backgroundColor: '#fff', height: '100%' }}>
          
          <div style={{textAlign:'center',padding:10}}>
           
             {
                this.state.AccountNumber != "undefined" &&
                <div style={{backgroundColor:'#c8c163',textAlign:'center',padding:8}}>
                  <span style={{fontFamily:'YekanBakhFaMedium',fontSize:14,color:'#000',textAlign:'center'}}>شماره حساب :  {this.state.AccountNumber}</span>
                </div>
              }
            {this.state.Shops && this.state.Shops.length > 1 ? 
            <InputText value={this.state.title} autocomplete="off" keyboardType="default" placeholder="بخشی از نام فروشگاه را جستجو کنید" name="title" onChange={(text) => {
              var result = this.state.Shops.filter(function (obj) {
                return obj.name.indexOf(text.target.value) > -1;
              });
              this.setState({
                title: text.target.value,
                ShopsList: result

              })
            }} style={{ textAlign: "right", fontFamily: 'YekanBakhFaMedium', width: '100%' }} />
            :
            this.state.ShopsList.length > 0  &&
            <Button style={{marginTop:10}} onClick={()=>{this.getShops()}} className="YekanBakhFaMedium p-button-secondary">
              <span className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} >مشاهده همه فروشگاهها </span>
              
            </Button>
            }
          </div>
          {this.state.Type=="credit" &&
          <div>
            <div className="YekanBakhFaMedium" style={{ marginTop: 10, color: 'red',textAlign:'center' }}>
              <span>
                موجودی مهر کارت :
              </span>
              <span>
                {!this.state.credit ? 0 : (this.state.credit.toString().replace(",", "")).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال
              </span>

            </div>
          </div>
          }
          {!this.state.ShowLoading ?
            <div style={{  marginRight: 5, padding: 20 }}>
              {this.state.ShopsList && this.state.ShopsList.map((item, index) => {
                let color = index % 2 ? '#fff' : '#eee';
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: color, padding: 5 }}>

                    <div style={{ width: 70, display: 'none' }}>
                      {
                        item.logo &&
                        <img src={item.server + item.logo.split("public")[1]} style={{ height: 50, width: 50 }} />
                      }
                    </div>

                    <div className="YekanBakhFaMedium">
                      {item.name}
                    </div>
                    <div className="YekanBakhFaMedium">
                      <Button className="p-button-success YekanBakhFaMedium" onClick={() => {
                        this.setState({
                          selectedShop: item
                        })
                      }}><span  className="YekanBakhFaMedium" style={{ width: '100%', fontSize: 17 }} >خرید </span></Button>
                    </div>


                  </div>
                )

              })
              }
            </div>
            :
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
              <ProgressSpinner style={{ paddingTop: 150 }} />
            </div>
          }
          <div style={{height:50}}></div>
        </div>
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
    mobile: state.mobile,
    LoginAnia:state.LoginAnia
  }
}
export default connect(mapStateToProps)(Shop)  

import React, { Component } from 'react';
import { Toast } from 'primereact/toast';

import Server from '../Server.js'
import { connect } from "react-redux"
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Header from '../Header.js'
import Num2persian from 'num2persian';

class Transfer extends React.Component {
  constructor(props){
    super(props);  
    const { navigation } = this.props;
    this.Server = new Server();
    this.SendData = this.SendData.bind(this);  
    this.toast = React.createRef();
    this.state={      
      AccountNumber:this.props.location.search.split("account=")[1],
      Type:this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0],
      ShowLoading:false,
      Sheba:[],
      ShebaId:"",
      TransferAccount:"",
      AccPersonName:"",
      LocalAccKind:"",
      Amount:"",
      Desc:"",
      TransferId:"",
      SecCode:"",    
      TimeTransfer:"",
      ShebaBankName:"",
      ticketNo:null,
      ButtonText:"ارسال",
      IconName:"md-return-right",
      AfterSend:false,   
      AfterFinalSend:false,  
      ResidNumber:null,
      SanadNumber:null,
      Subject:"",
      shareOptions:{}
    }
    this.GetInitialData()
    
     


  }
  onCancel() {
    console.log("CANCEL")
    this.setState({visible:false});
  }
  onOpen() {
    console.log("OPEN")
    this.setState({visible:true});
  }
  SendData(){  
    debugger;
    let that = this;
    let ip = that.props.ip || "https://ansar24.com";
    let ShebaId = that.state.ShebaId ? that.state.ShebaId.split("IR")[1] : "";
    if(this.state.Type=="Transfer"){
        if(!this.state.AfterSend){  

            
            if(ShebaId==""){
              that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">کد شبا را وارد کنید</div>, life: 4000 });

              return;
            }
            if(ShebaId.length !=24){
              that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">تعداد ارقام کد شبا باید 24 باشد</div>, life: 4000 });

              return;
            }
            if(that.state.Amount==""){
              that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">مبلغ را وارد کنید</div>, life: 4000 });
              return;
            }
            let SCallBack = function(response){

              that.setState({
                ShowLoading:false
              })
              let resp=[];
            for(let i=0;i<response.length;i++){
              resp[i] = response[i].children;
              
            }   
            if(resp[0]&&resp[0][0].name=="ERROR"){
              let Err=resp[0] ? resp[0][0].value : "" ;
              Err += resp[1] ? resp[1][0].value : "";   
              that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">Err</div>, life: 4000 });

              return;
            }
            that.setState({
              ticketNo:resp[0][0] ? resp[0][0].value : '',
              TimeTransfer:resp[0][3] ? resp[0][3].value : '',
              AccPersonName:resp[0][2] ? resp[0][2].value : '',  
              ButtonText:"تایید و انتقال",
              IconName:"md-checkmark",
              AfterSend:true  
            })
              
            } 
            let ECallBack = function(error){
              that.setState({
                ShowLoading:false
              })  
            }       
            let Param1 = ShebaId+";"+(parseInt(this.state.Amount.toString().replace(/,/g,""))+25000).toString()+";"+this.state.SecCode;
            var param = '{CommandNo : "71" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + Param1 + '" }';
            that.setState({
              ShowLoading:true
            }) 
            
            that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack);
        }
        else{               
          
          let SCallBack = function(response){
                       
            let resp=[];
            if(response.indexOf(";")==-1){
              that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">response</div>, life: 4000 });

            }else{
              resp=response.split(";");
              console.warn(resp)    

              /*AsyncStorage.getItem('History', (err, result) => {
                if(!result)
                  var res=[];
                if(result)  
                  var res=JSON.parse(result).H;
                var msg = "انتقال وجه به بانک"+ "\n" +"نام صاحب حساب مقصد : "  + that.state.AccPersonName + "\n" + "کد پیگیری:"  +resp[1] + "\n" + "شماره ثبت سند:" + resp[0] + "\n" + "مبلغ:" + (parseInt(that.state.Amount.toString().replace(/,/g,""))+25000).toString() + "ریال" + "\n" + "کد شعبه:" + that.props.place + "\n" + "";
          
                res.unshift(msg)    
                var SaveData = {
                  H : res
                }
                 
                AsyncStorage.setItem('History', JSON.stringify(SaveData));
              })*/
              that.setState({
                AfterFinalSend:true,
                ResidNumber:resp[1],
                SanadNumber:resp[0],
                shareOptions:{
                  title: "",
                  message: "همراه بانک رایمند - رسید تراکنش"+ "\n" +"نام صاحب حساب مقصد : "  + that.state.AccPersonName + "\n" + "کد پیگیری:"  +resp[1] + "\n" + "شماره ثبت سند:" + resp[0] + "\n" + "مبلغ:" + (parseInt(that.state.Amount.toString().replace(/,/g,""))+25000).toString() + "ریال" + "\n" + "کد شعبه:" + that.props.place + "\n" + "" ,
                  url: "http://r-bank.ir",
                  subject: "aaaaa"   //  for email    
                }
                
              }) 
              
            }
            that.setState({
                ShowLoading:false
            })
             
          } 
          let ECallBack = function(error){
            that.setState({
              ShowLoading:false
            })  
          }     
          that.setState({             
            ShowLoading:true
          })
          //var JSON = '{TicketNo : "' + That.TicketNo + '" , BranchCode: "' + That.BranchCode + '",UserId: '+this.userNumber+',AccountNo:'+this.shomare+',Sheba: "' + this.FAcc2 + '",Amount: "' + FAmount + '",Des: "' + That.FDes + '",Info: "' + That.FInfo + '",SanadNo: ""  }'
          var param = '{"TicketNo" : "' + this.state.ticketNo + '" , "BranchCode": "' + that.props.place + '","UserId": "'+that.props.username +'","AccountNo":"'+that.state.AccountNumber+'","Sheba": "' + ShebaId + '","Amount": "' + (parseInt(that.state.Amount.toString().replace(/,/g,""))+25000).toString() + '","Des": "' + that.state.Desc + '","Info": "' + that.state.AccPersonName + '","SanadNo": "1","InterFace":"Mob","SecurityCode": "'+that.state.SecCode+'" }'
          that.Server.sendRaymand("https://r-bank.ir/TransferAPI/TransferSheba",param,SCallBack,ECallBack,1,"POST",1);    

        }                    
    }
    if(this.state.Type=="LocalTransfer"){
      if(!this.state.AfterSend){
        if(this.state.TransferAccount==""){
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">شماره حساب قصد را وارد کنید</div>, life: 4000 });

          return; 
        }
        if(this.state.Amount==""){
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">مبلغ را وارد کنید</div>, life: 4000 });

          return;
        }
        let SCallBack = function(response){
          that.setState({
            ShowLoading:false
          })
          let resp=[];
        for(let i=0;i<response.length;i++){
          resp[i] = response[i].children;
          
        }
        if(resp[0][0].name=="ERROR"){
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

          return;
        }  
        that.setState({
          ticketNo:resp[0][0] ? resp[0][0].value : '',
          LocalAccKind:resp[0][1] ? resp[0][1].value :'',
          AccPersonName:resp[0][2] ? resp[0][2].value :'',
          ButtonText:"تایید و انتقال",
          IconName:"md-checkmark",
          AfterSend:true  
        })
          
        } 
        let ECallBack = function(error){
          that.setState({
            ShowLoading:false
          })  
        }     
        that.setState({
          ShowLoading:true
        }) 
            var SecCode = this.state.SecCode;
            /*if(!SecCode || SecCode=="")
              FSecurityCodeLocal="0";*/

            let Param1 = this.state.TransferAccount+";"+this.state.Amount.toString().replace(/,/g,"")+";"+this.state.SecCode;
            var param = '{CommandNo : "72" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + Param1 + '" }';

            that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack);

      }
      if(this.state.AfterSend){
        let SCallBack = function(response){
          that.setState({
            ShowLoading:false
          })
          let resp=[];
        for(let i=0;i<response.length;i++){
          resp[i] = response[i].children;
          
        }
        if(resp[0][0] && resp[0][0].name=="ERROR"){
          that.toast.current.show({ severity: 'warn', summary: <div className="YekanBakhFaMedium">خطا در برقراری ارتباط</div>, detail: <div className="YekanBakhFaMedium">{resp[0][0].value}</div>, life: 4000 });

          return;
        }
        /*AsyncStorage.getItem('History', (err, result) => {
          if(!result)
            var res=[];
          if(result)  
            var res=JSON.parse(result).H;
          var msg = "انتقال وجه داخلی"+ "\n" +"نام صاحب حساب مقصد : "  + that.state.AccPersonName + "\n" + "کد پیگیری:"  +resp[0][1].value + "\n" + "شماره ثبت سند:" + resp[0][0].value + "\n" + "مبلغ:" + that.state.Amount + "ریال" + "\n" + "کد شعبه:" + that.props.place + "\n" + "";
    
          res.unshift(msg)    
          var SaveData = {
            H : res
          }
           
          AsyncStorage.setItem('History', JSON.stringify(SaveData));
        })  */
        
        that.setState({
          SanadNumber:resp[0][0] ? resp[0][0].value : '',
          ResidNumber:resp[0][1] ? resp[0][1].value : '',
          AfterFinalSend:true, 
          shareOptions:{
            title: "",
            message: "همراه بانک رایمند - رسید تراکنش"+ "\n" +"نام صاحب حساب مقصد : "  + that.state.AccPersonName + "\n" + "کد پیگیری:"  +resp[0][1].value + "\n" + "شماره ثبت سند:" + resp[0][0].value + "\n" + "مبلغ:" + that.state.Amount + "ریال" + "\n" + "کد شعبه:" + that.props.place + "\n" + "" ,
            url: "http://r-bank.ir",
            subject: "aaaaa"   //  for email    
          }  
        })
          
          
        } 
        let ECallBack = function(error){
          that.setState({
            ShowLoading:false
          })  
        }     
        that.setState({
          ShowLoading:true
        }) 
            var SecCode = this.state.SecCode;
            /*if(!SecCode || SecCode=="")
              FSecurityCodeLocal="0";*/
            var FDesLocalChanged = " همراه بانک " + this.state.Desc;
            var Param1 = this.props.username+';'+this.state.AccountNumber+';'+this.state.TransferAccount+";"+this.state.Amount.toString().replace(/,/g,"")+";"+FDesLocalChanged+";;;0;0;;";
            var param = '{CommandNo : "73" , AccountNo: "' + that.state.ticketNo + '",Param1: "' + Param1 + '" }';
            that.Server.sendRaymand(""+that.props.ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack);

      }


    }
  }
  GetInitialData(){
   
    let that = this;
    let SCallBack = function(response){
      that.setState({
        ShowLoading:false
      })
      let resp=[];
     for(let i=0;i<response.length;i++){
       resp[i] = response[i].children;
      
     }
     let Sheba = [],
         ShebaVal=[]; 

     for(let i=0;i<resp.length;i++){
        let Sh = {},
        BankName="",  
        shebaCode="",
        PersonName="";
        for(let j=0;j<resp[i].length;j++){

          if(resp[i][j] && resp[i][j].name=="Sheba"){
            ShebaVal.push(resp[i][j].value)
            shebaCode = resp[i][j].value;
          }
          if(resp[i][j] && resp[i][j].name=="BankName"){
            BankName=resp[i][j].value;
          }
          if(resp[i][j] && resp[i][j].name=="ShebaName"){   
            PersonName=resp[i][j].value;
          }
         
          

         
        }
        Sh = {"value":shebaCode,"label":PersonName + "," +  BankName}
        Sheba.push(Sh);

     }
     that.setState({
        Sheba:Sheba
     })
     if(Sheba.length == 0)
      return;
    
      
     
        
     
    } 
    let ECallBack = function(error){
      that.setState({
        ShowLoading:false
      })  
    }
    var param = '{CommandNo : "70" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + that.props.username + '" }';
    let ip = that.props.ip || "https://ansar24.com";

    this.setState({
      ShowLoading:true
    }) 
    that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack)
  }
 
  render() {      
   
    
 
 
    return (       
      <div style={{height:'100%'}}>
                <Toast ref={this.toast} position="top-right" style={{ fontFamily: 'YekanBakhFaMedium', textAlign: 'right' }} />

      <div>
      <Header credit={this.state.credit} ComponentName="انتقال وجه" />

    </div>
      <div style={{direction:'rtl',padding:20,backgroundColor: '#fff',height:'100%'}}>
   
           {!this.state.AfterFinalSend &&
           <div> 
           {this.state.Type=="Transfer" &&
           <div>
          {!this.state.AfterSend && this.state.Sheba.length>0 && 
          <Dropdown value={this.state.ShebaTemp} className="YekanBakhFaMedium" style={{width:'100%'}} options={this.state.Sheba} onChange={(e) => {
            this.setState({
              ShebaId:e.value,
              ShebaTemp:e.value
            })
            
          }} placeholder="کد شبا را انتخاب کنید"/>

          }
          <div floatingLabel style={{marginTop:15}}>       
          <div className="YekanBakhFaMedium" >حساب شبا مقصد</div>
            <InputText  value={this.state.ShebaId} disabled={this.state.AfterSend} keyboardType="number-pad" name="ShebaId" onChange={(text) => this.setState({ShebaId:text.target.value})  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div>   
          <div floatingLabel style={{marginTop:10}}>           
          <div className="YekanBakhFaMedium" >صاحب حساب مقصد</div>
            <InputText  value={this.state.AccPersonName} disabled={this.state.AfterSend} keyboardType="default" name="AccPersonName" onChange={(text) => this.setState({AccPersonName:text.target.value})  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div>
          </div>        
          }     
          {this.state.Type=="LocalTransfer" &&
          <div floatingLabel>       
          <div style={{fontFamily:'YekanBakhFaMedium'}} >شماره حساب مقصد</div>
            <InputText  value={this.state.TransferAccount} keyboardType="number-pad" name="TransferAccount" onChange={(text) => {this.setState({TransferAccount:text.target.value})}  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div> 
          }     
          <div floatingLabel> 
          <div style={{fontFamily:'YekanBakhFaMedium'}} >مبلغ</div>
            <InputText  value={this.state.Amount} disabled={this.state.AfterSend} keyboardType="number-pad" name="Amount" onChange={(text) => {let txt=text.target.value.replace(/,/g,""); this.setState({Amount:txt.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})  }}  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
            {this.state.Amount &&
              <div style={{fontFamily:'YekanBakhFaMedium',marginTop:7,marginBottom:7}}>{Num2persian(this.state.Amount.toString().replace(/,/g,""))} {this.state.Amount != "" ? <span style={{color:'red',textAlign:'left',fontFamily:'YekanBakhFaMedium',fontSize:11,paddingRight:5 }}>ریال</span>  : ""} </div>
            }
            </div>
         
          <div floatingLabel>                          
          <div style={{fontFamily:'YekanBakhFaMedium'}} >شرح</div>
            <InputText  value={this.state.Desc} keyboardType="default" name="Desc" onChange={(text) => this.setState({Desc:text.target.value})  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div>
          {this.state.Type=="Transfer" &&
          <div floatingLabel>           
          <div style={{fontFamily:'YekanBakhFaMedium'}} >شناسه واریز (اختیاری)</div>
            <InputText style={{fontFamily:'YekanBakhFaMedium'}} value={this.state.TransferId} keyboardType="number-pad" name="TransferId" onChange={(text) => this.setState({TransferId:text.target.value})  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div>
          }
          <div floatingLabel>           
          <div style={{fontFamily:'YekanBakhFaMedium'}} >کد امنیتی پیامک شده</div>
            <InputText value={this.state.SecCode} keyboardType="number-pad" name="SecCode" onChange={(text) => this.setState({SecCode:text.target.value})  }  style={{textAlign:"center",fontFamily:'YekanBakhFaMedium',width:'100%'}}  />
          </div> 
          {this.state.TimeTransfer!="" &&
          <div>
            <div style={{marginBottom:10,alignItems: 'center',justifyContent: 'center'}}>          
            <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'right',paddingRight:15,color:'red'}} >زمان انتقال : {this.state.TimeTransfer}</span>
            </div>
            <div style={{marginBottom:10,alignItems: 'center',justifyContent: 'center'}}>          
            <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'right',paddingRight:15,color:'red'}} >کارمزد : 25000 ریال</span>
            </div>
          </div>
          }

          <Button block info rounded style={{marginTop:10,marginLeft:10,marginRight:10,marginBottom:10}}  onClick={this.SendData}>
            <span style={{fontFamily:'YekanBakhFaMedium',fontSize:15 }}>{this.state.ButtonText}</span> 
            <i name={this.state.IconName} style={{fontSize:18,color:'#000'}} />        
          </Button>  
          {this.state.Type=="LocalTransfer"&&this.state.AfterSend&&
          <div style={{flex: 1,alignItems: 'center',justifyContent: 'center',marginTop:10}}>           
          <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15}}> اطلاعات حساب مقصد</span></div>
          <div><span  style={{fontFamily:'YekanBakhFaMedium',fontSize:15}}>نوع حساب : {this.state.LocalAccKind}</span></div>
          <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15}}>نام صاحب حساب: {this.state.AccPersonName}</span></div>
  
          </div>   
          }
          </div>
          }   
          {this.state.AfterFinalSend&&
          <div><div style={{textAlign:'center',marginTop:100}}>
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,color:'green'}} >انتقال وجه با موفقیت انجام شد</span></div>  
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:18,color:'blue',marginTop:30}} >رسید تراکنش</span></div>  
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:30}} >نام صاحب حساب مقصد : {this.state.AccPersonName}</span></div>  
              {this.state.Type=="LocalTransfer" ?
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>مبلغ : {this.state.Amount} ریال</span></div>  
              :
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>مبلغ : {(parseInt(this.state.Amount.toString().replace(/,/g,""))+25000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ریال</span></div>  
              }
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>رسید : {this.state.ResidNumber}</span></div> 
              <div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:15,marginTop:15}}>شماره ثبت سند :{this.state.SanadNumber}</span></div>  
          </div>     
           
           </div>
          }
       
    </div>
    </div> 
    );
  }
}

function mapStateToProps(state) {        
  return {
    username : state.username,
    password : state.password,
    ip : state.ip,
    account:state.account,
    place:state.place,
    fullname : state.fullname,
    mobile : state.mobile
  }
}
export default connect(mapStateToProps)(Transfer)  

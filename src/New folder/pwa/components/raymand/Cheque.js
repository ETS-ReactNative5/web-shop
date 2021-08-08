import React, { Component } from 'react';
import { Badge } from 'primereact/badge';

import Server from '../Server.js'
import { connect } from "react-redux"
import Header from '../Header.js'

    
class Cheque extends React.Component {       
  constructor(props){
    super(props);  
    this.Server = new Server();
    this.state={
      AccountNumber:this.props.location.search.split("account=")[1],
      Place:this.props.place,
      listViewData:[],
      Sort:"",
      ShowLoading:false,
      Sum:0,
      Count:0  
    }     
    this.GetCheque("تاریخ سررسید");
    let data = ["تاریخ سررسید","تاریخ دریافت","مبلغ چک"];
    
    /*Picker.init({
      pickerData: data,
      pickerTitleText:"نوع مرتب سازی",
      pickerConfirmBtnText:"انتخاب",
      pickerCancelBtnText:"لغو",
      pickerFontFamily:"YekanBakhFaMedium",
      pickerToolBarFontSize:12,
      pickerTextEllipsisLen:20,
      pickerFontSize:12,    
      selectedValue: [],    
      onPickerConfirm: data => {
        this.GetCheque(data);
      },
      onPickerCancel: data => {  
          //console.log(data);
      },
      onPickerSelect: data => {  
        //this.GetCheque(data);
      }
    });*/
  }

  GetCheque(val){
    let that = this;  
    var Param = "";
    this.setState({  
      Sort:val
    })
    if (val == "تاریخ سررسید")
      Param = ";;;;;;;7;;0;";   
    else if (val == "تاریخ دریافت")
      Param = ";;;;;;;7;;1;";
     else if (val == "مبلغ چک")
      Param = ";;;;;;;7;;2;";
    let SCallBack = function(response){

      response = JSON.parse(response.d)
      console.warn(response)         

      that.setState({
        ShowLoading:false
      })
      let data=[];
      let resp=[];
      let ListView=[];
      var Sum=0;
      var Count=0;
     for(let i=0;i<response.length;i++){
      let Id,Tar_Dar,Num,Amount,Tar_Sar,Bank;
          Id = response[i].chq_Id; 
          Tar_Dar = response[i].chq_TarDar;  
          Num = response[i].chq_Sho; 
          Amount = response[i].chq_AmountD;  
          Tar_Sar = response[i].chq_TarSar;                
          Bank = response[i].chq_Bnk; 
          
       Sum+=parseInt(response[i].chq_Amount);
       Count++;
       ListView[i] = {     
        data : 
        <div style={{backgroundColor:'#fff',marginBottom:5}}>    
      <div style={{paddingTop:4,paddingBottom:4,paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
       <span style={{fontFamily:'YekanBakhFaMedium',fontSize:13,color:'blue'}}>{ Num  } </span>
       </div> 
       <div>   
       <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12}}>شماره</span>
       </div>
      </div>       
      <div style={{paddingTop:4,paddingBottom:4,paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
       <Badge severity="success" value={ Amount  }>
       </Badge>
       </div> 
       <div>   
       <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12}}>مبلغ</span>
       </div>
      </div>
      <div>        
      <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
       <span >{Tar_Dar}</span>
       </div>
       <div> 
       <span >تاریخ دریافت</span>
       </div>
    </div>   
    <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
       <span >{Tar_Sar}</span>
       </div>
       <div> 
       <span >تاریخ سررسید</span>
       </div>
    </div>
    <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
       <span >{ Bank }</span>
       </div>
       <div> 
       <span >بانک</span>
       </div>
    </div> 
    </div>
  </div>   

             
       } 
     }
     if(response.length < 1){
      ListView[0] = {     
        data : 
        <div> 
          <span >اطلاعاتی جهت نمایش وجود ندارد</span>
        </div> 
             
       }
     }
     //console.warn(response)  
             
     that.setState({
      listViewData:ListView,
      Sum:Sum,
      Count:Count
     })
     
    } 
    let ECallBack = function(error){
      that.setState({
        ShowLoading:false
      })  
    }
    var param = '{CommandNo : "91" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + Param + '" }';
    this.setState({
      ShowLoading:true
    }) 
    that.Server.sendRaymand(""+that.props.ip+"/MobileBank.aspx/MobileBankSpJson",param,SCallBack,ECallBack,1)
  }
  render() {         
   
  
    return (   

      <div>
            <Header credit={this.state.credit} ComponentName="مدیریت چک ها" />

             
       <div> 
      
       <span style={{display:'none'}}>
       <div style={{backgroundColor:'#9dccae',padding:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
        <div><i name='md-arrow-dropdown' style={{fontSize:30,color:'#000'}} /></div><div><span style={{fontFamily:'YekanBakhFaMedium',fontSize:14,color:'#000'}}>مرتب سازی بر اساس...  {this.state.Sort}  </span></div>
        </div></span>
        {this.state.Count>0&&
     
        <div style={{paddingTop:4,paddingBottom:4,paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
      
        <div> 
        {this.state.Sum&&this.state.Sum.toString()&&   
        <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12}}>{this.state.Sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}({this.state.Count})</span>
        }
        </div>
       </div> 
        }
      {
         this.state.listViewData&&this.state.listViewData.map((item, index) => (
          <div style={{borderBottomWidth:1,borderBottomColor:'#eee'}}>        
            {item.data}          
          </div>
               
         )) 
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
export default connect(mapStateToProps)(Cheque)  


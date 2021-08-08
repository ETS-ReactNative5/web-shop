import React, { Component } from 'react';
import Server from '../Server.js'
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { connect } from "react-redux"
import Header from '../Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
const Picker = [
  {label: '100', value: '100'},
  {label: '50', value: '50'},
  {label: '20', value: '20'},
  {label: '10', value: '10'}
]; 
class Gardesh extends React.Component {
  constructor(props){
    super(props);  
    this.Server = new Server();   

    this.state={
      AccountNumber:this.props.location.search.split("account=")[1],
      place:this.props.place,
      numberOfRows:"10",     
      listViewData : [],
      ShowLoading:false,
      Commandno:this.props.location.search.split("VamType=") && this.props.location.search.split("VamType=")[1] ?  "22" : "2",
      VamType:this.props.location.search.split("VamType=")[1] && this.props.location.search.split("VamType=")[1].split("&")[0],
      MandeArray:[],
      DateArray:[],
      VisibleExtra:false 
    }
    let data = ["5","10","15","20","30","50","100","200"];
           


  }
  componentDidMount() {
    this.GetGardesh("10");

  }
  ConvertNumToFarsi(text){
    if(!text)
      return text;
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return text.toString().replace(/[0-9]/g, function(w){
     return id[+w]
    });
  }
  GetGardesh(n){
    this.setState({
      numberOfRows: n
    });
    let number = n;
    let that = this;
    let ListView=[];
    let MandeArray=[];      
    let DateArray=[];                 
    let SCallBack = function(response){            
      that.setState({ 
        ShowLoading:false
      })   
      if(that.state.Commandno=="22"){ //Vam
        var parseString = ""
        //var parseString = require('react-native-xml2js').parseString;
        var xml = response.d||response;
        let XmlParsed = new DOMParser().parseFromString(xml,"text/xml").getElementsByTagName("Table");
        for(let result of XmlParsed) { 

          

              if(that.state.VamType=="1"){                                  
                if(result.children[3].textContent != ""){  
                ListView.push({     
                  data :       
                <div style={{backgroundColor:'#fff',marginBottom:5}}>
                <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                  <div>
                    <span style={{fontFamily:'YekanBakhFaMedium',fontSize:16,color:'blue'}}>{ that.ConvertNumToFarsi(result.children[2].textContent)  } ریال</span>
                  </div>      
                  <div>   
                  <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12}}>مبلغ قسط</span>
                  </div>
                  </div>
                  <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                  <div>                     

                  <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,color:'#437154'}}>{result.children[3].textContent} (تاخیر {that.ConvertNumToFarsi(result.children[6].textContent)})</span>  
                  </div>
                  <div> 
                  <span >تاریخ پرداخت</span>
                  </div>
                </div> 
                  <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                  <div> 
                  <span style={{fontFamily:'YekanBakhFaMedium'}}  >{that.ConvertNumToFarsi(result.children[1].textContent)}</span>
                  </div>
                  <div> 
                  <span >تاریخ سررسید</span>
                  </div>
                </div>
                  
                <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                  <div> 
                  <span style={{fontFamily:'YekanBakhFaMedium'}} >{that.ConvertNumToFarsi(result.children[4].textContent)}</span>
                  </div>
                  <div> 
                  <span style={{fontFamily:'YekanBakhFaMedium'}}>مبلغ پرداخت</span>
                  </div>
                </div>        
                  <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                  <div> 
                  <span style={{fontFamily:'YekanBakhFaMedium'}} >{that.ConvertNumToFarsi(result.children[5].textContent)}</span>
                  </div>
                  <div> 
                  <span style={{fontFamily:'YekanBakhFaMedium'}}>مانده</span>
                  </div>
                </div>   
                </div>    
                      
                })
              }
            }else{
              if(result.children[3].textContent == ""){      
                ListView.push({     
                  data :   
                  <div style={{backgroundColor:'#fff'}}>
 
                    <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
                    
                    <div style={{alignItems:"center",justifyContent:"center",textAlign:'center'}}>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'center'}}>مبلغ قسط :</span>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:16,textAlign:'center',color:'#b5a809'}}>{ that.ConvertNumToFarsi(result.children[2].textContent)  } ریال </span>
             
                      <Button warning style={{marginBottom:5}} onClick={()=>window.open("https://r-bank.ir/"+that.props.place+that.state.AccountNumber,"_blank")}  >
                      <span style={{fontFamily:"YekanBakhFaMedium",fontSize:14,padding:4}}>پرداخت</span>
                    </Button>
                    </div>   
                    <div style={{alignItems:"center",textAlign:'right',width:'50%'}}>
                      <div>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'center'}}>تاریخ سررسید :</span>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'center'}}>{ that.ConvertNumToFarsi(result.children[1].textContent) }  </span>
                      </div>
                      <div>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,textAlign:'center'}}>مانده :</span>
                      <span style={{fontFamily:'YekanBakhFaMedium',fontSize:16,textAlign:'center',color:'#69676bc7'}}>{ that.ConvertNumToFarsi(result.children[5].textContent)  } ریال </span>

                      </div>
                    </div>
                  </div>
                  </div> 
               
                      
                })
              }
             }
          } 
      }else{
      let data=[];
      let resp=[];
      
     for(let i=0;i<response.length;i++){
       resp[i] = response[i].children;
      
     }  
     var count=0;
     for(let i=0;i<resp.length;i++){
          data.push(resp[i])
          count++;
     }    
     
     for(let i=0;i<data.length;i++){
     console.warn(data[i])  
     let Hr = data[i][1] ? data[i][1].value : ""; 
     let Date = data[i][0] ? data[i][0].value : "";  
     let Bes = data[i][2] ? data[i][2].value : "0"; 
     let Bed = data[i][3] ? data[i][3].value : "";  
     let Mnd = data[i][5] ? data[i][5].value : "";                
     let SanadNo = data[i][6] ? data[i][6].value : "";    
     let Des = data[i][7] ? data[i][7].value : ""; 
     let Info = data[i][8] ? data[i][8].value : "";           
          
     let Typ  = (Bes=="0") ? <span style={{fontFamily:'YekanBakhFaMedium',fontSize:13,color:'red'}}><i name='ios-arrow-round-down' style={{fontSize:13,color:'red'}} />برداشت</span> : <span style={{fontFamily:'YekanBakhFaMedium',fontSize:13,color:'green'}}><i name='ios-arrow-round-up' style={{fontSize:13,color:'green'}}  />واریز</span> ;
     let Amount = (Bes!="0")	? Bes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : Bed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     MandeArray[i]=Mnd;

     DateArray[i]=Date.split("/")[1]+"/"+Date.split("/")[2];
     ListView[i] = {     
      data :        
      <div style={{backgroundColor:'#fff',marginBottom:5,borderBottom:'1px solid #eee'}}>    
      
                                   
      <div style={{paddingTop:4,paddingBottom:4,paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div> 
        {Bes==0 ? 
       <Badge severity="danger" value={ that.ConvertNumToFarsi(Amount)  }>
       </Badge>
         : 
         <Badge severity="success" value={ that.ConvertNumToFarsi(Amount)  }>
       </Badge>
         }
       </div> 
       <div>
       <span style={{fontFamily:'YekanBakhFaMedium'}} ><i name="md-calendar" style={{color:'blur',fontSize:12,fontFamily:'YekanBakhFaMedium'}} />{ that.ConvertNumToFarsi(Date) } <i class="fal fa-clock" style={{color:'blue',fontSize:12}} ></i> {that.ConvertNumToFarsi(Hr.substring(0,2) + ":"+ Hr.substring(2,4) + ":" + Hr.substring(4,6))}</span>
   
      </div>   
       <div>              
       <span style={{fontFamily:'YekanBakhFaMedium',fontSize:12,color:(Bes=="0") ? 'green' :'red'}}>{Typ}</span>  
       </div>         
      </div>
      <div>        
      <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
        
       <div style={{display:'flex',justifyContent:'space-between',width:'100%',flexDirection:'column',alignItems:'flex-end'}} > 
       <span  style={{fontFamily:'YekanBakhFaMedium',fontSize:13}} >{that.ConvertNumToFarsi(Des)}</span>
       <span style={{fontFamily:'YekanBakhFaMedium',fontSize:14 ,color:'red'}}>شماره سند {that.ConvertNumToFarsi(SanadNo)}</span>
       <span style={{textAlign:'right',fontFamily:'YekanBakhFaMedium',fontSize:11}}>{Info}</span>   
      
       </div>
     
    </div>   
   
    <div style={{paddingRight:8,paddingLeft:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
       <div>                   
       <span style={{fontFamily:'YekanBakhFaMedium'}} >{ that.ConvertNumToFarsi(Mnd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))  } ریال</span>
       </div>
       <div> 
       <span style={{fontFamily:'YekanBakhFaMedium'}} >مانده</span>
       </div>
    </div> 
    </div>
  </div> 
     }     
     }
     }
     var flag=true;
     for(var k=0;k<MandeArray.length;k++){
       if(isNaN(MandeArray[k]))
          flag=false;
     }
     that.setState({
      listViewData:ListView
     })
     if(flag){    
      that.setState({
        MandeArray:MandeArray,
        DateArray:DateArray
      })
    }
     
    } 
    let ECallBack = function(error){
      that.setState({   
        ShowLoading:false
      })  
     alert(error)   
    }
    var param = '{CommandNo : "' + that.state.Commandno + '" , AccountNo: "' + that.state.AccountNumber + '",Param1: "' + number + '" }';
    this.setState({
      ShowLoading:true
    }) 
    let ip = that.props.ip || "https://ansar24.com";
    that.Server.sendRaymand(""+ip+"/MobileBank.aspx/MobileBankSp",param,SCallBack,ECallBack,(that.state.Commandno=="22" ? 1 : 0))
  }
  render() {      
   
  
    return (  
      !this.state.ShowLoading ?  
      <div>
        <div>
          <Header credit={this.state.credit} ComponentName="گردش حساب"  />

        </div>
        <div>

      {
         this.state.Commandno=="22"&&this.state.VamType!="1"&&
         <div style={{backgroundColor:'#c8c163',textAlign:'center',padding:8}}>
           <span style={{fontFamily:'YekanBakhFaMedium',fontSize:14,color:'#000',textAlign:'center'}}>اقساط باقیمانده وام شماره {this.ConvertNumToFarsi(this.state.AccountNumber)}</span>
        </div>
       }  
       {
         this.state.Commandno=="22"&&this.state.VamType=="1"&&
         <div style={{backgroundColor:'#c8c163',textAlign:'center',padding:8}}>
           <span style={{fontFamily:'YekanBakhFaMedium',fontSize:14,color:'#000',textAlign:'center'}}>اقساط پرداخت شده وام شماره {this.ConvertNumToFarsi(this.state.AccountNumber)}</span>
        </div>   
       }
      <div>
          </div>
       <div style={{borderBottomWidth:1,borderBottomColor:'#eee',marginBottom:15,color:'red'}}>    
       {
        this.state.MandeArray.length>0 &&    
       <div >  
       <div style={{backgroundColor:'#c8c163',padding:8,display:'flex',flexWrap:'nowrap',flexDirection:'row',justifyContent:'space-between',alignContent:'flex-start'}} >
        <div></div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexDirection:'row-reverse',width:'100%'}}><div style={{fontFamily:'YekanBakhFaMedium',fontSize:14,textAlign:"center",color:'#000'}}>مشاهده </div> <SelectButton value={this.state.numberOfRows} options={Picker} onChange={(e) => this.GetGardesh(e.value)}></SelectButton><div style={{fontFamily:'YekanBakhFaMedium',fontSize:14,textAlign:"center",color:'#000'}}>  گردش آخر حساب   </div></div>
       </div>  
          
       </div>      
       }
       </div>        
         
      {      
         this.state.listViewData.map((item, index) => (
          <div style={{borderBottom:'1px solid #eee'}}>        
            {item.data}          
          </div>
               
         ))                     
      } 
           

    </div>
  </div>
  :
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
  <ProgressSpinner style={{paddingTop:150}}/>
    
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
    place:state.place,
    fullname : state.fullname,
    mobile : state.mobile
  }     
}
export default connect(mapStateToProps)(Gardesh)  


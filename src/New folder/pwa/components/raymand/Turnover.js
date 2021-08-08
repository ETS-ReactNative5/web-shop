import React from 'react';
import { connect } from "react-redux"
import Header from '../Header.js'


import Server from '../Server.js'


class Turnover extends React.Component {
  
  constructor(props) {
    super(props);

    this.Server = new Server();
  
    
    this.state = {
      visibleLoader: true,
      AccountNumber: !this.props.shop ? this.props.location.search.split("account=")[1] : null,
      Type: !this.props.shop ? this.props.location.search.split("Type=")[1] && this.props.location.search.split("Type=")[1].split("&")[0] : null,

   
    }

  }
  
  ConvertNumToFarsi(text){
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    if(!text)  
      return text;
    return text.toString().replace(/[0-9]/g, function(w){   
     return id[+w]
    });
  }
  componentDidMount() {
    if(this.props.shop){
      this.getShopCreditPayment();
    }else{
      this.getCreditPayment();
    }

  }
  getShopCreditPayment(){
    let that = this;  
    var mobile = null;
    
    let SCallBack = function (response) {
      that.setState({
        Gardesh:response.data.result,
        visibleLoader: false         
      })
    }
    let ECallBack = function (error) {
      that.setState({
        visibleLoader: false
      })
    }
    this.setState({
      visibleLoader: true
    })
    this.Server.send2("https://marketapi.sarvapps.ir/MainApi/getShopCreditPayment", { shopId:this.props.shopId }, SCallBack, ECallBack)

  }
  getCreditPayment(){

    let that = this;  
    var mobile = null;
    if(this.props.mobile)
       mobile = this.props.mobile.charAt(0) == "0" ? this.props.mobile.substr(1) : this.props.mobile;
    let SCallBack = function (response) {
      that.setState({
        Gardesh:response.data.result,
        visibleLoader: false         
      })
    }
    let ECallBack = function (error) {
      that.setState({
        visibleLoader: false
      })
    }
    this.setState({
      visibleLoader: true
    })
    this.Server.send2("https://marketapi.sarvapps.ir/MainApi/getCreditPayment", { limit: 0,username:mobile }, SCallBack, ECallBack)

  }
  render() {
    
    return (
      <div>
        {!this.props.shop &&
          <Header navigation={this.props.navigation} ComponentName='گردش حساب ' goBack={true} />
        }
        
        <div >
        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
          <div style={{backgroundColor:'#fff',width:'100%',textAlign:'right'}}>
          <div style={{textAlign:'right',fontFamily:'YekanBakhFaMedium',marginRight:5,fontSize:12,backgroundColor:'#eee',width:'100%'}}>
            تمامی مبالغ به ریال است
          </div>
          </div>
          
        </div>
        {!this.props.shop ? 
        <div>
        <div style={{display:'flex',flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginTop:10,backgroundColor:'#cdd8df'}}>
                <div style={{width:'20%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>مبلغ</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>فروشگاه</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>تاریخ</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>روز</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>توضیح</span>
                </div>
                <div style={{width:'20%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium'}}>وضعیت</span>
                </div>
          </div>    
          {this.state.Gardesh && this.state.Gardesh.length > 0 && this.state.Gardesh.map((v,i) => {
            return(
              <div style={{display:'flex',flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',backgroundColor: (i % 2 == 0) ? '#fff' : '#eee' }}>
                <div style={{width:'20%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.Amount.toString().replace(",","").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.shop[0] ? v.shop[0].name : '-'}</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.Date}</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.Time}</span>
                </div>
                <div style={{width:'20%',textAlign:'center'}}> 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.desc}</span>
                </div>
                <div style={{width:'15%',textAlign:'center'}}> 
                {v.type == 1 ? 
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12,color:'green'}}><i class="fas fa-plus-circle" /></span>
                :
                  <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12,color:'red'}}><i class="fas fa-minus-circle" /></span>
                }
                </div>
              </div>       
            )
            })
          }
          </div>
          :
          <div style={{textAlign:'center'}}>
            <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:18}}>آخرین تراکنش های حساب مهرکارت</span>
            <div style={{display:'flex',flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginTop:10,backgroundColor:'#cdd8df'}}>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>مبلغ</span>
                  </div>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{this.props.shop ? "خریدار" : "فروشگاه"}</span>
                  </div>
                  <div style={{width:'15%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>روز</span>
                  </div>
                  <div style={{width:'15%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>ساعت</span>
                  </div>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>توضیح</span>
                  </div>
                  <div style={{width:'10%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>وضعیت</span>
                  </div>
                  
            </div>    
            {this.state.Gardesh && this.state.Gardesh.length > 0 && this.state.Gardesh.map((v,i) => {
              return(
                <div style={{display:'flex',flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',backgroundColor: (i % 2 == 0) ? '#fff' : '#eee' }}>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:14}}>{v.Amount.toString().replace(",","").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  </div>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    {this.props.shop ? 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.user[0] ? v.user[0].name : '-'}</span>
                    :
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.shop[0] ? v.shop[0].name : '-'}</span>
                    }
                  </div>
                  <div style={{width:'15%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.Date}</span>
                  </div>
                  <div style={{width:'15%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.Time}</span>
                  </div>
                  <div style={{width:'20%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12}}>{v.desc}</span>
                  </div>
                  {v.username == "system" ?
                  <div style={{width:'10%',textAlign:'center'}}> 
                  {v.type == 1 ? 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12,color:'green'}}><i class="fas fa-plus-circle" /></span>
                  :
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12,color:'red'}}><i class="fas fa-minus-circle" /></span>
                  }
                  </div>
                  :
                  <div style={{width:'10%',textAlign:'center'}}> 
                    <span style={{textAlign:'center',fontFamily:'YekanBakhFaMedium',fontSize:12,color:'green'}}><i class="fas fa-plus-circle" /></span>
                  </div>
                  }
                  
                </div>       
              )
              })
            }
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
export default connect(mapStateToProps)(Turnover)


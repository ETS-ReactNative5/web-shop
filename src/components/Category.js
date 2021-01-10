import React, { Component } from 'react';
import './Category.css';
import Server  from './Server.js'
import {Spinner} from 'primereact/spinner';
import axios from 'axios'  
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Header1  from './Header1.js'
import { connect } from 'react-redux';
import MainBox3  from './MainBox3.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { AutoComplete } from 'rsuite';

class Category extends React.Component {
    constructor(props){
        super(props);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.Server = new Server();
        this.state={
            id:this.props.location.search.split("id=")[1],
            getSubs:this.props.location.search.split("getSubs=")[1],
            GridData:[],
            layout: 'list',
            PId:null,
            UId:null,
            EmptyCat:-1,
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }
        let that = this;
        let param={
            id : this.state.id,
            getSubs:this.state.getSubs,
            token: localStorage.getItem("api_token")
        };
        let SCallBack = function(response){
            let res =response.data.result;
            debugger;

            that.setState({
                GridData:response.data.result,
                EmptyCat:response.data.result.length == 0 ? 0 : 1
            })
        };
        let ECallBack = function(error){
            console.log(error)
        }
        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
                this.setState({
                    UId : response.data.authData.userId
                })
                param.levelOfUser=response.data.authData.levelOfUser
                this.Server.send("MainApi/GetProductsPerCat",param,SCallBack,ECallBack)
            })
          .catch(error => {
            this.Server.send("MainApi/GetProductsPerCat",param,SCallBack,ECallBack)
        })
    }
    roundPrice(price){
        return price.toString();;
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
    componentWillReceiveProps(nextProps) {
        if((nextProps.location.search && nextProps.location.search.split("id=")[1] != this.state.id) || (!nextProps.location.search && this.state.id) ){
            window.location.reload();
        }
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
    itemTemplate(car, layout) {
        if (layout === 'list' && car) {
            
            let pic = car.fileUploaded.split("public")[1] ? this.state.absoluteUrl+car.fileUploaded.split("public")[1] : this.state.absoluteUrl+'nophoto.png';
             return (
                 
                <div className="col-12 col-lg-3 col-md-4 col-sm-6" style={{textAlign:'center',paddingRight:0,paddingLeft:0,paddingTop:0,paddingBottom:0}}>
                <div className="product-grid-item card" style={{padding:10,minHeight:500}} >
                    
                    <div className="product-grid-item-content YekanBakhFaMedium">
                    <img src={pic} alt={car.title} style={{height:150,borderRadius:15}} />
                        <div className="product-name YekanBakhFaMedium" style={{textAlign:'right',marginTop:30,height:50}}>{car.title}</div>
                    </div>
                    <div className="product-grid-item-bottom" style={{marginTop:10,marginBottom:10,textAlign:'left'}}>
                        {(this.state.UId || !car.ShowPriceAftLogin) &&
                        <div>
                            {car.number > 0 ?
                                <div style={{textAlign: 'left'}}>

                                 {
                                    car.number > 0 && (parseInt(this.props.off) + car.off) > "0" ?
                                    <div>
                                        <div className="car-subtitle oldPrice_cat  iranyekanwebmedium" style={{paddingTop:5,marginTop:25, marginLeft:45,fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(car.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div><br/>
                                        <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 'auto',left:0 }} >{this.persianNumber(((!car.NoOff ? parseInt(this.props.off) : 0) + car.off))} %</div>
                                    </div>
                                    :
                                    <div style={{height:66}}>
                                    </div>

                                }
                                 <div className="product-price YekanBakhFaBold" style={{fontSize:20}} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off) : 0)+car.off))/100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                </div>
                                :
                                <div style={{textAlign:'center'}}><div style={{height:70}}>
                                </div><span className="iranyekanwebmedium" style={{fontSize:16,marginTop:10,color:'red'}}>ناموجود</span></div>

                            }

                            
                        </div>
                        }
                        <br/>
                    </div>
                    
                        
                    <div  style={{textAlign:'right'}}><i className="fas fa-id-card-alt" style={{paddingRight:8,paddingLeft:8,fontSize:16}} ></i><span className="iranyekanwebmedium">فروشنده:</span> <span className="YekanBakhFaBold">{car.Seller[0].name}</span></div>
                    <div  style={{textAlign:'right'}}><i className="fas fa-truck" style={{paddingRight:8,paddingLeft:8,fontSize:16}} ></i><span className="YekanBakhFaBold">زمان ارسال: {this.persianNumber(car.PrepareTime||"3")} روز کاری</span></div>
                    <div style={{position:'absolute',bottom:6,width:'100%',left:0}}>
                    <Button label="Secondary"  className="p-button-secondary" icon="pi pi-shopping-cart " onClick={()=>{this.GoToProduct((car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id)}} style={{marginTop:10,width:'85%'}} label="مشاهده جزئیات / خرید"></Button>

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
    GoToProduct(id){
        this.setState({
            PId:id
        })
    }
    render(){
    if (this.state.PId) {
        return <Redirect to={"/products?id="+this.state.PId}/>;
    }
    return (
      
        <div>   
        <Header1 /> 
        <Header2 /> 
        <div className="row justify-content-center firstInPage  p-md-5 p-3" style={{direction:'rtl',minHeight:600}}>
        
        <div className="col-lg-10 DataViewNoBorder bs-row">
            {this.state.GridData.length > 0 && this.state.EmptyCat !=0 ?
            <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={9}  itemTemplate={this.itemTemplate}></DataView>

            :
            <div>
                {this.state.EmptyCat ==0 ? 
                <p className="iranyekanwebmedium"  style={{ textAlign: 'center',fontSize:35,marginTop:50 }}>کالایی جهت نمایش وجود ندارد. <i class="fal fa-frown" style={{marginRight: 20,fontSize: 36}}></i></p>
                :
                <div style={{ zIndex: 10000 }} >
                            <p style={{ textAlign: 'center' }}>
                            <img src={require('../public/loading.gif')} style={{ width: 320 }} />
                            </p>
                
                 </div>
                
                }
             </div>
            }

            </div>
        
        </div>
         <Footer />
     </div>
     
    )
    }
}
const mapStateToProps = (state) => {
	return{
		CartNumber : state.CartNumber,
		off : state.off
	}
   }
   export default withRouter(
	connect(mapStateToProps)(Category)
   );
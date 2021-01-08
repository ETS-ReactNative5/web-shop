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
            that.setState({
                GridData:response.data.result
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
                <div className="col-12 col-md-4" style={{marginBottom:10,textAlign:'center'}}>
                <div className="product-grid-item card" style={{padding:10}} >
                    
                    <div className="product-grid-item-content iranyekanweblight">
                    <img src={pic} alt={car.title} style={{height:150,borderRadius:15}} />
                        <div className="product-name iranyekanweblight">{car.title}</div>
                        <div className="product-description iranyekanweblight">{car.subTitle}</div>
                    </div>
                    <div className="product-grid-item-bottom" style={{marginTop:10,marginBottom:10}}>
                        {(this.state.UId || !car.ShowPriceAftLogin) &&
                        <div>
                            {car.number > 0 ?
                                 <span className="product-price iranyekanweblight" style={{fontSize:20}} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off) : 0)+car.off))/100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</span>

                                :
                                <span className="iranyekanwebmedium" style={{fontSize:16,marginTop:10,color:'red'}}>ناموجود</span>

                            }
                            
                        </div>
                        }
                        <br/>
                        <Button label="Secondary" className="p-button-secondary" icon="pi pi-shopping-cart " onClick={()=>{this.GoToProduct((car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id)}} style={{marginTop:10}} label="مشاهده جزئیات / خرید"></Button>
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
            {this.state.GridData.length > 0 &&
            <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={9}  itemTemplate={this.itemTemplate}></DataView>
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
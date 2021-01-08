import React, { Component } from 'react';
import './Category.css';
import Server  from './Server.js'
import {Spinner} from 'primereact/spinner';
import axios from 'axios'  
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Header1  from './Header1.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
class Shop extends React.Component {
    constructor(props){
        super(props);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.Server = new Server();
        this.state={
            id:this.props.location.search.split("id=")[1],
            GridData:[],
            layout: 'list',
            PId:null,
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }
        let that = this;
        let param={
            id : this.state.id,
            token: localStorage.getItem("api_token")
        };
        let SCallBack = function(response){
            let res =response.data.result;
            that.setState({
                GridData:response.data.result
            })
        };
        let ECallBack = function(error){
            alert(error)
        }
        this.Server.send("MainApi/GetProductsPerShop",param,SCallBack,ECallBack)
    }
    itemTemplate(car, layout) {
        if (layout === 'list' && car) {
            
            let pic = car.fileUploaded.split("public")[1] ? this.state.absoluteUrl+car.fileUploaded.split("public")[1] : this.state.absoluteUrl+'nophoto.png';
            
             return (
                 <div>
                 <div className="row">
                     <div className="col-lg-2 col-md-2 col-12 yekan"  style={{textAlign:'center'}}>
                     <span>
                        {car.title}
                        <br/>
                        {car.subTitle}
                     </span>    
                     </div>
                     <div className="col-lg-4 col-md-4 col-12" style={{textAlign:'center'}} >
                     <p className="yekan" style={{textAlign:"center"}}>{car.desc}</p>
                     </div>
                     <div className="col-lg-2 col-md-2 col-12 yekan" style={{textAlign:'center'}} >
                     <span style={{fontSize:20}}>
                         {this.persianNumber((car.price - (car.price * car.off)/100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان
                     </span>
                     </div>
                     <div className="col-lg-2 col-md-2 col-6 yekan" style={{textAlign:'center'}}>
                      <img  src={pic} style={{width : "150px",marginLeft:80}} name="pic3"  alt="" /> 
                     </div>
                     
                     <div className="col-lg-2 col-md-2 col-6 yekan" style={{textAlign:'center'}}>
                     <button className="btn btn-primary" style={{marginTop:25}} onClick={()=>{this.GoToProduct(car._id)}}>جزییات</button>
                     </div>
                    
                 </div> <hr /></div>
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
    if (this.state.PId) {
        return <Redirect to={"/products?id="+this.state.PId}/>;
    }
    return (
      
        <div>   
        <Header1 /> 
        <Header2 />
        <div className="row justify-content-center firstInPage" style={{direction:'rtl',minHeight:600}}>
        
        <div className="col-lg-10">
            <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={10} itemTemplate={this.itemTemplate}></DataView>
        </div>
        
        </div>
        <Footer /> 
     </div>
     
    )
    }
}
export default Shop;
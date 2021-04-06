import React, { Component } from 'react';
import Server  from './Server.js'
import {withRouter , NavLink ,Link,Redirect} from 'react-router-dom'
import axios from 'axios'  
import Header1  from './Header1.js'
import Header2  from './Header2.js'

import {TabView,TabPanel} from 'primereact/tabview';
import { Button,Alert } from 'reactstrap';
import {Panel} from 'primereact/panel';
import moment from 'moment-jalaali';
import { connect } from 'react-redux';
import {Dialog} from 'primereact/dialog';
import ReactImageMagnify from 'react-image-magnify';
import MainBox3  from './MainBox3.js'
import Footer  from './Footer.js' 
class Products extends React.Component {
    constructor(props){
        super(props);
        this.Server = new Server();
        this.getBlogs = this.getBlogs.bind(this);
        this.myRef = React.createRef()   // Create a ref object
        this.getProducts = this.getProducts.bind(this);
 
        
        this.state={
            id:this.props.location.search.split("id=")[1],
            UId:null,
            loading:1,
            levelOfUser:null,
            Blog:[],
            Newproducts:[],
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }

        axios.post(this.state.url+'checktoken', {
            token: localStorage.getItem("api_token")
        })
        .then(response => {
                this.setState({
                    UId : response.data.authData.userId,
                    levelOfUser:response.data.authData.levelOfUser
                })
                this.getPics();
          })
          .catch(error => {
            this.getPics();

        })
               
            
       
        
       
    }
    getSettings() {
        let that = this;
        that.Server.send("AdminApi/getSettings", {}, function (response) {

            if (response.data.result) {
                that.setState({
                    ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
                    SaleFromMultiShops: response.data.result[0] ? response.data.result[0].SaleFromMultiShops : false
                })
            }
            that.getBlogs(); 

        }, function (error) {
        })


    }
    componentWillReceiveProps(nextProps) {
        if((nextProps.location.search && nextProps.location.search.split("id=")[1] != this.state.id) || (!nextProps.location.search && this.state.id) ){
            window.location.reload();
        }
    }
    componentDidMount(){
        document.getElementsByTagName("body")[0].scrollTo(0, 0); 
        //this.myRef.current.scrollTo(0, 0);   
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
    getBlogs(){
        let that = this;
        
        let param={
            BlogId:this.state.id,
            condition:this.state.id ? {} : {FixPage:false} 
        }; 
        
        let SCallBack = function(response){
            
            that.setState({
                Blog:response.data.result,
                loading:0
            })
            that.getProducts();
            that.myRef.current.scrollTo(0,0)

        };
        
        let ECallBack = function(error){
            
        }
        that.Server.send("AdminApi/getBlogs",param,SCallBack,ECallBack)
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
    
    getProducts(){
        axios.post(this.state.url+'getProducts', {
            type: "new",
            limit:8,
            levelOfUser:this.state.levelOfUser
        })
        .then(response => {
            
                this.setState({
                    Newproducts:response.data.result
                })

            
           
            
        })
        .catch(error => {
            console.log(error)
        })

    }
    getPics(l, type) {
        let that = this;
        axios.post(this.state.url + 'getPics', {})
          .then(response => {
            response.data.result.map(function (item, index) {
              
              if (item.name == "file13"){
                that.setState({
                  loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
                })
              }
                  
            })
            this.getSettings();      
        })
          .catch(error => {
            this.getSettings();      
        })
    
    }
    render(){
    if (this.state.GotoLogin) {
        return <Redirect to={"/login"}/>;
    }
    return (
      <div ref={this.myRef}>  
        <Header1 /> 
        <Header2 /> 
        {!this.state.loading ? 
        <div className="single_product firstInPage blogs" style={{direction:'rtl'}} >
        
		<div className="container">
            <div className="row" >
                {this.state.ProductBase &&
                <div className="col-md-3 col-12 order-md-1 order-2" style={{marginTop:50,opacity:'0.8'}} >
                {this.state.Newproducts.map((item,index) => {
                    var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];

                    return(
                        <div style={{textAlign:'center',border:'1px solid #d8d8d8',padding:15,margin:5,borderRadius:5}}>
                            <NavLink    className="car-details" to={`${process.env.PUBLIC_URL}/Products?id=`+((item.product_detail && item.product_detail.length>0) ? item.product_detail[0]._id : item._id)} style={{color:'#333'}} >
                                <div className="p-grid p-nogutter" >
                                    <div className="p-col-12" align="center" >
                                    <img src={img} style={{height:160}}  alt="" />
                                    </div>
                                    <div className="p-col-12 car-data" style={{marginTop:10}}>
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:14}}>{item.title}</div>
                
                                        <div className="car-title yekan" style={{textAlign:'center',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontSize:12,marginTop:5,marginBottom:5}} >{item.subTitle}</div>
                                        
                                        {(this.state.UId || !item.ShowPriceAftLogin)&&  
                                        <div>
                                            <div className="car-subtitle yekan" style={{textAlign:'center',textDecoration:'line-through',fontSize:11,color:'#a09696'}} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                            <div className="car-subtitle yekan" style={{textAlign:'center'}} ><span className="yekan" style={{float:'left',fontSize:11,marginTop:10,color:'#d08527'}}>تومان</span> <span className="yekan" style={{fontSize:20,color:'#d08527'}}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off+(!item.NoOff ? parseInt(this.props.off) : 0)))/100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) }</span> </div>
                                        </div>
                                        }
                                       
                                        
                                    </div>
                                    {
                                        item.off != "0" &&
                                        <div className="car-title yekan off" style={{position:'absolute',top:0,backgroundColor:'#99389a'}} >{this.persianNumber(((!item.NoOff ? parseInt(this.props.off) : 0)+item.off))} %</div>
                
                                    }
                
                                </div>
                            </NavLink >

                        </div>
                    )
                })
                }
                </div>
                }
                <div className={this.state.ProductBase ? "col-md-9 col-12 order-md-2 order-1" : "col-md-12 col-12 order-md-2 order-1"} style={{marginTop:50}} >
                    {this.state.id && this.state.Blog[0] ? 
                    <div>
                        <div className="iranyekanwebblack" style={{textAlign:'center',fontSize:22}}>{this.state.Blog[0].title}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.Blog[0].content }} style={{textAlign:'right'}} />
                    </div>
                    :
                    <div>

                    {this.state.Blog.map((item,index) => {
                        return(
                            <div style={{marginTop:8,cursor:'pointer'}} >
                                <div className="row">
                                        
                                        <div className="col-12" style={{backgroundColor:'#f1f1f1'}}>
                                <NavLink    className="car-details" to={`${process.env.PUBLIC_URL}/Blogs?id=`+item._id} style={{color:'#333',backgroundColor:'#eee',textDecoration:'none'}} >
                                    
                                            <p className="iranyekanwebblack" style={{textAlign:'right',backgroundColor:'#2f2f2fb8',color:'#fff',padding:8,marginTop:10,borderRadius:5}}>{item.title}</p>

                                            <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight" style={{textAlign:'right',height:150,overflow:'hidden'}} />
                                      
                                </NavLink >
                                </div>
                                    </div>
                            </div>
                        )

                    })
                    }
                    </div>
                    
                    }
                </div>
            </div>
                 
        </div>
                   
	    </div>
        :
            <div style={{ zIndex: 10000 }} >
                  <p style={{ textAlign: 'center' }}>
                    
                    <img src={this.state.loading_pic}  />
                  </p>
        
                </div>
        }
        {!this.state.loading &&
          <Footer />
        }
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
	connect(mapStateToProps)(Products)
   );
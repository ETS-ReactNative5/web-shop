import React, { Component } from 'react';
import Server  from './Server.js'
import {withRouter , NavLink ,Link,Redirect} from 'react-router-dom'
import axios from 'axios'  
import Header  from './Header.js'
import { ProgressSpinner } from 'primereact/progressspinner';

import { connect } from 'react-redux';
import Footer  from './Footer.js' 
class Blogs extends React.Component {
    constructor(props){
        super(props);
        this.Server = new Server();
        this.getBlogs = this.getBlogs.bind(this);
        this.myRef = React.createRef()   // Create a ref object
 
        
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
                    levelOfUser:response.data.authData.levelOfUser,
                    username:response.data.authData.username
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
    getBlogs(_id){
        let that = this;
        
        let param={
            BlogId:_id,
            condition:_id ? {} : {FixPage:{$ne: true}} 
        }; 
        
        let SCallBack = function(response){
            that.setState({
                Blog:response.data.result,
                loading:0,
                id:_id
            })
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
        <Header ComponentName="اخبار و اعلانات" close="1"  /> 
        {!this.state.loading ? 
        <div className="single_product firstInPage blogs" style={{direction:'rtl'}} >
        
		<div className="container">
            <div className="row" >
               
                <div className={this.state.ProductBase ? "col-md-9 col-12 order-md-2 order-1" : "col-md-12 col-12 order-md-2 order-1"} style={{padding:10}}  >
                    {this.state.id && this.state.Blog[0] ? 
                    <div>
                        <div className="YekanBakhFaMedium" style={{textAlign:'center',fontSize:22}}>{this.state.Blog[0].title}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.Blog[0].content }} className="blog" style={{textAlign:'right'}} />
                    </div>
                    :
                    <div>

                    {this.state.Blog.map((item,index) => {
                        return(
                            <div style={{marginTop:8,cursor:'pointer'}} >
                                <div className="row blog">
                                        
                                        <div className="col-12" style={{backgroundColor:'#f1f1f1'}}>
                                        <div    className="car-details" onClick={()=>{this.getBlogs(item._id)}} style={{color:'#333',backgroundColor:'#eee',textDecoration:'none'}} >
                                    
                                            <p className="YekanBakhFaMedium" style={{textAlign:'right',backgroundColor:'#ececec',color:'#333',padding:8,marginTop:10,borderRadius:5}}>{item.title}</p>

                                      
                                </div >
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',height:'100%' }}>
          <ProgressSpinner style={{ paddingTop: 150 }} />
        </div>
        }
      </div>
    )
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
      mobile: state.mobile
    }
  }
   export default withRouter(
	connect(mapStateToProps)(Blogs)
   );
import React, { Component } from 'react';
import Server  from './Server.js'
import {withRouter , NavLink ,Link,Redirect} from 'react-router-dom'
import Header1  from './Header1.js'
import Header2  from './Header2.js'
import Header  from './Header.js'

import { connect } from 'react-redux';
import Footer  from './Footer.js' 
class Pages extends React.Component {
    constructor(props){
        super(props);
        this.Server = new Server();
        this.getPages = this.getPages.bind(this);
        this.myRef = React.createRef()   // Create a ref object
 
        
        this.state={
            id:this.props.location.search.split("id=")[1],
            UId:null,
            loading:1,
            levelOfUser:null,
            Pages:[],
            Newproducts:[],
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }
        debugger;
        this.getSettings();

               
            
       
        
       
    }
    componentDidMount(){
        document.getElementsByTagName("body")[0].scrollTo(0, 0); 
    }
    getPages(){
        let that = this;
        if(!this.state.id)
            return;
        let param={
            page:this.state.id
        }; 
        
        let SCallBack = function(response){
            debugger;
            that.setState({
                Layout:response.data.result[0].content,
                LayoutItems:response.data.result[0].items,
                loading:0
            })
            that.myRef.current.scrollTo(0,0)

        };
        
        let ECallBack = function(error){
            
        }
        that.Server.send("AdminApi/getPageLayout",param,SCallBack,ECallBack)
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
    
    getSettings() {
        let that = this;
        that.Server.send("AdminApi/getSettings", {}, function (response) {

            if (response.data.result) {
                that.setState({
                    ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
                    SaleFromMultiShops: response.data.result[0] ? response.data.result[0].SaleFromMultiShops : false,
                    System: response.data.result[0] ? response.data.result[0].System : "shop"
                })
            }
            that.getPages(); 

        }, function (error) {
        })


    }
    render(){
    if (this.state.GotoLogin) {
        return <Redirect to={"/login"}/>;
    }
    return (
      <div ref={this.myRef}>  
      {this.state.System=="shop"  ?
        <div>
            
        <Header1 /> 
        <Header2 />
        </div>
        :
        <div>
            {this.state.System ?
               <Header /> 

            :
                <div></div>
            }
 
        </div>
        }
        {!this.state.loading ? 
        <div className="single_product firstInPage blogs" style={{direction:'rtl'}} >
        
		<div className="container">
        {this.state.Layout && this.state.Layout.map((item,index)=>{
                    if(!this.state.LayoutItems["hidden"+item.id]){
                      return(
                        <div style={{textAlign:'right',marginTop:100}}>
                            {this.state.LayoutItems["link"+item.id]
                            ?
                            this.state.LayoutItems["link"+item.id].indexOf("http://") != -1 ?
                            <a  href={this.state.LayoutItems["link"+item.id]} target="_blank" style={{cursor:'pointer'}} >
                              <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            </a>
                            :

                            <NavLink  to={this.state.LayoutItems["link"+item.id].indexOf("http://") != -1 ? this.state.LayoutItems["link"+item.id] : `${process.env.PUBLIC_URL}/${this.state.LayoutItems["link"+item.id]}`} target="_blank" style={{cursor:'pointer'}} >
                              <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            </NavLink>
                            :
                            <div dangerouslySetInnerHTML={{ __html: item.content }} className="iranyekanweblight " style={{textAlign:'right',overflow:'hidden'}} />
                            }
                        </div>
                        
                    )
                    }
                        
                    })}
                 
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
	connect(mapStateToProps)(Pages)
   );
import React, { Component } from 'react';
import './Category.css';
import Server  from './Server.js'
import axios from 'axios'  
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import { withRouter, Route, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { SelectButton } from 'primereact/selectbutton';
import { ToggleButton } from 'primereact/togglebutton';
import {InputSwitch} from 'primereact/inputswitch';

import Header1  from './Header1.js'
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
class Shop extends React.Component {
    constructor(props){
        super(props);
        this.Server = new Server();
        this.getProducts = this.getProducts.bind(this);

        this.state={
            id:this.props.location.search.split("id=")[1],
            GridData:[],
            layout: 'list',
            PId:null,
            Exist:true,
            SortOptions: [{ name: 'جدیدترین', value: 1 }, { name: 'ارزانترین', value: 2 }, { name: 'گرانترین', value: 3 }, { name: 'سریعترین ارسال', value: 4 }],
            absoluteUrl:this.Server.getAbsoluteUrl(),
            url:this.Server.getUrl()
        }
        this.itemTemplate = this.itemTemplate.bind(this);

    }
    componentDidMount() {
        this.getProducts({Exist:true});
    
    }
    getProducts(p){
        
        let that = this;
        let param={
            id : this.state.id,
            token: localStorage.getItem("api_token"),
            Exist: p.Exist,
            Sort: p.Sort
        };
        let SCallBack = function(response){
            let shop = response.data.extra ? response.data.extra.shop[0] : null;
            let res =response.data.result;
            that.setState({
                GridData:response.data.result,
                shop:shop
            })
        };
        let ECallBack = function(error){
            alert(error)
        }
        this.Server.send("MainApi/GetProductsPerShop",param,SCallBack,ECallBack)
    }
    roundPrice(price) {
        return price.toString();;
        if (price == 0)
            return price;
        price = parseInt(price).toString();
        let C = "500";
        let S = 3;
        if (price.length <= 5) {
            C = "100";
            S = 2;
        }
        if (price.length <= 4) {
            C = "100";
            S = 2;
        }
        let A = price.substr(price.length - S, S)
        if (A == C || A == "000" || A == "00")
            return price;
        if (parseInt(A) > parseInt(C)) {
            let B = parseInt(A) - parseInt(C);
            return (parseInt(price) - B + parseInt(C)).toString();
        } else {
            let B = parseInt(C) - parseInt(A);
            return (parseInt(price) + B).toString();
        }


    }
    itemTemplate(car, layout) {
        if (layout === 'list' && car) {
            let pic = car.fileUploaded.split("public")[1] ? this.state.absoluteUrl + car.fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            return (
                <div className="col-12 col-lg-4 col-md-4 col-sm-6" style={{ textAlign: 'center', paddingRight: 0, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
                    <div className="product-grid-item card" style={{ padding: 10, minHeight: 400 }} >
                        <div className="product-grid-item-content YekanBakhFaMedium">
                            <img src={pic} alt={car.title} style={{ height: 150, borderRadius: 15 }} />
                            <div className="product-name YekanBakhFaMedium" style={{ textAlign: 'right', marginTop: 30, height: 50 }}>{car.title}</div>
                        </div>
                        <div className="product-grid-item-bottom" style={{ marginTop: 10, marginBottom: 10, textAlign: 'left' }}>
                            {(this.state.UId || !car.ShowPriceAftLogin) &&
                                <div>
                                    {car.number > 0 ?
                                        <div style={{ textAlign: 'left' }}>

                                            {
                                                car.number > 0 && (parseInt(this.props.off) + car.off) > "0" ?
                                                    <div>
                                                        <div className="car-subtitle oldPrice_cat  iranyekanwebmedium" style={{ paddingTop: 5, marginTop: 25, marginLeft: 45, fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(car.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div><br />
                                                        <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 'auto', left: 0 }} >{this.persianNumber(((!car.NoOff ? parseInt(this.props.off) : 0) + car.off))} %</div>
                                                    </div>
                                                    :
                                                    <div style={{ height: 66 }}>
                                                    </div>

                                            }
                                            <div className="product-price YekanBakhFaBold" style={{ fontSize: 20 }} >{this.persianNumber(this.roundPrice((car.price - (car.price * ((!car.NoOff ? parseInt(this.props.off) : 0) + car.off)) / 100).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان</div>

                                        </div>
                                        :
                                        <div style={{ textAlign: 'center' }}><div style={{ height: 70 }}>
                                        </div><span className="iranyekanwebmedium" style={{ fontSize: 16, marginTop: 10, color: 'red' }}>ناموجود</span></div>

                                    }


                                </div>
                            }
                            <br />
                        </div>

                        <div style={{ position: 'absolute', bottom: 15, width: '100%', left: 0 }}>
                            <Link className="p-button-secondary btn-light" to={`${process.env.PUBLIC_URL}/products?id=${(car.product_detail && car.product_detail[0]) ? car.product_detail[0]._id : car._id}`} href="#" style={{ padding: 10, marginTop: 10, width: '85%', fontFamily: 'YekanBakhFaBold' }}>
                                مشاهده جزئیات / خرید

                    </Link>

                        </div>
                    </div>
                </div>

            );
        } else {
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
        {this.state.shop &&
        <div className="row justify-content-center firstInPage" style={{direction:'rtl',minHeight:600}}>
        {this.state.shop &&
            <div style={{position:'relative',marginBottom:30}}>
                <div>
                    {this.state.shop.SpecialPic ?
                        <img src={this.state.absoluteUrl+this.state.shop.SpecialPic.split("public")[1]} style={{marginTop:30,marginBottom:50,maxHeight:450,width:'100%'}} />
                    :
                        <img src={require('../public/bg-seller.png')} style={{marginTop:30,marginBottom:30,marginBottom:50,maxHeight:450,width:'100%'}} />

                    }
                    <div style={{position:'absolute',display:'flex',bottom:0,alignItems:'center',backgroundColor:'#fff',width:'100%',height:50,justifyContent:'space-between'}} >
                        {this.state.shop.logo &&
                            <img src={this.state.absoluteUrl+this.state.shop.logo.split("public")[1]} className="d-sm-block d-none" style={{position:'absolute',top:-85,width:160,height:160,right:20}} />
                        }
                        <div className="yekan" style={{width:30}}>
                            
                        </div>
                        
                        <div className="yekan" style={{fontSize:16,padding:5}}>
                            {this.state.shop.address}
                        </div>
                    </div>
                </div>
            </div>
        }
        <div className="col-lg-10 col-md-12">
            <div className="row">
            <div className="col-lg-3 col-12 mb-5" style={{backgroundColor:'#fff'}}>
                <div className="row" style={{padding:5,marginTop:20}}>
                    <div className="col-12" >
                       {
                           this.state.shop &&
                           <div>
                                <p  style={{fontSize:26,textAlign:'center',marginTop:30,color:'#fff',backgroundColor:'#00bfd6',minHeight:100,padding:24}} className="yekan">

                                فروشگاه آنلاین {this.state.shop.name}
                                </p>
                                <p dangerouslySetInnerHTML={{ __html: this.state.shop.about}} style={{display:'none'}}>

                                </p>
                                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-evenly',border:'1px solid #eee',borderRadius:5,padding:5}} >
                                    <InputSwitch checked={this.state.Exist} onChange={(e) => {
                                        this.setState({
                                            Exist: e.value
                                        });
                                        this.getProducts({ Exist: e.value });
                                    }
                                    } />
                                    <label className="yekan">
                                        فقط کالاهای موجود
                                    </label>
                                    </div>
                                    <div style={{marginTop:10,border:'1px solid #eee',borderRadius:5,padding:5,textAlign: 'right' }} >
                                    <p className="yekan">مرتب سازی بر اساس : </p>
                                    <SelectButton optionLabel="name" optionValue="value" style={{textAlign: 'right',display:'flex',flexDirection:'column',alignItems:'flex-start'}} value={this.state.Sort} options={this.state.SortOptions} onChange={(e) => {
                                        this.setState({ Sort: e.value });
                                        this.getProducts({ Exist: this.state.Exist, Sort: e.value })

                                    }}
                                    ></SelectButton>
                                    </div>
                                    

                            </div>

                       } 
                    </div>
                </div>
            </div>
            <div className="col-lg-9 col-12 bs-row">
            {this.state.GridData.length > 0 ?
            <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} rows={12} itemTemplate={this.itemTemplate}></DataView>
            :
                                <div>
                                        <p className="iranyekanwebmedium" style={{ textAlign: 'center', fontSize: 35, padding: 100, backgroundColor: '#fff' }}>کالایی جهت نمایش وجود ندارد. <i className="fal fa-frown" style={{ marginRight: 20, fontSize: 36 }}></i></p>
                                        

                                </div>
                            }

            </div>
            </div>
            
        </div>
        
        </div>
        }
        <Footer /> 
     </div>
     
    )
    }
}
const mapStateToProps = (state) => {
    return {
        CartNumber: state.CartNumber,
        off: state.off,
        credit: state.credit
    }
}
export default withRouter(
    connect(mapStateToProps)(Shop)
);
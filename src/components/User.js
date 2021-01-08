import React, { Component } from 'react';
import Server  from './Server.js'
import {Spinner} from 'primereact/spinner';
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import axios from 'axios'  
import { connect } from 'react-redux';
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Header1  from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'reactstrap';
import {Panel} from 'primereact/panel';
import {Column} from 'primereact/column';
import {Dialog} from 'primereact/dialog';
import {Sidebar} from 'primereact/sidebar';
import {PanelMenu} from 'primereact/panelmenu';
import {TabMenu} from 'primereact/tabmenu';
import {ProgressSpinner} from 'primereact/progressspinner';
import Footer  from './Footer.js' 
import Header2  from './Header2.js'
import {DataTable} from 'primereact/datatable';
import './User.css'   
import { Alert } from 'rsuite';
import {Link} from 'react-router-dom'


class User extends React.Component {
  
    constructor(props){
        super(props);
        this.Server = new Server();
        this.GetFactors = this.GetFactors.bind(this);
        this.selectedFactorChange = this.selectedFactorChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);

        this.onHide = this.onHide.bind(this);
        this.state={
            id:this.props.location.search.split("id=")[1],
            GridDataFactors : [],
            newStatus:null,
            selectedFactor:null,
            GridDataPayment:[],
            username:null,
            newPassword:null,
            newPassword2:null,
            oldPassword:null,
            name:null,
            address:null,
            logout:false,
            mail:null,
            company:null,
            sidebarOpen: true,
            visible:false,
            activeItem:0,
            loading:0,
            levelName:"",
            PanelVisible:'edit',
            MenuModel:[
              {label: 'ویرایش مشخصات', icon: 'pi pi-fw pi-pencil',className:'iranyekanweblight',type:'edit'},
              {label: 'سفارشات در حال پردازش', icon: 'pi pi-fw pi-home',className:'iranyekanweblight',type:'progress'},
              {label: 'سفارشات تحویل داده شده', icon: 'pi pi-fw pi-calendar',className:'iranyekanweblight',type:'done'},
              {label: 'سفارشات لغو شده', icon: 'pi pi-fw pi-file',className:'iranyekanweblight',type:'cancel'},
              {label: 'گزارش تراکنشها', icon: 'pi pi-fw pi-cog',className:'iranyekanweblight',type:'pay'}/*,
              {label: 'سایر', icon: 'pi pi-fw pi-cog',className:'iranyekanweblight',type:'SideBar'}*/
            ],
            url: this.Server.getUrl(),
            fromCart:window.location.hash.indexOf("fromCart=1") > -1 ?  "1" : "0"

        }
        //this.GetFactors(["1","2","3"]);
        
        axios.post(this.state.url+'checktoken', {
          token: localStorage.getItem("api_token")
      })
      .then(response => {
              
              
        })
        .catch(error => {
          this.setState({
            logout:true
          })
          //Alert.error('عملیات انجام نشد', 2500);
        })
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeoldPassword = this.handleChangeoldPassword.bind(this);
        this.handleChangenewPassword = this.handleChangenewPassword.bind(this);
        this.handleChangenewPassword2 = this.handleChangenewPassword2.bind(this);

        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangeMail = this.handleChangeMail.bind(this);
        this.handleChangeCompany = this.handleChangeCompany.bind(this);
        this.Edituser = this.Edituser.bind(this);
        this.changePass = this.changePass.bind(this);
        
       
    }
    componentDidMount(){
      let that = this;
      axios.post(this.state.url+'checktoken', {
        token: localStorage.getItem("api_token")
      })
      .then(response => {
        this.setState({
          id : response.data.authData.userId
        })
      

        axios.post(this.state.url+'getSettings', {
          token: localStorage.getItem("api_token")
        })
        .then(response => {
          this.getUser();
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
    onSetSidebarOpen(open) {
      this.setState({ sidebarOpen: open });
    }
    handleChangeUsername(event){
      this.setState({username: event.target.value});
    }
    handleChangeName(event){
      this.setState({name: event.target.value});
    }
    handleChangenewPassword(event){
      this.setState({newPassword: event.target.value});
    }
    handleChangenewPassword2(event){
      this.setState({newPassword2: event.target.value});
    }
    handleChangeoldPassword(event){
      this.setState({oldPassword: event.target.value});
    }
    handleChangeAddress(event){
      this.setState({address: event.target.value});
    }
    handleChangeCompany(event){
      this.setState({company: event.target.value});
    }
    handleChangeMail(event){
      this.setState({mail: event.target.value});
    }
    selectedFactorChange(value){
        let that = this;
        var p=[];
        this.setState({
          selectedId:value._id,
          newStatus:value.status,
          selectedFactor:value.products,
        })
        
    }
    handleChangeStatus(event){
        let that = this;
        this.setState({newStatus: event.target.value});
        let param={
          token: localStorage.getItem("api_token"),
          newStatus:event.target.value,
          selectedId:this.state.selectedId
        };
        let SCallBack = function(response){
            that.GetFactors();  
          
        };
        let ECallBack = function(error){
          Alert.error('عملیات انجام نشد', 2500);
        }
        this.Server.send("AdminApi/changeFactorStatus",param,SCallBack,ECallBack)
    
      }  
      onHide(event) {
        
        this.setState({selectedFactor: null});
      }
    GetFactors(Stat){
        let that = this;
        this.setState({
          loading:1
        })
        let param={
          token: localStorage.getItem("api_token"),
          user_id:this.state.id,
          Stat:Stat
        };
        let SCallBack = function(response){
          response.data.result.map(function(v,i){
            v.radif=i+1;  
            if(v.status=="-2")
              v.statusDesc="درخواست لغو توسط خریدار"
            if(v.status=="-1")
              v.statusDesc="لغو شده"
            if(v.status=="0")
              v.statusDesc="پرداخت نشده"
            if(v.status=="1")
              v.statusDesc="پرداخت شده"  
            if(v.status=="2")
              v.statusDesc="آماده ارسال"  
            if(v.status=="3")
              v.statusDesc="ارسال شده"
            if(v.status=="4")
              v.statusDesc="پایان"  
          })
          that.setState({
            GridDataFactors : response.data.result,
            loading:0
          })
          //Alert.success('عملیات با موفقیت انجام شد', 2500);
          //that.GetPayment();
        };
        let ECallBack = function(error){
          this.setState({
            loading:0
          })
          Alert.error('عملیات انجام نشد', 2500);
        }
        this.Server.send("MainApi/getFactors",param,SCallBack,ECallBack)
      }
      GetPayment(){
        let that = this;
        this.setState({
          loading:1
        })
        let param={
          token: localStorage.getItem("api_token"),
          user_id:this.state.id,
          OkPayment:1
        };
        let SCallBack = function(response){
          response.data.result.map(function(v,i){
            v.radif=i+1;
          })
          that.setState({
            GridDataPayment : response.data.result,
            loading:0
          })
          //Alert.success('عملیات با موفقیت انجام شد', 2500);
          //that.getUser();
          
        };
        let ECallBack = function(error){
          Alert.error('عملیات انجام نشد', 2500);
          this.setState({
            loading:0
          })
        }
        this.Server.send("MainApi/getPayment",param,SCallBack,ECallBack)
      }
      getUser(){
        let that = this;
        this.setState({
          loading:1
        })
        let param={
          token: localStorage.getItem("api_token"),
          user_id:this.state.id,
          level:"0"
        };
        let SCallBack = function(response){
          that.setState({
            username : response.data.result[0].username,
            name:response.data.result[0].name,
            address:response.data.result[0].address,
            mail:response.data.result[0].mail,
            company:response.data.result[0].company,
            loading:0,
            levelName:(response.data.result[0].offs && response.data.result[0].offs.length>0) ? response.data.result[0].offs[0].levelName : "تعیین نشده"
          })
          //Alert.success('عملیات با موفقیت انجام شد', 2500);
        };
        let ECallBack = function(error){
          Alert.error('عملیات انجام نشد', 2500);
          that.setState({
            loading:0
          })
        }
        this.Server.send("MainApi/getuserInformation",param,SCallBack,ECallBack)
      }
      Edituser(){
        let that = this;
        that.setState({
          loading:1
        })
        let param={
          token: localStorage.getItem("api_token"),
          username:this.state.username,
          nopass:1,
          name:this.state.name,
          address:this.state.address,
          company:this.state.company,
          mail:this.state.mail,
          MyAccount:"1",
          level:"0"
        };
        let SCallBack = function(response){
          that.setState({
            loading:0
          })
          Alert.success('عملیات با موفقیت انجام شد', 2500);
        };
        let ECallBack = function(error){
          that.setState({
            loading:0
          })
          Alert.error('عملیات انجام نشد', 2500);
          console.log(error)
        }
        this.Server.send("AdminApi/ManageUsers",param,SCallBack,ECallBack)
      }
      changePass(){
        let that = this;
        if(this.state.newPassword != this.state.newPassword2){
          Alert.warning('رمز عبور جدید و تکرار آن متفاوتند',2500);
          return
        }
        if(this.state.newPassword=="" || this.state.newPassword2=="" || this.state.oldPassword==""){
          Alert.warning('همه فیلدها را تکمیل کنید',2500);
          return
        }
        that.setState({
          loading:1
        })
        let param={
          token: localStorage.getItem("api_token"),
          username:this.state.username,
          nopass:0,
          oldPassword:this.state.oldPassword,
          newPassword:this.state.newPassword,
          MyAccount:"1",
          level:"0"
        };
        let SCallBack = function(response){
          that.setState({
            loading:0
          })
          if(response.data.err){
            Alert.error(response.data.err,2500);

            return
          }
          Alert.success('عملیات با موفقیت انجام شد', 2500);
        };
        let ECallBack = function(error){
          that.setState({
            loading:0
          })
          Alert.error('عملیات انجام نشد', 2500);
          console.log(error)
        }
        this.Server.send("AdminApi/ManageUsers",param,SCallBack,ECallBack)
      }
      
    render(){
    if (this.state.logout) {
        return <Redirect to={"/login"} push={true}/>;
    }
    if (this.state.GoToCart) {
      return <Redirect to={"/Cart?AcceptAddress=1"} push={true}/>;
    }
    
    return (
      <div style={{direction:'rtl'}}>
    
    <Header1 /> 
    <Header2 /> 
    <div className="row justify-content-center firstInPage" style={{minHeight:600}}>
        
        <div className="col-lg-10 iranyekanweblight" style={{dir:'rtl',marginTop:20}} >
        <TabMenu model={this.state.MenuModel} activeItem={this.state.activeItem} onTabChange={(e) => {
          if(e.value.type=="SideBar"){
            this.setState({
              visible:true
            })
          }
          if(e.value.type=="progress"){
            this.GetFactors(["1","2","3"]);
          }
          if(e.value.type=="done"){
            this.GetFactors(["4"]);
          }
          if(e.value.type=="cancel"){
            this.GetFactors(["0"]);
          }
          if(e.value.type=="pay"){
            this.GetPayment();
          }
          if(e.value.type=="edit"){
            this.getUser();
          }
          if(e.value.type !="SideBar")
            this.setState({activeItem: e.value,PanelVisible:e.value.type})

          
        }}/>

        {this.state.loading==1 &&
          <div style={{position:'absolute',top:'50%',left:'50%',zIndex:1}}>
            <ProgressSpinner style={{width:40,height:40}}/>

          </div>
        }

     <Sidebar visible={this.state.visible} position="right" onHide={() => this.setState({visible:false})}>

        </Sidebar>
       
     {this.state.PanelVisible=="edit" &&
     <Panel header=" اطلاعات شخصی " style={{marginTop:5,textAlign:'right',fontFamily: 'iranyekanweblight'}}>
         <form  >
      <div className="row">
      <div className="col-lg-6">
      <div >
      <label className="labelNoGroup iranyekanweblight">نام کاربری</label>

        <input className="form-control iranyekanweblight" disabled autoComplete="off"  type="text" value={this.state.username} name="username" style={{textAlign:'right'}} onChange={this.handleChangeUsername} />
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.name} name="name" onChange={this.handleChangeName}  style={{textAlign:'right'}} required="true"/>
        <label>نام و نام خانوادگی</label>
      </div>
      </div>
      
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.mail} name="mail" onChange={this.handleChangeMail}  style={{textAlign:'right'}} required="true"/>
        <label>پست الکترونیکی</label>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.company} name="company" onChange={this.handleChangeCompany}  style={{textAlign:'right'}} required="true"/>
        <label>نام شرکت</label>
      </div>
      </div>
      <div className="col-lg-12">
      <div className="group">
        <textarea className="form-control iranyekanweblight" autoComplete="off"  type="text" value={this.state.address} name="address" onChange={this.handleChangeAddress}  style={{textAlign:'right'}} required="true"/>
        <label>آدرس کامل پستی</label>
      </div>
      </div>
      <div className="col-lg-12">
      <div style={{marginRight:10}}>
        <Link  to={`${process.env.PUBLIC_URL}/Map?fromCart=`+this.state.fromCart}  >ثبت آدرس با استفاده از نقشه</Link>
      </div>
      </div>

      <div className="col-lg-12">
      <Button style={{marginLeft:5,marginTop:10}} color="primary"  onClick={this.Edituser}>ویرایش اطلاعات</Button>
      {this.state.fromCart=="1" &&
      <Button style={{marginLeft:5,marginTop:10}} color="primary"  onClick={()=>this.setState({GoToCart:true})}>ادامه فرآیند خرید</Button>
      }
      </div>

      <div className="col-12">
        <hr />
      </div>
      <div className="col-12">
        <h2 className="iranyekanweblight">تغییر رمز عبور</h2>
      </div>
      <div className="col-lg-7">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="password" value={this.state.oldPassword} name="oldPassword" onChange={this.handleChangeoldPassword} style={{textAlign:'right'}}  required="true"/>
        <label>رمز عبور فعلی</label>
      </div>
      </div>
      <div className="col-lg-7">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="password" value={this.state.newPassword} name="newPassword" onChange={this.handleChangenewPassword} style={{textAlign:'right'}} required="true"/>
        <label>رمز عبور جدید</label>
      </div>
      </div>
      <div className="col-lg-7">
      <div className="group">
        <input className="form-control iranyekanweblight" autoComplete="off"  type="password" value={this.state.newPassword2} name="newPassword2" onChange={this.handleChangenewPassword2} style={{textAlign:'right'}}  required="true"/>
        <label>تکرار رمز عبور جدید</label>
      </div>
      </div>
      <div className="col-lg-12">
      <Button style={{marginLeft:5,marginTop:10}} color="primary"   onClick={this.changePass}>تغییر رمز</Button>
      
      </div>
      
      
      </div>
    </form>
    </Panel>
    }
    {(this.state.PanelVisible=="cancel" || this.state.PanelVisible=="progress" || this.state.PanelVisible=="done") &&
    <Panel header="   لیست سفارشات - برای مشاهده جزئیات سفارش روی سطر مربوط به آن کلیک کنید" style={{marginTop:50,textAlign:'right',fontFamily: 'iranyekanweblight'}}>

    <DataTable resizableColumns={true} paginator={true} rows={10} value={this.state.GridDataFactors} selectionMode="single" selection={this.state.selectedFactor} onSelectionChange={e => this.selectedFactorChange(e.value)}  >
                        <Column field="radif"  header="ردیف" className="iranyekanweblight" style={{textAlign:"center"}} />
                        <Column field="Amount" header="قیمت (تومان)" className="iranyekanweblight" style={{textAlign:"center"}} />
                        <Column field="refId" header="رسید تراکنش"  className="iranyekanweblight" style={{textAlign:"center"}}/>
                        <Column field="statusDesc" header="وضعیت"   className="iranyekanweblight" style={{textAlign:"center"}}/>

              </DataTable>

              
        
    </Panel>
    }
    {this.state.PanelVisible=="pay" &&
    <Panel header="صورتحساب های ثبت شده" style={{marginTop:50,textAlign:'right',fontFamily: 'iranyekanweblight'}}>
              <DataTable resizableColumns={true} paginator={true} rows={10}  value={this.state.GridDataPayment}  >
                        <Column field="radif"  header="ردیف" className="iranyekanweblight" style={{textAlign:"center",width:100}} />
                        <Column field="refId" header="رسید تراکنش" className="iranyekanweblight" style={{textAlign:"center"}} />
                        <Column field="Date" header="زمان پرداخت"  className="iranyekanweblight" style={{textAlign:"center"}}/>
                        <Column field="desc" header="شرح"   className="iranyekanweblight" style={{textAlign:"center"}}/>
                        <Column field="amount" header="مبلغ(تومان)"   className="iranyekanweblight" style={{textAlign:"center"}}/>



              </DataTable>
    </Panel>
    }
    <Dialog header="جزئیات"  visible={this.state.selectedFactor} style={{width: '60vw'}}  minY={70} onHide={this.onHide} maximizable={true}>
    <div style={{overflowY:'auto',overflowX:'hidden',maxHeight:400}}>
      {(this.state.newStatus == "1" || this.state.newStatus == "-2") &&
      <div style={{display:'none'}}><p className="iranyekanweblight" style={{float:"right"}}>تغییر وضعیت</p>
      <select className="custom-select iranyekanweblight"  value={this.state.newStatus} name="status" onChange={this.handleChangeStatus} >
        <option value="1">پرداخت شده</option>
        <option value="-2">لغو سفارش</option>
      </select>
      </div>
      }
      <br/><br/>
     
      <DataTable resizableColumns={true} paginator={true} rows={10} value={this.state.selectedFactor}  >
                        <Column field="_id"  header="شناسه" className="iranyekanweblight" style={{textAlign:"center"}} />
                        <Column field="title" header="عنوان" className="iranyekanweblight" style={{textAlign:"center"}} />
                        <Column field="subTitle" header="عنوان دوم"  className="iranyekanweblight" style={{textAlign:"center"}}/>
                        <Column field="desc" header="شرح" className="iranyekanweblight" style={{textAlign:"center",whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}} />
                        <Column field="number" header="تعداد" className="iranyekanweblight" style={{textAlign:"center"}} />

              </DataTable>
     </div>
     </Dialog> 
        </div>
        
    </div>  
    <Footer /> 
     </div>
    )
    }
}

export default withRouter(User);

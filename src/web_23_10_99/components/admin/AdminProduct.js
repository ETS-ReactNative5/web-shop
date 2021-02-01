import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import Dashboard  from './Dashboard.js'
import  './Dashboard.css'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactTable from "react-table";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server  from './../Server.js'
import {DataView, DataViewLayoutOptions} from 'primereact/dataview';
import { connect } from 'react-redux';
import 'react-persian-calendar-date-picker/lib/DatePicker.css';
import moment from 'moment-jalaali';
import { Alert } from 'rsuite';
import {Messages} from 'primereact/messages';
import {Message} from 'primereact/message';
import DatePicker from 'react-datepicker2';
import {ProgressSpinner} from 'primereact/progressspinner';
import { Loader } from 'rsuite';
import {Checkbox} from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import {AutoComplete} from 'primereact/autocomplete';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { Multiselect } from 'multiselect-react-dropdown';

class AdminProduct extends React.Component {
  constructor(props){
    super(props);
    this.Server = new Server();
    this.state = {
      username:null,
      layout: 'list',
      title : '',
      title2 : '',
      desc : '',
      price : '',
      off : '',
      status : '',
      number:'',
      file : '',
      file1 : '',
      file2 : '',
      file3 : '',
      file4 : '',
      fileUploaded : '',
      fileUploaded1 : '',
      fileUploaded2 : '',
      fileUploaded3 : '',
      fileUploaded4 : '',
      UploadBoxToggle:true,
      formul:'',
      formul_level:'',
      formul_off:'',
      formul_opr:'',
      formul_price:'',
      pic1 : '',
      pic2 : '',
      pic3 : '',
      pic4 : '',
      pic5 : '',
      id_edit : '',
      title_edit : '',
      title2_edit : '',
      desc_edit : '',
      price_edit : '',
      off_edit : '',
      status_edit : '',
      GridData:[],
      ParentCat:null,
      GridData2:{
        id: 1,
        model: "Passat",
        year: 2001,
        brand: "VW",
        color: {id: 1, name: "Red", code: "#FF0000"}
      },
      modal: false,
      picModal:false,
      picFile:'',
      currentId:'',
      currentImage:'',
      number_edit:'',
      CatsChoosen:'',
      setCategory : 'ایجاد',
      CategoryList:[],
      CategoryOrder:'',
      CategoryId:"",
      CategoryInProduct:"",
      CategoryInProduct_edit:"",
      visibleModalEditProduct: false,
      visibleModalPic: false,
      visibleModalOff:false,
      SetHaraj:0,
      HarajDate:'',
      SetHaraj_edit:0,
      HarajDate_edit:'',
      PrepareTime_edit:'',
      PrepareTime:'',
      selectedDay:null,
      selectedDay_edit:null,
      HarajDate1:moment(),
      SellerId:null,
      ShopId_product:null,
      ShopId_product_edit:null,
      loading:0,
      showInSite:false,
      ShowPriceAftLogin:1,
      NoOff:0,
      TypeOfSend:"1",
      Immediate:false,
      ShowPriceAftLogin_edit:false,
      NoOff_edit:false,
      TypeOfSend_edit:"1",
      Immediate_edit:false,
      HarajType:"1",
      ShopInfo:[],
      level:null,
      levelOfUserArrayName:[],
      levelOfUserArray:[],
      sortKey: null,
      sortOrder: null,
      sortField: null,
      HarajType_edit:"1",
      TableLayoutModal:0,
      SeveralShop:false,
      CatSpecs:[],
      CatSpecs_Edit:[],
      selectedColors: null,
      filteredColors: null,
      selectedSize: null,
      filteredSize: null,
      SelectedSize_edit:null,
      SelectedColors_edit:null,
      grid: [
        [{value:  5, expr: '1 + 4'}, {value:  6, expr: '6'}, {value: "qqqqqqqqqq"}],
        [{value:  5, expr: '1 + 4'}, {value:  5, expr: '1 + 4'}, {value: "qqqqqqqqqqqq"}]

      ],
      absoluteUrl:this.Server.getAbsoluteUrl(),
      url:this.Server.getUrl(1)
      
    }
    this.ColorsRef = React.createRef();
    this.ColorsRef_edit = React.createRef();
    this.SizeRef = React.createRef();
    this.SizeRef_edit = React.createRef();
    
    let RangeView = ({ cell, getValue }) => (
      <input
        type="range"
        value={getValue({ data: cell })}
        disabled
        style={{ pointerEvents: "none" }}
      />
    );
     
    let RangeEdit = ({ getValue, cell, onChange }) => (
      <input
        type="range"
        onChange={e => {
          alert(1)
        }}
        value={getValue({ data: cell }) || 0}
        autoFocus
      />
    );
    this.data = [
      [{ value: "Flavors" }],
      [({ value: "Vanilla" }, { value: "Chocolate" })],
      [{ value: "Strawberry" }, { value: "Cookies" }],
      [
        { value: "How much do you like ice cream?" },
        { value: 100, DataViewer: RangeView, DataEditor: RangeEdit }
      ]
    ];
    this.sortOptions = [
      {label: 'کمترین موجودی', value: 'number'},
      {label: 'بیشترین موجودی', value: '!number'},
      {label: 'آخرین تاریخ ویرایش', value: '!TodayDate'},
      {label: 'دسته بندی', value: '!CatId'},
      {label: 'بیشترین تخفیف', value: '!off'},
      {label: 'بیشترین قیمت', value: '!price'},
      {label: 'کمترین قیمت', value: 'price'},



    ];
    this.itemTemplate = this.itemTemplate.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeTitle2 = this.handleChangeTitle2.bind(this);
    this.handleChangeDesc = this.handleChangeDesc.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeOff = this.handleChangeOff.bind(this);
    this.handleChangePrepareTime = this.handleChangePrepareTime.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleCategoryInProduct = this.handleCategoryInProduct.bind(this);
    this.handleChangeTitle_edit = this.handleChangeTitle_edit.bind(this);
    this.handleChangeTitle2_edit = this.handleChangeTitle2_edit.bind(this);
    this.handleChangeDesc_edit = this.handleChangeDesc_edit.bind(this);
    this.handleChangePrice_edit = this.handleChangePrice_edit.bind(this);
    this.handleChangeOff_edit = this.handleChangeOff_edit.bind(this);
    this.handleChangePrepareTime_edit = this.handleChangePrepareTime_edit.bind(this);
    this.handleChangeStatus_edit = this.handleChangeStatus_edit.bind(this);
    this.handleCategoryInProduct_edit = this.handleCategoryInProduct_edit.bind(this);
    this.handleChangeNumber_edit = this.handleChangeNumber_edit.bind(this);
    this.handleChangeHarajDate_edit = this.handleChangeHarajDate_edit.bind(this);
    this.handleChangeChooseCategory = this.handleChangeChooseCategory.bind(this);
    this.handleChangeChooseCategoryForEdit = this.handleChangeChooseCategoryForEdit.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeCategoryOrder = this.handleChangeCategoryOrder.bind(this);
    this.SetOff = this.SetOff.bind(this);

    
    this.DeleteCategory = this.DeleteCategory.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.FileUpload = this.FileUpload.bind(this);
    this.picToggle = this.picToggle.bind(this);
    this.offToggle = this.offToggle.bind(this);

    
    this.Changepic = this.Changepic.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.setProduct = this.setProduct.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.setSelectedDay = this.setSelectedDay.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.TableLayout = this.TableLayout.bind(this);
    this.Colors= [{name: 'نقره‌ای', id: 1},{name: 'زرد', id: 2},{name: 'مشکی', id: 3},{name: 'سفید', id: 4},{name: 'بنفش', id: 5},{name: 'صورتی', id: 6},{name: 'قرمز', id: 7},{name: 'سرمه ای', id: 8},{name: 'سبز', id: 10},{name: 'خاکستری', id: 11},{name: 'زرشکی', id: 12},{name: 'طلایی', id: 14},{name: 'استیل', id: 15},{name: 'تیتانیومی', id: 16}]//['سبز', 'آبی', 'قرمز', 'مشکی', 'سفید','صورتی','طوسی','بنفش','آبی فیروزه ای','خاکستری','','سرمه‌ای','','',''];
    this.Size= [{name: 'S', id: 1},{name: 'M', id: 2},{name: 'L', id: 3},{name: 'XL', id: 4},{name: 'XXL', id: 5},{name: 'XXXL', id: 6}];

  }
  CatTOptionTemplate(option) {
    return (
        <div className="country-item">
            <div>{option.name}</div>
        </div>
    );
  }    
  selectedCatTemplate(option, props) {
    if (option) {
        return (
            <div className="country-item country-item-value">
                <div>{option.name}</div>
            </div>
        );
    }

    return (
        <span>
            {props.placeholder}
        </span>
    );
}
  getMainShopInfo(){
    let that = this;
		let param={
			main:true
		};
		that.setState({
			loading:1
		})
		let SCallBack = function(response){
			that.setState({
        ShopInfo : response.data.result,
        MainShopId:response.data.result[0]._id
      })
      that.setState({
        loading:0
      })
      that.GetShopList();



		};
		let ECallBack = function(error){
			that.setState({
			loading:0
			})
      that.GetProduct();

		}
		this.Server.send("AdminApi/ShopInformation",param,SCallBack,ECallBack)
  }
  componentDidMount(){
    let param={
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading:1
    })
    let that = this;
    let SCallBack = function(response){
      that.setState({
        loading:0,
        SellerId : response.data.authData.shopId
      })
      that.setState({
        loading:0
      })
      that.GetCategory();
      that.setState({
        loading:0
      })


    };
    let ECallBack = function(error){
       that.setState({
         loading:0
       })
       //Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("MainApi/checktoken",param,SCallBack,ECallBack)
  }
  onClick(event) {
    this.setState({visible: true});
  }
  roundPrice(price){
    price=parseInt(price).toString();
    let C="500";
    let S=3;
    if(price.length <= 4){
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
  onHide(event) {
      this.setState({visibleModalPic: false , visibleModalEditProduct :false,visibleModalOff:false,TableLayoutModal:false});
      this.GetCategory();
      this.GetProduct();

  }
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleChangeTitle(event){
    this.setState({title: event.target.value});
  }
  handleChangeTitle2(event){
    this.setState({title2: event.target.value});
  }
  handleChangeDesc(event){
    this.setState({desc: event.target.value});
  }
  handleChangePrice(event){
    this.setState({price: event.target.value.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
  }
  handleChangeChooseCategory(event){
    this.setState({CatsChoosen: event.target.value});
  }
  handleChangeChooseCategoryForEdit(event){
    this.setState({CatsChoosen_edit: event.target.value});
    if(event.target.value !="0"){
      document.getElementById("DeleteCategory").style.display="inline";
      this.setState(
        {
          CategoryOrder:this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].order||'',
          showInSite:this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].showInSite||false,
          setCategory: "ویرایش",
          Category:event.nativeEvent.target[event.nativeEvent.target.selectedIndex].text,
          CategoryId:event.target.value,
          ParentCat:this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].Parent||'',
          CatPicPreview:this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].pic ? this.state.absoluteUrl+this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].pic.split("public")[1] : this.state.absoluteUrl+'/nophoto.png'/*,
          CatSpecs:this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].Spec ? this.state.CategoryList[event.nativeEvent.target.selectedIndex-1].Spec : []*/

        }
      );
    }else{
      document.getElementById("DeleteCategory").style.display="none";
      this.setState({setCategory: "ایجاد",
      Category:"",
      CategoryId:"",
      showInSite:false,
      ParentCat:''
      });
    }
  }
  handleChangeCategory(event){
    this.setState({Category: event.target.value});
  }
  handleChangeCategoryOrder(event){
    this.setState({CategoryOrder: event.target.value});

  }
  handleChangeOff(event){
    this.setState({off: event.target.value});
  }
  handleChangePrepareTime(event){
    this.setState({PrepareTime: event.target.value});
  }
  handleChangeNumber(event){
    this.setState({number: event.target.value});
  }
  handleChangeStatus(event){
    this.setState({status: event.target.value});
  }
  handleChangeTitle_edit(event){
    this.setState({title_edit: event.target.value});
  }
  handleChangeTitle2_edit(event){
    this.setState({title2_edit: event.target.value});
  }
  handleChangeDesc_edit(event){
    this.setState({desc_edit: event.target.value});
  }
  handleChangePrice_edit(event){
    this.setState({price_edit: event.target.value.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")});
  }
  handleChangeOff_edit(event){
    this.setState({off_edit: event.target.value});
  }
  handleChangePrepareTime_edit(event){
    this.setState({PrepareTime_edit: event.target.value});

  }
  handleChangeNumber_edit(event){
    this.setState({number_edit: event.target.value});
  }
  handleChangeHarajDate_edit(event){
    this.setState({HarajDate_edit: event.target.value});
  }
  handleChangeStatus_edit(event){
    this.setState({status_edit: event.target.value});
  }
  handleCategoryInProduct_edit(event){
    this.setState({CategoryInProduct_edit: event.value});
    let CatSelected="";

    for(const property of this.state.CategoryList){
      if(property["_id"]==event.value.value)
          CatSelected=property
    } 
    let Spec = CatSelected && CatSelected.Spec;
    this.setState({
      CatSpecs_Edit:[]
    })
    if(Spec && Spec.length > 0){
      this.GetSpecifications(Spec,1);
    }

  }
  handleCategoryInProduct(event){
    this.setState({CategoryInProduct: event.value});
    let CatSelected="";

    for(const property of this.state.CategoryList){
      if(property["_id"]==event.value.value)
          CatSelected=property
    } 
    let Spec = CatSelected && CatSelected.Spec;
    this.setState({
      CatSpecs:[]
    })
    if(Spec && Spec.length > 0){
      this.GetSpecifications(Spec);
    }


  }
  GetSpecifications(Spec,edit){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      Spec:Spec
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      var CatSpecs=[];
      response.data.result.map(function(v,i){
        CatSpecs[i]={id:v._id,title:v.title,boolean:v.boolean};
      })
      if(!edit){
        that.setState({
          CatSpecs:CatSpecs
        })
      }else{
        that.setState({
          CatSpecs_Edit:CatSpecs
        })
        
      }
      
      that.setState({
        loading:0
      })
    };
    let ECallBack = function(error){
      console.log(error)
      that.setState({
        loading:0,
        CatSpecs:[]
      })
    }
    this.Server.send("AdminApi/GetSpecifications",param,SCallBack,ECallBack)
  }
  getSettings(){
    let that = this;
    that.setState({
      loading:1
    })
      that.Server.send("AdminApi/getSettings",{},function(response){
        that.setState({
          loading:0
        })
        if(response.data.result){
          that.setState({
            ShowPriceAftLogin:!response.data.result[0].AccessAfterReg,
            SeveralShop : response.data.result[0].SeveralShop
          })
        }
        that.getMainShopInfo()

        

        
      },function(error){
        that.setState({
          loading:0
        })
        that.GetProduct();

        console.log(error)
      })

    
  }
  itemTemplateMulti(item) {
    return (
        <div className="country-item">
            <div>{item}</div>
        </div>
    );
 }
  itemTemplate(car, layout) {
    if(!car)
        return (
          <div className="p-col-12 p-md-3">
              <div></div>
          </div>
      );
    
    if (layout === 'list') {
       let pic = car.fileUploaded.split("public")[1] ? this.state.absoluteUrl+car.fileUploaded.split("public")[1] : this.state.absoluteUrl+'/nophoto.png';
        return (
            <div className="row">
                <div className="col-lg-12" >
                <div className="row" style={{margin:20}}>
                    <div className="col-lg-3 yekan" style={{textAlign:"right"}}>
                      <img  src={pic} style={{width : "150px" , height:"100px"}} name="pic3"   alt="Picture" /> 
                      <hr />
                      <div style={{display:'none'}}>
                        <p className="yekan">آخرین به روز رسانی</p>
                        <span className="yekan">{car.TodayDate} <span>{car.TodayTime}</span> </span>
                      </div>
                      
                    </div>
                    <div className="col-lg-7 yekan" style={{textAlign:"right"}}>
                    <p className="yekan">{car.title}</p>
                    <p className="yekan" >{car.subTitle}</p>
                    <p className="yekan" style={{display:'none'}}>{car.HarajDate}</p>
                    <p className="yekan" >{car.desc}</p>
                    <p className="yekan" style={{display:'none'}}>{car.number}</p>
                    <p className="yekan" style={{display:'none'}}>{car.off} %</p>
                    <p className="yekan" style={{display:'none'}}>{this.roundPrice(car.price)} تومان</p>

                    
                    </div>
                    <div className="col-lg-2 yekan" style={{textAlign:"right"}}>
                    <button  className="btn btn-primary yekan" onClick={() => {this.setState({visibleModalEditProduct: true});this.PreparEditProduct(car);}}  style={{width:"100px",marginTop : "5px" , marginBottom : "5px"}}>ویرایش</button>
                    {(!this.state.SeveralShop || (this.state.SellerId ==this.state.MainShopId)) &&
                    <div>
                      <button  className="btn btn-primary yekan" onClick={() => {this.picToggle(car)}}  style={{width:"100px",marginTop : "5px" , marginBottom : "5px"}}>تصاویر</button>
                    {!this.state.SeveralShop &&
                      <button  className="btn btn-primary yekan" onClick={() => {this.offToggle(car)}}  style={{width:"100px",marginTop : "5px" , marginBottom : "5px"}}>محاسبه قیمت / تخفیف</button>
                     }
                     <button  className="btn btn-primary yekan" onClick={() =>this.productTableAction("delete",car._id)}  style={{width:"100px",marginTop : "5px" , marginBottom : "5px"}}  >حذف</button>
                    </div>
                      
                    }
                 
                    </div>
                   
                </div>
                <hr />
                </div>

            </div>
        );
    }
    if (layout === 'grid') {
        return (
            <div className="p-col-12 p-md-3">
                <div>{car.brand}</div>
            </div>
        );
    }
}
PreparEditProduct(row){
  if(row.HarajDate)
    this.setState({
      harajCheckBoxEdit:true

    })
  else  
    this.setState({
      harajCheckBoxEdit:false
    })
  let CatSelectedName= "";   
  for(const property of this.state.CategoryListForDropDown){
    if(property["value"]==row.category_id)
      CatSelectedName=property["name"]
  }  
  this.setState({
    id_edit:(this.state.SellerId !=this.state.MainShopId) ? row.product_id : row._id,
    title_edit: row.title,
    title2_edit: row.subTitle,
    desc_edit: row.desc,
    price_edit: !this.state.SeveralShop ? row.price.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",")  : "",
    off_edit: !this.state.SeveralShop ? row.off : "",
    status_edit: !this.state.SeveralShop ? row.status : "",
    CategoryInProduct_edit:{name:CatSelectedName,value:row.category_id},
    number_edit: !this.state.SeveralShop ? row.number : "",
    ShowPriceAftLogin_edit:!this.state.SeveralShop ? row.ShowPriceAftLogin : "",
    NoOff_edit:!this.state.SeveralShop ? row.NoOff : "",
    TypeOfSend_edit:!this.state.SeveralShop ? row.TypeOfSend : "",
    Immediate_edit:!this.state.SeveralShop ? row.Immediate : "",
    HarajDate_edit: (!this.state.SeveralShop && row.HarajDate) ? row.HarajDate : "",
    HarajType_edit:!this.state.SeveralShop ? (row.HarajType ? row.HarajType : "1") : "",
    SetHaraj_edit:!this.state.SeveralShop ? (row.HarajDate ? 1 : 0) : "",
    PrepareTime_edit:!this.state.SeveralShop ? (row.PrepareTime ? row.PrepareTime : '') : "",
    ShopId_product_edit:"",
    CatSpecs_Edit:row.Spec,
    SelectedColors_edit:null,
    SelectedSize_edit:null
  })
  if(row.Spec){
    for(let i=0;i<row.Spec.length;i++){
      this.setState({["Spec_edit_"+row.Spec[i].id]: row.Spec[i].value})
  
    }
  }
  
  if(this.state.SellerId !=this.state.MainShopId ){
    this.GetProductPerShop(this.state.SellerId,row.product_id)
  }
  
}
  DeleteCategory(event){
    let that = this;
    let param={
      Category : "",
      id : this.state.CategoryId,
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      
      this.GetCategory();
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading:0
      })

    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send("AdminApi/setCategory",param,SCallBack,ECallBack)
 
    event.preventDefault();
  }

  picToggle(row) {
    this.setState({
      currentId:null,
      picModal: !this.state.picModal
    });
    if(row){
      this.setState({
        currentId:row._id,
        pic1: row.fileUploaded ? this.state.absoluteUrl + row.fileUploaded.split("public")[1] : this.state.absoluteUrl+'nophoto.png' ,
        pic2: row.fileUploaded1 ? this.state.absoluteUrl + row.fileUploaded1.split("public")[1] : this.state.absoluteUrl+'nophoto.png',
        pic3: row.fileUploaded2 ? this.state.absoluteUrl + row.fileUploaded2.split("public")[1] : this.state.absoluteUrl+'nophoto.png',
        pic4: row.fileUploaded3 ? this.state.absoluteUrl + row.fileUploaded3.split("public")[1] : this.state.absoluteUrl+'nophoto.png',
        pic5: row.fileUploaded4 ? this.state.absoluteUrl + row.fileUploaded4.split("public")[1] : this.state.absoluteUrl+'nophoto.png'
      })
    }

    this.setState({visibleModalPic: true});
  }
  SetOff(){
    let that = this;
    if(this.state.formul_price != "" &&(this.state.formul_level != "" || this.state.formul_off != "" || this.state.formul_opr != ""))
    {
      Alert.warning('قیمت و آیتم های دیگر نمیتوانند همزمان پر باشند', 5000);
      return;
    }
    this.setState({
      loading:1
    })
    
    
    let param={
      token: localStorage.getItem("api_token"),
      product_id : this.state.currentId,
      level:this.state.level,
      formul:this.state.formul_price ? this.state.formul_price : '{"level":"'+this.state.formul_level+'","off":"'+this.state.formul_off+'","opr":"'+this.state.formul_opr+'"}'
    };
    let SCallBack = function(response){
      that.setState({
        loading:0
      })
      
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetOffForLevel",param,SCallBack,ECallBack)
  }
  GetOffs(product_id,level){
    let that = this;
    this.setState({
      formul:"",
      level:""
    })
    let formul_price='',
        formul_level='',
        formul_off='',
        formul_opr='';
    if(typeof level != "undefined" ){
      this.setState({
        formul_level:formul_level,
        formul_off:formul_off,
        formul_opr:formul_opr,
        formul_price:formul_price
      })
      for(var i=0;i<this.state.offsPerLeverl.length;i++){
        if(level==this.state.offsPerLeverl[i].level){
          
          if(!isNaN(this.state.offsPerLeverl[i].formul))
            formul_price=this.state.offsPerLeverl[i].formul;
          else{
            let json =JSON.parse(this.state.offsPerLeverl[i].formul);
            formul_level=json.level;
            formul_off=json.off;
            formul_opr=json.opr;
          }  
          this.setState({
            formul_level:formul_level,
            formul_off:formul_off,
            formul_opr:formul_opr,
            formul_price:formul_price,
            level:level
          })
          
        }
          
      }
      this.setState({
        level:level
      })
      return;
    }
    this.setState({
      loading:1
    })
    let param={};
    
      param={
        product_id : product_id
      };
      var SCallBack = function(response){
        that.setState({
          loading:0
        })
        let levelOfUserArray=[],
            levelOfUserArrayName=[],
            Offs=[],
            PriceOfLevels=[],
            formuls=[];
        for(let i=0;i<response.data.offs.length;i++){
          levelOfUserArray[i]=response.data.offs[i].level;
          levelOfUserArrayName[i]=response.data.offs[i].levelName;
        }
        that.setState({
          levelOfUserArray: levelOfUserArray,
          levelOfUserArrayName: levelOfUserArrayName,
          offsPerLeverl:response.data.result[0].offs,
          formul_level:formul_level,
          formul_off:formul_off,
          formul_opr:formul_opr,
          formul_price:formul_price,
          levelOfUser:'-1'
        })
        that.GetOffs(that.state.currentId,'-1');
       
     
      };
      var ECallBack = function(error){
        Alert.error('عملیات انجام نشد', 5000);
        that.setState({
          loading:0
        })
      }
      this.Server.send("AdminApi/GetOffs",param,SCallBack,ECallBack)

    
  }
  offToggle(row){
    this.setState({
      currentId:null,
      offModal: !this.state.offModal
    });
    if(row){
      this.setState({
        currentId:row._id
      })
    }
    this.GetOffs(row._id);
    this.setState({visibleModalOff: true});
  }
  Changepic(e){
    this.setState({
      currentImage : e.target.name
    })
    document.getElementById("picFile").click(e);
  }
  FileUpload(e){
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    formData.append('myImage',e.target.files[0]);
    if(this.state.currentId){
      formData.append('id',this.state.currentId);
      formData.append('pic',this.state.currentImage);
    }
    if(this.state.ShopInfo[0] && this.state.ShopInfo[0].logoCopyRight)
      formData.append('AddLogo',this.state.absoluteUrl+this.state.ShopInfo[0].logoCopyRight.split("public")[1]);
    if(name=="CatPic"){
      formData.append('CatId',this.state.CategoryId);

    }
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress:(progressEvent)=>{
          const {loaded,total} = progressEvent;
          let percent = parseInt((loaded *100) / total)
          this.setState({
            showLoadedCount:1,
            loadedCount : `${loaded} byte of ${total}byte | ${percent}%`
          })
          if(percent == "100"){
            debugger;
            this.setState({
              showLoadedCount:0
            })
          }

        }
      };
    axios.post(this.state.url+'uploadFile', formData , config)
      .then( (response) => {
        
        if(name=="picFile"){
          let p  =this.state.currentImage;
          if(p=="pic1")
            this.setState({
              pic1: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if(p=="pic2")
            this.setState({
              pic2: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if(p=="pic3")
            this.setState({
              pic3: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if(p=="pic4")
            this.setState({
              pic4: this.state.absoluteUrl + response.data.split("public")[1]
            })
          if(p=="pic5")
            this.setState({
              pic5: this.state.absoluteUrl + response.data.split("public")[1]
            })  
        }
        if(name=="file")
          this.setState({
            fileUploaded : response.data
          })
        if(name=="file1")
          this.setState({
            fileUploaded1 : response.data
          })
        if(name=="file2")
          this.setState({
            fileUploaded2 : response.data
          })
        if(name=="file3")
          this.setState({
            fileUploaded3 : response.data
          })
        if(name=="file4")
          this.setState({
            fileUploaded4 : response.data
          }) 
        if(name=="CatPic")
          this.setState({
            CatPicPreview : this.state.absoluteUrl + response.data.split("public")[1]
          })  
          
          console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });
  }
  setCategory(event){
    let param={
      Category : this.state.Category,
      id : this.state.CategoryId,
      token: localStorage.getItem("api_token"),
      SellerId:this.state.SellerId,
      ParentCat:this.state.ParentCat,
      CategoryOrder:this.state.CategoryOrder,
      showInSite:this.state.showInSite,
      pic:this.state.CatPic
    };
    this.setState({
      loading:1
    })
    let that=this;
    let SCallBack = function(response){
      if(response.data.result.insertedCount)
        that.GetCategory(response);
      Alert.success('عملیات با موفقیت انجام شد', 5000);  
      that.setState({
        loading:0
      })
    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send("AdminApi/setCategory",param,SCallBack,ECallBack)
    event.preventDefault();
  }
  
  setProduct(event){
    if(this.state.title == "" || this.state.title2 == "" || this.state.desc == "" || this.state.price == "" || this.state.off == ""  )
      Alert.info('فیلدهای اجباری را پر کنید', 5000);
    let that=this;
    this.setState({
      loading:1
    })

    

    let Spec = [];
    for(let i=0;i<this.state.CatSpecs.length;i++){
      Spec.push({id:this.state.CatSpecs[i].id,title:this.state.CatSpecs[i].title,value:this.state["Spec_"+this.state.CatSpecs[i].id]})
      //param["Spec_"+this.state.CatSpecs[i].id]=this.state["Spec_"+this.state.CatSpecs[i].id]
    }
    let param={
      set : true,
      title: this.state.title,
      title2: this.state.title2,
      desc: this.state.desc,
      price: this.state.price.replace(/,/g,""),
      off: this.state.off,
      status: this.state.status,
      number: this.state.number,
      CategoryInProduct: this.state.CategoryInProduct ? this.state.CategoryInProduct.value : this.state.CategoryInProduct,
      ShowPriceAftLogin:this.state.ShowPriceAftLogin,
      NoOff:this.state.NoOff,
      TypeOfSend:this.state.TypeOfSend,
      Immediate:this.state.Immediate,
      fileUploaded: this.state.fileUploaded,
      fileUploaded1: this.state.fileUploaded1,
      fileUploaded2: this.state.fileUploaded2,
      fileUploaded3: this.state.fileUploaded3,
      fileUploaded4: this.state.fileUploaded4,
      HarajDate: this.state.SetHaraj ? this.state.HarajDate1.local("fa").format("jYYYY/jM/jD") : "",
      HarajType:this.state.SetHaraj ? this.state.HarajType : "",
      token: localStorage.getItem("api_token"),
      SellerId:(this.state.ShopId_product && this.state.SeveralShop) ? this.state.ShopId_product : this.state.SellerId,
      SeveralShop:this.state.SeveralShop,
      PrepareTime:this.state.PrepareTime,
      Spec:Spec,
      Color:this.ColorsRef.current.getSelectedItems(),
      Size:this.SizeRef.current.getSelectedItems()
    };
    
    debugger;

    let SCallBack = function(response){
      if(response.data.result.insertedCount)
        that.GetProduct()
      that.setState({
          price: "",
          off: "",
          status: "",
          number: "",
          HarajDate: "",
          HarajType:"",
          SetHaraj:"",
          PrepareTime:"",
          SelectedSize:"",
          SelectedColors:"",
          title:"",
          title2:"",
          desc:"",
          fileUploaded:'',
          fileUploaded1:'',
          fileUploaded2:'',
          fileUploaded3:'',
          fileUploaded4:''
      })  
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading:0
      })
  
    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send("AdminApi/setOrUpdateProduct",param,SCallBack,ECallBack)
   
    event.preventDefault();
  }
  editProduct(event){
      if(this.state.title_edit == "" || this.state.title2_edit == "" || this.state.desc_edit == "" || this.state.price_edit == ""  )
        {
          Alert.success("فیلدهای اجباری را پر کنید",2500);

          return;
        }
        if((this.state.ShopId_product_edit == "" && this.state.SeveralShop && this.state.SellerId ==this.state.MainShopId)){
          Alert.success("فروشگاه را انتخاب کنید",2500);

          return;
        }
        this.setState({
          loading:1
        })  
      let Spec = [];
      if(this.state.CatSpecs_Edit){
        for(let i=0;i<this.state.CatSpecs_Edit.length;i++){
          Spec.push({id:this.state.CatSpecs_Edit[i].id,title:this.state.CatSpecs_Edit[i].title,value:this.state["Spec_edit_"+this.state.CatSpecs_Edit[i].id]})
        }
      }
      this.state.off_edit = this.state.off_edit ? this.state.off_edit : 0;
      var that = this;
      let param={
      set : false,
      id: this.state.id_edit,
      title: this.state.title_edit,
      title2: this.state.title2_edit,
      desc: this.state.desc_edit,
      price: this.state.price_edit.replace(/,/g,""),
      off: this.state.off_edit,
      number: this.state.number_edit,
      status: this.state.status_edit,
      CategoryInProduct: this.state.CategoryInProduct_edit ? this.state.CategoryInProduct_edit.value : this.state.CategoryInProduct_edit,
      ShowPriceAftLogin:this.state.ShowPriceAftLogin_edit,
      NoOff:this.state.NoOff_edit,
      TypeOfSend:this.state.TypeOfSend_edit,
      Immediate:this.state.Immediate_edit,
      HarajDate: this.state.SetHaraj_edit ? this.state.HarajDate_edit : "",
      HarajType:this.state.SetHaraj_edit ? this.state.HarajType_edit : "",
      PrepareTime:this.state.PrepareTime_edit ? this.state.PrepareTime_edit : "",
      token: localStorage.getItem("api_token"),
      SellerId:(this.state.ShopId_product_edit && this.state.SeveralShop) ? this.state.ShopId_product_edit : this.state.SellerId,
      SeveralShop:this.state.SeveralShop,
      Spec:Spec,
      Color:this.ColorsRef_edit.current.getSelectedItems(),
      Size:this.SizeRef_edit.current.getSelectedItems()
      };
      let SCallBack = function(response){
      that.onHide();
      
      Alert.success('عملیات با موفقیت انجام شد', 5000);
      that.setState({
        loading:0
      })
      
      
      };
      let ECallBack = function(error){
        Alert.error('عملیات انجام نشد', 5000);
        that.setState({
          loading:0
        })
      }
      this.Server.send("AdminApi/setOrUpdateProduct",param,SCallBack,ECallBack)
      event.preventDefault();    

  }
  setSelectedDay(date){
    
    this.setState({
      HarajDate:date.year +""+ date.month + "" + date.day
    })
  }
  productTableAction(act,id){
    let that = this;

    debugger;
    if(act=="delete"){
      confirmAlert({
        title: <span className="yekan">حذف محصول</span>,
        message: <div>
                     <span className="yekan">  در صورت تایید امکان بازگرداندن محصول وجود نخواهد داشت . آیا مطمئنید ؟  </span>
                  </div>,
        buttons: [
          {
            label: <span className="yekan">بله </span>,
            onClick: () =>{

              this.setState({
                loading:1
              })
              let param={
                act:act,
                id:id,
                token: localStorage.getItem("api_token")
              };
              let SCallBack = function(response){
                that.GetProduct(); 
                Alert.success('عملیات با موفقیت انجام شد', 5000);
                that.setState({
                  loading:0
                })
          
              };
              let ECallBack = function(error){
                Alert.error('عملیات انجام نشد', 5000);
                that.setState({
                  loading:0
                })
              }
              this.Server.send("AdminApi/productTableAction",param,SCallBack,ECallBack)
          


            }
          },
          {
            label: <span className="yekan">خیر </span>
          }
        ]
      });
 

    }
    else if(act=="edit"){
      this.setState({visibleModalEditProduct: true});
    }
  }
  GetProduct(id){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      SellerId:this.state.SellerId,
      MainShopId:this.state.MainShopId,
      id:id
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      that.setState({
        GridData : response.data.result
      })
      that.setState({
        loading:0
      })

    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send("AdminApi/getProducts",param,SCallBack,ECallBack)
  }
  GetProductPerShop(shopId,id){
    let that = this;
    that.setState({
      price_edit: "",
      off_edit: "",
      status_edit: "",
      number_edit: "",
      ShowPriceAftLogin_edit:"",
      NoOff_edit:"",
      TypeOfSend_edit:"",
      Immediate_edit:"",
      HarajDate_edit: "",
      HarajType_edit:"",
      SetHaraj_edit:"",
      PrepareTime_edit:"",
      SelectedSize_edit:null,
      SelectedColors_edit:null
    })
    if(shopId=="")
      return;
    let param={
      token: localStorage.getItem("api_token"),
      SellerId:shopId,
      product_id:id||this.state.id_edit,
      getDetails:1
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){
      let res = response.data.result;
      that.setState({
        loading:0
      })
      if(res.length==0)
        return;
      that.setState({
        price_edit: res[0].price.toString().replace(/,/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        off_edit: res[0].off,
        status_edit: res[0].status,
        number_edit: res[0].number,
        ShowPriceAftLogin_edit:res[0].ShowPriceAftLogin,
        NoOff_edit:res[0].NoOff,
        TypeOfSend_edit:res[0].TypeOfSend,
        Immediate_edit:res[0].Immediate,
        HarajDate_edit: res[0].HarajDate ? res[0].HarajDate : "",
        HarajType_edit:res[0].HarajType ? res[0].HarajType : "1",
        SetHaraj_edit:res[0].HarajDate ? 1 : 0,
        PrepareTime_edit:res[0].PrepareTime ? res[0].PrepareTime : "",
        SelectedSize_edit:res[0].SelectedSize ? res[0].SelectedSize : "",
        SelectedColors_edit:res[0].SelectedColors ? res[0].SelectedColors : ""
      })
      
     
     // that.getMainShopInfo()

    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send("AdminApi/getProducts",param,SCallBack,ECallBack)
  }
  onSortChange(event) {
    const value = event.value.value;
    if (value.indexOf('!') === 0) {
        this.setState({
            sortOrder: -1,
            sortField: value.substring(1, value.length),
            sortKey: value
        });
    }
    else {
        this.setState({
            sortOrder: 1,
            sortField: value,
            sortKey: value
        });
    }
  }
  GetCategory(){
    let that = this;
    let param={
      token: localStorage.getItem("api_token"),
      SellerId:this.state.SellerId
    };
    this.setState({
      loading:1
    })
    let SCallBack = function(response){    
      that.setState({
        CategoryList : response.data.result
      })
      let CatList=[];
      for(let i=0;i<that.state.CategoryList.length;i++){
        CatList.push({name:that.state.CategoryList[i].name,value:that.state.CategoryList[i]._id})
      }
      that.setState({
        CategoryListForDropDown:CatList,
        loading:0
      })
      that.getSettings();

    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
      that.getSettings();
    }
    this.Server.send("AdminApi/GetCategory",param,SCallBack,ECallBack)



  }
  TableLayout(){
    this.TableLayoutGetSet();
    this.setState({
      TableLayoutModal:1
    })
  }
  onEditorValueChange(props, value,field) {
    let updatedProducts = [...props.value];
    updatedProducts[props.rowIndex][props.field] = value;
    
    /*if((props.field=="relativeLevel" ||  props.field=="off") && value=="-")
      return;
    if((props.field=="relativeLevel" ||  props.field=="off") && isNaN(value) && value != "")
      return;  */
    this.TableLayoutGetSet(updatedProducts[props.rowIndex],updatedProducts,props.rowIndex);
    this.setState({
      grid:updatedProducts
    })
  }
  GetShopList(){
    let that = this;
    let param={
      ShopId:(this.state.SellerId ==this.state.MainShopId ) ? null : this.state.SellerId
    };
    that.setState({
      loading:1
    })
    let SCallBack = function(response){

      let ShopArray=[],
      ShopArrayName=[];
      for(let i=0;i<response.data.result.length;i++){
        ShopArray[i]=response.data.result[i]._id;
        ShopArrayName[i]=response.data.result[i].name;
      }
      that.setState({
        ShopArray : ShopArray,
        ShopArrayName :ShopArrayName,
        ShopId:ShopArray[0],
        loading:0
      })
      that.GetProduct();



    };
    let ECallBack = function(error){
      that.setState({
        loading:0
      })
      that.GetProduct();



    }
    this.Server.send("AdminApi/ShopInformation",param,SCallBack,ECallBack)
  }
  inputTextEditor(field,props) {
    if((props.rowData.price && (field=="relativeLevel" || field=="opr" || field=="off")) || ((( props.rowData.off !="" || props.rowData.opr != "") && props.rowData.price == "") && field=="price"))
      return;
    return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value,field)} />;
  }
  gridEditor(field,props){
    return this.inputTextEditor(field,props);
  }
  onSelect(event){
    var _id = event.originalEvent.target.getAttribute("_id");
    if(!_id){
      try{
        _id = event.originalEvent.target.nextElementSibling.nextElementSibling.children[0].getElementsByClassName("p-highlight")[0].getElementsByClassName("row")[0].getAttribute("_id");
      }catch(e){
  
      }
    }
      
    this.GetProduct(_id)
  }
  suggestBrands(event) {
    let that = this;
    let param={
      title: event.query,
      SellerId:this.state.SellerId,
      Main:this.state.SellerId ==this.state.MainShopId

    };
    
    let SCallBack = function(response){

      let title = [];
      let _id =[],
        img=[],
        desc=[],
        subTitle=[];
      response.data.result.map(function(v,i){
        title.push(v.title);
        subTitle.push(v.subTitle);
        _id.push(v._id);
        img.push(v.fileUploaded);
        desc.push(v.desc);
      })
      
      that.setState({_id:_id,img:img ,desc:desc, Count:-1 , brandSuggestions: title,subTitle:subTitle });
  
      


    };
    let ECallBack = function(error){
      console.log(error)


    }
    this.Server.send("MainApi/searchItems",param,SCallBack,ECallBack)
    
    
     }
  itemTemplateSearch(brand) {
		this.state.Count++;
		return (
		    <div className="p-clearfix" style={{direction:'rtl'}} >
			   <div style={{ margin: '10px 10px 0 0' }} className="row" _id={this.state._id[this.state.Count]} >
			   
			   <div className="col-lg-6" _id={this.state._id[this.state.Count]} style={{textAlign:'right'}}>{this.state.desc[this.state.Count] && 
			   <span className="iranyekanwebregular" style={{textAlign:'right'}}  _id={this.state._id[this.state.Count]} >
			   <span _id={this.state._id[this.state.Count]}>{brand}</span><br />
			   <span _id={this.state._id[this.state.Count]}>{this.state.subTitle[this.state.Count]}</span> 
			   </span>
			   }
			   </div>
			   <div _id={this.state._id[this.state.Count]} className="col-lg-6">{this.state.img[this.state.Count] && 
			   <img src={this.state.absoluteUrl + this.state.img[this.state.Count].split("public")[1]} style={{width:100,height:100,minWidth:100}}  _id={this.state._id[this.state.Count]}  />
			   } </div>
			   </div>
		    </div>
		);

	 }
  TableLayoutGetSet(Set,updatedProducts,rowIndex){
    let url = "";
    if(!Set)
      url = "AdminApi/GetTableProduct";
    else{
      if(!Set.Opr && !Set.off && !Set.relativeLevel && Set.price.length>0 && Set.price.length<3)
        return;
      url = "AdminApi/SetTableProduct";
   
    }
    let that = this;
    this.setState({
      loading:1
    })
    let SCallBack = function(response){  
      if(!Set){
        var grid=[];
        let initPrice=0;
        
        for(var i=0;i<response.data.result.length;i++){
          let result=0;
          if(response.data.result[i].product.length > 0)
          {
             
            let levelName="ثبت نام اولیه";
            switch(response.data.result[i].level){
              case "0":
                {
                  levelName="کاربر عادی"
                  break;
                }
                case "1":
                {
                  levelName="همکار 1"
                  break;
                }
                case "2":
                {
                  levelName="همکار 2"
                  break;
                }
                case "3":
                {
                  levelName="عمده 1"
                  break;
                }
                case "4":
                {
                  levelName="عمده 2"
                  break;
                }
                case "5":
                {
                  levelName="سوپر"
                  break;
                }
            }
            let price="";
            let formul={};
            if(response.data.result[i].formul &&!isNaN(response.data.result[i].formul))
              price = response.data.result[i].formul;
            else if(response.data.result[i].formul){
              let json = JSON.parse(response.data.result[i].formul)
              formul.level = json.level;
              formul.off = json.off;
              formul.opr = json.opr;
            }
            if(!isNaN(response.data.result[i].formul)){
              initPrice=parseInt(response.data.result[i].formul);
              result=initPrice;
            }
            else{
              result = (initPrice && formul.opr != "undefined" && formul.off != "undefined" && formul.level !="undefined" && formul.opr != "" && formul.off != "" && formul.level !="" && formul.level != "" && !isNaN(formul.off) && !isNaN(formul.level)) ? eval(parseInt(initPrice)+formul.opr+(((initPrice*parseInt(formul.off))/100))) : result;
            }
            if(response.data.result[i].computedPrice)
              result=response.data.result[i].computedPrice;
            grid.push({
              "_id":response.data.result[i]._id,
              "product_id":response.data.result[i].product_id,
              "level":response.data.result[i].level,
              "levelName":levelName,
              "price":price,
              "relativeLevel":formul.level,
              "off":formul.off,
              "opr":formul.opr,
              "number":response.data.result[i].product[0].number,
              "title":response.data.result[i].product[0].title,
              "subTitle":response.data.result[i].product[0].subTitle,
              "result":result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            })
          }
        }
        that.setState({
          grid : grid
        })
      }else{
        let result = !isNaN(response.data.result) ? that.roundPrice(response.data.result) : response.data.result;
        updatedProducts[rowIndex]["result"]=result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        that.setState({
          grid:updatedProducts
        })
        if(!isNaN(response.data.result))
          that.TableLayoutGetSet();
        
      }
        
      that.setState({
        loading:0
      })

    };
    let ECallBack = function(error){
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading:0
      })
    }
    this.Server.send(url,Set,SCallBack,ECallBack)
  }
 
    render(){
      const footer = (
        <div>
                <button  className="btn btn-primary yekan" onClick={this.editProduct}  style={{marginTop : "20px" , marginBottom : "20px"}}> اصلاح محصول </button>

        </div>
    );
        return (
          
          <div>
            {this.state.loading == 1 &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px'}}>
                <Loader content="لطفا صبر کنید ..." className="yekan"  />
              </div>
            }
            {this.state.showLoadedCount > 0  &&
              <div style={{position:'fixed',zIndex:2000,top:10,left:15,backgroundColor:'#e89f31',padding:'2px 20px',direction:'ltr'}}>
                <Loader content={this.state.loadedCount} className="yekan"  />
              </div>
            }
            <div className="col-lg-12"> 
            {!this.state.SeveralShop &&
              <div style={{position:'fixed',bottom:0,zIndex:5,left:5,background:'#9c2ac1',color:'#fff',borderRadius:5,padding:10,cursor:'pointer'}} onClick={this.TableLayout} className="IRANYekan">نمایش جدولی محصولات</div>
            } 

                <div  className="row" >
                {this.state.SellerId && this.state.MainShopId && this.state.SellerId ==this.state.MainShopId &&
                <div className="col-lg-7 col-md-12 col-12" >
                <div className="section-title " style={{textAlign:'right'}}><span className="title IRANYekan" style={{fontSize:17,color:'gray'}} >‍‍‍‍‍‍‍ثبت محصول جدید</span></div>

                <form onSubmit={this.setProduct} >
                <div className="group">
                  <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.title} name="title" onChange={this.handleChangeTitle}  required="true"/>
                  <label>عنوان</label>
					      </div>
                
                <div className="group">
                  <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.title2} name="title2" onChange={this.handleChangeTitle2}  required="true" />
                  <label>زیر عنوان</label>
					      </div>
                <div className="group">
                  <textarea className="form-control yekan" style={{height:170}} autoComplete="off" type="text" value={this.state.desc} name="desc" onChange={this.handleChangeDesc}  required="true"/>
                  <label>شرح</label>
					      </div>

                <div className="group">
                  <input className="form-control yekan" autoComplete="off" type="text" value={this.state.price} name="price" onChange={this.handleChangePrice}  required="true" />
                  <label>قیمت</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.number} name="number" onChange={this.handleChangeNumber}  required="true"  />
                 <label>تعداد</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.off} name="off" onChange={this.handleChangeOff}  required="true"  />
                 <label>تخفیف</label>
					      </div>
                <div className="group" >

                 <Multiselect
                  placeholder="رنگ"
                  ref={this.ColorsRef}
                  options={this.Colors} // Options to display in the dropdown
                  selectedValues={this.state.selectedColors} // Preselected value to persist in dropdown
                  displayValue="name" // Property name to display in the dropdown options
                  />
					      </div>
                <div className="group">

                <Multiselect
                  placeholder="اندازه"
                  ref={this.SizeRef}
                  options={this.Size} // Options to display in the dropdown
                  selectedValues={this.state.selectedSize} // Preselected value to persist in dropdown
                  displayValue="name" // Property name to display in the dropdown options
                  />
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.PrepareTime} name="PrepareTime" onChange={this.handleChangePrepareTime}  required="true"  />
                 <label>زمان آماده سازی محصول برای تحویل به مشتری</label>
					      </div>
                {this.state.SeveralShop && 
                
                <div>

                  <div>
                    <label className="labelNoGroup irsans" style={{marginTop:10}}>انتخاب فروشگاه</label>

                    <div style={{textAlign:'center'}}>
                      
                        <select className="custom-select irsans"  value={this.state.ShopId_product} name="ShopId_product" onChange={(event)=>this.setState({
                          ShopId_product: event.target.value
                          })} >
                            <option value=""></option>
                          {
                            this.state.ShopArray && this.state.ShopArray.map((v,i) => {
                              return (   <option value={v} >{this.state.ShopArrayName[i]}</option> )
                            })
                          }
                      </select>

                        
                      </div>
                  </div>
                </div>
                }
                

                <div className="row" style={{marginTop:20,paddingRight:10}}>
                  <div className="col-12" style={{textAlign:'right'}}>
                    <Checkbox inputId="ShowPriceAftLogin" value={this.state.ShowPriceAftLogin} checked={this.state.ShowPriceAftLogin} onChange={e => this.setState({ShowPriceAftLogin: e.checked})}></Checkbox>
                    <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{paddingRight:5}}> نمایش قیمت بعد از هویت سنجی</label>
                  </div>
                  <div className="col-12" style={{textAlign:'right'}}>
                    <Checkbox inputId="ShowPriceAftLogin" value={this.state.NoOff} checked={this.state.NoOff} onChange={e => this.setState({NoOff: e.checked})}></Checkbox>
                    <label htmlFor="ShowPriceAftLogin" className="p-checkbox-label yekan" style={{paddingRight:5}}> در تخفیف های کلی لحاظ نشود</label>
                  </div>
                  <div className="col-12" style={{textAlign:'right'}} >
                    <Checkbox inputId="Immediate" value={this.state.Immediate} checked={this.state.Immediate} onChange={e => this.setState({Immediate: e.checked})}></Checkbox>
                    <label htmlFor="Immediate" className="p-checkbox-label yekan" style={{paddingRight:5}}>ارسال فوری</label>
                  </div>
                  <div className="col-12" style={{textAlign:'right'}}>
                        <RadioButton inputId="TypeOfSend1" name="TypeOfSend" value="1" onChange={(e) => this.setState({TypeOfSend: e.value})} checked={this.state.TypeOfSend === '1'} />
                        <label htmlFor="TypeOfSend1" className="p-checkbox-label yekan">ارسال منطقه ای</label>
                        <RadioButton inputId="TypeOfSend2" name="TypeOfSend" value="2" onChange={(e) => this.setState({TypeOfSend: e.value})} checked={this.state.TypeOfSend === '2'} />
                        <label htmlFor="TypeOfSend2" className="p-checkbox-label yekan">ارسال سراسری</label>
                  </div>
                  </div>
                <div className="row" style={{height:40,marginTop:20,paddingRight:10}}>
                  <div className="col-3" style={{textAlign:'right'}}>
                    <Checkbox inputId="harajCheckBox" value={this.state.harajCheckBox} checked={this.state.harajCheckBox} onChange={(e)=>{this.setState({SetHaraj:!this.state.SetHaraj,harajCheckBox: e.checked})}}></Checkbox>
                    <label htmlFor="harajCheckBox" className="p-checkbox-label yekan" style={{paddingRight:10}}>حراج</label>
                  </div>
                  <div className="col-3" style={{textAlign:'right',display:(this.state.SetHaraj ? "flex" : "none" )}} >
                        <RadioButton inputId="HarajType1" name="HarajType" value="1" onChange={(e) => this.setState({HarajType: e.value})} checked={this.state.HarajType === '1'} />
                        <label htmlFor="HarajType1" className="p-checkbox-label yekan"  style={{paddingRight:5}}>روز</label>
                        <RadioButton inputId="HarajType2" name="HarajType" value="2" onChange={(e) => this.setState({HarajType: e.value})} checked={this.state.HarajType === '2'} />
                        <label htmlFor="HarajType2" className="p-checkbox-label yekan"  style={{paddingRight:5}}>هفته</label>
                  </div>

                   <div className="col-4" style={{marginRight:5,display:(this.state.SetHaraj ? "flex" : "none" )}} >
                   <DatePicker
                      onChange={value => this.setState({ HarajDate1 : value})}
                      value={this.state.HarajDate1}
                      isGregorian={false}
                      timePicker={false}

                    />
                  
                   </div>
                   

                

                
					      </div>
                
                  
                
                <div onClick={()=>{this.setState({UploadBoxToggle:!this.state.UploadBoxToggle})}} style={{textAlign:"right",textDecoration:"underline",cursor:"pointer",paddingRight:"5px",marginBottom:"5px",fontSize:"13px"}} className="yekan">آپلود تصاویر</div>
                <div style={{display:(this.state.UploadBoxToggle ? "block" : "none" )}}>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}   type="file"  name="file"    />
                 <label>آپلود عکس اصلی</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  type="file"  name="file1"    />
                 <label>1 آپلود عکس</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  type="file"  name="file2"    />
                 <label>2 آپلود عکس</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  type="file"  name="file3"    />
                 <label>3 آپلود عکس</label>
					      </div>
                <div className="group">
                  <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  type="file"  name="file4"    />
                 <label>4 آپلود عکس</label>
					      </div>
                </div>
                <div style={{textAlign:'right'}}>
                <select className="custom-select yekan" style={{marginTop:20}}  value={this.state.status} name="status" onChange={this.handleChangeStatus} >
                  <option selected="">وضعیت را انتخاب کنید</option>
                  <option value="1">معمولی</option>
                  <option value="2">شگفت انگیز</option>
                  <option value="4">بایگانی</option>
                </select>
                <Dropdown value={this.state.CategoryInProduct} panelStyle={{width:'100%',textAlign:'right'}} style={{fontFamily:'iranyekanwebregular',width:'100%',textAlign:'right',marginTop:20}} options={this.state.CategoryListForDropDown} onChange={this.handleCategoryInProduct} optionLabel="name" placeholder="دسته بندی"
                  valueTemplate={this.selectedCatTemplate} filter  filterBy="name" itemTemplate={this.CatTOptionTemplate} />
                <select className="custom-select yekan" style={{marginTop:20,display:'none'}}  value={this.state.CategoryInProduct} name="CategoryInProduct" onChange={this.handleCategoryInProduct} >
                  <option selected="">دسته بندی</option>
                  {
                    
                    this.state.CategoryList && this.state.CategoryList.map((v, i) => {
                      return (   <option value={v._id} >{v.name}</option> )
                    })
                    

                  }
                </select>
                </div>
                  <div className="row" >
                  {
                  this.state.CatSpecs && this.state.CatSpecs.map((v, i) => {
                    let name = "Spec_"+v.id;
                    return (  <div className="col-6" >
                            <div className="group">
                              <input className="form-control yekan" autoComplete="off" type="text" value={this.state[name]} name={name} onChange={(event)=>{debugger;this.setState({[event.target.name]: event.target.value})}}  required="true" />
                              <label>{v.title}</label>
                            </div>
                          </div>
                       )
                  
                    })
                  }
                  </div>
                
                
							  <input  className="btn btn-primary yekan" type="submit" value="ثبت محصول" style={{width:"200px",marginTop : "20px" , marginBottom : "20px"}}/>
                </form>
                </div>
                }
                </div>
                <div className="row" style={{marginTop:50,marginBottom:20}} >
                <div className="col-6" style={{textAlign: 'right'}}>
                <AutoComplete placeholder="نام کالای مورد نظر را جستجو کنید" inputStyle={{fontFamily:'iranyekanwebregular',textAlign:'right',fontSize:12,borderColor:'#dedddd',fontSize:15}} style={{width:'100%'}} onChange={(e) => this.setState({ brand: e.value })}  itemTemplate={this.itemTemplateSearch.bind(this)} value={this.state.brand} onSelect={(e) => this.onSelect(e)}  suggestions={this.state.brandSuggestions} completeMethod={this.suggestBrands.bind(this)} />
                </div>
                <div className="col-3" style={{textAlign: 'left'}}>
                <i class="fas fa-sync" style={{cursor:'pointer'}} aria-hidden="true" onClick={()=>this.GetProduct()} ></i>
                </div>
                <div className="col-3" style={{textAlign: 'left'}}>
                    <Dropdown options={this.sortOptions} value={this.state.sortKey} optionLabel="label" placeholder="مرتب سازی" onChange={this.onSortChange}/>
                </div>
                </div>
                
                <DataView value={this.state.GridData} layout={this.state.layout} paginator={true} sortOrder={this.state.sortOrder} sortField={this.state.sortField}  rows={10} itemTemplate={this.itemTemplate}></DataView>
                
            </div>
    <Dialog header="اصلاح محصول"  visible={this.state.visibleModalEditProduct} style={{width: '60vw'}} footer={footer} minY={70} onHide={this.onHide} maximizable={true}>

    <form   style={{overflowY:'auto',overflowX:'hidden',height:400}}  >
      <div className="row">
      {this.state.SeveralShop && (this.state.SellerId ==this.state.MainShopId ) &&
      
      <div className="col-lg-12" style={{marginBottom:20}}>
      <label className="labelNoGroup irsans" style={{marginTop:10}}>انتخاب فروشگاه</label>

      <div className="group" style={{textAlign:'center'}}>

                    <select className="custom-select irsans"  value={this.state.ShopId_product_edit} name="ShopId_product_edit" onChange={(event)=>{
                      this.setState({
                      ShopId_product_edit: event.target.value
                      }) 
                      this.GetProductPerShop(event.target.value);
                      }                     
                      } >
                        <option value=""></option>
                      {
                        this.state.ShopArray && this.state.ShopArray.map((v,i) => {
                          return (   <option value={v} >{this.state.ShopArrayName[i]}</option> )
                        })
                      }
                  </select>

                    
                  </div>
      </div>
      }
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.title_edit} name="title_edit" onChange={this.handleChangeTitle_edit}  required="true" disabled={this.state.SellerId !=this.state.MainShopId}/>
        <label>عنوان</label>
      </div>
      </div>
      <div className="col-lg-6">

      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.title2_edit} name="title2_edit" onChange={this.handleChangeTitle2_edit}  required="true" disabled={this.state.SellerId !=this.state.MainShopId} />
        <label>زیر عنوان</label>
      </div>
      </div>
      <div className="col-lg-12">
      <div className="group">
        <textarea className="form-control yekan" autoComplete="off" style={{height:170}} type="text" value={this.state.desc_edit} name="desc_edit" onChange={this.handleChangeDesc_edit}  required="true" disabled={this.state.SellerId !=this.state.MainShopId}/>
        <label>شرح</label>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.price_edit} name="price_edit" onChange={this.handleChangePrice_edit}  required="true" />
        <label>قیمت</label>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.off_edit} name="off_edit" onChange={this.handleChangeOff_edit}  required="true"  />
       <label>تخفیف</label>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="group" >
            <Multiselect
                  placeholder="رنگ"
                  ref={this.ColorsRef_edit}
                  options={this.Colors} // Options to display in the dropdown
                  selectedValues={this.state.SelectedColors_edit} // Preselected value to persist in dropdown
                  displayValue="name" // Property name to display in the dropdown options
                  />

					      </div>
      </div>
      <div className="col-lg-6">
          <div className="group" >
          <Multiselect
                  placeholder="اندازه"
                  ref={this.SizeRef_edit}
                  options={this.Size} // Options to display in the dropdown
                  selectedValues={this.state.SelectedSize_edit} // Preselected value to persist in dropdown
                  displayValue="name" // Property name to display in the dropdown options
                  style={{ fontFamily: 'iranyekanweblight' }}
                  />

					      </div>
      </div>
                
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.PrepareTime_edit} name="PrepareTime_edit" onChange={this.handleChangePrepareTime_edit}  required="true"  />
       <label>زمان آماده سازی محصول برای تحویل به مشتری</label>
      </div>
      </div>
      
      <div className="col-lg-6">
      <div className="group">
        <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.number_edit} name="number_edit" onChange={this.handleChangeNumber_edit}  required="true"  />
       <label>تعداد</label>
      </div>
      </div>
      <div className="col-md-12 col-12" style={{textAlign:'right',marginTop:5,height:45}}>
                    <Checkbox inputId="harajCheckBox" value={this.state.harajCheckBoxEdit} disabled={this.state.SellerId !=this.state.MainShopId} checked={this.state.harajCheckBoxEdit} onChange={(e)=>{this.setState({SetHaraj_edit:!this.state.SetHaraj_edit,harajCheckBoxEdit: e.checked})}} name="harajCheckBoxEdit" ></Checkbox>
                    <label htmlFor="harajCheckBox" className="p-checkbox-label yekan" style={{paddingRight:10}}>حراج روز</label>
                 
      </div>
      <div className="col-4" style={{marginTop:5,textAlign:'right',display:(this.state.SetHaraj_edit ? "flex" : "none" )}} >
                        <RadioButton inputId="HarajType1_edit" name="HarajType_edit" value="1" onChange={(e) => this.setState({HarajType_edit: e.value})} checked={this.state.HarajType_edit === '1'} disabled={this.state.SellerId !=this.state.MainShopId} />
                        <label htmlFor="HarajType1_edit" className="p-checkbox-label yekan" style={{paddingRight:5}}>روز</label>
                        <RadioButton inputId="HarajType2_edit" name="HarajType_edit" value="2" onChange={(e) => this.setState({HarajType_edit: e.value})} checked={this.state.HarajType_edit === '2'} disabled={this.state.SellerId !=this.state.MainShopId} />
                        <label htmlFor="HarajType2_edit" className="p-checkbox-label yekan" style={{paddingRight:5}}>هفته</label>
      </div>
      <div className="col-md-4 col-12" >
                      <div className="group" style={{marginTop:0,display:(this.state.SetHaraj_edit ? "block" : "none" )}}>
                      <input className="form-control yekan" autoComplete="off"  type="text" value={this.state.HarajDate_edit} name="HarajDate_edit" onChange={this.handleChangeHarajDate_edit}  required="true" disabled={this.state.SellerId !=this.state.MainShopId}  />

                    
     </div>
      
                

                
             </div>
                  <div className="col-12" style={{textAlign:'right'}}>
                    <Checkbox inputId="ShowPriceAftLogin_edit" value={this.state.ShowPriceAftLogin_edit} checked={this.state.ShowPriceAftLogin_edit} disabled={this.state.SellerId !=this.state.MainShopId} onChange={e => this.setState({ShowPriceAftLogin_edit: e.checked})}></Checkbox>
                    <label htmlFor="ShowPriceAftLogin_edit" className="p-checkbox-label yekan" style={{paddingRight:5}}> نمایش قیمت بعد از هویت سنجی</label>
                  </div>
                  <div className="col-12" style={{textAlign:'right'}}>
                    <Checkbox inputId="NoOff_edit" value={this.state.NoOff_edit} checked={this.state.NoOff_edit} onChange={e => this.setState({NoOff_edit: e.checked})}></Checkbox>
                    <label htmlFor="NoOff_edit" className="p-checkbox-label yekan" style={{paddingRight:5}}> در تخفیف های کلی لحاظ نشود</label>
                  </div>
                  
                  <div className="col-12" style={{textAlign:'right'}} >
                    <Checkbox inputId="Immediate" value={this.state.Immediate_edit} checked={this.state.Immediate_edit} onChange={e => this.setState({Immediate_edit: e.checked})}></Checkbox>
                    <label htmlFor="Immediate_edit" className="p-checkbox-label yekan" style={{paddingRight:5}}>ارسال فوری</label>
                  </div>
                  <div className="col-12" style={{textAlign:'right'}}>
                        <RadioButton inputId="TypeOfSend1_edit" name="TypeOfSend_edit" value="1" onChange={(e) => this.setState({TypeOfSend_edit: e.value})} checked={this.state.TypeOfSend_edit === '1'} />
                        <label htmlFor="TypeOfSend1" className="p-checkbox-label yekan">ارسال منطقه ای</label>
                        <RadioButton inputId="TypeOfSend2_edit" name="TypeOfSend_edit" value="2" onChange={(e) => this.setState({TypeOfSend_edit: e.value})} checked={this.state.TypeOfSend_edit === '2'} />
                        <label htmlFor="TypeOfSend2_edit" className="p-checkbox-label yekan">ارسال سراسری</label>
                  </div>
        
               
      <div className="col-lg-6" style={{marginTop:20}}>
      <label className="labelNoGroup yekan">وضعیت</label>

      <select className="custom-select yekan" disabled={this.state.SellerId !=this.state.MainShopId}  value={this.state.status_edit} name="status_edit" onChange={this.handleChangeStatus_edit} >
        <option selected="">وضعیت را انتخاب کنید</option>
        <option value="1">معمولی</option>
        <option value="2">شگفت انگیز</option>
        <option value="4">بایگانی</option>
      </select>
      </div>
      <div className="col-lg-6" style={{marginTop:20}} >
      <label className="labelNoGroup yekan">دسته بندی</label>

      <Dropdown value={this.state.CategoryInProduct_edit} panelStyle={{width:'100%',textAlign:'right'}} style={{fontFamily:'iranyekanwebregular',width:'100%',textAlign:'right'}} options={this.state.CategoryListForDropDown} onChange={this.handleCategoryInProduct_edit} optionLabel="name" placeholder="دسته بندی"
                  valueTemplate={this.selectedCatTemplate} filter  filterBy="name" itemTemplate={this.CatTOptionTemplate} />
      </div>
      <div className="col-lg-6" style={{marginTop:20,display:'none'}}>
      <label style={{textAlign:"right"}} className="labelNoGroup yekan" >دسته بندی</label>
      <select className="custom-select yekan"  value={this.state.CategoryInProduct_edit} disabled={this.state.SellerId !=this.state.MainShopId} name="CategoryInProduct" onChange={this.handleCategoryInProduct_edit} >
        <option selected="">دسته بندی</option>
        {
          
          this.state.CategoryList.map((v, i) => {
            return (   <option value={v._id} >{v.name}</option> )
        })
          

      }
      </select>
      </div>
                  {
                  this.state.CatSpecs_Edit && this.state.CatSpecs_Edit.map((v, i) => {
                    let name = "Spec_edit_"+v.id;
                    return (  <div className="col-6" >
                            <div className="group">
                              <input className="form-control yekan" disabled={this.state.SellerId !=this.state.MainShopId} value={v.value} autoComplete="off" type="text" value={this.state[name]} name={name} onChange={(event)=>{this.setState({[event.target.name]: event.target.value})}}  required="true" />
                              <label>{v.title}</label>
                            </div>
                          </div>
                       )
                  
                    })
                  }
      </div>
 </form>
</Dialog>
 

<Dialog header="تصاویر" visible={this.state.visibleModalPic} width="800px" minY={70} onHide={this.onHide} maximizable={true}>
           
<input className="form-control yekan" style={{visibility:'hidden'}} autoComplete="off" onChange={this.FileUpload}  type="file"  name="picFile" id="picFile"   />
  <div className="row" >
  <div className="col-6" >
  <img  src={this.state.pic1} name="pic1" onClick={this.Changepic} style={{width : "300px" , height:"300px"}}  alt="Picture" /> 

  </div>
  </div>
  <br/>
  <div className="row" >
  <div className="col-3" >
  <img  src={this.state.pic2} style={{width : "150px" , height:"100px"}} name="pic2" onClick={this.Changepic}  alt="Picture" /> 

  </div>
  <div className="col-3" >
  <img  src={this.state.pic3} style={{width : "150px" , height:"100px"}} name="pic3" onClick={this.Changepic}  alt="Picture" /> 

  </div>
  <div className="col-3" >
  <img  src={this.state.pic4} style={{width : "150px" , height:"100px"}} name="pic4" onClick={this.Changepic}  alt="Picture" /> 

  </div>
  <div className="col-3" >
  <img  src={this.state.pic5} style={{width : "150px" , height:"100px"}} name="pic5" onClick={this.Changepic}  alt="Picture" /> 

  </div>
  </div>
</Dialog>

<Dialog header="محاسبه قیمت / تخفیف" visible={this.state.visibleModalOff} width="600px" minY={70} onHide={this.onHide} maximizable={true}>
   <div style={{maxWidth:800}}>
     
  <div className="row">
  <div className="col-12">
     <p className="yekan" style={{textAlign:'right'}}>
       در صورتی که در ستون عمل عملگر + قرار گیرد مقدار درصد به قیمت درج شده در قیمت خرید کاربر با درجه کاربری درج شده در نسبت به اضافه می شود و به عنوان قیمت برای درجه کاربری انتخابی در نظر گرفته می شود 
     </p>
   </div>
   <div className="col-lg-12">
    <label className="labelNoGroup irsans">درجه ی کاربری</label>
    <select className="custom-select irsans"  value={this.state.levelOfUser} name="levelOfUser" onChange={(event)=>{this.setState({
      levelOfUser: event.target.value,
      status : event.target.value > -1 ? "1" :"0"
      })
      this.GetOffs(this.state.currentId,event.target.value)
      }
      } >
    {
                    this.state.levelOfUserArray && this.state.levelOfUserArray.map((v,i) => {
                      
                      return (   <option value={v} >{this.state.levelOfUserArrayName[i]}</option> )
                  })
    }
  </select>
  </div>

  
  <div className="col-lg-12" style={{display:'none'}}>

      <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul} name="formul" onChange={(event)=>this.setState({formul: event.target.value})}  required="true" />
        <label>فرمول محاسبه قیمت</label>
      </div>
   </div>
   
   <div className="col-lg-12" >
      <div className="row">
      <div className="col-3">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_price} name="formul_price" onChange={(event)=>this.setState({formul_price: event.target.value})}  required="true" />
        <label>قیمت خرید</label>
        </div>
        </div>
        <div className="col-3">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_level} name="formul_level" onChange={(event)=>this.setState({formul_level: event.target.value})}  required="true" />
        <label>نسبت به</label>
        </div>
        </div>
        <div className="col-3">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_off} name="formul_off" onChange={(event)=>this.setState({formul_off: event.target.value})}  required="true" />
        <label>درصد</label>
        </div>
        </div>
        <div className="col-3">
        <div className="group">
        <input className="form-control yekan" autoComplete="off" dir="ltr"  type="text" value={this.state.formul_opr} name="formul_opr" onChange={(event)=>this.setState({formul_opr: event.target.value})}  required="true" />
        <label>عمل</label>
        </div>
        </div>
      </div>
      
   </div>
    <div  className="col-lg-12">
        <button  className="btn btn-primary irsans" onClick={this.SetOff}  style={{width:"200px",marginTop : "5px" , marginBottom : "5px"}}> اعمال </button>
    </div>    
   </div>
   </div>
</Dialog>



<Dialog header="نمایش جدولی" maximized={true} visible={this.state.TableLayoutModal} width="600px" minY={70} onHide={this.onHide}  maximizable={true}>
   <div >
     
   <div className="row">
   <div className="col-lg-12">
     <div>
       <p className="yekan" style={{textAlign:'right'}}>راهنمای درجه کاربری : ثبت نام اولیه (-1)    کاربر عادی (0)    همکار1 (1)    همکار 2 (2) عمده 1 (3)    عمده 2 (4)    سوپر (5)</p>
     </div>
   <div className="datatable-editing-demo">
  
                <div className="card" style={{maxHeight: '400px'}} >
   <DataTable value={this.state.grid} editMode="cell"   className="editable-cells-table" paginator={true} rows={14}  >
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="title" header="عنوان" ></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="subTitle" header="عنوان دوم"  ></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="level" header="کد درجه کاربری"></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="levelName" header="درجه کاربری" ></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="price" header="قیمت خرید" editor={(props) => this.gridEditor('price', props)}></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="relativeLevel" header="نسبت به" editor={(props) => this.gridEditor('relativeLevel', props)}></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} filter={true} field="off" header="درصد تخفیف" editor={(props) => this.gridEditor('off', props)}></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} field="opr" header="عمل" editor={(props) => this.gridEditor('opr', props)}></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} field="result" header="قیمت نهایی" ></Column>
                        <Column headerStyle={{ fontFamily: 'iranyekanweblight' }} bodyStyle={{ fontFamily: 'iranyekanweblight',textAlign:'right',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }} field="number" header="موجودی" ></Column>

    
    
    </DataTable>
    </div>
    </div>
    </div>   
   </div>
   </div>
</Dialog>




</div>

      
          
          

        )
    }
}
const mapStateToProps = (state) => {
  return{
    username : state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(AdminProduct)
);

import React, { Component, useEffect } from 'react';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import './Dashboard.css'
import { io } from "socket.io-client";
import axios from 'axios'

import { Sidebar } from 'primereact/sidebar';

import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

import { SelectButton } from 'primereact/selectbutton';
import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Toast } from 'primereact/toast';
import './DataTableDemo.css';

const FilterItems = [
    { label: 'همه', value: 'All' },
    { label: 'جاری', value: "1" },

    { label: 'پایان یافته', value: "2" }



];
let ania_chat_interval = null,
    ania_chat_interval2 = null;
var socket;

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.state = {
            layout: 'list',
            dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
            dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
            NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
            NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
            ChatSelected: {},
            Filter: "1",
            browser:{},
            GridData:[],
            chosenEmoji:null,
            setChosenEmoji:null,
            EmojiData : ({ chosenEmoji }) => (
                <div>
                  
                </div>
              ),
            url: this.Server.getUrl(1),
            absoluteUrl: this.Server.getAbsoluteUrl()

        }
        socket = io(this.Server.getAbsoluteUrl());
        this.toast = React.createRef();
        this.Editor = React.createRef();
        this.selectChat = this.selectChat.bind(this);
        this.EndChat = this.EndChat.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
        this.onHideDialog = this.onHideDialog.bind(this);
        this.SetAnswer = this.SetAnswer.bind(this);
        this.FileUpload = this.FileUpload.bind(this);
        this.getCode = this.getCode.bind(this);
        this.myRef = React.createRef()   // Create a ref object
        this.fileUpladElem = React.createRef()   // Create a ref object

        

    }

    componentDidMount() {
        socket.on("setChat", (data) => {
            debugger;
            this.getChat(this.state.visibleDialog ? data._id : null, this.state.Filter)
        });


        let param = {
            token: localStorage.getItem("api_token"),
        };
        let that = this;
        this.setState({
            loading: 1
        })
        let SCallBack = function (response) {
            that.setState({
                loading: 0
            })
            that.setState({
                username: response.data.authData.username,
                UId: response.data.authData.userId,
                shopId: response.data.authData.shopId,
                name: response.data.authData.name || ""
            })


            that.getShop();


        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
            console.log(error)
        }
        this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
    }
    FileUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        let name = e.target.name;
        formData.append('name', name);
        formData.append('PagePics', "1");
        formData.append('ExtraFile', "1");
        formData.append('typeOfFile', "2");
        if(!e.target.files[0]){
          return;
    
        }
        formData.append('myImage', e.target.files[0]);
    
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        };
        this.setState({
          loading: 1
        })
        axios.post(this.state.url + 'uploadFile', formData, config)
          .then((response) => {
            let file = this.state.absoluteUrl + response.data.split("public")[1];
            if(file.indexOf(".png") > 0 ||  file.indexOf(".jpg") > 0 ||  file.indexOf(".gif") > 0){
                this.setState({
                    answer:'<img src='+file+' />'
                })
                this.SetAnswer();

            }else{
                this.setState({
                    answer:'<a href='+file+' target="_blank" >فایل ارسالی</a>'
                })
                this.SetAnswer();


            }
    
          })
          .catch((error) => {
            this.setState({
              loading: 0
            })
            console.log(error);
          });
      }
    getShop() {
        let that = this;
        that.Server.send("AdminApi/ShopInformation", { ShopId: this.state.shopId }, function (response) {
            that.setState({
                tokenId: response.data.result[0]?.tokenId
            })
            that.getCode();


        }, function (error) {
        })
    }
    getCode() {
        let that = this;
        that.Server.send("AdminApi/getSettings", {}, function (response) {
            that.setState({
                code: response.data.result[0] ? response.data.result[0].ChatId : '',
            })
            that.getChat(null, that.state.Filter);
            /*ania_chat_interval2 = setInterval(function () {
                that.getChat(null, that.state.Filter);
            }, 10000);*/



        }, function (error) {
        })
    }


    getChat(_id, Filter) {
        let param = {
            token: localStorage.getItem("api_token"),
            sort: { "_id": -1 },
            _id: _id,
            User: 0,
            End: 'All',
            code: this.state.tokenId || this.state.code
        };
        let that = this;
        if (!_id)
            this.setState({
                loading: 1
            })
        let SCallBack = function (response) {

            if (_id) {
                debugger;
                for(let i=0;i<that.state.GridData.length;i++){
                    if(that.state.GridData[i]._id == response.data.result[0]._id)
                        that.state.GridData[i] = response.data.result[0];
                }
                that.setState({
                    loading: 0,
                    ChatSelected: response.data.result[0]||{},
                    GridData:that.state.GridData,
                    browser: response.data.result[0]?.browser||{}
                })
                that.myRef.current.scrollTo(0, that.myRef.current.scrollHeight); 


            } else {
                that.setState({
                    loading: 0,
                    GridData: response.data.result,
                    browser: response.data.result[0]?.browser||{}
                })
            }




        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
            console.log(error)
        }
        this.Server.send("ChatApi/getChat", param, SCallBack, ECallBack)

    }
    selectChat(itemSelected) {
        let that = this;
        this.setState({
            visibleDialog: true,
            ChatSelected: itemSelected
        })
        setTimeout(()=>{
            if(this.myRef.current)
                this.myRef.current.scrollTo(0, this.myRef.current.scrollHeight); 
        },0)
        


    }
    EndChat(itemSelected) {
        let _id = itemSelected._id;
        let param = {
            token: localStorage.getItem("api_token"),
            _id: _id,
            code: this.state.tokenId || this.state.code
        };
        let that = this;
        this.setState({
            loading: 1
        })
        let SCallBack = function (response) {
            that.setState({
                loading: 0
            })
            that.getChat();





        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
            console.log(error)
        }
        this.Server.send("ChatApi/EndChat", param, SCallBack, ECallBack)
        return false;

    }
    itemTemplate(car, layout) {
        if (!car)
            return (
                <div className="p-col-12 p-md-3">
                    <div></div>
                </div>
            );

        if (layout === 'list') {
            return (
                <div className="row" style={{border:0}}  >
                    <div className="col-lg-12 " >
                        <div className="row" style={{background:'#eee',marginBottom:10,marginRight:5,marginLeft:5,borderRadius:10,marginTop:10}} >

                            <div className="col-lg-12 col-12 yekan" style={{ cursor: 'pointer', textAlign: "right", padding: 10, borderRadius: 10 }} onClick={() => { this.selectChat(car) }} >
                                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}} >
                                    <div style={{width:'30%'}}>
                                        <i className="fas fa-user" style={{fontSize:40,color:'orange'}} />
                                        
                                    </div>
                                    <div style={{width:'70%'}}>
                                        <div className="yekan" style={{ textAlign: "right", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',fontSize:14 }}  dangerouslySetInnerHTML={{__html:car.text}}  />

                                        {car.chats_detail &&
                                            <div className="yekan" style={{ textAlign: "right", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',fontSize:11 }}  dangerouslySetInnerHTML={{__html:car.chats_detail[car.chats_detail.length - 1]?.text}}  />
                                        }
                                    </div>


                                    <div style={{display:'none'}}>
                                    <p className="yekan" >{car.TodayTime} : {car.TodayDate}</p>

                                    </div>

                                </div>
                                



                             </div>

                            <div className="col-lg-3 col-12" style={{ display: 'none' }}>
                                {car.End ?
                                    <div>
                                        <p className="yekan" style={{ color: 'red' }}>پایان یافته</p>

                                    </div>
                                    :
                                    <div>

                                        <button className="btn btn-danger yekan" onClick={() => { this.EndChat(car) }} style={{ marginTop: "5px", marginBottom: "5px", float: 'left' }}>پایان گفتگو </button>

                                    </div>
                                }
                            </div>




                        </div>
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

    onHideDialog(event) {

        clearInterval(ania_chat_interval);
        let that = this;
        //ania_chat_interval2 = setInterval(function () {

        that.getChat(null, that.state.Filter);
        //}, 10000);

        this.getChat(null, that.state.Filter);

        this.setState({
            visibleDialog: false,
            ChatSelected: {}
        });
    }
    SetAnswer() {
        
        let param = {
            token: localStorage.getItem("api_token"),
            sort: { TodayDate_C: -1 },
            UId: this.state.UId,
            _id: this.state.ChatSelected._id,
            value: this.state.answer,
            userSend: 0,
            code: this.state.tokenId || this.state.code
        };
        let that = this;
        this.setState({
            loading: 1,
            showEmoji:false
        })
        let SCallBack = function (response) {
            that.setState({
                loading: 0,
                answer:''
            })
            //that.toast.current.show({ severity: 'success', summary: <div>پاسخ با موفقیت ارسال شد</div>, life: 8000 });
            that.getChat(that.state.ChatSelected._id);
            //that.onHideDialog();


        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
            console.log(error)
        }
        debugger;
        this.Server.send("ChatApi/setChat", param, SCallBack, ECallBack)
    }
    _handleKeyDown(e) {
        if (e.key === 'Enter') {
          this.setState({
            answer:''
          })   
          this.SetAnswer();
        }
      }
    render() {


        return (
            <div style={{ direction: 'rtl',height:'100%'  }}>


                {this.state.loading == 1 &&
                    <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: '50%', padding: '2px 20px' }}>
                        <Loader content="" className="yekan" />
                    </div>
                }
                <Toast ref={this.toast} position="top-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                <div className="row justify-content-center" style={{height:'100%',background:'#eee',overflow:'hid_den'}}>

                    <div className="col-12" style={{height:'100%'}} >
                        <div className="row" style={{ alignItems: 'flex-start',marginTop:20,background:'#eeeeee52',height:'97%',marginTop:25 }} >
                            <div className="col-9" style={{display:'none'}} >
                                <div style={{ textAlign: 'right', marginBottom: 10 }}>
                                    <SelectButton value={this.state.Filter} options={FilterItems} style={{ fontFamily: 'Yekan' }} className="yekan" onChange={(e) => { this.setState({ Filter: e.value || "1" }); this.getChat(null, e.value || "1") }}></SelectButton>

                                </div>

                            </div>
                            <div className="col-3" style={{display:'none'}} >
                                <div style={{ textAlign: 'right', marginBottom: 10 }}>

                                    <button className="btn btn-info yekan" onClick={() => { this.getChat(null, this.state.Filter) }} style={{ marginTop: "5px", marginBottom: "5px" }}><i className="fas fa-sync" /></button>
                                </div>

                            </div>
                            <div className="col-3 ania-chat-column" style={{position:'relative'}}>
                                <div style={{background:'#fff',paddingTop:80,borderRadius:5}}>
                                <div style={{background:'orange',padding:30,color:'#fff',textAlign:'center',width:'85%',zIndex:2,left:'26px',top:-20,position:'absolute',borderRadius:10}} className="yekan">گفتگوهای من </div>
                                <div style={{padding:'0px 20px'}} >
                                    <button className="btn btn-outline-info yekan" style={{width:'100%'}} onClick={()=>{
                                        this.setState({ShowContact:true})
                                    }} >گفتگوی جدید </button>
                                </div>
                                <div style={{height:'88vh',overflow:'auto'}}>
                                {this.state.GridData.length > 0 ?
                                    <DataView value={this.state.GridData}  layout={this.state.layout} paginator={false} itemTemplate={this.itemTemplate}></DataView>
                                :
                                    <div></div>
                                }

                                </div>

                                </div>
                            </div>


                            <div className="col-7 ania-chat" style={{height:'100%',background:'#fff',borderTopRightRadius:5,borderBottomRightRadius:5}}>
                                {this.state.ChatSelected.text &&
                                    <div className="yekan" style={{padding:10,textAlign:'right',width:'100%',background:'#fff',zIndex:1,position:'absolute'}}>{(this.state.ChatSelected && this.state.ChatSelected.user_detail && this.state.ChatSelected.user_detail[0]) ? (this.state.ChatSelected.user_detail[0].name||this.state.ChatSelected.user_detail[0].mobile||this.state.ChatSelected.user_detail[0].mail) : "کاربر مهمان"}</div>

                                }
                                {this.state.ChatSelected.text ?

                                <div style={{height:'97vh',display:'flex',flexDirection:'column',position:'absolute',width:'100%',background:'#eee'}}>
                                 <div style={{display:'flex',flex:1,height:'calc(100% - 52px)'}}>   
                                <div className="row" style={{ margin: 20,overflowY:'auto',overflowX:'hidden',width:'100%' }} ref={this.myRef}>



                                    <div className="col-12" style={{ textAlign: 'right' }}>
                                        
                                    <div className="yekan "  style={{ fontSize: 14, width: 'fit-content', padding: 6, borderRadius: 10,color:'#fff', background: '#7b7db9', clear: 'both',marginBottom:10,marginTop:40 }} >

                                    <div className="yekan"  dangerouslySetInnerHTML={{ __html: this.state.ChatSelected.text }}  />

                                    </div>
                                        {this.state.ChatSelected.chats_detail && this.state.ChatSelected.chats_detail.map((v, i) => {
                                            let style = v.userSend ? { fontSize: 14, width: 'fit-content', padding: 6, borderRadius: 10,color:'#fff', background: '#7b7db9', marginBottom: 5, clear: 'both' } : { fontSize: 25, color: 'blue', width: 'fit-content', padding: 6, borderRadius: 10, background: '#fff', marginBottom: 5, float: 'left', clear: 'both',marginLeft:10 }
                                            return (
                                                <div style={style} className="ania-chat-text">
                                                    <div style={{display:'none'}} >
                                                        {v.userSend ?
                                                            <p className="yekan" style={{ textAlign: 'right', color: '#ffffff80' }}>{v.TodayTime} : {v.TodayDate}</p>
                                                            :
                                                            <p className="yekan" style={{ textAlign: 'left', color: '#00000059' }}>{v.TodayTime} : {v.TodayDate}</p>
                                                        }
                                                    </div>
                                                    
                                                    {v.userSend ?
                                                        <p className="yekan" style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: '#fff', textAlign: 'right' }}>
                                                            <div className="yekan" dangerouslySetInnerHTML={{ __html: v.text }}  />
                                                        </p>
                                                        :
                                                        <p className="yekan" style={{ whiteSpace: 'pre-wrap', fontSize: 14, textAlign: 'left' }}>
                                                            {v.read ?
                                                                <img src='/read.png' style={{ width: 16 }} />

                                                                :
                                                                <img src='/unread.png' style={{ width: 16 }} />
                                                            }
                                                            <div className="yekan" dangerouslySetInnerHTML={{ __html: v.text }}  />

                                                            </p>
                                                    }

                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                    


                                </div>
                                </div>
                                {!this.state.ChatSelected.End &&
                                        
                                        <div style={{height:52}}>
                                        <div className="col-lg-12 col-12 yekan" style={{ textAlign: "center" }}>
                                            <div >
                                            <div style={{position:'relative'}}>
                                            
                                            <div className="emoji" style={this.state.showEmoji ? {display:'flex'} : {display:'none'}} onClick={(event)=>{
                                                
                                                let Editor = this.Editor;
                                                let cursorPosition = Editor.current.selectionStart
                                                let textBeforeCursorPosition = Editor.current.value.substring(0, cursorPosition)
                                                let textAfterCursorPosition = Editor.current.value.substring(cursorPosition, Editor.current.value.length)
                                                this.setState({
                                                    answer: textBeforeCursorPosition + event.target.innerText + textAfterCursorPosition
                                                })
                                            
                                            }}>
                                            <span>😁</span><span>😃</span><span>😅</span><span>😆</span><span class="ej">😇</span><span>😉</span><span>😂</span><span>🙂</span><span class="ej">🙃</span><span class="ej">🤣</span><span>😊</span><span>😍</span><span>😘</span><span>😋</span><span>😜</span><span class="ej">🤑</span><span class="ej">🤗</span><span class="ej">🤔</span><span>😐</span><span>😏</span><span class="ej">🙄</span><span>😔</span><span>😴</span><span>😪</span><span class="ej">🤒</span><span class="ej">🤕</span><span class="ej">🤢</span><span>😎</span><span class="ej">😕</span><span class="ej">🙁</span><span>😲</span><span>😢</span><span>😭</span><span>😱</span><span>😖</span><span>😓</span><span>😡</span><span>😤</span><span class="ej">🖐</span><span>👌</span><span>👆</span><span>👇</span><span>👍</span><span>👎</span><span>✋</span><span class="ej">🤝</span><span>🙏</span><span>👋</span><span>👏</span><span>💬</span><span>💔</span><span>💜</span><span>💖</span><span>👓</span><span>🎀</span><span>👶</span><span>👦</span><span>👧</span><span>🌎</span><span>👪</span><span>💎</span><span>💥</span><span>🚦</span><span>🚀</span><span>🕓</span><span>⚡</span><span>🎁</span><span>🎵</span><span>📕</span><span>📅</span><span>🐱</span><span>🏠</span><span>🎫</span><span>📞</span><span>💳</span><span>🔒</span><span>🌹</span>
                                            </div>
                                            <div style={{display:'flex',backgroundColor:'#fff',border:'1px solid #eee'}}>
                                                <div style={{width:'calc(100% - 80px)'}} >
                                                        <textarea ref={this.Editor} onKeyDown={(event)=>this._handleKeyDown(event)} className="iranyekanweblight" autoComplete="off"  type="text" value={this.state.answer} name="answer" onChange={(event)=>{
                                                        this.setState({answer: event.target.value})

                                                    }}  style={{textAlign:'right',height:36,border:0,width:'100%',padding:6}} required="true"/>
                                                </div>
                                                <div style={{width:80,padding:7}}>
                                                {!this.state.answer ? 
                                                  <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',paddingTop:10}}>
                                                    <button   onClick={()=>{this.setState({showEmoji:!this.state.showEmoji})}} style={{ backgroundColor:'transparent'}}> 
                                                        <img src="/emoji.png" style={{width:20}}  />
                                                    </button>
                                                    <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload}  ref={this.fileUpladElem} type="file" name="file1" style={{display:'none'}} />
                                                    <button   onClick={()=>{
                                                        this.fileUpladElem.current.click();
                                                    }} style={{ backgroundColor:'transparent'}}> 
                                                    <img src="/attach.png" style={{width:20}} />
                                                    </button>
                                                 </div>
                                                    
                                                :
                                                <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center',paddingTop:10}}>
                                                    <button   onClick={()=>{this.setState({showEmoji:!this.state.showEmoji})}} style={{ backgroundColor:'transparent'}}> 
                                                        <img src="/emoji.png" style={{width:20}}  />
                                                    </button>
                                                    <button onClick={this.SetAnswer} style={{ backgroundColor:'transparent'}}> 
                                                    <img src="/send.png" style={{width:20,transform:'rotate(180deg)'}}  />
                                                    </button>
                                                </div>
                                                }

                                                <div>
                                                 
                                              </div>
                                                
                                                

                                                
                                                </div>
                                            </div>

                                            </div>
                                            

                                            </div>
                                            
                                        </div>
                                        </div>

                                    }
                                    </div>
                                :
                                <div style={{textAlign:'center',marginTop:150}}>
                                    <i class="fas fa-comment-minus" style={{fontSize:60,marginBottom:60,color:'#eee'}}></i>
                                    <p className="yekan" style={{fontSize:25,color:'#eee'}}>گفتگویی را انتخاب کنبد</p>
                                </div>
                            }

                            </div>
                            <div className="col-2"  style={{height:'100%',background:'#fff',borderRight:'1px solid #eee',textAlign:'right'}}>
                            {this.state.ChatSelected.text &&


                                <div>
                                    <div style={{textAlign:'center',marginTop:50,marginBottom:40}} ><i class="fas fa-database" style={{fontSize:60,color:'orange'}}></i></div>
                                    <hr />
                                    {
                                        this.state.ChatSelected.user_detail && this.state.ChatSelected.user_detail[0] &&
                                        <div>
                                            <div><span className="yekan">نام : </span><span className="yekan">{this.state.ChatSelected.user_detail[0].name}</span></div>
                                            <div><span className="yekan">تلفن همراه : </span><span className="yekan">{this.state.ChatSelected.user_detail[0].mobile}</span></div>
                                            <div><span className="yekan">ایمیل : </span><span className="yekan">{this.state.ChatSelected.user_detail[0].mail}</span></div>

                                        </div>
                                    }
                                    <div><span className="yekan">مرورگر : </span><span className="yekan">{this.state.browser.name}</span></div>
                                    <div><span className="yekan">سیستم : </span><span className="yekan">{this.state.browser.platform}</span></div>
                                </div>
                                
                            }

                            </div>
                        </div>


                    </div>



                </div>
                <Sidebar visible={this.state.ShowContact} onHide={() => this.setState({
                    ShowContact:false
                })}>
                </Sidebar>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        username: state.username
    }
}
export default withRouter(
    connect(mapStateToProps)(Chat)
);

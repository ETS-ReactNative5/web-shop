import React, { Component, useRef } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import JoditEditor from "jodit-react";
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import { Link } from 'react-router-dom'


// fake data generator


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: "#fff",
    border:'1px solid #000',
    borderRadius:10,

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: "#fff",
    padding: grid,
    width: "100%"
});

const config = {
    readonly: false,
    buttons: ['bold', 'italic', 'underline','font', 'fontsize', 'hr','left',
    'center',
    'right',
    'justify','brush'],
    controls: {
    font: {
        list: {
            'yekan': 'yekan',
            'YekanBakhFaMedium':'YekanBakhFaMedium',
            'YekanBakhFaLight':'YekanBakhFaLight',
            'YekanBakhFaBold':'YekanBakhFaBold'
        }
    }
    }
}
class FirstPageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.state = {
            dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
            dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
            NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
            NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
            GridDataBlogs: [],
            selectedId: null,
            content: null,
            title: null,
            BlogId: null,
            address: null,
            tasks: [{ id: "sss" }, { id: "aaaa" }],
            FixPage: false,
            draft: false,
            page:"",
            loading: 0,
            items: null,
            pic1: this.Server.getAbsoluteUrl() + "/nophoto.png",
            pic2: this.Server.getAbsoluteUrl() + "/nophoto.png",
            pic3: this.Server.getAbsoluteUrl() + "/nophoto.png",
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl(1)
        }

        this.onDragEnd = this.onDragEnd.bind(this);
        this.FileUpload = this.FileUpload.bind(this);
        this.getItems = this.getItems.bind(this);
        this.item1 = React.createRef();


    }
    FileUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        let name = e.target.name;
        formData.append('name', name);
        formData.append('PagePics', "1");
        formData.append('ExtraFile', "1");
        if (!e.target.files[0]) {
            Alert.warning("ارتباط با سرور برقرار نشد مجددا امتحان کنید", 500);
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
                Alert.success('عملیات با موفقیت انجام شد', 5000);
                this.setState({
                    loading: 0
                })
                if (name == "file5-bg")
                    this.setState({
                        bg5: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file5")
                    this.setState({
                        pic5: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file4-bg")
                    this.setState({
                        bg4: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file4")
                    this.setState({
                        pic4: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file3-bg")
                    this.setState({
                        bg3: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file3")
                    this.setState({
                        pic3: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file2-bg")
                    this.setState({
                        bg2: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file2")
                    this.setState({
                        pic2: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file1-bg")
                    this.setState({
                        bg1: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                if (name == "file1")
                    this.setState({
                        pic1: this.state.absoluteUrl + response.data.replace(/\\/gi, "/").split("public")[1]
                    })
                this.init();


            })
            .catch((error) => {
                this.setState({
                    loading: 0
                })
                Alert.error('عملیات انجام نشد', 5000);
                console.log(error);
            });
    }
    getItems(count) {
        Array.from({ length: count }, (v, k) => k).map(k => ({
            id: `item-${k}`,
            content: `item ${k}`
        }));
    }
    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );
        this.setState({
            items
        });
    }
    componentDidMount() {
        this.getPage()
    }
    init() {
        this.setState({
            items: [{
                id: "1",
                content: <div>
                    <div>
                        <div className="group" style={{display:'flex',alignItems:'center'}}>
                          <input inputId="IsTitle" type="checkbox" onChange={e => {this.setState({hidden1:!this.state.hidden1});
                            setTimeout(()=>{
                                debugger;
                                this.init();
                    
                            },0)
                            }} checked={this.state.hidden1} value={this.state.hidden1}    style={{ marginBottom: 10,width:50,height:25 }} />
                          <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 50 }}>عدم نمایش</label>
                    </div>
                   </div>
                    <div className="row" style={{ position: 'relative', backgroundImage: `url(${this.state.bg1})` }} >
                    <div className="col-12" style={{backgroundColor:'#000',color:'#fff'}}>
                        <div style={{ textAlign: 'left' }}>
                            <label>تصویر پس زمینه</label>
                            <input className=" yekan" placeholder="background" autoComplete="off" onChange={this.FileUpload} type="file" name="file1-bg" />

                        </div>
                    </div>
                    <div className="col-12" >
                        <p className=" yekan">عنوان</p>

                        <JoditEditor
                            value={this.state.content1_1}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content1_1: value })
                            }}

                        />
                    </div>
                    <div className="col-3" >
                        <p className=" yekan">تصویر</p>
                        <input className=" yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file1" />
                        <img src={this.state.pic1} />
                    </div>
                    <div className="col-9" >
                        <p className=" yekan">متن</p>
                        <JoditEditor
                            value={this.state.content1_2}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content1_2: value })
                            }}
                        /></div>

                </div>
                <div className="row">
                   <div className="col-12">
                   <div className="group">
                    <input className="form-control irsans" style={{direction:'ltr'}} autoComplete="off" type="text" value={this.state.link1} name="link1" onChange={(event)=>this.setState({link1:event.target.value})} required="true" />
                    <label>لینک</label>
                    </div>
                   </div>    


                </div>
                </div>
            },
            {
                id: "2",
                content: <div>
                    <div>
                        <div className="group" style={{display:'flex',alignItems:'center'}}>
                          <input inputId="IsTitle" type="checkbox" onChange={e => {this.setState({hidden2:!this.state.hidden2});
                            setTimeout(()=>{
                                debugger;
                                this.init();
                    
                            },0)
                            }} checked={this.state.hidden2} value={this.state.hidden2}    style={{ marginBottom: 10,width:50,height:25 }} />
                          <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 50 }}>عدم نمایش</label>
                    </div>
                   </div>
                    <div className="row" style={{ position: 'relative', backgroundImage: `url(${this.state.bg2})` }} >
                    <div className="col-12" style={{backgroundColor:'#000',color:'#fff'}}>
                        <div style={{ textAlign: 'left' }}>
                            <label>تصویر پس زمینه</label>
                            <input className=" yekan" placeholder="background" autoComplete="off" onChange={this.FileUpload} type="file" name="file2-bg" />

                        </div>
                    </div>
                    <div className="col-12" >
                        <p className=" yekan">عنوان</p>

                        <JoditEditor
                            value={this.state.content2_1}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content2_1: value })
                            }}

                        />
                    </div>
                    <div className="col-9" >
                        <p className=" yekan">متن</p>
                        <JoditEditor
                            value={this.state.content2_2}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content2_2: value })
                            }}
                        /></div>
                    <div className="col-3" >
                        <p className=" yekan">تصویر</p>
                        <input className=" yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file2" />
                        <img src={this.state.pic2} />
                    </div>
                    

                </div>
                <div className="row">
                   <div className="col-12">
                   <div className="group">
                    <input className="form-control irsans" autoComplete="off" style={{direction:'ltr'}} type="text" value={this.state.link3} name="link3" onChange={(event)=>this.setState({link3:event.target.value})} required="true" />
                    <label>لینک</label>
                    </div>
                   </div>    


                </div>
                </div>
            },
            {
                id: "3",
                content: <div>
                    <div>
                        <div className="group" style={{display:'flex',alignItems:'center'}}>
                          <input inputId="IsTitle" type="checkbox" onChange={e => {this.setState({hidden3:!this.state.hidden3});
                            setTimeout(()=>{
                                debugger;
                                this.init();
                    
                            },0)
                            }} checked={this.state.hidden3} value={this.state.hidden3}    style={{ marginBottom: 10,width:50,height:25 }} />
                          <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 50 }}>عدم نمایش</label>
                    </div>
                   </div>
                    <div className="row" style={{ position: 'relative', backgroundImage: `url(${this.state.bg3})` }} >
                    <div className="col-12" style={{backgroundColor:'#000',color:'#fff'}}>
                        <div style={{ textAlign: 'left' }}>
                            <label>تصویر پس زمینه</label>
                            <input className=" yekan" placeholder="background" autoComplete="off" onChange={this.FileUpload} type="file" name="file3-bg" />

                        </div>
                    </div>
                    <div className="col-12" >
                        <p className=" yekan">عنوان</p>

                        <JoditEditor
                            value={this.state.content3_1}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content3_1: value })
                            }}

                        />
                    </div>
                    <div className="col-3" >
                        <p className=" yekan">تصویر</p>
                        <input className=" yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file3" />
                        <img src={this.state.pic3} />
                    </div>
                    <div className="col-9" >
                        <p className=" yekan">متن</p>
                        <JoditEditor
                            value={this.state.content3_2}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content3_2: value })
                            }}
                        /></div>

                </div>
                <div className="row">
                   <div className="col-12">
                   <div className="group">
                    <input className="form-control irsans" autoComplete="off" style={{direction:'ltr'}} type="text" value={this.state.link2} name="link2" onChange={(event)=>this.setState({link2:event.target.value})} required="true" />
                    <label>لینک</label>
                    </div>
                   </div>    


                </div>
                </div>
            },
            {
                id: "4",
                content: <div>
                    <div>
                        <div className="group" style={{display:'flex',alignItems:'center'}}>
                          <input inputId="IsTitle" type="checkbox" onChange={e => {this.setState({hidden4:!this.state.hidden4});
                            setTimeout(()=>{
                                debugger;
                                this.init();
                    
                            },0)
                            }} checked={this.state.hidden4} value={this.state.hidden4}    style={{ marginBottom: 10,width:50,height:25 }} />
                          <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 50 }}>عدم نمایش</label>
                    </div>
                   </div>
                   <div className="row" style={{ position: 'relative', backgroundImage: `url(${this.state.bg4})` }} >
                    <div className="col-12" style={{backgroundColor:'#000',color:'#fff'}}>
                        <div style={{ textAlign: 'left' }}>
                            <label>تصویر پس زمینه</label>
                            <input className=" yekan" placeholder="background" autoComplete="off" onChange={this.FileUpload} type="file" name="file4-bg" />

                        </div>
                    </div>
                    <div className="col-3" >
                        <p className=" yekan">تصویر</p>
                        <input className=" yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file4" />
                        <img src={this.state.pic4} style={{height:400}} />
                    </div>
                    
                    <div className="col-9" >
                        <p className=" yekan">متن</p>
                        <JoditEditor
                            value={this.state.content4_2}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content4_2: value })
                            }}
                        /></div>
                       

                </div>
                <div className="row">
                   <div className="col-12">
                   <div className="group">
                    <input className="form-control irsans" autoComplete="off" style={{direction:'ltr'}} type="text" value={this.state.link4} name="link4" onChange={(event)=>this.setState({link4:event.target.value})} required="true" />
                    <label>لینک</label>
                    </div>
                   </div>    


                </div>
                </div>
            },
            {
                id: "5",
                content: <div>
                    <div>
                        <div className="group" style={{display:'flex',alignItems:'center'}}>
                          <input inputId="IsTitle" type="checkbox" onChange={e => {this.setState({hidden5:!this.state.hidden5});
                            setTimeout(()=>{
                                debugger;
                                this.init();
                    
                            },0)
                            }} checked={this.state.hidden5} value={this.state.hidden5}    style={{ marginBottom: 10,width:50,height:25 }} />
                          <label htmlFor="IsTitle" className="p-checkbox-label yekan" style={{ paddingRight: 50 }}>عدم نمایش</label>
                    </div>
                   </div>
                   <div className="row" style={{ position: 'relative', backgroundImage: `url(${this.state.bg5})` }} >
                    <div className="col-12" style={{backgroundColor:'#000',color:'#fff'}}>
                        <div style={{ textAlign: 'left' }}>
                            <label>تصویر پس زمینه</label>
                            <input className=" yekan" placeholder="background" autoComplete="off" onChange={this.FileUpload} type="file" name="file5-bg" />

                        </div>
                    </div>
                    
                    <div className="col-9" >
                        <p className=" yekan">متن</p>
                        <JoditEditor
                            value={this.state.content5_2}
                            config={config}
                            tabIndex={1} // tabIndex of textarea
                            onChange={(value) => {
                                if (value)
                                    this.setState({ content5_2: value })
                            }}
                        /></div>
                    <div className="col-3" >
                        <p className=" yekan">تصویر</p>
                        <input className=" yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file5" />
                        <img src={this.state.pic5} style={{height:400}} />
                    </div>
                    
                    

                </div>
                <div className="row">
                   <div className="col-12">
                   <div className="group">
                    <input className="form-control irsans" style={{direction:'ltr'}} autoComplete="off" type="text" value={this.state.link5} name="link5" onChange={(event)=>this.setState({link5:event.target.value})} required="true" />
                    <label>لینک</label>
                    </div>
                   </div>    


                </div>
                </div>
            }]
        })
    }
    SetChange() {

        let that = this;
        let req = [];
        let count=0;
        let temp={};
        for (let i = 0; i < this.state.items.length; i++) {
            count++;
            temp["bg"+count]=this.state["bg"+this.state.items[i].id];
            temp["pic"+count]=this.state["pic"+this.state.items[i].id];
            temp["link"+count]=this.state["link"+this.state.items[i].id];
            temp["hidden"+count]=this.state["hidden"+this.state.items[i].id];
            temp["content"+count+"_1"]=this.state["content"+this.state.items[i].id+"_1"];
            temp["content"+count+"_2"]=this.state["content"+this.state.items[i].id+"_2"];
            if (this.state.items[i].id == "1") {
                
                req.push({
                    id:count,
                    content:`<div class='row' style="background-image:url(${this.state.bg1})"><div class='col-12' style='margin-bottom:50px'><p>${this.state.content1_1}</p></div><div class='col-md-1 col-0' ></div><div class='col-md-3 col-12' style='padding:15px' ><img src='${this.state.pic1}' style='width:100%' /></div><div class='col-md-7 col-12' style='padding:15px' >${this.state.content1_2}</div><div class='col-md-1 col-0' ></div></div></div>`
                })

            }
            if (this.state.items[i].id == "2") {
                
                req.push({
                    id:count,
                    content:`<div class='row' style="background-image:url(${this.state.bg2})"><div class='col-12' style='margin-bottom:50px'><p>${this.state.content2_1}</p></div><div class='col-md-1 col-0' ></div><div class='col-md-7 col-12' style='padding:15px' >${this.state.content2_2}</div><div class='col-md-3 col-12' style='padding:15px' ><img src='${this.state.pic2}' style='width:100%' ></div><div class='col-md-1 col-0' ></div></div></div>`
                })
            }
            if (this.state.items[i].id == "3") {
                
                req.push({
                    id:count,
                    content:`<div class='row' style="background-image:url(${this.state.bg3})"><div class='col-12' style='margin-bottom:50px'><p>${this.state.content3_1}</p></div><div class='col-md-1 col-0' ></div><div class='col-md-3 col-12' style='padding:15px' ><img src='${this.state.pic3}' style='width:100%' /></div><div class='col-md-7 col-12' style='padding:15px' >${this.state.content3_2}</div><div class='col-md-1 col-0' ></div></div></div>`
                })
            }
            if (this.state.items[i].id == "4") {
                
                req.push({
                    id:count,
                    content:`<div class='row' style="background-image:url(${this.state.bg4})"><div class='col-md-1 col-0' ></div><div class='col-md-4 col-12' ><img src='${this.state.pic4}' style='width:100%' /></div><div class='col-md-6 col-12'  >${this.state.content4_2}</div><div class='col-md-1 col-0' ></div></div></div>`
                })
            }
            if (this.state.items[i].id == "5") {
                
                req.push({
                    id:count,
                    content:`<div class='row' style="background-image:url(${this.state.bg5})"><div class='col-md-1 col-0' ></div><div class='col-md-6 col-12'  >${this.state.content5_2}</div><div class='col-md-4 col-12' ><img src='${this.state.pic5}' style='width:100%' /></div><div class='col-md-1 col-0' ></div></div></div>`
                })
            }

        }
        debugger;
        let param = {
            token: localStorage.getItem("api_token"),
            page:that.state.page,
            content: req,
            items:temp
        };
        that.setState({
            loading: 1
        })
        let SCallBack = function (response) {
            Alert.success('عملیات با موفقیت انجام شد', 5000);
            that.setState({
                loading: 0
            })
        };
        let ECallBack = function (error) {
            Alert.danger('عملیات انجام نشد', 5000);
            that.setState({
                loading: 0
            })
        }
        this.Server.send("AdminApi/setPageLayout", param, SCallBack, ECallBack)
    }
    getPage() {
        let that = this;
        
        let param = {
          token: localStorage.getItem("api_token")
        };
        that.setState({
          loading: 1
        })
        let SCallBack = function (response) {
            let resp={};
            let pageNameList = [];

            for(let i=0;i<response.data.result.length;i++){
                pageNameList.push({name:response.data.result[i].page})
            }
            resp = response.data.result[0];
            that.setState({
                pagesLayout:response.data.result,
                pageNameList:pageNameList,
                page:response.data.result[0].page,
                PageLink:"Pages?id="+(pageNameList[0] ? pageNameList[0].name : "first") + ""
            })
            if( resp ){
                that.Layout(response.data.result[0]);
            }
            that.setState({
                loading: 0
            })
    
        };
        let ECallBack = function (error) {
          that.setState({
            loading: 0
          })
          console.log(error)
        }

        this.Server.send("AdminApi/getPageLayout", param, SCallBack, ECallBack)
      }
      Layout(resp){
        debugger;

        this.setState({
            
            pic1: resp.items?.pic1||"",
            pic2: resp.items?.pic2||"",
            pic3: resp.items?.pic3||"",
            pic4: resp.items?.pic4||"",
            pic5: resp.items?.pic5||"",
            link1:resp.items?.link1||"",
            link2:resp.items?.link2||"",
            link3:resp.items?.link3||"",
            link4:resp.items?.link4||"",
            link5:resp.items?.link5||"",
            hidden1:resp.items?.hidden1||false,
            hidden2:resp.items?.hidden2||false,
            hidden3:resp.items?.hidden3||false,
            hidden4:resp.items?.hidden4||false,
            hidden5:resp.items?.hidden5||false,
            bg1: resp.items?.bg1||"",
            bg2: resp.items?.bg2||"",
            bg3: resp.items?.bg3||"",
            bg4: resp.items?.bg4||"",
            bg5: resp.items?.bg5||"",
            content1_1:resp.items?.content1_1||"",
            content1_2:resp.items?.content1_2||"",
            content2_1:resp.items?.content2_1||"",
            content2_2:resp.items?.content2_2||"",
            content3_1:resp.items?.content3_1||"",
            content3_2:resp.items?.content3_2||"",
            content4_2:resp.items?.content4_2||"",
            content5_2:resp.items?.content5_2||"",

          })
          setTimeout(()=>{
            this.init();

          },0)

      }
      createPage(){
        for(let p of this.state.pageNameList){
            if(p.name == this.state.pageName)
                return; 
        }
        let that = this;
        
        let param = {
          token: localStorage.getItem("api_token"),
          page:this.state.pageName
        };
        that.setState({
          loading: 1
        })
        let SCallBack = function (response) {
            Alert.success('عملیات با موفقیت انجام شد', 5000);

            that.setState({
                loading: 0
              })
              that.getPage()
    
        };
        let ECallBack = function (error) {
          that.setState({
            loading: 0
          })
          console.log(error)
        }

        this.Server.send("AdminApi/createLayoutPage", param, SCallBack, ECallBack)

      }
    render() {

        return (
            <div style={{ direction: 'rtl' }}>
                {this.state.loading == 1 &&
                    <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
                        <Loader content="لطفا صبر کنید ..." className="yekan" />
                    </div>
                }
                <div className="row justify-content-center">

                    <div className="col-12" style={{ background: '#fff' }}>
                        <Panel header="ایجاد صفحه جدید" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                        <div className="row">
                            <div className="col-12">
                            <div className="group">
                                <input className="form-control irsans" style={{direction:'ltr'}} autoComplete="off" type="text" value={this.state.pageName} name="pageName" onChange={(event)=>this.setState({pageName:event.target.value})} required="true" />
                                <label>نام لاتین صفحه</label>
                                </div>
                            </div>    
                            <div className="col-12">
                                    <button className="btn btn-primary irsans" onClick={() => this.createPage()} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}> ایجاد صفحه </button>

                            </div>


                            </div>
                        </Panel>
                        <Panel header="مدیریت اجزاء صفحه" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                            
                            <div className="row">
                            <div className="col-lg-4">
                              <label className="labelNoGroup irsans">صفحه جاری</label>
                              <select className="custom-select irsans" id="company" name="company" value={this.state.page} onChange={(event) => {
                               for(let i=0;i<this.state.pagesLayout.length;i++){
                                    this.setState({page: event.target.value,PageLink:"Pages/?id="+event.target.value+"" })

                                    if(this.state.pagesLayout[i].page == event.target.value){
                                        this.Layout(this.state.pagesLayout[i]) 
                                    }
                                }
                                }} style={{ marginBottom: 20 }} >
                                {
                                    this.state.pageNameList && this.state.pageNameList.map((v, i) => {
                                        return (<option value={v.name} >{v.name}</option>)
                                    })
                                }
                              </select>
                             </div>
                             <div className="col-lg-4">
                             <div className="group">
                                <input className="form-control irsans" disabled style={{direction:'ltr'}} autoComplete="off" type="text" value={this.state.PageLink} name="PageLink" onChange={(event)=>this.setState({PageLink:event.target.value})} required="true" />
                                <label>لینک صفحه</label>
                                </div>
                             </div>
                                <DragDropContext
                                    onBeforeCapture={this.onBeforeCapture}
                                    onBeforeDragStart={this.onBeforeDragStart}
                                    onDragStart={this.onDragStart}
                                    onDragUpdate={this.onDragUpdate}
                                    onDragEnd={this.onDragEnd}
                                >
                                    <Droppable droppableId="droppable">
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                            >
                                                {this.state.items && this.state.items.map((item, index) => (
                                                    
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style
                                                                    )}
                                                                >
                                                                
                                                                {item.content}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                </DragDropContext>
                                <div>
                                    <button className="btn btn-primary irsans" onClick={() => this.SetChange()} style={{ width: "200px", marginTop: "5px", marginBottom: "5px" }}> اعمال </button>

                                </div>

                            </div>
                        </Panel>


                    </div>

                </div>

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
    connect(mapStateToProps)(FirstPageLayout)
);

import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';


import JoditEditor from "jodit-react";
import { Sidebar } from 'primereact/sidebar';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
const config = {
    readonly: false // all options from https://xdsoft.net/jodit/doc/
}
class Forms_Details extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.selectedComponentChange = this.selectedComponentChange.bind(this);
        this.onHideFormsDialog = this.onHideFormsDialog.bind(this);

        this.SetDetails = this.SetDetails.bind(this);



        this.state = {
            layout: 'list',
            dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
            dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
            NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
            NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
            GridDataComponents: [],
            selectedId: null,
            selectedComponent: null,
            visibleManageComponent: false,
            visibleManageMaps: false,
            mapSelection: "",
            mapId: null,
            mapList: [],
            mapListTemp: [],
            CIds: [],
            SelectedComponents: [],
            HasErrorForMaps: null,
            FName: null,
            LName: null,
            CountArr: [],
            Count: 0,
            Address: null,
            Icon: null,
            ComponentId: null,
            loading: 0,
            user_Id: null

        }


    }
    componentDidMount() {
        let param = {
            token: localStorage.getItem("api_token"),
        };
        this.setState({
            loading: 1
        })
        let that = this;
        let SCallBack = function (response) {
            that.setState({
                user_Id: response.data.authData.userId,
                loading: 0
            })

            that.GetComponents();

        };
        let ECallBack = function (error) {
            that.setState({
                loading: 0
            })
            console.log(error)
        }
        this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
    }

    SetDetails() {
        let that = this;
        let Count = 0;
        let Details = [];
        for (let i = 0; i < this.state.Count; i++) {
            Details.push({ value: Math.pow(2, i), desc: this.state["desc_" + i] })
        }
        let param = {
            token: localStorage.getItem("api_token"),
            selectedId: this.state.selectedId,
            Details: Details,
        };
        this.setState({
            loading: 1
        })
        let SCallBack = function (response) {
            that.onHideFormsDialog();
            that.GetComponents();
            that.setState({
                loading: 0
            })
            Alert.success('عملیات با موفقیت انجام شد', 5000);
        };
        let ECallBack = function (error) {
            console.log(error)
            that.setState({
                loading: 0
            })
            Alert.error('عملیات انجام نشد', 5000);
        }
        this.Server.send("AdminApi/SetComponentsDetails", param, SCallBack, ECallBack)
    }
    onHideFormsDialog(event) {
        let state={};
        for(let i=0;i<200;i++){
            state["value_" + i] = undefined;
            state["desc_" + i] = undefined;
        }
        this.setState({
            visibleManageComponent: false,
            selectedId: null,
            CountArr:[],
            Count:0,
            ...state

        });

    }
    selectedComponentChange(value) {
        let that = this;
        var p = [];
        let state = [];
        if (value.Details) {
            value.Details.map(function (v, i) {
                state["desc_" + i] = v.desc;
            })
            let Count = value.Details.length;
            this.setState({
                Count: Count
            })
            let that = this;
            let Arr = Array.from(Array(parseInt(Count)).keys())
            that.setState({
                CountArr: Arr
            })
        }
        
        this.setState({
            selectedId: value._id,
            visibleManageComponent: true,
            ...state

        })

    }
    GetComponents() {
        let that = this;
        debugger;
        let param = {
            token: localStorage.getItem("api_token"),
            GetAll: 1
        };
        this.setState({
            loading: 1
        })
        let SCallBack = function (response) {

            that.setState({
                GridDataComponents: response.data.result
            })
            that.setState({
                loading: 0
            })
        };
        let ECallBack = function (error) {
            console.log(error)
            that.setState({
                loading: 0
            })
        }
        this.Server.send("AdminApi/GetComponents", param, SCallBack, ECallBack)
    }
    render() {
        const footer = (
            <div>
                <button className="btn btn-primary irsans" onClick={this.SetDetails} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

            </div>
        );
        return (

            <div style={{ direction: 'rtl' }}>
                {this.state.loading == 1 &&
                    <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
                        <Loader content="لطفا صبر کنید ..." className="yekan" />
                    </div>
                }
                <div className="row justify-content-center">

                    <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>

                        <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >فرم های سیستم مدیریت</span></div>

                        <DataTable responsive value={this.state.GridDataComponents} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
                            <Column field="CId" header="شماره کامپوننت" className="irsans" style={{ textAlign: "center" }} />
                            <Column field="FName" header="نام فارسی" className="irsans" style={{ textAlign: "center" }} />
                            <Column field="LName" header="نام لاتین" className="irsans" style={{ textAlign: "center" }} />
                            <Column field="Url" header="آدرس" className="irsans" style={{ textAlign: "center" }} />

                        </DataTable>
                    </div>

                </div>


                <Dialog header="اصلاح جزئیات" visible={this.state.visibleManageComponent} style={{ width: '700px' }} footer={footer} minY={70} onHide={this.onHideFormsDialog} maximizable={true} maximized={true}>
                    <div className="col-lg-12" style={{ marginTop: 20, marginRight: 5, textAlign: 'right' }}>
                        <button className="irsans" onClick={() => {
                            let Count = this.state.Count + 1;
                            this.setState({
                                Count: Count
                            })
                            let that = this;
                            let Arr = Array.from(Array(parseInt(Count)).keys())
                            that.setState({
                                CountArr: Arr
                            })
                        }
                        } style={{ textAlign: 'right', cursor: 'pointer' }}><i className="fa fa-plus" /><span style={{ marginRight: 10 }}> اضافه کردن ردیف جدید </span>
                        </button>

                    </div>
                    <div className="col-lg-12" >
                        {this.state.CountArr.map((item, index) => {
                            let value = Math.pow(2, index);
                            return (
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="group">
                                            <input className="form-control irsans" disabled autoComplete="off" type="text" id={"value_" + index} name={"value_" + index} value={value} onChange={(event) => { this.setState({ ["value_" + index]: event.target.value }) }} required="true" />
                                            <label>شماره</label>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="group">
                                            <input className="form-control irsans" autoComplete="off" type="text" id={"desc_" + index} name={"desc_" + index} value={this.state["desc_" + index]} onChange={(event) => { this.setState({ ["desc_" + index]: event.target.value }) }} required="true" />
                                            <label>عنوان</label>
                                        </div>
                                    </div>
                                </div>
                            )

                        })
                        }
                    </div>
                </Dialog>

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
    connect(mapStateToProps)(Forms_Details)
);

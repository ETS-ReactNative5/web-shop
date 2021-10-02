import React, { Component } from 'react';
import './Category.css';
import Server from './Server.js'
import axios from 'axios'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { withRouter, Route, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


class Company extends React.Component {
    constructor(props) {
        super(props);
        this.Server = new Server();
        this.state = {
            id: this.props.location.search.split("id=")[1],
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }

    }
    componentDidMount() {
        this.setState({
            loading: true
        })
        this.getSettings();

    }
    getSettings() {
        let that = this;
        that.Server.send("AdminApi/getSettings", {}, function (response) {

            if (response.data.result) {
                that.setState({
                    ProductBase: response.data.result[0] ? response.data.result[0].ProductBase : false,
                    SaleFromMultiShops: response.data.result[0] ? response.data.result[0].SaleFromMultiShops : false,
                    Theme: response.data.result[0] ? response.data.result[0].Theme : "1"

                })
            }
           
        }, function (error) {
        })


    }
    persianNumber(input) {
        var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
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
    render() {
        
        return (

            <div>
                ssssssss
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
    connect(mapStateToProps)(Company)
);
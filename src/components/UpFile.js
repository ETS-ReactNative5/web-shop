import React, { Component } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios'  
import { ProgressBar } from 'primereact/progressbar';
import Server from './Server.js'
import { Alert } from 'rsuite';

class UpFile extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FileUpload = this.FileUpload.bind(this);
    this.uploadRef = React.createRef();

    this.state = {
      uploadImage: props.uploadImage || "",
      label: props.label,
      buttonLabel: props.buttonLabel,
      ContainerClass: props.ContainerClass,
      className: props.className,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
  }
  FileUpload(e) {
    debugger;
    e.preventDefault();

    const formData = new FormData();
    let name = e.target.name;
    formData.append('name', name);
    formData.append('PagePics', "1");
    formData.append('ExtraFile', "1");
    formData.append('typeOfFile', "1");
    if(!e.target.files[0]){
      Alert.warning("ارتباط با سرور برقرار نشد مجددا امتحان کنید",500);
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
        this.setState({
          uploadImage: this.state.absoluteUrl + response.data.split("public")[1]

        })
        debugger;
        this.props.callback({uploadImage:this.state.absoluteUrl + response.data.split("public")[1]});
        //Alert.success('عملیات با موفقیت انجام شد', 5000);
        this.setState({
          loading: 0
        })
        

      })
      .catch((error) => {
        this.setState({
          loading: 0
        })
        //Alert.error('عملیات انجام نشد', 5000);
        console.log(error);
      });
  }
  render() {
    return (
        <div className={this.props.className||"col-lg-8 col-12 mt-3"} style={{ display: 'flex',flexDirection:'column', justifyContent: 'space-between',height:200, background: '#fff', alignItems: 'center' }} >
            <div className="row" style={{width:'100%',border:'1px solid #ced4da',padding:8,borderRadius:8}}>
            <div className="col-lg-6 col-12" >
            <div style={{marginTop:30}}>
              <div className="title">{this.state.label}</div>
            </div>
            <div style={{marginTop:70}}>
              <input className="d-none"  id="uploadRef" ref={this.uploadRef} autoComplete="off" onChange={this.FileUpload} type="file" name="file" />
              <Button label={this.state.buttonLabel} style={{ width: '100%' }} onClick={() => {
                this.uploadRef.current.click();
                return false;
              }} />
            </div>
            </div>
            <div className="col-lg-6 col-12" >

            {(this.state.uploadName || this.state.uploadImage) &&
          <div className={this.props.className||"col-lg-8 col-12 mt-3"} style={{ background: '#fff' }}>
            <div className="row" style={{  padding: 10 }}>
              <div className="col-12">
                <img src={this.state.uploadImage} style={{ height: 150 }} />
              </div>
              <div className="col-7">
                <div className="small-title">
                  {this.state.uploadName}
                </div>
                <div className="small-title">
                  {this.state.uploadSize}
                </div>
              </div>
            </div>
            {this.state.uploadName &&
              <div className="mt-2 mb-2">
                <ProgressBar value={this.state.percentageValue} />
              </div>
            }
            
          </div>
        }
          </div>
            </div>
            
          </div>

        
        


    )
  }
}


export default UpFile;
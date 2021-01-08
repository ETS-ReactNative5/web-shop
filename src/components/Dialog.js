import React, { Component } from 'react';
import axios from 'axios'  
import {BrowserRouter , Route,withRouter,Redirect} from 'react-router-dom'
import './Dialog.css' 
class Dialog extends React.Component {
  constructor(props){
    super(props);
		this.handleClickButton = this.handleClickButton.bind(this);
	}
	handleClickButton(){

	}
 

    render(){

        return (
					<div>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal" onClick={this.handleClickButton}>
  Open modal
</button>

<div className="modal show" id="myModal">
  <div className="modal-dialog">
    <div className="modal-content">

      <div className="modal-header">
        <h4 className="modal-title">Modal Heading</h4>
        <button type="button" className="close" data-dismiss="modal">&times;</button>
      </div>

      <div className="modal-body">
        Modal body..
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>
</div>
        )
    }
}
export default Dialog;
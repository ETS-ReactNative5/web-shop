import React, { Component } from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component {
   constructor(props){
     super(props);
     this.state={
        isLoading:false
     }

   }
 
  
 
}
const mapStateToProps = (state) => {
   return{
      count : 90
   }
}
export default connect(mapStateToProps)(Counter);
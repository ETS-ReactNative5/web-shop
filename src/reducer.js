    
const initialState = {
    CartNumber: 0,
    off:0,
    credit:0
}

function reducer(state = initialState , action){

   
    switch(action.type){    
       case "LoginTrueUser":{
           localStorage.setItem("CartNumber",action.CartNumber);
           localStorage.setItem("off",action.off);
           localStorage.setItem("credit",action.credit);

           return {
                CartNumber:action.CartNumber,
                off:action.off,
                credit:action.credit
           } 
           break;        
       }
       case "LoginTrueAdmin":{
            return {
                username:action.admin.username
           }
        break;        
    }
       default:{
           return initialState;
       }
   }
}
export default reducer;
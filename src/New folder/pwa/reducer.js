
const initialState = {
    username: null,
    ip: null,
    account: null,
    place: null,
    placeName: null,
    fullname: null,
    Address: null,
    mobile:null,
    LoginAnia:null
}

function reducer(state = initialState, action) {


    switch (action.type) {
        case "LoginTrue": {
            return {
                username: action.username,
                password: action.password,
                ip: action.ip,
                account: action.account,
                place: action.place,
                placeName: action.Logo,
                fullname: action.fullname,
                Address: action.Address,
                mobile: action.mobile,
                LoginAnia: action.LoginAnia

            }
            break;
        }
        default: {
            return initialState;
        }
    }
}
export default reducer;
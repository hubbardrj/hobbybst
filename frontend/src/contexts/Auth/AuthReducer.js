import * as actionTypes from './AuthActionTypes';

let user = JSON.parse(localStorage.getItem("currentUser"))
  ? localStorage.getItem("currentUser")
  : "";
let token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";
// let expirationDate = localStorage.getItem("expirationDate")
//   ? JSON.parse(localStorage.getItem("expirationDate")).auth_token
//   : "";

export const initialState = {
  user: "" || user,
  token: "" || token,
  csrf: null,
  //expirationDate: "" || expirationDate,
  isLoggedin: false,
  loading: true,
  errorMessage: null
};
 
export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...initialState,
        loading: true
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.token,
        isLoggedin: true,
        loading: false,
        errorMessage: null
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...initialState,
        user: "",
        token: "",
        csrf: action.payload.csrf,
        isLoggedin: false,
        loading: false,
        errorMessage: null
      };
 
    case actionTypes.AUTH_FAIL:
      return {
        ...initialState,
        loading: false,
        isLoggedin: false,
        errorMessage: action.error
      };
 
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
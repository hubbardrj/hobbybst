import * as actionTypes from './AuthActionTypes';
import * as settings from '../../settings';
import http from "../../services/http-common";

const SESSION_DURATION = settings.SESSION_DURATION;

const getCSRF = (dispatch) => {
    http().get("/auth/csrf/", {
      credentials: "include",
    })
    .then((res) => {
        console.log(res);
      let csrfToken = res.headers['x-csrftoken'];
      dispatch({ type: actionTypes.SET_CSRF, payload:{csrf:csrfToken}});
    })
    .catch((err) => {
      console.log(err);
    });
  }

export const authLogin = (dispatch, loginPayload) => {
    try {
        dispatch({ type: actionTypes.AUTH_START});
        http().post("/auth/login/", {
            username: loginPayload.username,
            password: loginPayload.password
        }, 
        {
            headers: {"X-CSRFToken": loginPayload.csrf,}
        })
        .then(res => {
            const key = res.data.key;
            const currentUser = res.data.user;
            const expirationDate = new Date(new Date().getTime() + SESSION_DURATION );
            localStorage.setItem('token', key);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('currentUser', JSON.stringify(res.data.user))
            dispatch({ type: actionTypes.AUTH_SUCCESS, payload:{token:key, user:currentUser}});
            //dispatch(authCheckTimeout(SESSION_DURATION));
        })
        .catch(error => {
            if (error.response) {
                dispatch({ type: actionTypes.AUTH_FAIL, error: 'Unable to login with the supplied credentials' });
            } else {
                dispatch({ type: actionTypes.AUTH_FAIL, error: 'An Unknown Error Occured' });
            }
        });
    } catch (error) {
        dispatch({ type: actionTypes.AUTH_FAIL, error: error });
    }
}
export const googleAuthLogin = (dispatch, accesstoken) => {
    try {
        dispatch({ type: actionTypes.AUTH_START});
        http().post("/auth/google/", {
            access_token: accesstoken,
        })
        .then(res => {
            console.log(res);
            const key = res.data.key;
            const currentUser = res.data.user;
            const expirationDate = new Date(new Date().getTime() + SESSION_DURATION );
            localStorage.setItem('token', key);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('currentUser', JSON.stringify(res.data.user))
            dispatch({ type: actionTypes.AUTH_SUCCESS, payload:{token:key, user:currentUser}});
        })
        .catch(error => {
            if (error.response) {
                dispatch({ type: actionTypes.AUTH_FAIL, error: 'Unable to login with the supplied credentials' });
            } else {
                dispatch({ type: actionTypes.AUTH_FAIL, error: 'An Unknown Error Occured' });
            }
        });
    } catch (error) {
        dispatch({ type: actionTypes.AUTH_FAIL, error: error });
    }
}
export const logout = (dispatch) => {
    const token = localStorage.getItem('token');
    dispatch({ type: actionTypes.AUTH_LOGOUT, payload:{csrf: getCSRF()} });
    if (token === undefined){
        localStorage.removeItem('currentUser');
        localStorage.removeItem('expirationDate');
    } else {
        http().post('/auth/logout/', {
        }).then(res => {console.log(res)}).catch(err => {console.log(err)});
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
    }
}
export const authCheckState = (dispatch) => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("checking state");
    if (!token) {
        dispatch({ type: actionTypes.AUTH_LOGOUT, payload:{csrf: getCSRF(dispatch)} });
    } else {
        dispatch({ type: actionTypes.AUTH_SUCCESS, payload:{token:token, user:currentUser}});
    }
}
export const updateProfile = (dispatch, user) => {
    dispatch({ type: actionTypes.PROFILE_UPDATE, payload:{user: user}});
}
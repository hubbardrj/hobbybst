import http from './http-common';
import { useNavigate } from 'react-router-dom';
import { logout, useAuthDispatch } from '../contexts/Auth';

const useApiService = () => {
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();

    const axiosInstance = http();

    const handleSuccess = (response) => {
        return new Promise((resolve, reject) => {
            resolve(response);
        });
    }
    
    const handleError = (error) => {
        switch (error.response.status) {
            case 401:
            case 403:
                logout(dispatch);
                navigate('/login');
                break;
            case 404:
                redirectTo(document, '/404')
                break;
            default:
                break;
        }
        return Promise.reject(error);
    }
    axiosInstance.interceptors.response.use(handleSuccess, handleError);

    const get = (path, config) => {
        return axiosInstance.get(path, config);
    }
    const post = (path, payload, config) => {
        return axiosInstance.post(path, payload, config);
    }

    const redirectTo = (document, path) => {
        document.location = path
    }
    return {get, post}
}

export default useApiService;
import useApiService from '../../services/ApiService';

const useAccountService = () => {
    const api = useApiService();
    const config = { withCredentials:true};

    const getProfile = async () => {
        return api.get('/auth/user/');
    }
    const updateProfile = async (data) => {
        return api.put('/auth/user/', data, config);
    }

    const updatePassword = async (data) => {
        return api.post("/auth/update_password/", data, config);
    }

    return { getProfile, updatePassword, updateProfile };
}

export default useAccountService;
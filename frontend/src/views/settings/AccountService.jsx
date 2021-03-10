import useApiService from '../../services/ApiService';

const useAccountService = () => {
    const api = useApiService();
    const config = { withCredentials:true};

    const getProfile = async () => {
        return api.get('/user/');
    }

    const updatePassword = async (data) => {
        return api.post("/auth/update_password/", data, config);
    }

    return { getProfile, updatePassword };
}

export default useAccountService;
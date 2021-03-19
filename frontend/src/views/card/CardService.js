import useApiService from '../../services/ApiService';

const useCardService = () => {
    const api = useApiService();
    const config = { withCredentials:true};

    const getAll = async () => {
        return api.get('/cards');
    }

    const get = async (id) => {
        return api.get('/cards/'+id);
    }

    const createCard = async (data) => {
        return api.post("/cards/", data, config);
    }
    const getSports = async () => {
        return api.get('/sports/');
    }
    const findPlayers = async (name) => {
        return api.get('/players/?search='+name);
    }
    return { getAll, get, createCard, getSports, findPlayers };
}

export default useCardService;
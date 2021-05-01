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
    const updateCard = async (id, data) => {
        return api.put("/cards/"+id+"/", data, config);
    }
    const findPlayers = async (sport) => {
        return api.get('/players/?sport='+sport);
    }
    const findBrands = async (sport) => {
        return api.get('/brands/?sport='+sport);
    }
    const findTeams = async (sport) => {
        return api.get('/teams/?sport='+sport);
    }
    const getSports = async () => {
        return api.get('/sports/');
    }
    const getChecklist = async (brandId, year) => {
        return api.get('/checklists?brand_id='+brandId+'&year='+year);
    }
    return { getAll, get, createCard, getSports, getChecklist, findPlayers, findBrands, findTeams, updateCard };
}

export default useCardService;
import useApiService from './ApiService';
import axios from "axios";

const useFileService = () => {
    const api = useApiService();
    const config = { withCredentials:true};

    const convertUrltoFile = async (url, name) => {
        return new Promise(resolve => {
            fetch(url)
            .then(r => r.blob()
            .then(b => resolve(new File([b], name)))
            );
        });
    }

    const uploadToS3 = async (file, fileType) => {
        return new Promise(resolve => {
            api.post('/files/', 
            {
                filetype:fileType
            }, config)
            .then(response => {
                let returnData = response.data;
                let url = returnData.url;
                console.log(response);
                const formData = new FormData();
                Object.keys(returnData.fields).forEach(key => {
                    formData.append(key, returnData.fields[key]);
                });
                // Actual file has to be appended last.
                formData.append("file", file);
                
                let options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                };
                axios.post(url,formData,options)
                .then(result => {
                    let fileUrl = url.concat(returnData.filename);

                    resolve(fileUrl);
                })
                .catch(error => {
                alert("ERROR " + JSON.stringify(error));
                })
            })
            .catch(error => {
                alert("later error "+JSON.stringify(error));
            })
        });
    }
    return { uploadToS3, convertUrltoFile };
}

export default useFileService;
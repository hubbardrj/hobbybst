import axios from "axios";
import * as settings from '../settings';

export default () => {
  const axiosInstance = axios.create({
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: "X-CSRFToken",

    baseURL: `${settings.API_SERVER}/api`,
    headers: {
      "Content-type": "application/json",
    },
    withCredentials:true,
  });

  return axiosInstance;
}


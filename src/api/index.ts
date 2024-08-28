import axios from "axios";
import { netBearerTokenInterceptor } from "./netBearerTokenInterceptor";

export const HC_SERVER = "https://edcadmin.homecarbon.com.br/edc_api_app/";
//export const HC_SERVER = 'http://localhost:8000'
export const HC_API = `${HC_SERVER}`;

export const NET_SERVER = "https://apinet.homecarbon.com.br";
export const NET_API = `${NET_SERVER}/api/`;

export const hcApi = axios.create({
  baseURL: HC_API,
});

hcApi.interceptors.request.use(netBearerTokenInterceptor);
hcApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // window.location.href = "/login";
      return;
    }
    return error;
  }
);

export const netApi = axios.create({
  baseURL: NET_API,
});

netApi.interceptors.request.use(netBearerTokenInterceptor);
netApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // window.location.href = "/login";
      return;
    }
    // window.location.href = "/login";
    return;
  }
);

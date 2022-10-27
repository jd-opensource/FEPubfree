import axios from "axios";
import { DefineProperty } from "../util/define-property";

const axiosIns = axios.create({
  baseURL: DefineProperty.ServerUrl + "/api",
  timeout: 5000,
  withCredentials: true,
});

axiosIns.interceptors.response.use((response) => {
  return response.data;
});

export default axiosIns;

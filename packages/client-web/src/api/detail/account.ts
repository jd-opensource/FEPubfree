import axiosIns from "../axios-ins";
import { IApiRes } from "../index";

export const accountInfo = async (): Promise<IApiRes<IAccountInfo>> => {
  return axiosIns.get("/account/info");
};

export const accountLogin = async (): Promise<IApiRes<any>> => {
  return axiosIns.post("/account/login");
};

export const accountLogout = async (): Promise<IApiRes<any>> => {
  return axiosIns.post("/account/logout");
};

export const accountRegister = async (): Promise<IApiRes<any>> => {
  return axiosIns.post("/account/register");
};

export interface IAccountInfo {
  id: number;
  name: string;
}

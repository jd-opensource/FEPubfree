import { IDomainDTO } from "../../interface/client-api/domain.interface";
import axiosIns from "../axios-ins";
import { IApiRes } from "../index";

export const getProjectDomains = (
  projectId: number
): Promise<IApiRes<IDomainDTO[]>> => {
  return axiosIns.get(`/projects/${projectId}/domains`);
};

export const createProjectDomain = (
  projectId: number,
  params: { projectEnvId: number; host: string }
): Promise<IApiRes<any>> => {
  return axiosIns.post(`/projects/${projectId}/domains`, params);
};

export const deleteProjectDomain = (
  projectId: number,
  domainId: number
): Promise<IApiRes<any>> => {
  return axiosIns.delete(`/projects/${projectId}/domains/${domainId}`);
};

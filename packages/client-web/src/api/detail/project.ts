import {
  EProjectEnvType,
  ICreateProjectDTO,
  IGetProjectsQuery,
  IProjectDeployDTO,
  IProjectDTO,
  IProjectEnvDTO,
} from "../../interface/client-api/project.interface";
import axiosIns from "../axios-ins";
import { IApiRes } from "../index";

export const getProjects = (
  query: IGetProjectsQuery
): Promise<
  IApiRes<{
    total: number;
    projects: IProjectDTO[];
  }>
> => {
  return axiosIns.get(`/projects`, {
    params: query,
  });
};

export const getProjectInfo = (
  projectId: number
): Promise<IApiRes<IProjectDTO>> => {
  return axiosIns.get(`/projects/${projectId}`);
};

export const createProject = (
  params: ICreateProjectDTO
): Promise<IApiRes<IProjectDTO>> => {
  return axiosIns.post(`/projects`, params);
};

export const updateProject = (projectId: number): Promise<IApiRes<any>> => {
  return axiosIns.post(`/projects/${projectId}`);
};

export const deleteProject = (projectId: number): Promise<IApiRes<any>> => {
  return axiosIns.delete(`/projects/${projectId}`);
};

export const getProjectEnvs = (
  projectId: number
): Promise<IApiRes<IProjectEnvDTO[]>> => {
  return axiosIns.get(`/projects/${projectId}/envs`);
};

export const createProjectEnv = (
  projectId: number,
  params: { name: string; type: EProjectEnvType }
): Promise<IApiRes<IProjectEnvDTO>> => {
  return axiosIns.post(`/projects/${projectId}/envs`, params);
};

export const updateProjectEnv = (
  projectId: number,
  envId: number
): Promise<IApiRes<any>> => {
  return axiosIns.post(`/projects/${projectId}/envs/${envId}`);
};

export const deleteProjectEnv = (
  projectId: number,
  envId: number
): Promise<IApiRes<any>> => {
  return axiosIns.delete(`/projects/${projectId}/envs/${envId}`);
};

export const getProjectDeploys = (
  projectId: number,
  envId: number
): Promise<IApiRes<IProjectDeployDTO[]>> => {
  return axiosIns.get(`/projects/${projectId}/envs/${envId}/deploys`);
};

export const createProjectDeploy = (
  projectId: number,
  envId: number,
  params: { type: "url" | "zip"; options: { target: string; remark: string } }
): Promise<IApiRes<IProjectDeployDTO>> => {
  return axiosIns.post(`/projects/${projectId}/envs/${envId}/deploys`, params);
};

export const activateDeploy = (
  projectId: number,
  envId: number,
  deployId: number
): Promise<IApiRes<void>> => {
  return axiosIns.post(
    `/projects/${projectId}/envs/${envId}/deploys/${deployId}/activate`
  );
};

export const deactivateDeploy = (
  projectId: number,
  envId: number,
  deployId: number
): Promise<IApiRes<void>> => {
  return axiosIns.post(
    `/projects/${projectId}/envs/${envId}/deploys/${deployId}/deactivate`
  );
};

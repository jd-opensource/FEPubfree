import { IGroupDTO } from "../../interface/client-api/group.interface";
import { IProjectDTO } from "../../interface/client-api/project.interface";
import axiosIns from "../axios-ins";
import { IApiRes } from "../index";

export const getGroups = async (): Promise<IApiRes<IGroupDTO[]>> => {
  return axiosIns.get(`/groups`);
};

export const getGroupDetail = async (
  groupId: number
): Promise<IApiRes<IGroupDTO>> => {
  return axiosIns.get(`/groups/${groupId}`);
};

export const createGroup = async (params: {
  name: string;
  description: string;
}): Promise<IApiRes<any>> => {
  return axiosIns.post(`/groups`, params);
};

export const updateGroup = async (groupId: number): Promise<IApiRes<any>> => {
  return axiosIns.post(`/groups/${groupId}`);
};

export const deleteGroup = async (groupId: number): Promise<IApiRes<void>> => {
  return axiosIns.delete(`/groups/${groupId}`);
};

export const getGroupProjects = async (
  groupId: number
): Promise<IApiRes<IProjectDTO[]>> => {
  return axiosIns.get(`/groups/${groupId}/projects`);
};

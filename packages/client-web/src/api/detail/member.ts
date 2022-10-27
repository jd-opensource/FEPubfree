import {
  EGroupMemberRole,
  EProjectMemberRole,
  IGroupMemberDTO,
  IProjectMemberDTO,
} from "../../interface/client-api/member.interface";
import axiosIns from "../axios-ins";
import { IApiRes } from "../index";

export const getGroupMembers = (
  groupId: number
): Promise<IApiRes<IGroupMemberDTO[]>> => {
  return axiosIns.get(`/groups/${groupId}/members`);
};

export const addGroupMember = (
  groupId: number,
  params: { name: string; role: EGroupMemberRole }
): Promise<IApiRes<void>> => {
  return axiosIns.post(`/groups/${groupId}/members`, params);
};

export const deleteGroupMember = (
  groupId: number,
  memberId: number
): Promise<IApiRes<void>> => {
  return axiosIns.delete(`/groups/${groupId}/members/${memberId}`);
};

export const getProjectMembers = (
  projectId: number
): Promise<IApiRes<IProjectMemberDTO[]>> => {
  return axiosIns.get(`/projects/${projectId}/members`);
};

export const addProjectMember = (
  projectId: number,
  params: { name: string; role: EProjectMemberRole }
): Promise<IApiRes<any>> => {
  return axiosIns.post(`/projects/${projectId}/members`, params);
};

export const deleteProjectMember = (
  projectId: number,
  memberId: number
): Promise<IApiRes<void>> => {
  return axiosIns.delete(`/projects/${projectId}/members/${memberId}`);
};

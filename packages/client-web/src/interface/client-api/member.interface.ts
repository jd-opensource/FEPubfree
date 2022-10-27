export enum EProjectMemberRole {
  Guest = 0,
  Developer = 1,
  Master = 2,
}

export enum EGroupMemberRole {
  Guest = 0,
  Developer = 1,
  Master = 2,
}

export interface IProjectMemberDTO {
  id: number;

  projectId: number;

  userId: number;

  role: EProjectMemberRole;

  isDel: boolean;

  createdAt: number;

  updatedAt: number;

  user: {
    id: number;
    name: string;
  };
}

export interface IGroupMemberDTO {
  id: number;

  groupId: number;

  userId: number;

  role: EGroupMemberRole;

  isDel: boolean;

  createdAt: number;

  updatedAt: number;

  user: {
    id: number;
    name: string;
  };
}

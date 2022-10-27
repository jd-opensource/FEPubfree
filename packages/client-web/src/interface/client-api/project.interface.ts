export interface IGetProjectsQuery {
  type: "self" | "all";
  page: number;
  size: number;
}

export interface IProjectDTO {
  id: number;

  name: string;

  zhName: string;

  description: string;

  ownerId: number;

  groupId: number;

  createUserId: number;

  createUser: {
    id: number;

    name: string;
  };
}

export interface ICreateProjectDTO {
  name: string;

  zhName: string;

  description: string;

  /**
   * 创建群组项目时，添加此字段
   */
  groupId?: number;
}

export interface IProjectEnvDTO {
  id: number;

  projectId: number;

  name: string;

  envType: EProjectEnvType;

  createUserId: number;

  createUser: {
    id: number;

    name: string;
  };
}

export enum EProjectEnvType {
  Test = 0,
  Beta = 1,
  Gray = 2,
  Prod = 3,
}

export interface IProjectDeployDTO {
  id: number;

  projectId: number;

  projectEnvId: number;

  remark: string;

  targetType: EDeployTargetType;

  target: string;

  createUserId: number;

  createUser: {
    id: number;

    name: string;
  };

  actionUserId: number;

  actionUser: {
    id: number;

    name: string;
  };

  isActive: boolean;

  createdAt: number;

  updatedAt: number;
}

export enum EDeployTargetType {
  Local = 0,
  Cloud = 1,
}

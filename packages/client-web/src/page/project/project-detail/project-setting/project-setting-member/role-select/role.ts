import { isNil } from "lodash-es";

export enum ERole {
  Owner = 1 << 7, // 128
  Master = 1 << 6, // 64
  Developer = 1 << 5, // 32
  Guest = 1 << 4, // 16
}

export default class Role {
  static roleDesc = {
    [ERole.Owner]: {
      name: "Owner",
      desc: "可以删除、删除项目成员、转移项目、修改项目详情",
    },
    [ERole.Master]: {
      name: "Master",
      desc: "可添加修改项目成员与角色，生产审批变更",
    },
    [ERole.Developer]: {
      name: "Developer",
      desc: "日常项目操作权限，比如发布，创建工作区等",
    },
    [ERole.Guest]: {
      name: "Guest",
      desc: "可浏览项目，不支持任何修改",
    },
  };

  static getCanSelectRoles = () => {
    return [ERole.Guest, ERole.Developer, ERole.Master];
  };

  /**
   * 获取用户角色名称,一个用户可以有多个角色
   * @param role
   */
  static getMemberRoleName = (role: ERole) => {
    const desc = Role.roleDesc[role];
    if (!isNil(desc)) {
      return desc.name;
    }
    if (role === ERole.Owner + ERole.Master) {
      return `${Role.roleDesc[ERole.Owner].name} & ${
        Role.roleDesc[ERole.Master].name
      }`;
    }
    return "";
  };

  /**
   * 获取角色说明
   * @param role
   * @returns
   */
  static getRoleDesc = (role: ERole) => {
    const desc = Role.roleDesc[role];
    if (isNil(desc)) {
      return null;
    }
    return desc;
  };
}

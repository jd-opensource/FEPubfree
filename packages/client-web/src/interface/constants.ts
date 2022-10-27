// 工作区类型
export const EnvType = {
  TEST: 0,
  BETA: 1,
  GRAY: 2,
  PROD: 3,
};

// 成员角色
export const Role = {
  OWNER: 1 << 7,
  MASTER: 1 << 6,
  DEVELOPER: 1 << 5,
  GUEST: 1 << 4,
};

export const RoleDesc = {
  [Role.GUEST]: {
    name: "Guest",
    desc: "可浏览项目，不支持任何修改",
  },
  [Role.DEVELOPER]: {
    name: "Developer",
    desc: "日常项目操作权限，比如发布，创建工作区等",
  },
  [Role.MASTER]: {
    name: "Master",
    desc: "可添加修改项目成员与角色，生产审批变更",
  },
  [Role.OWNER]: {
    name: "Owner",
    desc: "可以删除、删除项目成员、转移项目、修改项目详情",
  },
};

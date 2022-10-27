import * as account from "./detail/account";
import * as domain from "./detail/domain";
import * as group from "./detail/group";
import * as member from "./detail/member";
import * as project from "./detail/project";

export interface IApiRes<T> {
  code: EApiCode;
  data: T;
  message?: string;
}

export enum EApiCode {
  Success = 200,
  Unauthorized = 401,
}

const Api = {
  account: account,
  domain: domain,
  group: group,
  member: member,
  project: project,
};

export default Api;

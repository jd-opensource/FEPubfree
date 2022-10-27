import {
  IProjectDTO,
  IProjectEnvDTO,
} from "../interface/client-api/project.interface";
import { DefineProperty } from "./define-property";

export const getNormalUrl = (project: IProjectDTO, env: IProjectEnvDTO) => {
  return `http://${project.name}.${env.name}${DefineProperty.DomainSuffix}`;
};

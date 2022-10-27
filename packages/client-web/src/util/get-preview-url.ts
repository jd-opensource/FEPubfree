import {
  IProjectDeployDTO,
  IProjectDTO,
  IProjectEnvDTO,
} from "../interface/client-api/project.interface";
import { DefineProperty } from "./define-property";

export const getPreviewUrl = (
  project: IProjectDTO,
  env: IProjectEnvDTO,
  deploy: IProjectDeployDTO
) => {
  return `http://${deploy.id}.${project.name}.${env.name}${DefineProperty.DomainSuffix}`;
};

import * as assert from "assert";
import { isNil } from "lodash";
import { ProjectDomain, ProjectDomainRepo } from "../entity/project-domain";
import { UnMatchedHostError } from "../error/UnMatchedHostError";
import { queryRunnerRepo } from "../util/query-runner-repo";
import { Project, ProjectRepo } from "../entity/project";
import { ProjectEnv, ProjectEnvRepo } from "../entity/project-env";
import { ProjectEnvDeployRepo } from "../entity/project-env-deploy";

export class ProjectService {
  async getProjectDomain(host: string): Promise<{ domain: ProjectDomain; project: Project; env: ProjectEnv }> {
    // TODO 添加缓存机制

    const projectDomainRepo = queryRunnerRepo(ProjectDomainRepo);
    const domain = await projectDomainRepo.findOne({ host: host, isDel: false });
    assert(!isNil(domain), new UnMatchedHostError(`个性化域名配置不存在 ${host}`));

    const projectRepo = queryRunnerRepo(ProjectRepo);
    const project = await projectRepo.findOne({ id: domain.projectId, isDel: false });
    assert(!isNil(project), new UnMatchedHostError(`个性化域名配置对应项目不存在 ${host} ${domain.projectId}`));

    const envRepo = queryRunnerRepo(ProjectEnvRepo);
    const env = await envRepo.findOne({ id: domain.projectEnvId, isDel: false });
    assert(!isNil(env), new UnMatchedHostError(`个性化域名配置对应环境不存在 ${host} ${domain.projectEnvId}`));

    return {
      domain: domain,
      project: project,
      env: env,
    };
  }

  async getProjectById(projectId: number) {
    const projectRepo = queryRunnerRepo(ProjectRepo);
    return await projectRepo.findOne({ id: projectId, isDel: false });
  }

  async getProjectByName(projectName: string) {
    const projectRepo = queryRunnerRepo(ProjectRepo);
    return await projectRepo.findOne({ name: projectName, isDel: false });
  }

  async getProjectEnvByName(projectId: number, name: string) {
    const projectEnvRepo = queryRunnerRepo(ProjectEnvRepo);
    return await projectEnvRepo.findOne({ projectId: projectId, name: name, isDel: false });
  }

  async getProjectEnvDeployById(deployId: number) {
    const projectEnvDeployRepo = queryRunnerRepo(ProjectEnvDeployRepo);
    return await projectEnvDeployRepo.findOne({ id: deployId, isDel: false });
  }

  /**
   * 获取某个环境下生效中的部署记录
   */
  async getProjectEnvActiveDeploy(projectEnvId: number) {
    const projectEnvDeployRepo = queryRunnerRepo(ProjectEnvDeployRepo);
    return await projectEnvDeployRepo.findOne({
      projectEnvId: projectEnvId,
      isActive: true,
      isDel: false,
    });
  }
}

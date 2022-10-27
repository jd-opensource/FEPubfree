import * as assert from "assert";
import { AssertionError } from "assert";
import { cloneDeep, isNil } from "lodash";
import { EHostType, HostCache, IHostCacheValue } from "../cache/host-cache";
import { Project } from "../entity/project";
import { EDeployTargetType, ProjectEnvDeploy } from "../entity/project-env-deploy";
import { ResourceFetchFailedError } from "../error/ResourceFetchFailedError";
import { UnMatchedProjectEnvDeployError } from "../error/UnMatchedProjectEnvDeployError";
import { InvalidPreviewError } from "../error/InvalidPreviewError";
import { UnMatchedHostError } from "../error/UnMatchedHostError";
import { UnMatchedProjectEnvError } from "../error/UnMatchedProjectEnvError";
import { UnMatchedProjectError } from "../error/UnMatchedProjectError";
import { IContext } from "../interface/context";
import { ProjectService } from "../service/project-service";
import { ResourceService } from "../service/resource-service";
import { ctxPrint } from "../util/ctx-print";
import { Logger } from "../util/logger";

export class DispatchController {
  private logger = Logger.create();

  private projectService = new ProjectService();
  private resourceService = new ResourceService();
  private hostCache = HostCache.getInstance();

  async dispatchWithErrorHandler(ctx: IContext): Promise<void> {
    try {
      return await this.dispatch(ctx);
    } catch (err) {
      this.logger.warn(ctxPrint(ctx), `load resource failed: ${err.constructor.name}`);

      if (err instanceof AssertionError) {
        return this.resourceService.response404Buffer(ctx, "AssertionError");
      }

      if (
        err instanceof InvalidPreviewError ||
        err instanceof ResourceFetchFailedError ||
        err instanceof UnMatchedHostError ||
        err instanceof UnMatchedProjectError ||
        err instanceof UnMatchedProjectEnvError ||
        err instanceof UnMatchedProjectEnvDeployError
      ) {
        return this.resourceService.response404Buffer(ctx, err.name);
      }

      this.logger.error(ctxPrint(ctx), `UnknownError: `, err.stack);
      return this.resourceService.response404Buffer(ctx, "UnKnownError");
    }
  }

  async dispatch(ctx: IContext): Promise<void> {
    const reqHost = ctx.req.headers.host;

    const hostCache: IHostCacheValue = this.hostCache.test(reqHost);
    const { hostType, projectName, envName, deployId } = hostCache;

    // 默认域名模式
    if (hostType === EHostType.Default) {
      return await this.dispatchDefault(ctx, projectName, envName);
    }

    // 部署预览模式
    if (hostType === EHostType.Preview) {
      return await this.dispatchPreview(ctx, +deployId);
    }

    // 个性化域名模式
    if (hostType === EHostType.Domain) {
      const { project, env } = await this.projectService.getProjectDomain(reqHost);
      return await this.dispatchDefault(ctx, project.name, env.name);
    }

    // 异常模式
    if (hostType === EHostType.Unknown) {
      this.logger.warn(ctxPrint(ctx), `Matched unknown host`);
      throw new UnMatchedHostError(`域名匹配失败：${reqHost}`);
    }
  }

  /**
   * 线上环境，无缓存
   * 获得数据之后，需要反哺于本地内存缓存
   */
  private async dispatchDefault(ctx: IContext, projectName: string, envName: string) {
    const project = await this.projectService.getProjectByName(projectName);
    assert(!isNil(project), new UnMatchedProjectError(`未查询到匹配项目 ${projectName}`));

    const env = await this.projectService.getProjectEnvByName(project.id, envName);
    assert(!isNil(env), new UnMatchedProjectEnvError(`未查询到匹配环境 ${projectName}-${envName}`));

    const deploy = await this.projectService.getProjectEnvActiveDeploy(env.id);
    assert(!isNil(deploy), new UnMatchedProjectEnvDeployError(`未查询到生效部署记录 ${projectName}-${envName}`));

    const buffer = await this.getResourceBuffer(ctx, project, deploy);
    assert(!isNil(buffer), new ResourceFetchFailedError(`未查询到匹配资源 ${projectName}-${envName}-${deploy.id}`));

    return this.resourceService.responseSuccessBuffer(ctx, buffer);
  }

  /**
   * 预览模式
   */
  private async dispatchPreview(ctx: IContext, deployId: number) {
    const deploy = await this.projectService.getProjectEnvDeployById(deployId);
    assert(!isNil(deploy), new InvalidPreviewError(`未查询到预览部署信息 ${deployId}`));

    const project = await this.projectService.getProjectById(deploy.projectId);
    assert(!isNil(project), new InvalidPreviewError(`未查询到预览项目信息 ${project}`));

    const buffer = await this.getResourceBuffer(ctx, project, deploy);
    return this.resourceService.responseSuccessBuffer(ctx, buffer);
  }

  /**
   * 获取资源 Buffer
   */
  private async getResourceBuffer(ctx: IContext, project: Project, deploy: ProjectEnvDeploy): Promise<Buffer> {
    const { targetType } = deploy;
    let buffer;

    // 先尝试获取本地缓存
    const cache = this.resourceService.getResourceFromLocalCache(ctx);

    // 存在本地缓存
    if (!isNil(cache)) {
      ctx.respHeaders = cloneDeep(ctx.respHeaders);
      return cache.buffer;
    }

    // 不存在本地缓存
    if (targetType === EDeployTargetType.Cloud) {
      buffer = await this.resourceService.getResourceBufferFromCloud(ctx, deploy.target);
    }
    if (targetType === EDeployTargetType.Local) {
      throw new Error("Not Implemented");
    }

    // 将获得的资源放入本地缓存
    this.resourceService.addResourceToLocalCache(ctx, {
      envId: deploy.projectEnvId,
      buffer: buffer,
      respHeaders: cloneDeep(ctx.respHeaders),
    });

    return buffer;
  }
}

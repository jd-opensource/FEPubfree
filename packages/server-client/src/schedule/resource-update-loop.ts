import { IApplication } from "../interface/application";
import { queryRunnerRepo } from "../util/query-runner-repo";
import { ProjectEnvDeployRepo } from "../entity/project-env-deploy";
import { MemoryCache } from "../cache/memory-cache";
import { BaseLoop } from "./base/BaseLoop";
import { ProjectEnvRepo } from "../entity/project-env";

export class ResourceUpdateLoop extends BaseLoop {
  interval: number = 5000;
  identifier: string = "ResourceUpdateLoop";

  private startTimestamp = new Date().valueOf();

  private memoryCache = MemoryCache.getInstance();

  constructor(app: IApplication) {
    super(app);
  }

  async runner() {
    const lastTimestamp = this.startTimestamp;
    this.startTimestamp = new Date().valueOf();

    const deployRepo = queryRunnerRepo(ProjectEnvDeployRepo);
    const latestDeploys = await deployRepo.findLatestUpdatedEnvIds(lastTimestamp);

    const envRepo = queryRunnerRepo(ProjectEnvRepo);
    const latestEnvs = await envRepo.findLatestUpdatedEnvAreas(lastTimestamp);

    let envIds = latestDeploys.map((v) => v.envId).concat(latestEnvs.map((env) => env.id));

    this.memoryCache.cache.forEach((value, key) => {
      if (envIds.includes(value.envId)) {
        this.logger.debug(`EnvId: ${value.envId} matched, will delete key: ${key}`);
        this.memoryCache.cache.del(key);
      }
    });
  }
}

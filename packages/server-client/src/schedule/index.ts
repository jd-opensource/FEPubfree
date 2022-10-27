import { IApplication } from "../interface/application";
import { Logger } from "../util/logger";
import { ResourceUpdateLoop } from "./resource-update-loop";

export class ScheduleManager {
  private logger = Logger.create();
  private app: IApplication = null;

  constructor(app: IApplication) {
    this.app = app;
  }

  start() {
    const { enable = false } = this.app.config.schedule || {};
    if (enable === true) {
      new ResourceUpdateLoop(this.app).start();
    } else {
      this.logger.info("Schedule enable is false, skipped.");
    }
  }
}

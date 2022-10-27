import * as schedule from "node-schedule";
import { IApplication } from "../../interface/application";
import { Logger } from "../../util/logger";

export abstract class BaseSchedule {
  protected logger = Logger.create();
  protected app: IApplication = null;

  /**
   * *    *    *    *    *    *
   * ┬    ┬    ┬    ┬    ┬    ┬
   * │    │    │    │    │    │
   * │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
   * │    │    │    │    └───── month (1 - 12)
   * │    │    │    └────────── day of month (1 - 31)
   * │    │    └─────────────── hour (0 - 23)
   * │    └──────────────────── minute (0 - 59)
   * └───────────────────────── second (0 - 59, OPTIONAL)
   */
  abstract cron: string;
  abstract identifier: string;

  abstract runner();

  protected constructor(app: IApplication) {
    this.app = app;
  }

  start() {
    schedule.scheduleJob(this.cron, () => {
      this.runner();
    });
    this.logger.info(`Schedule ${this.identifier} is started`);
  }
}

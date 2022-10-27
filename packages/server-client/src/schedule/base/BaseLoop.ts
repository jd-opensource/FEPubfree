import { Logger } from "../../util/logger";
import { IApplication } from "../../interface/application";

export abstract class BaseLoop {
  protected logger = Logger.create();
  protected app: IApplication = null;

  abstract interval: number;
  abstract identifier: string;

  abstract runner();

  protected constructor(app: IApplication) {
    this.app = app;
  }

  start() {
    setTimeout(async () => {
      try {
        await Promise.resolve(this.runner());
      } catch (err) {
        this.logger.error(`${this.identifier} execute error`, err.stack);
      }
      this.start();
    }, this.interval);
  }
}

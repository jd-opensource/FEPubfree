import * as path from "path";
import { Logger } from "./logger";

export interface IAppConfig {
  mysql: {
    enable: boolean;
    options: {
      host: string;
      port: number;
      database: string;
      username: string;
      password: string;
    };
  };

  schedule: {
    enable: boolean;
  };
}

export class AppConfig {
  private static logger = Logger.create();
  private static _config: IAppConfig = null;

  public static load(): IAppConfig {
    if (this._config === null) {
      this._config = require(path.resolve(__dirname, "../../resource/config.default.json"));
      this.logger.info("Load resource/config.default.json success");
    }

    return this._config;
  }

  public static config(): IAppConfig {
    return this._config;
  }
}

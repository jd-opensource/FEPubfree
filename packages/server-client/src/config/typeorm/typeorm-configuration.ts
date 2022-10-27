import * as path from "path";
import { createConnection } from "typeorm";
import { Logger } from "../../util/logger";
import { AppConfig } from "../../util/app-config";

export class TypeormConfiguration {
  private logger = Logger.create();

  async config() {
    this.logger.info("Starting config typeorm.");

    const {
      mysql: {
        enable,
        options: { host, port, username, password, database },
      },
      // @ts-ignore
    } = AppConfig.config();

    if (enable === false) {
      this.logger.error("Typeorm config enable is false, skipped.");
      return;
    }

    try {
      await createConnection({
        bigNumberStrings: false,
        type: "mysql",
        host: host,
        port: port,
        username: username,
        password: password,
        database: database,
        entities: [path.resolve(__dirname, `../../entity/*{.js,.ts}`)],
        synchronize: false,
        logging: false,
      });
      this.logger.info("Typeorm config success.");
    } catch (err) {
      this.logger.error(`Typeorm config failed.`);
      this.logger.error(err.stack);
    }
  }
}

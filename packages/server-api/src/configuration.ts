import * as cors from "@koa/cors";
import { ILifeCycle } from "@midwayjs/core";
import { ALL, App, Config, Configuration, Logger } from "@midwayjs/decorator";
import { Application } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as bodyParser from "koa-bodyparser";
import * as path from "path";
import { createConnection, getConnection } from "typeorm";
import { IAppConfig } from "./interface/config.interface";

@Configuration({
  importConfigs: [path.join(__dirname, "../resource/config.default.json")],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  @Logger()
  logger: ILogger;

  private config: IAppConfig = null;

  async onReady() {
    this.logger.info("Configuration onReady");
    this.config = require(path.join(__dirname, "../resource/config.default.json"));

    await this.configOrm();
    await this.configMiddlewares();
  }

  async onStop() {
    await getConnection().close();
  }

  private async configOrm() {
    const { host, port, database, username, password } = this.config.orm;
    await createConnection({
      type: "mysql",
      host: host,
      port: port,
      username: username,
      password: password,
      database: database,
      entities: [path.resolve(__dirname, "./entity/*{.js,.ts}")],
      synchronize: false,
      bigNumberStrings: false,
      logging: false,
    });
  }

  private async configMiddlewares() {
    this.logger.info("Starting config middlewares.");
    this.app.use(
      cors({
        origin: (ctx) => {
          return ctx.get("origin");
        },
        credentials: true,
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
      })
    );
    this.app.use(bodyParser());
    this.app.use(await this.app.generateMiddleware("RequestMiddleware"));
    this.app.use(await this.app.generateMiddleware("ValidateMiddleware"));
    this.logger.info("Config middlewares success.");
  }
}

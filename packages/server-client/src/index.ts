import * as http from "http";
import * as path from "path";
import * as fse from "fs-extra";
import { Logger } from "./util/logger";
import { TypeormConfiguration } from "./config";
import { AppConfig } from "./util/app-config";
import { DispatchController } from "./controller/dispatch-controller";
import { IApplication } from "./interface/application";
import { ScheduleManager } from "./schedule";

const bootstrap = async () => {
  const appConfig = AppConfig.load();
  const logger = Logger.create();

  const application: IApplication = {
    config: appConfig,
    faviconBuffer: await fse.readFileSync(path.resolve(__dirname, "../resource/favicon.ico")),
    notFoundHtmlBuffer: await fse.readFileSync(path.resolve(__dirname, "../resource/404.html")),
  };

  await new TypeormConfiguration().config();
  new ScheduleManager(application).start();

  const dispatchController = new DispatchController();
  const server = http.createServer(async (req, resp) => {
    logger.info(`receive: ${req.headers.host + req.url}`);

    if (req.url === "/favicon.ico") {
      return resp.end(application.faviconBuffer);
    }

    const ctx = { req: req, resp: resp, app: application, respHeaders: {} };
    return await dispatchController.dispatchWithErrorHandler(ctx);
  });

  server.listen(3000, () => {
    logger.info(`Server now is listening on http://127.0.0.1:3000`);
  });
};

bootstrap();

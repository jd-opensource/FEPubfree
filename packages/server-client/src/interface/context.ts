import { IncomingMessage, ServerResponse } from "http";
import { IApplication } from "./application";

export interface IContext {
  req: IncomingMessage;
  resp: ServerResponse;
  app: IApplication;

  // 过程中临时存放 Header 字段
  respHeaders?: any;
}

declare module "http" {
  interface IncomingHttpHeaders {
    originHost?: string;
  }
}

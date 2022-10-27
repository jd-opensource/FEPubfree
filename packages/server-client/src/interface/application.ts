import { IAppConfig } from "../util/app-config";

export interface IApplication {
  // 应用配置信息
  config: IAppConfig;

  // favicon
  faviconBuffer: Buffer;
  // 404 页面 buffer
  notFoundHtmlBuffer: Buffer;
}

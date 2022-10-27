import * as mime from "mime";
import axios from "axios";
import { ResourceFetchFailedError } from "../error/ResourceFetchFailedError";
import { IContext } from "../interface/context";
import { IMemoryCacheValue, MemoryCache } from "../cache/memory-cache";
import { Logger } from "../util/logger";

export class ResourceService {
  private logger = Logger.create();

  private memoryCacheIns = MemoryCache.getInstance();

  private axiosClient = axios.create({
    timeout: 5000,
  });

  public getResourceFromLocalCache(ctx: IContext) {
    const cacheKey = MemoryCache.getCacheKey(ctx);
    return this.memoryCacheIns.cache.get(cacheKey);
  }

  public addResourceToLocalCache(ctx: IContext, cache: IMemoryCacheValue) {
    const cacheKey = MemoryCache.getCacheKey(ctx);
    this.memoryCacheIns.cache.set(cacheKey, cache);
  }

  public getContentType(url: string) {
    return mime.getType(url);
  }

  public responseSuccessBuffer(ctx: IContext, buffer: Buffer) {
    Object.getOwnPropertyNames(ctx.respHeaders).forEach((key) => {
      ctx.resp.setHeader(key, ctx.respHeaders[key]);
    });

    ctx.resp.end(buffer);
    return;
  }

  public response404Buffer(ctx: IContext, identifier: string = "default") {
    ctx.resp.setHeader("Content-Type", "text/html; charset=UTF-8");
    ctx.resp.setHeader("Pubfree-Error-Code", identifier);
    ctx.resp.end(ctx.app.notFoundHtmlBuffer);
    return;
  }

  public async getResourceBufferFromCloud(ctx: IContext, url: string) {
    ctx.respHeaders["Content-Type"] = this.getContentType(url);

    try {
      // TODO 添加本地缓存策略
      const resp = await this.axiosClient.get(url, { responseType: "arraybuffer" });
      return resp.data;
    } catch (err) {
      this.logger.error(`远程拉取资源失败 ${url}`, err.message, err.stack);
      throw new ResourceFetchFailedError(`远程拉取资源失败 ${url}`);
    }
  }
}

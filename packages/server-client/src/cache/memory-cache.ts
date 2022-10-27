import { isNil } from "lodash";
import * as LRUCache from "lru-cache";
import * as parseurl from "parseurl";
import { IContext } from "../interface/context";

export interface IMemoryCacheValue {
  envId: number;
  buffer: Buffer;
  respHeaders: { [key: string]: string };
}

export class MemoryCache {
  private static instance: MemoryCache = null;

  cache: LRUCache<string, IMemoryCacheValue> = null;

  constructor() {
    this.cache = new LRUCache<string, IMemoryCacheValue>({
      // count
      max: 1000,
      // ms
      maxAge: 5 * 60 * 1000,
      updateAgeOnGet: false,
    });
  }

  public static getInstance() {
    if (isNil(MemoryCache.instance)) {
      MemoryCache.instance = new MemoryCache();
    }

    return MemoryCache.instance;
  }

  /**
   * 请求的域名以及路径作为缓存 key
   * 示例
   * 请求地址：https://abc.com/account?name=x
   * 缓存 Key 为：abc.com/account
   */
  public static getCacheKey(ctx: IContext) {
    return `${ctx.req.headers.host}${parseurl(ctx.req).pathname}`;
  }
}

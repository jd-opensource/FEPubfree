import { IContext } from "../interface/context";
import { MemoryCache } from "../cache/memory-cache";

export function ctxPrint(ctx: IContext) {
  return MemoryCache.getCacheKey(ctx);
}

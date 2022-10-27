import { Provide } from "@midwayjs/decorator";
import { Context, IMidwayKoaNext, IWebMiddleware } from "@midwayjs/koa";

@Provide("ValidateMiddleware")
export class ValidateMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayKoaNext) => {
      try {
        await next();
      } catch (err) {
        // RuleType 校验失败
        if (err?.name === "ValidationError") {
          return (ctx.body = {
            code: -1,
            message: err?.message || "Unknown validation error.",
          });
        }
        throw err;
      }
    };
  }
}

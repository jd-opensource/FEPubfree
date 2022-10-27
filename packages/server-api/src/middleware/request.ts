import { App, Provide } from "@midwayjs/decorator";
import { Application, Context, IMidwayKoaNext, IWebMiddleware } from "@midwayjs/koa";
import { WebUtil } from "../controller/common/web-util";
import { CustomError } from "../error/custom-error";

@Provide("RequestMiddleware")
export class RequestMiddleware implements IWebMiddleware {
  @App()
  app: Application;

  resolve() {
    return async (ctx: Context, next: IMidwayKoaNext) => {
      try {
        await next();
      } catch (err) {
        if (err instanceof CustomError) {
          ctx.body = WebUtil.warning(err.code, err.message);
          return;
        }

        this.app.getLogger().error(err.stack);
        ctx.body = WebUtil.error();
      }
    };
  }
}

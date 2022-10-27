import { Provide } from "@midwayjs/decorator";
import { Context, IMidwayKoaNext, IWebMiddleware } from "@midwayjs/koa";

interface IJwtPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}

@Provide("AuthMiddleWare")
export class AuthMiddleWare implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayKoaNext) => {
      ctx.loginUser = {
        id: 1,
        name: "admin",
      };
      await next();
      // const authorization: string = ctx.headers["authorization"] as string;
      // const token = authorization.split(" ")?.[1];
      // try {
      //   // TODO get secret key from config
      //   const decoded = jwt.verify(token, "pubfree") as IJwtPayload;
      //   const { id, name } = decoded;
      //   ctx.loginUser = {
      //     id: id,
      //     name: name,
      //   };
      //   await next();
      // } catch (err) {
      //   if (err instanceof TokenExpiredError) {
      //     ctx.body = WebUtil.userNoLogin();
      //     return;
      //   }
      //   throw err;
      // }
    };
  }
}

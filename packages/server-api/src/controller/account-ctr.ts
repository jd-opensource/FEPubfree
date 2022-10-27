import { ALL, Body, Controller, Get, Inject, Logger, Post, Provide } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as jwt from "jsonwebtoken";
import { AccountSrv } from "../service/account-srv";
import { WebUtil } from "./common/web-util";

@Provide()
@Controller("/api/account")
export class AccountCtr {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @Inject()
  userSrv: AccountSrv;

  @Get("/info", { middleware: ["AuthMiddleWare"] })
  async getUserInfo() {
    return WebUtil.result(this.ctx.loginUser);
  }

  @Post("/login")
  async login(@Body(ALL) body: { name: string; password: string }) {
    const user = await this.userSrv.login({ name: body.name, password: body.password });
    // TODO load "pubfree" from config
    const token = jwt.sign({ id: user.id, name: user.name }, "pubfree");
    return WebUtil.result({
      token: token,
    });
  }

  @Post("/logout")
  async logout() {
    return WebUtil.notImplemented();
  }

  @Post("/register")
  async register(@Body(ALL) body: { name: string; password: string }) {
    const res = this.userSrv.register({ name: body.name, password: body.password });
    return WebUtil.result(res);
  }
}

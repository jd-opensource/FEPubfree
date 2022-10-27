import { App, Inject, Provide } from "@midwayjs/decorator";
import { Application, Context } from "@midwayjs/koa";
import { ILogger } from "@midwayjs/logger";
import * as assert from "assert";
import * as _ from "lodash";
import { getConnection } from "typeorm";
import { User, UserRepo } from "../entity/user";
import { CustomError } from "../error/custom-error";
import { queryRunnerRepo } from "../util/query-runner-repo";

@Provide()
export class AccountSrv {
  @App()
  private app: Application;

  @Inject()
  private logger: ILogger;

  @Inject()
  private ctx: Context;

  /**
   * 用户注册
   */
  async register(user: Partial<User>): Promise<User> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      const userRepo = queryRunnerRepo(UserRepo, queryRunner);

      const existed = await userRepo.findOne({
        where: {
          name: user.name,
          isDel: false,
        },
      });
      assert(_.isNil(existed), CustomError.new(`user with name ${user.name} already exists`));

      const result = await userRepo.save({
        name: user.name,
        // TODO encryption here
        password: user.password,
      });
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 用户登录
   */
  async login(user: Partial<User>): Promise<Partial<User>> {
    const userRepo = queryRunnerRepo(UserRepo);

    const matchedUser = await userRepo.findOne({
      name: user.name,
      // TODO encryption here
      password: user.password,
      isDel: false,
    });
    assert(!_.isNil(matchedUser), CustomError.new(`user with name ${user.name} was not registered.`));

    return User.purify(matchedUser);
  }

  /**
   * 当前用户是否是管理员
   */
  async isAdmin(): Promise<boolean> {
    return false;
  }
}

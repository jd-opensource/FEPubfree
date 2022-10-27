import { getManager, QueryRunner } from "typeorm";
import { ObjectType } from "typeorm/common/ObjectType";

export function queryRunnerRepo<T>(customRepo: ObjectType<T>, queryRunner?: QueryRunner) {
  if (queryRunner) {
    return queryRunner.manager.getCustomRepository(customRepo);
  } else {
    return getManager().getCustomRepository(customRepo);
  }
}

import * as _ from "lodash";
import * as dayjs from "dayjs";
import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";
import { BoolTransform } from "./base/bool-transform";

export enum EDeployTargetType {
  Local = 0,
  Cloud = 1,
}

@Entity({ name: "project_env_deploy" })
export class ProjectEnvDeploy extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "project_env_id" })
  projectEnvId: number;

  @Column({ name: "remark" })
  remark: string;

  @Column({ name: "target_type" })
  targetType: EDeployTargetType;

  @Column({ name: "target" })
  target: string;

  @Column({ name: "create_user_id" })
  createUserId: number;

  @Column({ name: "action_user_id" })
  actionUserId: number;

  @Column({
    name: "is_active",
    type: "tinyint",
    transformer: BoolTransform.defaultFalse(),
  })
  isActive: boolean;

  static purify(projectEnvDeploy: ProjectEnvDeploy) {
    if (_.isNil(projectEnvDeploy)) {
      return null;
    }
    return {
      id: projectEnvDeploy.id,
      projectId: projectEnvDeploy.projectId,
      projectEnvId: projectEnvDeploy.projectEnvId,
      remark: projectEnvDeploy.remark,
      targetType: projectEnvDeploy.targetType,
      target: projectEnvDeploy.target,
      createUserId: projectEnvDeploy.createUserId,
      actionUserId: projectEnvDeploy.actionUserId,
      isActive: projectEnvDeploy.isActive,
    };
  }
}

@EntityRepository(ProjectEnvDeploy)
export class ProjectEnvDeployRepo extends Repository<ProjectEnvDeploy> {
  findLatestUpdatedEnvIds(timestamp: number): Promise<Array<{ envId: number }>> {
    return this.query(
      "SELECT DISTINCT project_env_id as envId FROM project_env_deploy WHERE is_del = 0 AND updated_at >= ?",
      [dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss")]
    );
  }
}

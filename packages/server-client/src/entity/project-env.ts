import * as dayjs from "dayjs";
import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

export enum EProjectEnvType {
  Test = 0,
  Beta = 1,
  Gray = 2,
  Prod = 3,
}

@Entity({ name: "project_env" })
export class ProjectEnv extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "env_type" })
  envType: EProjectEnvType;

  @Column({ name: "create_user_id" })
  createUserId: number;
}

@EntityRepository(ProjectEnv)
export class ProjectEnvRepo extends Repository<ProjectEnv> {
  findLatestUpdatedEnvAreas(timestamp: number): Promise<Array<{ id: number }>> {
    return this.query("SELECT DISTINCT id FROM project_env WHERE is_del = 0 AND updated_at >= ?", [
      dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss"),
    ]);
  }
}

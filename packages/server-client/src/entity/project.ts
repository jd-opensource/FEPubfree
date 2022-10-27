import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

@Entity({ name: "project" })
export class Project extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "zh_name" })
  zhName: string;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "owner_id" })
  ownerId: number;

  @Column({ name: "group_id" })
  groupId: number;

  @Column({ name: "create_user_id" })
  createUserId: number;
}

@EntityRepository(Project)
export class ProjectRepo extends Repository<Project> {}

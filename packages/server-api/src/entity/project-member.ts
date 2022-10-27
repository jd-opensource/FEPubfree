import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

export enum EProjectMemberRole {
  Guest = 0,
  Developer = 1,
  Master = 2,
}

@Entity({ name: "project_member" })
export class ProjectMember extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "role" })
  role: EProjectMemberRole;
}

@EntityRepository(ProjectMember)
export class ProjectMemberRepo extends Repository<ProjectMember> {}

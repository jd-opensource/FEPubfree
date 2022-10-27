import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

@Entity({ name: "project_domain" })
export class ProjectDomain extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "project_id" })
  projectId: number;

  @Column({ name: "project_env_id" })
  projectEnvId: number;

  @Column({ name: "host" })
  host: string;
}

@EntityRepository(ProjectDomain)
export class ProjectDomainRepo extends Repository<ProjectDomain> {}

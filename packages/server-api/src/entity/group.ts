import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

@Entity({ name: "group" })
export class Group extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "owner_id" })
  ownerId: number;

  @Column({ name: "create_user_id" })
  createUserId: number;
}

@EntityRepository(Group)
export class GroupRepo extends Repository<Group> {}

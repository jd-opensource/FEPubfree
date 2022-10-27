import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

export enum EGroupMemberRole {
  Guest = 0,
  Developer = 1,
  Master = 2,
}

@Entity({ name: "group_member" })
export class GroupMember extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "group_id" })
  groupId: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "role" })
  role: EGroupMemberRole;
}

@EntityRepository(GroupMember)
export class GroupMemberRepo extends Repository<GroupMember> {}

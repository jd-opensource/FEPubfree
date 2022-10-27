import * as _ from "lodash";
import { Column, Entity, EntityRepository, PrimaryGeneratedColumn, Repository } from "typeorm";
import { BaseColumn } from "./base/base-column";

@Entity({ name: "user" })
export class User extends BaseColumn {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "password" })
  password: string;

  static purify(user: User): Partial<User> {
    if (_.isNil(user)) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
    };
  }
}

@EntityRepository(User)
export class UserRepo extends Repository<User> {}

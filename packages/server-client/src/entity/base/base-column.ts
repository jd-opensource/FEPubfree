import { Column } from "typeorm";
import { BoolTransform } from "./bool-transform";

export class BaseColumn {
  @Column({
    name: "is_del",
    type: "tinyint",
    transformer: BoolTransform.defaultFalse(),
  })
  isDel: boolean;

  @Column({
    name: "created_at",
    transformer: {
      to(value: any): any {
        return value;
      },
      from(value: any): any {
        return new Date(value).valueOf();
      },
    },
  })
  createdAt: number;

  @Column({
    name: "updated_at",
    transformer: {
      to(value: any): any {
        return value;
      },
      from(value: any): any {
        return new Date(value).valueOf();
      },
    },
  })
  updatedAt: number;
}

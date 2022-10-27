import * as _ from "lodash";

export class BoolTransform {
  public static defaultTrue() {
    return {
      to(value: boolean): 1 | 0 {
        if (_.isNil(value)) {
          return 1;
        }
        return value === true ? 1 : 0;
      },
      from(value: 1 | 0): boolean {
        if (_.isNil(value)) {
          return true;
        }
        return value === 1;
      },
    };
  }

  public static defaultFalse() {
    return {
      to(value: boolean): 1 | 0 {
        if (_.isNil(value)) {
          return 0;
        }
        return value === true ? 1 : 0;
      },
      from(value: 1 | 0): boolean {
        if (_.isNil(value)) {
          return false;
        }
        return value === 1;
      },
    };
  }
}

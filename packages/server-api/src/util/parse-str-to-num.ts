import * as _ from "lodash";

export function parseStrToNum(value: string) {
  if (!_.isNil(value)) {
    return +value;
  }
  return undefined;
}

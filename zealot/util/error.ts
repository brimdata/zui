import { isObject } from "./utils.ts";

export function createError(input: any) {
  if (input instanceof Error) return input;
  if (isObject(input)) {
    const e = Object.assign(new Error(), input);
    if (input.error) {
      e.message = input.error;
    }
    if (input.kind) {
      e.name = input.kind;
    }
    return e;
  }
  return new Error(input);
}

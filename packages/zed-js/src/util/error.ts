import { isObject, isString } from './utils';

export function createError(input: unknown) {
  if (input instanceof Error) return input;
  if (isObject(input)) {
    const e = Object.assign(new Error(), input);
    if ('error' in input && isString(input.error)) {
      e.message = input.error;
    }
    if ('kind' in input && isString(input.kind)) {
      e.name = input.kind;
    }
    return e;
  }
  if (isString(input)) return new Error(input);

  return new Error('Unknown Error');
}

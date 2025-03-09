export function isAlias(name: string | number) {
  // an alias is a non-integer string
  return isNaN(name as number);
}

/* @flow */

export function merge(obj1: Object, obj2: Object) {
  return {...obj1, ...obj2}
}

export function deleteIf(obj: *, condFn: (prop: *) => boolean) {
  let newObj = {...obj}
  for (let key in newObj) {
    if (condFn(newObj[key])) delete newObj[key]
  }
  return newObj
}

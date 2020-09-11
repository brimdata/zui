export function merge(obj1: Object, obj2: Object) {
  return {...obj1, ...obj2}
}

export function deleteIf(obj: any, condFn: (prop: any) => boolean) {
  let newObj = {...obj}
  for (let key in newObj) {
    if (condFn(newObj[key])) delete newObj[key]
  }
  return newObj
}

export function extract(obj: Object, ...props: string[]) {
  let newObj = {}
  for (let key of props) {
    newObj[key] = obj[key]
    delete obj[key]
  }
  return newObj
}

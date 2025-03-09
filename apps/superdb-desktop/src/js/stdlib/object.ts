export function merge(obj1: Object, obj2: Object) {
  return {...obj1, ...obj2}
}

export function deleteIf(obj: any, condFn: (prop: any) => boolean) {
  const newObj = {...obj}
  for (const key in newObj) {
    if (condFn(newObj[key])) delete newObj[key]
  }
  return newObj
}

export function extract(obj: Object, ...props: string[]) {
  const newObj = {}
  for (const key of props) {
    newObj[key] = obj[key]
    delete obj[key]
  }
  return newObj
}

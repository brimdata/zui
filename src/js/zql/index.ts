import {toZql} from "./toZql"

export default function zql(strings, ...vars) {
  let result = ""

  for (let i = 0; i < vars.length; ++i) {
    result += strings[i] + toZql(vars[i])
  }

  result += strings[vars.length]

  return result
}

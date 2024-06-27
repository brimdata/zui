import {toZedScript} from "./toZedScript"

export default function zedScript(strings, ...vars) {
  let result = ""

  for (let i = 0; i < vars.length; ++i) {
    result += strings[i] + toZedScript(vars[i])
  }

  result += strings[vars.length]

  return result
}

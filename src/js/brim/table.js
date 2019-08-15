/* @flow */
import brim from "./"

export default function table() {
  let descriptor = []
  let tuples = []

  return {
    col(name: string, type: string) {
      descriptor.push({name, type})
      return this
    },
    row(data: string[]) {
      tuples.push(data)
      return this
    },
    toLogs() {
      return tuples.map<*>((tuple) => brim.log(tuple, descriptor))
    }
  }
}

import brim from "./"

export default function table() {
  const descriptor = []
  const tuples = []

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
      return tuples.map<any>((tuple) => brim.log(tuple, descriptor))
    }
  }
}

/* @flow */

export default class Field {
  name: string
  type: string
  value: string

  constructor({name, type, value}: *) {
    this.name = name
    this.type = type
    this.value = value
  }
}

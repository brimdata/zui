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

  cast() {
    return this.value
  }

  queryableValue() {
    let WHITE_SPACE = /\s+/
    let COMMA = /,/
    let quote = [WHITE_SPACE, COMMA].some((reg) => reg.test(this.value))
    if (this.type === "string") quote = true

    return quote ? `"${this.value}"` : this.value
  }

  toString() {
    return [this.name, this.type].join(":") + "\t" + this.value
  }

  static fromString(string: string) {
    let [front, value] = string.split("\t")
    let [name, type] = front.split(":")
    return new Field({name, type, value})
  }
}

export class TimeField extends Field {
  toDate() {
    return new Date(+this.value * 1000)
  }

  cast() {
    return this.toDate()
  }
}

export class IntervalField extends Field {
  cast() {
    return parseFloat(this.value)
  }
}

export class NullField extends Field {
  cast() {
    return null
  }
}

export class CountField extends Field {
  cast() {
    return parseInt(this.value)
  }
}

export default class FieldFiler {
  constructor({name, value, operator}) {
    this.name = name
    this.value = value
    this.operator = operator
  }

  toProgramFragment() {
    return this.name + this.operator + maybeQuotes(this.value)
  }
}

const maybeQuotes = s => (s.includes(" ") ? `"${s}"` : s)

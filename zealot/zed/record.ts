import {ZedField} from "./field"

export class ZedRecord {
  fields: ZedField[] | null
  typeName?: string

  constructor(args: {fields: ZedField[]; typeName?: string}) {
    this.fields = args.fields
    this.typeName = args.typeName
  }

  [Symbol.iterator]() {
    let index = 0
    const next = () =>
      index < this.fields.length
        ? {done: false, value: this.at(index++)}
        : {done: true, value: undefined}

    return {next}
  }

  get columns() {
    return this.fields.map((f) => f.name)
  }

  at(index: number) {
    return this.fields[index].data
  }

  get(name: string) {
    return this.getField(name).data
  }

  try(name: string) {
    try {
      return this.get(name)
    } catch {
      return null
    }
  }

  isUnset() {
    return this.fields === null
  }

  private _getField(name: string) {
    if (this.isUnset()) throw new Error("Record is unset")
    const field = this.fields.find((f) => f.name == name)
    if (!field) throw new UnknownColumnError(name, this.columns)
    return field
  }

  getField(name: string) {
    return name
      .split(".")
      .reduce<ZedField>((field: ZedField, namePart: string) => {
        if (field.data instanceof ZedRecord) {
          return new ZedField({name, data: field.data._getField(namePart).data})
        } else {
          throw new Error("Dot syntax is only for nested records")
        }
      }, new ZedField({name: "", data: this}))
  }

  tryField(name: string) {
    try {
      return this.getField(name)
    } catch {
      return null
    }
  }

  has(name: string) {
    return this.columns.includes(name)
  }

  flatten(prefix = ""): ZedRecord {
    let fields = []

    this.fields.forEach((field) => {
      if (field.data instanceof ZedRecord) {
        const nested = field.data.flatten(field.name + ".")
        fields = fields.concat(nested.fields)
      } else {
        fields.push({data: field.data, name: prefix + field.name})
      }
    })
    return new ZedRecord({fields})
  }

  serialize() {
    return {
      kind: "record",
      typeName: this.typeName,
      fields: this.fields.map((f) => f.serialize())
    }
  }
}

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(", ")
    super(`"${unknown}" not present in [${available}]`)
  }
}

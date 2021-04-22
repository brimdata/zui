import {TypeDef} from "./types/type-def"
import {TypeRecord} from "./types/type-record"
import {StreamObject, Type} from "./zjson"
import primitives from "./types/type-primitives"

export class ZedContext {
  id: number
  typeByStringValue: {}
  typeByName: {}
  typedefs: {}
  typetype: {}

  constructor() {
    this.id = 0
    this.typeByStringValue = {}
    this.typeByName = {}
    this.typedefs = {}
    this.typetype = {}
  }

  decode(objects: StreamObject[]) {
    return objects.map((object) => this.decodeRecord(object))
  }

  decodeRecord({schema, types, values}: StreamObject) {
    const typedefs = {}
    types && types.forEach((type) => this.decodeType(type, typedefs))
    const type = typedefs[schema] as TypeRecord
    return type.create(values, typedefs)
  }

  decodeType(obj: Type, typedefs) {
    switch (obj.kind) {
      case "record":
        return this.lookupTypeRecord(
          obj.fields.map(({name, type}) => ({
            name,
            type: this.decodeType(type, typedefs)
          }))
        )
      case "typedef":
        var type = this.decodeType(obj.type, typedefs)
        typedefs[obj.name] = type
        if (isNaN(obj.name as any)) {
          type = new TypeDef(obj.name, type)
          this.typedefs[obj.name] = type
        }
        return type
      case "primitive":
        var type = primitives[obj.name]
        if (!type) throw `Implement primitive: ${obj.name}`
        return type
      case "typename":
        return typedefs[obj.name]
      default:
        throw `Implement decoding: ${obj.kind}`
    }
  }

  lookupTypeRecord(fields) {
    const string = TypeRecord.stringify(fields)
    if (string in this.typeByStringValue) {
      return this.typeByStringValue[string]
    } else {
      return this.alloc(string, new TypeRecord(fields))
    }
  }

  alloc(key, type) {
    type.id = this.id++
    this.typeByStringValue[key] = type
    this.typeByName[type.id.toString()] = type
    return type
  }
}

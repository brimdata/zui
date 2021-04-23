import {TypeDef} from "./types/type-def"
import {TypeRecord} from "./types/type-record"
import {StreamObject, Type} from "./zjson"
import primitives from "./types/type-primitives"
import {TypeArray} from "./types/type-array"
import {TypeSet} from "./types/type-set"
import {TypeUnion} from "./types/type-union"
import types from "tree-model/types"
import {TypeMap} from "./types/type-map"

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
    const typedefs = {}
    return objects.map((object) => this.decodeRecord(object, typedefs))
  }

  decodeRecord({schema, types, values}: StreamObject, typedefs) {
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
        var innerType = this.decodeType(obj.type, typedefs)
        typedefs[obj.name] = innerType
        if (isNaN(obj.name as any)) {
          var def = new TypeDef(obj.name, innerType)
          this.typedefs[obj.name] = def
        }
        return innerType
      case "primitive":
        var type = primitives[obj.name]
        if (!type) throw `Implement primitive: ${obj.name}`
        return type
      case "typename":
        return typedefs[obj.name]
      case "array":
        return this.lookupTypeArray(this.decodeType(obj.type, typedefs))
      case "set":
        return this.lookupTypeSet(this.decodeType(obj.type, typedefs))
      case "union":
        return this.lookupTypeUnion(
          obj.types.map((t) => this.decodeType(t, typedefs))
        )
      case "map":
        return this.lookupTypeMap(
          this.decodeType(obj.key_type, typedefs),
          this.decodeType(obj.val_type, typedefs)
        )
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

  lookupTypeArray(type) {
    const string = TypeArray.stringify(type)
    if (string in this.typeByStringValue) {
      return this.typeByStringValue[string]
    } else {
      return this.alloc(string, new TypeArray(type))
    }
  }

  lookupTypeSet(type) {
    const string = TypeSet.stringify(type)
    if (string in this.typeByStringValue) {
      return this.typeByStringValue[string]
    } else {
      return this.alloc(string, new TypeSet(type))
    }
  }

  lookupTypeUnion(types) {
    const string = TypeUnion.stringify(types)
    if (string in this.typeByStringValue) {
      return this.typeByStringValue[string]
    } else {
      return this.alloc(string, new TypeUnion(types))
    }
  }

  lookupTypeMap(keyType, valType) {
    const string = TypeMap.stringify(keyType, valType)
    if (string in this.typeByStringValue) {
      return this.typeByStringValue[string]
    } else {
      return this.alloc(string, new TypeMap(keyType, valType))
    }
  }

  alloc(key, type) {
    type.id = this.id++
    this.typeByStringValue[key] = type
    this.typeByName[type.id.toString()] = type
    return type
  }
}

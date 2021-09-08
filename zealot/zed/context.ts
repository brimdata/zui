import * as zjson from "../zjson"
import {TypeAlias} from "./types/type-alias"
import {TypeArray} from "./types/type-array"
import {TypeMap} from "./types/type-map"
import primitives, {PrimitiveNames} from "./types/type-primitives"
import {TypeField, TypeField, TypeRecord} from "./types/type-record"
import {TypeSet} from "./types/type-set"
import {TypeUnion} from "./types/type-union"
import {ContainerTypeInterface, ZedType} from "./types/types"
import {isAlias, isNull, typeId} from "./utils"
import {Field} from "./values/field"
import {Record} from "./values/record"

export class ZedContext {
  private id = 23
  private typeByShape: {[shape: string]: ZedType} = {}
  public typeById: {[id: string]: ZedType} = {}
  private typetype: unknown = {}

  decode(objects: zjson.RootRecord[], typedefs = {}): Record[] {
    return objects.map((object) => this.decodeRecord(object, typedefs))
  }

  decodeRecord(
    {schema, types, values}: zjson.RootRecord,
    typedefs: {[id: string]: ZedType} = {}
  ): Record {
    types && types.forEach((type) => this.decodeType(type, typedefs))
    const type = typedefs[schema]
    return type.create(values, typedefs)
  }

  // @ts-ignore
  decodeType(obj: zjson.Type, typedefs: {[id: string]: ZedType} = {}) {
    // All types with the same shape in a zed context must point to the same type instance. When
    // decoding a stream of zjson, use the following logic to get the correct type instance.
    //
    // Primitive Type: Lookup the singleton primitive type in the primitives table and return it.
    //
    // Container Type: Lookup the container type based on its stringified representation. If that
    //                 does not exist, create a new type, give it a local id, and save in the
    //                 context (saved in this.typeById & this.typeByShape). Return the
    //                 new type instance.
    //
    //       Type Def: Decode it's type (which will go through the steps above). Save the decoded
    //                 inner type to the stream-scoped typedefs table key'd by the typedef name.
    //                 If the typedef's name is not a number, it is a user-defined typename. So,
    //                 create a new alias type with the name and decoded type. Save it in the
    //                 context in this.typeAliases. Return the alias type.
    //
    //      Type Name: If the name is an integer, lookup the type in the stream-scoped typedefs
    //                 table, and return it. If it is not, it is an alias. Look it up in the
    //                 context's typeAliases table, and return it.

    switch (obj.kind) {
      // Primitives
      case "primitive":
        var type = primitives[obj.name as PrimitiveNames]
        if (!type) throw `Implement primitive: ${obj.name}`
        return type

      // Containers
      case "record":
        return this.lookupTypeRecord(
          isNull(obj.fields)
            ? null
            : obj.fields.map(({name, type}) => {
                return {
                  name,
                  type: this.decodeType(type, typedefs)
                }
              })
        )
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

      // Type Definitions
      case "typedef":
        var innerType: ZedType = this.decodeType(obj.type, typedefs)
        return (typedefs[obj.name] = isAlias(obj.name)
          ? this.lookupTypeAlias(obj.name, innerType)
          : innerType)
      case "typename":
        return typedefs[obj.name]
      default:
        throw `Implement decoding: ${obj.kind}`
    }
  }

  lookupTypeRecord(fields: TypeField[]) {
    const key = TypeRecord.stringify(fields)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      return this.alloc(key, new TypeRecord(fields))
    }
  }

  lookupTypeArray(type: ZedType) {
    const key = TypeArray.stringify(type)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      return this.alloc(key, new TypeArray(type))
    }
  }

  lookupTypeSet(type) {
    const key = TypeSet.stringify(type)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      return this.alloc(key, new TypeSet(type))
    }
  }

  lookupTypeUnion(types) {
    const key = TypeUnion.stringify(types)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      return this.alloc(key, new TypeUnion(types))
    }
  }

  lookupTypeMap(keyType, valType) {
    const key = TypeMap.stringify(keyType, valType)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      return this.alloc(key, new TypeMap(keyType, valType))
    }
  }

  lookupTypeAlias(name, type) {
    const key = TypeAlias.stringify(name, type)
    if (key in this.typeByShape) {
      return this.typeByShape[key]
    } else {
      const alias = new TypeAlias(name, type)
      // Do we need to save it twice?
      this.typeById[name] = alias
      return this.alloc(key, new TypeAlias(name, type))
    }
  }

  alloc(key, type) {
    type.id = this.id++ // Typescript doesn't know about this id yet...
    this.typeByShape[key] = type
    this.typeById[type.id.toString()] = type
    return type
  }

  encode(records) {
    const typedefs = {}
    return records.map((record) => this.encodeRecord(record, typedefs))
  }

  encodeRecord(record: Record, typedefs = {}) {
    const types = []
    const values = record.serialize()
    const schema = typeId(record.type)
    this.encodeTypeDef(schema, typedefs, types)

    record.type.walkTypeValues(this, values, (typeName) => {
      this.encodeTypeDef(typeName, typedefs, types)
    })

    return types.length === 0 ? {schema, values} : {schema, types, values}
  }

  encodeTypeDef(name, typedefs, types) {
    if (name in primitives || name in typedefs) return
    let type = this.typeById[name]
    const typedef = isAlias(name)
      ? type.serialize(typedefs)
      : {
          name,
          kind: "typedef",
          type: type.serialize(typedefs)
        }
    types.push(typedef)
    typedefs[name] = typedef
  }

  walkTypeValues(type: ZedType, value: zjson.Value, visit) {
    if (this.hasTypeType(type)) {
      type.walkTypeValues(this, value, visit)
    }
  }

  hasTypeType(type): type is ContainerTypeInterface {
    const name = typeId(type)
    if (name in this.typetype) return this.typetype[name]

    const bool = type.hasTypeType && type.hasTypeType(this)
    this.typetype[name] = bool
    return bool
  }

  decodeField(obj: zjson.FieldRootRecord) {
    // Grab the first field and return it
    const transport = this.decodeRecord(obj)
    return transport.fieldAt(0)
  }

  encodeField(field: Field) {
    // Wrap a field in a record to encode
    const type = this.lookupTypeRecord([
      {name: field.name, type: field.value.type}
    ])

    const transport = type.create([field.value.serialize()], {...this.typeById})
    return this.encodeRecord(transport)
  }
}

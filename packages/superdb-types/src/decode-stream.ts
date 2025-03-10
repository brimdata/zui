import * as zjson from './zjson';
import { TypeDefs, ZedContext } from './context';
import { TypeField } from './types/type-field';
import { PrimitiveName } from './types/type-primitives';
import { Type } from './types/types';
import { getPrimitiveType } from './utils/get-primitive-type';

export class DecodeStream {
  public typedefs: TypeDefs = {};

  constructor(private context: ZedContext) {}

  decode(object: zjson.Obj) {
    const type = this.decodeType(object.type);
    return type.create(object.value, this);
  }

  decodeType(obj: zjson.Type): Type {
    const type = this.buildType(obj);
    if ('id' in obj && obj.kind !== 'ref') {
      this.typedefs[obj.id] = type;
    }
    return type;
  }

  buildType(obj: zjson.Type) {
    switch (obj.kind) {
      case 'primitive':
        return getPrimitiveType(obj.name as PrimitiveName);
      case 'ref':
        return this.typedefs[obj.id];
      case 'named':
        return this.context.lookupTypeAlias(
          obj.name,
          this.decodeType(obj.type)
        );
      case 'array':
        return this.context.lookupTypeArray(this.decodeType(obj.type));
      case 'set':
        return this.context.lookupTypeSet(this.decodeType(obj.type));
      case 'error':
        return this.context.lookupErrorType(this.decodeType(obj.type));
      case 'union':
        return this.context.lookupTypeUnion(
          obj.types.map((t) => this.decodeType(t))
        );
      case 'map':
        return this.context.lookupTypeMap(
          this.decodeType(obj.key_type),
          this.decodeType(obj.val_type)
        );
      case 'record':
        return this.context.lookupTypeRecord(
          obj.fields === null
            ? null
            : obj.fields.map(({ name, type }) => {
                return new TypeField(name, this.decodeType(type));
              })
        );
      default:
        throw `Implement decoding: ${obj.kind}`;
    }
  }
}

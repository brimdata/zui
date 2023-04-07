import {zed} from "@brimdata/zed-js"
import {InspectArgs} from "../types"
import {ArrayView} from "./array-view"
import {ErrorView} from "./error-view"
import {MapView} from "./map-view"
import {NullView} from "./null-view"
import {RecordView} from "./record-view"
import {SetView} from "./set-view"
import {StringView} from "./string-view"
import {TypeValueView} from "./type-value-view"
import {TypeRecordView} from "./type-record-view"
import {TypeUnionView} from "./type-union-view"
import {View} from "./view"
import {ExplicitPrimitiveView} from "./explicit-primitive-view"

export function createView(args: InspectArgs): View {
  const CustomView = args.ctx.customViews.find((v) => v.when(args))
  if (CustomView) {
    return new CustomView(args)
  }

  // VALUES

  // * unset
  if (!zed.isType(args.value) && args.value.isUnset()) return new NullView(args)
  // * record
  if (args.value instanceof zed.Record) return new RecordView(args)
  // * array
  if (args.value instanceof zed.Array) return new ArrayView(args)
  // * set
  if (args.value instanceof zed.Set) return new SetView(args)
  // * map
  if (args.value instanceof zed.Map) return new MapView(args)
  // * string
  if (args.value instanceof zed.String) return new StringView(args)
  // * error
  if (args.value instanceof zed.Error) return new ErrorView(args)
  // * union
  if (args.value instanceof zed.Union)
    return createView({...args, value: args.value.value})
  // * type value
  if (args.value instanceof zed.TypeValue)
    return createView({...args, value: args.value.value})

  if (zed.isInt(args.value) && !(args.value instanceof zed.Int64)) {
    return new ExplicitPrimitiveView(args)
  }

  if (zed.isFloat(args.value) && !(args.value instanceof zed.Float64)) {
    return new ExplicitPrimitiveView(args)
  }

  // TYPES

  if (args.value instanceof zed.TypeRecord) {
    return new TypeRecordView(args)
  }

  if (args.value instanceof zed.TypeUnion) return new TypeUnionView(args)

  if (args.value instanceof zed.TypeAlias)
    return createView({...args, value: args.value.type, type: args.value})

  if (zed.isType(args.value)) return new TypeValueView(args)

  // * type union
  // * type alias
  // * type error
  // * type array
  // * type set
  // * type map

  // ALL THE REST
  return new View(args)
}

import {zed} from "@brimdata/zealot"
import {InspectArgs} from "../types"
import {ArrayView} from "./array-view"
import {ErrorView} from "./error-view"
import {MapView} from "./map-view"
import {NullView} from "./null-view"
import {RecordView} from "./record-view"
import {SetView} from "./set-view"
import {StringView} from "./string-view"
import {TypeRecordView} from "./type-record-view"
import {View} from "./view"

export function createView(args: InspectArgs) {
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

  // TYPES

  // * type record
  if (args.value instanceof zed.TypeRecord) return new TypeRecordView(args)
  // * type union
  // * type alias
  // * type error
  // * type array
  // * type set
  // * type map

  // ALL THE REST
  return new View(args)
}

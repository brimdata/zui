import {zed} from "@brimdata/zealot"
import {createContainer} from "./create-container"
import {renderOneField} from "./render"
import {InspectArgs} from "./types"

export function inspect(args: InspectArgs) {
  const {value} = args
  if (zed.isType(value)) {
    inspectType({...args, value})
  } else {
    inspectValue({...args, value})
  }
}

function inspectType(args: InspectArgs & {value: zed.Type}) {
  const {ctx, value} = args
  if (
    zed.isPrimitiveType(value) ||
    value instanceof zed.TypeArray ||
    value instanceof zed.TypeSet ||
    value instanceof zed.TypeMap
  ) {
    ctx.push(renderOneField(args))
  } else if (value instanceof zed.TypeRecord) {
    inspectRecordType({...args, value})
  } else if (value instanceof zed.TypeUnion) {
    inspectUnionType({...args, value})
  } else if (value instanceof zed.TypeAlias) {
    inspectType({...args, value: value.type, type: value})
  } else if (value instanceof zed.TypeError) {
    inspectErrorType({...args, value: value})
  } else {
    console.log("No Way To Inpsect: " + value.constructor.name)
  }
}

function inspectValue(args: InspectArgs & {value: zed.Value}) {
  const {ctx, value} = args

  if (value.isUnset() || zed.isPrimitive(value)) {
    ctx.push(renderOneField(args))
  } else if (value instanceof zed.Record) {
    inspectRecord({...args, value})
  } else if (value instanceof zed.Array) {
    inspectArray({...args, value})
  } else if (value instanceof zed.Set) {
    inspectSet({...args, value})
  } else if (value instanceof zed.Map) {
    inspectMap({...args, value})
  } else if (value instanceof zed.Union) {
    inspect({...args, value: value.value})
  } else if (value instanceof zed.TypeValue) {
    inspect({...args, value: value.value})
  } else if (value instanceof zed.Error) {
    inspectError({...args, value})
  } else {
    console.log("No Way To Inpsect: " + value.constructor.name)
  }
}

export const inspectRecord = createContainer<zed.Record>(
  "Record",
  "{",
  "}",
  function* iterateRecord(args: InspectArgs & {value: zed.Record}) {
    const {value} = args
    for (let i = 0; i < value.fields.length; ++i) {
      const field = value.fields[i]
      yield {
        ...args,
        value: field.value,
        field,
        last: i === value.fields.length - 1,
        key: field.name,
        type: field.value.type,
        indexPath: [...args.indexPath, i]
      }
    }
  }
)

export const inspectArray = createContainer<zed.Array>(
  "Array",
  "[",
  "]",
  function* iterateArray(args: InspectArgs & {value: zed.Array}) {
    const {ctx, value} = args
    for (let i = 0; i < value.items.length; ++i) {
      const indexPath = [...args.indexPath, i]
      yield {
        ...args,
        value: value.items[i],
        last: i === value.items.length - 1,
        key: ctx.props.isExpanded(indexPath.join(",")) ? i.toString() : null,
        indexPath
      }
    }
  }
)

export const inspectSet = createContainer<zed.Set>(
  "Set",
  "|[",
  "]|",
  function* iterateSet(args: InspectArgs & {value: zed.Array}) {
    const {ctx, value} = args
    for (let i = 0; i < value.items.length; ++i) {
      const indexPath = [...args.indexPath, i]
      yield {
        ...args,
        value: value.items[i],
        last: i === value.items.length - 1,
        key: ctx.props.isExpanded(indexPath.join(",")) ? i.toString() : null,
        indexPath
      }
    }
  }
)

export const inspectMap = createContainer<zed.Map>(
  "Map",
  "|{",
  "}|",
  function* iterateMap(args: InspectArgs & {value: zed.Map}) {
    const {value} = args
    const map = (value as zed.Map).value
    let i = 0
    for (let key of map.keys()) {
      yield {
        ...args,
        value: map.get(key),
        last: i === map.size - 1,
        key: key,
        indexPath: [...args.indexPath, i]
      }
      i++
    }
  }
)

export const inspectError = createContainer<zed.Error>(
  "Error",
  "(",
  ")",
  function* iterateError(args: InspectArgs & {value: zed.Error}) {
    yield {
      ...args,
      value: args.value.value,
      key: 0,
      last: true,
      indexPath: [...args.indexPath, 0]
    }
  }
)

export const inspectErrorType = createContainer<zed.TypeError>(
  "Error",
  "(",
  ")",
  function* iterateError(args: InspectArgs & {value: zed.TypeError}) {
    yield {
      ...args,
      value: args.value.type,
      key: 0,
      last: true,
      indexPath: [...args.indexPath, 0]
    }
  }
)

export const inspectRecordType = createContainer<zed.TypeRecord>(
  "Record",
  "{",
  "}",
  function*(args: InspectArgs & {value: zed.TypeRecord}) {
    const {value} = args
    for (let i = 0; i < value.fields.length; i++) {
      const field = value.fields[i]
      yield {
        ...args,
        key: field.name,
        value: field.type,
        type: field.type,
        last: i === value.fields.length - 1,
        indexPath: [...args.indexPath, i]
      }
    }
  }
)

export const inspectUnionType = createContainer<zed.TypeUnion>(
  "Union",
  "(",
  ")",
  function*(args: InspectArgs & {value: zed.TypeUnion}) {
    const {ctx, value} = args
    for (let i = 0; i < value.types.length; i++) {
      const type = value.types[i]
      const indexPath = [...args.indexPath, i]
      yield {
        ...args,
        key: ctx.props.isExpanded(indexPath.join(",")) ? i.toString() : null,
        value: type,
        type: type,
        last: i === value.types.length - 1,
        indexPath
      }
    }
  }
)

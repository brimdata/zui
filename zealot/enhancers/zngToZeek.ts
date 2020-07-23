import { isString } from "../util/utils.ts";
import { Record, Payload, ZngTypeDef } from "../types.ts";

const COMPOUND_FIELD_RGX = /^(set|array)\[(\w+)\]$/;

function getSingleZeekType(type: string): string {
  switch (type) {
    case "byte":
    case "int16":
    case "int32":
    case "int64":
    case "uint16":
    case "uint32":
      return "int";
    case "uint64":
      return "count";
    case "float64":
      return "double";
    case "ip":
      return "addr";
    case "net":
      return "subnet";
    case "duration":
      return "interval";
    case "bstring":
      return "string";
    case "zenum":
      return "enum";
    default:
      return type;
  }
}

function getZeekType(type: string): string {
  const match = type.match(COMPOUND_FIELD_RGX);
  if (match) {
    const [_, container, itemType] = match;
    const zeekType = getSingleZeekType(itemType);
    return `${container}[${zeekType}]`;
  } else {
    return getSingleZeekType(type);
  }
}

function recursiveReplace(zng: string | ZngTypeDef): string | ZngTypeDef {
  if (isString(zng)) return getZeekType(zng);
  else return replaceTypes(zng);
}

export function replaceTypes(zng: ZngTypeDef): ZngTypeDef {
  return zng.map((t) => ({
    name: t.name,
    type: recursiveReplace(t.type),
  }));
}

function replaceTypesInRecord(record: Record) {
  if (record.type) record.type = replaceTypes(record.type);
  return record;
}

export function zngToZeek() {
  return (payload: Payload) => {
    if (payload.type === "SearchRecords") {
      return {
        ...payload,
        records: payload.records.map((r) => replaceTypesInRecord(r)),
      };
    } else {
      return payload;
    }
  };
}

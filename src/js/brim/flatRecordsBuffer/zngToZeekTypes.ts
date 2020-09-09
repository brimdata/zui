import { COMPOUND_FIELD_RGX } from "../compoundField";
import { isString } from "../../lib/is";

type ZngRecordType = { name: string; type: ZngRecordType | string }[];

export default function zngToZeekTypes(zng: ZngRecordType): ZngRecordType {
  return zng.map((t) => ({
    name: t.name,
    type: recursiveReplace(t.type),
  }));
}

function recursiveReplace(zng: ZngRecordType | string): ZngRecordType | string {
  if (isString(zng)) return getZeekType(zng);
  else return zngToZeekTypes(zng);
}

function getZeekType(type: string): string {
  let match = type.match(COMPOUND_FIELD_RGX);
  if (match) {
    let [_, container, itemType] = match;
    let zeekType = getSingleZeekType(itemType);
    return `${container}[${zeekType}]`;
  } else {
    return getSingleZeekType(type);
  }
}

function getSingleZeekType(type) {
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

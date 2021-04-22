export function typeId(type) {
  switch (type.kind) {
    case "primitive":
    case "typedef":
      return type.name
    default:
      return type.id.toString()
  }
}

import program from "src/js/models/program"

export function cutColumns(query: string, names: string[]) {
  return program(query)
    .quietCut(...names)
    .string()
}

export function addFuse(query: string) {
  return query + " | fuse"
}

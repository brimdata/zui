import program from "src/js/models/program"

export function cutColumns(query: string, names: string[]) {
  return program(query)
    .quietCut(...names)
    .string()
}

export function addFuse(query: string) {
  return query + " | fuse"
}

export function addLoad(query: string, poolId) {
  return query + " | load " + poolId
}

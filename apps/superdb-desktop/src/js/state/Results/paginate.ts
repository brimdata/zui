export function paginate(query: string, perPage: number, page: number) {
  return `${query}
  | skip ${(page - 1) * perPage}
  | limit ${perPage}`
}

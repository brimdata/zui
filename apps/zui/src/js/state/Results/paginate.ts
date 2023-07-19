export function paginate(query: string, perPage: number, page: number) {
  return `${query}
  | { i: count(), v: this}
  | i > ${(page - 1) * perPage}
  | head ${perPage}
  | yield v`
}

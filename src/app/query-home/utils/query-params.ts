export const encodeQueryParams = () => {
  const p = new URLSearchParams()
  return p.toString()
}

// Will begin using this again when we start to encode ?version= in the url
export type DecodedQueryParams = {}
export const decodeQueryParams = (_path: string): DecodedQueryParams => {
  // const url = new URLSearchParams(path)
  return {}
}

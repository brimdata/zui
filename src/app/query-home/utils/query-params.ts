export type DecodedQueryParams = {
  isDraft?: boolean
}

export const encodeQueryParams = ({
  isDraft = false
}: Partial<DecodedQueryParams>) => {
  const p = new URLSearchParams()
  encodeBool(p, isDraft, "isDraft")
  return p.toString()
}

export const decodeQueryParams = (path: string): DecodedQueryParams => {
  const url = new URLSearchParams(path)
  return {
    isDraft: decodeBool(url, "isDraft")
  }
}

const encodeBool = (params, value, name) => {
  if (value) {
    params.set(name, "true")
  }
}

const decodeBool = (params, name) => {
  const value = params.get(name)
  return value === "true"
}

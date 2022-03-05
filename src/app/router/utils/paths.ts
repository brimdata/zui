import {
  DecodedSearchParams,
  encodeSearchParams
} from "src/app/search/utils/search-params"
import {encodeQueryParams} from "../../query-home/utils/query-params"

export const lakesPath = () => {
  return "/lakes"
}

export const lakePath = (id: string) => {
  return `${lakesPath()}/${id}`
}

export const lakeImportPath = (lakeId: string) => {
  return `${lakePath(lakeId)}/import`
}

export const lakePoolPath = (poolId: string, lakeId: string) => {
  return `${lakePath(lakeId)}/pools/${poolId}`
}

// TODO: deprecate this when we remove 'query-flow' feature-flag
type Params = Partial<DecodedSearchParams>
export function poolSearchPath(
  poolId: string,
  lakeId: string,
  params: Params = {}
) {
  return `${lakePoolPath(poolId, lakeId)}/search?${encodeSearchParams(params)}`
}

export function lakeQueryPath(
  queryId: string,
  lakeId: string,
  params: {isDraft?: boolean}
) {
  const pathname = `${lakePath(lakeId)}/queries/${queryId}`
  const search = encodeQueryParams(params)
  if (search.length) {
    return pathname + "?" + search
  } else {
    return pathname
  }
}

export function releaseNotesPath(lakeId) {
  if (lakeId) {
    return `${lakePath(lakeId)}/release-notes`
  } else {
    return "/release-notes"
  }
}

import {
  DecodedSearchParams,
  encodeSearchParams,
} from "src/app/search/utils/search-params"

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
  version?: string
) {
  const path = `${lakePath(lakeId)}/queries/${queryId}`
  return version ? `${path}/versions/${version}` : path
}

export function releaseNotesPath(lakeId) {
  if (lakeId) {
    return `${lakePath(lakeId)}/release-notes`
  } else {
    return "/release-notes"
  }
}

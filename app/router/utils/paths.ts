import {
  DecodedSearchParams,
  encodeSearchParams
} from "app/search/utils/search-params"

export function workspacesPath() {
  return "/workspaces"
}

export function workspacePath(id: string) {
  return `/workspaces/${id}`
}

export function lakePath(id: string, parentId: string) {
  return `${workspacePath(parentId)}/lakes/${id}`
}

type Params = Partial<DecodedSearchParams>
export function lakeSearchPath(id: string, parentId: string, params: Params) {
  return `${lakePath(id, parentId)}/search?${encodeSearchParams(params)}`
}

export function lakeSummaryPath(id: string, parentId: string) {
  return `${lakePath(id, parentId)}/summary`
}

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

export function lakeImportPath(workspaceId: string) {
  return `${workspacePath(workspaceId)}/lakes/import`
}

export function lakePath(id: string, workspaceId: string) {
  return `${workspacePath(workspaceId)}/lakes/${id}`
}

type Params = Partial<DecodedSearchParams>
export function lakeSearchPath(
  id: string,
  workspaceId: string,
  params: Params = {}
) {
  return `${lakePath(id, workspaceId)}/search?${encodeSearchParams(params)}`
}

export function releaseNotesPath(workspaceId: string | null) {
  if (workspaceId) {
    return `${workspacePath(workspaceId)}/release-notes`
  } else {
    return "/release-notes"
  }
}

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

export function lakeQueryPath(
  queryId: string,
  lakeId: string,
  version: string
) {
  return `${lakePath(lakeId)}/queries/${queryId}/versions/${version}`
}

export function releaseNotesPath(lakeId) {
  if (lakeId) {
    return `${lakePath(lakeId)}/release-notes`
  } else {
    return "/release-notes"
  }
}
// The lake needs to not be in the url, I think.
// Or at least, the sidebar needs to work even if the page
// that is in the tab doesn't need a lake at all.
export function welcomePath(lakeId: string) {
  if (lakeId) {
    return `${lakePath(lakeId)}/welcome`
  } else {
    return "/welcome"
  }
}

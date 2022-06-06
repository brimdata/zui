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

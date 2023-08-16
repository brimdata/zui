import * as path from "path"

export async function derivePoolName(files: string[], existingNames: string[]) {
  let name: string
  if (files.length === 0) {
    name = "Pool 1"
  } else if (files.length === 1) {
    name = path.basename(files[0])
  } else if (inSameDir(files)) {
    name = path.basename(path.dirname(files[0]))
  } else {
    name = `Pool from ${files.length} files`
  }
  return getUniqName(name, existingNames)
}

function inSameDir(paths: string[]) {
  let dirName = null
  for (let p of paths) {
    if (dirName === null) dirName = path.dirname(p)
    if (dirName !== path.dirname(p)) return false
  }
  return true
}

function join(name: string, num: number) {
  return num === 0 ? name : [name, `(${num})`].join(" ")
}

function getUniqName(proposal: string, existing: string[]) {
  let i = 0
  while (existing.includes(join(proposal, i))) i++
  return join(proposal, i)
}

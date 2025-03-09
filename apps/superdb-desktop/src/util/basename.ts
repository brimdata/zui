export function basename(fullPath: string) {
  return fullPath.replace(/^.*[\\/]/, "")
}

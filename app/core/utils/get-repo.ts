import pkg from "./package-json"

export function getRepo(url = pkg.repository) {
  return new URL(url).pathname.slice(1)
}

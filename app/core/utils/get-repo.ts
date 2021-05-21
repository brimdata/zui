import packageJSON from "./package-json"

export async function getRepo(url?: string) {
  url = url || (await packageJSON()).repository
  return new URL(url).pathname.slice(1)
}

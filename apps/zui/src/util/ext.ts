import {basename} from "./basename"

export function ext(path: string) {
  const parts = basename(path).split(".")
  return parts.at(-1)
}

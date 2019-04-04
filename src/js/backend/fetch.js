/* @flow */
import type {Thunk} from "../reducers/types"

export const fetchSpaces = (): Thunk => (_d, _g, boom) => {
  return boom.spaces.list()
}

export const fetchSpace = (name: string): Thunk => (_d, _g, boom) => {
  return boom.spaces.get(name)
}

export const fetchLookytalkVersions = (): Thunk => (_d, _g, boom) => {
  return boom.serverVersion().then(({lookytalk}) => {
    return {
      server: lookytalk,
      client: boom.clientVersion().lookytalk
    }
  })
}

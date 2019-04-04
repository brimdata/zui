/* @flow */
import type {Thunk} from "../reducers/types"

export const fetchSpaces = (): Thunk => (_d, _g, boom) => {
  return boom.spaces.list()
}

export const fetchSpace = (name: string): Thunk => (_d, _g, boom) => {
  return boom.spaces.get(name)
}

/* @flow */
import type {Span} from "../BoomClient/types"
import type {Thunk} from "../state/reducers/types"

export function fetchSearch(program: string, span: Span, space: string): Thunk {
  return (d, g, boom) =>
    boom.search(program, {searchSpan: span, searchSpace: space})
}

export function fetchSpaces(): Thunk {
  return (d, g, boom) => boom.spaces.list()
}

export function fetchSpace(name: string): Thunk {
  return (d, g, boom) => boom.spaces.get(name)
}

export function fetchLookytalkVersions(): Thunk {
  return (d, g, boom) =>
    boom.serverVersion().then(({lookytalk}) => ({
      server: lookytalk,
      client: boom.clientVersion().lookytalk
    }))
}

export function boomFetchDescriptors(space: string, id: string): Thunk {
  return (d, g, boom) => boom.descriptors.get(space, id)
}

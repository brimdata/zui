import {QueryPin} from "src/js/state/Editor/types"
import {Query} from "src/js/state/Queries/types"

export type CreateQueryParams = Partial<Query> & {
  type?: QuerySource
  parentId?: string | null
}

export type OpenQueryOptions = {
  history?: boolean | "replace"
  version?: string
  tabId?: string
}

export type QueryParams = {
  pins: QueryPin[]
  value: string
}

export type Select = <T extends (...args: any) => any>(
  selector: T
) => ReturnType<T>

export type QuerySource = "local" | "session"

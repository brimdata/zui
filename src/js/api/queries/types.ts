import {QueryPin} from "src/js/state/Editor/types"

export type CreateQueryParams = {name: string}

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

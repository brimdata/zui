import {createContext, useContext} from "react"
import {ListProps} from "./types"

export const ListContext = createContext<ListProps<any>>(null)

export const useListContext = (): ListProps<any> => {
  const ctx = useContext(ListContext)
  if (ctx) return ctx
  throw new Error("Context must be set first")
}

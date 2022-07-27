import {FormEvent} from "react"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import Layout from "src/js/state/Layout"
import {ActiveQuery} from "./active-query"

export function useHeadingForm(active: ActiveQuery) {
  const api = useBrimApi()
  const dispatch = useDispatch()
  const action = useSelector(Layout.getTitleFormAction)

  function createNewQuery(name: string) {
    const q = api.queries.create(name)
    api.queries.open(q.id)
  }

  function renameQuery(name: string) {
    api.queries.rename(active.query.id, name)
  }

  function getInput(e: FormEvent<HTMLFormElement>) {
    return e.currentTarget.elements.namedItem("query-name") as HTMLInputElement
  }

  return {
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = getInput(e)
      if (!input) {
        throw new Error("Could not find input in query title form")
      }
      if (active.isAnonymous() || action === "create") {
        createNewQuery(input.value)
      } else {
        renameQuery(input.value)
      }
      dispatch(Layout.hideTitleForm())
    },
    onReset: () => dispatch(Layout.hideTitleForm()),
  }
}

import {FormEvent} from "react"
import {useSelector} from "react-redux"
import {useBrimApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import Layout from "src/js/state/Layout"
import {useActiveQuery} from "./context"
import {plusOne} from "./plus-one"

export function useHeadingForm() {
  const active = useActiveQuery()
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

  function getDefaultValue() {
    if (action === "create" && active.name()) {
      return plusOne(active.name())
    } else {
      return active.name()
    }
  }

  function getButtonText() {
    return action === "create" ? "Create" : "Update"
  }

  return {
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = getInput(e)
      if (!input) {
        dispatch(Layout.hideTitleForm())
        return
      }
      if (action === "update" && input.value === getDefaultValue()) {
        dispatch(Layout.hideTitleForm())
        return
      }
      if (active.isAnonymous() || action === "create") {
        createNewQuery(input.value)
      } else {
        renameQuery(input.value)
      }
      dispatch(Layout.hideTitleForm())
    },
    onReset: () => dispatch(Layout.hideTitleForm()),
    defaultValue: getDefaultValue(),
    buttonText: getButtonText(),
  }
}

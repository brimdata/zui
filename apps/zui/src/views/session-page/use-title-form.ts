import {FormEvent} from "react"
import {useSelector} from "react-redux"
import * as queries from "src/app/commands/queries"
import {useZuiApi} from "src/app/core/context"
import {useDispatch} from "src/app/core/state"
import Layout from "src/js/state/Layout"
import Current from "src/js/state/Current"

export function useTitleForm() {
  const active = useSelector(Current.getActiveQuery)
  const api = useZuiApi()
  const dispatch = useDispatch()

  return {
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const input = e.currentTarget.elements.namedItem("query-name") as any
      const name = input.value.trim() || ""

      if (name.length) {
        if (active.isSaved()) {
          api.queries.rename(active.query.id, name)
        } else {
          queries.save.run(name)
        }
      }
      dispatch(Layout.hideTitleForm())
    },
    onReset: () => dispatch(Layout.hideTitleForm()),
  }
}

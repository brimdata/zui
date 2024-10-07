import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"

export const submitSearch = createHandler(() => {
  const session = Active.querySession
  const snapshot = Active.snapshot
  const editorState = Active.editorState

  if (snapshot.equals(editorState)) {
    session.reload()
  } else {
    session.navigate(editorState)
  }
})

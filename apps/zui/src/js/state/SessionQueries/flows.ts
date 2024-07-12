import SessionQueries from "."

export const init = (id: string) => (dispatch) => {
  dispatch(SessionQueries.set({id, name: "Query Session"}))
}

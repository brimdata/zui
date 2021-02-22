import initTestStore from "src/js/test/initTestStore"

export default function reduxTest(...args) {
  let dispatch, select

  beforeEach(() => {
    const store = initTestStore(...args)
    select = (f) => f(store.getState())
    dispatch = store.dispatch
  })

  return {dispatch, select}
}

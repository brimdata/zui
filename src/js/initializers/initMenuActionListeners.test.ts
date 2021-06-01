import initMenuActionListeners from "./initMenuActionListeners"
import initTestStore from "../../../test/unit/helpers/initTestStore"

test("Each action has a listener", () => {
  const store = initTestStore()
  // @ts-ignore
  initMenuActionListeners(store)
})

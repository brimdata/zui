import initMenuActionListeners from "./initMenuActionListeners"
import initTestStore from "../test/initTestStore"
import {Store} from "../state/types"

test("Each action has a listener", () => {
  const store = initTestStore()
  // @ts-ignore
  initMenuActionListeners(store)
})

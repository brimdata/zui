import getTestState, {getAllTabs} from "../../test/helpers/getTestState"
import migrate from "./202101151201_addMainView"

test("migrating 202101151201_addMainView", () => {
  let {data} = getTestState("v0.21.1")

  let next = migrate(data)

  for (const tab of getAllTabs(next)) {
    expect(tab.layout.mainView).toBe("search")
  }
})

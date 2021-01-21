import getTestState, {getAllStates} from "../../test/helpers/getTestState"
import migrate from "./202101210823_renameToWorkspace"

test("migrating 202101210823_renameToWorkspace", () => {
  let {data} = getTestState("v0.21.1")

  let next = migrate(data)

  if (next) {
    expect(next.globalState.workspaces).toBeDefined()
    Object.values(next.globalState.workspaces).forEach((c: any) => {
      expect(c.password).toBeUndefined()
      expect(c.username).toBeUndefined()
    })
    expect(next.globalState.clusters).toBeUndefined()
  }
  for (const state of getAllStates(next)) {
    expect(state.clusters).toBeUndefined()
    if (!state.tabs) continue
    state.tabs.data.forEach((t) => {
      expect(t.current.connectionId).toBeUndefined()
      expect(t.current.workspaceId).toBeDefined()
    })
  }
})

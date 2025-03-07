import {getAllRendererStates, getAllStates} from "./utils/getTestState"

export default function populateSessions(state: any) {
  let sessions = []
  let histories = {}

  // First gather all the tab histories,
  for (const win of getAllRendererStates(state)) {
    if (!win.tabHistories) break

    const entities = win.tabHistories.ids.map(
      (id) => win.tabHistories.entities[id]
    )
    // filter the ones that are on a query session url
    const sessionTabs = entities.filter((history) =>
      /queries\/.*\/versions\/.*/.test(history.entries[history.index])
    )
    // Push those tab ides to the session
    sessions = sessions.concat(
      sessionTabs.map((tab) => {
        return {
          id: tab.id,
          name: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      })
    )

    // Now gather the session histories to make them global
    histories = {
      ...histories,
      ...win.sessionHistories,
    }
  }

  // Put these in the entity state shape
  const querySessions = {
    ids: sessions.map((session) => session.id),
    entities: sessions.reduce((entities, session) => {
      entities[session.id] = session
      return entities
    }, {}),
  }

  // Next add all those sessions to each state object, since these will be global
  for (const s of getAllStates(state)) {
    s.querySessions = querySessions
    s.sessionHistories = histories
  }

  return state
}

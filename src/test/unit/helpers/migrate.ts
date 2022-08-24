import {Migrations} from "src/js/electron/migrations"
import getTestState from "src/js/state/migrations/utils/getTestState"

export async function migrate({state: name, to}): Promise<any> {
  const state = getTestState(name)
  const migrator = await Migrations.init({from: state.version, to})
  const nextState = migrator.runPending(state)
  if (nextState.version.toString() !== to.toString()) {
    throw new Error(`Was not able to migrate to: ${to}`)
  }
  return nextState.data
}

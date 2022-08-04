import {BrimLake} from "../brim"
import {Thunk} from "../state/types"

export const subscribeEvents =
  (lake?: BrimLake): Thunk<Promise<EventSource>> =>
  async (d, gs, {api}) => {
    const zealot = await api.getZealot(lake)

    return zealot.subscribe()
  }

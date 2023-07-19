import {createEvent} from "../core/events"

export const selectQuery = createEvent<[id: string]>("selectQuery")

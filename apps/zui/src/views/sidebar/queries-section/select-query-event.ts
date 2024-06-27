import {createEvent} from "./events"

export const selectQuery = createEvent<[id: string]>("selectQuery")

import {throttle} from "lodash"

let id = null

function saveFuncion() {
  window.cancelIdleCallback(id)
  id = window.requestIdleCallback(() => {
    console.log("SENDING STATE")
  })
}

const save = throttle(saveFuncion, 3000, {leading: false})

export function initAutosave(store) {
  store.subscribe(() => {
    save()
  })
}

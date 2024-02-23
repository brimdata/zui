import {selectGroup} from "./dom"

class ReactApi {
  constructor(public group: string) {}

  enter() {
    return selectGroup(this.group).enter()
  }

  exit() {
    return selectGroup(this.group).exit()
  }
}

export function useDebut(group: string) {
  return new ReactApi(group)
}

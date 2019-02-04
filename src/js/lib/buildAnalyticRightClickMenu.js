import * as actions from "../actions/rightClick"

export default ({log, field, dispatch}) => {
  const menu = []

  if (["addr", "set[addr]"].includes(field.type)) {
    menu.push(actions.whois(field, dispatch))
    menu.push(actions.seperator())
  }

  menu.push(actions.analyticDetail(log, dispatch))

  return menu
}

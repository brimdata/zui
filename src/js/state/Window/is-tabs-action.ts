import {isTabAction} from "../Tabs/is-tab-action"

export const isTabsAction = ({type}) =>
  type.startsWith("TABS/") || isTabAction({type})

/* @flow */

import type {TabState} from "../Tab/types"
import activeTabSelect from "../Tab/activeTabSelect"

export const getSearch = activeTabSelect((t: TabState) => t.last.search)

import {AttributeTypes} from "bullet"
import {ApplicationEntity} from "./application-entity"
import {EntityState} from "@reduxjs/toolkit"
import {BrowserTab} from "./browser-tab"
import Tabs from "src/js/state/Tabs"
import SessionHistories from "src/js/state/SessionHistories"
import {queryPath} from "src/app/router/utils/paths"

const schema = {
  name: {type: String, default: null as string},
}

type Attributes = AttributeTypes<typeof schema>

export type QuerySessionState = EntityState<Attributes, string>

export class QuerySession extends ApplicationEntity<Attributes> {
  static schema = schema

  activate() {
    if (this.tab) this.tab.activate()
    else this.restore()
  }

  get tab() {
    return BrowserTab.find(this.id)
  }

  restore() {
    const histories = this.select(SessionHistories.getById(this.id))
    const entry = histories && histories[0]
    if (entry) {
      const url = queryPath(entry.queryId, entry.version)
      console.log({url, entry})
      this.dispatch(Tabs.create(url, this.id))
    } else {
      throw new Error("Figure this case out")
    }
  }
}

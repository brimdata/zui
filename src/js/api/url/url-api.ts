import tabHistory from "src/app/router/tab-history"
import {ApiDomain} from "../api-domain"

export class UrlApi extends ApiDomain {
  push(url: string) {
    this.dispatch(tabHistory.push(url))
  }
  replace(url: string) {
    this.dispatch(tabHistory.replace(url))
  }
  goBack() {
    this.dispatch(tabHistory.goBack())
  }
  goForward() {
    this.dispatch(tabHistory.goForward())
  }
}

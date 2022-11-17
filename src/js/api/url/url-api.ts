import {ApiDomain} from "../api-domain"

export class UrlApi extends ApiDomain {
  push(url: string, opts: {tabId?: string} = {}) {
    const id = opts.tabId ?? this.current.tabId
    global.tabHistories.getOrCreate(id).push(url)
  }
  replace(url: string, opts: {tabId?: string} = {}) {
    const id = opts.tabId ?? this.current.tabId
    global.tabHistories.getOrCreate(id).replace(url)
  }
  goBack(opts: {tabId?: string} = {}) {
    const id = opts.tabId ?? this.current.tabId
    global.tabHistories.getOrCreate(id).goBack()
  }
  goForward(opts: {tabId?: string} = {}) {
    const id = opts.tabId ?? this.current.tabId
    global.tabHistories.getOrCreate(id).goForward()
  }
}

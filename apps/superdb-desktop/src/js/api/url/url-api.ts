import {ApiDomain} from "../api-domain"

export class UrlApi extends ApiDomain {
  get path() {
    return this.getHistory().location.pathname
  }

  push(url: string, opts: {tabId?: string; state?: any} = {}) {
    this.getHistory(opts).push(url, opts.state)
  }
  replace(url: string, opts: {tabId?: string; state?: any} = {}) {
    this.getHistory(opts).replace(url, opts.state)
  }
  goBack(opts: {tabId?: string} = {}) {
    this.getHistory(opts).goBack()
  }
  goForward(opts: {tabId?: string} = {}) {
    this.getHistory(opts).goForward()
  }

  setState(data: any) {
    this.getHistory().location.state = data
  }

  private getHistory(opts: {tabId?: string} = {}) {
    const id = opts.tabId ?? this.current.tabId
    return global.tabHistories.getOrCreate(id)
  }
}

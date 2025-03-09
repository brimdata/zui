import {Lake} from "../lake"

export class FeatureDetector {
  constructor(public lake: Lake) {}

  async hasDescribe() {
    try {
      const resp = await this.lake.client.describeQuery("from :pools")
      return !resp.error
    } catch (e) {
      if (/404/.test(e.message)) return false
      else throw e
    }
  }

  async detect() {
    return {
      describe: await this.hasDescribe(),
    }
  }
}

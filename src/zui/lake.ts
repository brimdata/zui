import {QueryOpts} from "@brimdata/zed-js"
import {Client} from "@brimdata/zed-node"

class LakeApi {
  public client: Client | null = null

  query(program: string, options?: QueryOpts) {
    if (!this.client) throw new Error("No client configured for this lake")
    return this.client.query(program, options)
  }
}

export const lake = new LakeApi()

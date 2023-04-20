import {Client} from "@brimdata/zed-node"

class LakeApi {
  public client: Client | null = null

  query(program: string) {
    if (!this.client) throw new Error("No client configured for this lake")
    return this.client.query(program)
  }
}

export const lake = new LakeApi()

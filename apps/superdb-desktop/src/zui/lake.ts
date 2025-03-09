import {QueryOpts} from "../../../../packages/superdb-types/dist"
import {Client} from "../../../../packages/superdb-node-client/dist"

class LakeApi {
  public client: Client | null = null
  public id: string | null

  query(program: string, options?: QueryOpts) {
    if (!this.client) throw new Error("No client configured for this lake")
    return this.client.query(program, options)
  }
}

export const lake = new LakeApi()

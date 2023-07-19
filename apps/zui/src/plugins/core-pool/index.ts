import {FieldPath} from "src/core/field-path"
import {createSettings} from "src/domain/pools/operations"
import {pools, PluginContext} from "src/zui"

export function activate(_ctx: PluginContext) {
  pools.on("create", ({pool}) => {
    createSettings.run(pool.id)

    pools
      .configure(pool.id)
      .set("timeField", new FieldPath(pool.layout.keys[0]).toString())
  })
}

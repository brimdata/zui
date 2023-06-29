import {FieldPath} from "src/core/field-path"
import {pools, PluginContext} from "src/zui"

export function activate(_ctx: PluginContext) {
  pools.on("create", ({pool}) => {
    const poolKeyAccessor = new FieldPath(pool.layout.keys[0]).toString()

    pools.configure(pool.id).set("timeField", poolKeyAccessor)
  })
}

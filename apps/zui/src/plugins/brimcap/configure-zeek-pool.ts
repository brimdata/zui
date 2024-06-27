import {zeekColorMap} from "./zeek/colors"
import {pools} from "src/zui"

export function configureZeekPool(poolId: string) {
  pools
    .configure(poolId)
    .set("timeField", "ts")
    .set("colorField", "_path")
    .set("colorMap", zeekColorMap)
}

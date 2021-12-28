import {inspect} from "./inspect"
import {renderClosing, renderContainer, renderOneField} from "./render"
import {InspectArgs} from "./types"

export function createContainer<T>(
  name: string,
  open: string,
  close: string,
  createIterator
) {
  return (args: InspectArgs & {value: T}) => {
    const {ctx, value} = args
    const iterator = createIterator(args)

    if (ctx.isExpanded(value)) {
      ctx.push(renderContainer(args, name, open))
      ctx.nest()
      for (let args of iterator) inspect(args)
      ctx.unnest()
      ctx.push(renderClosing(args, close))
    } else {
      const nodes = []
      for (let args of iterator) nodes.push(renderOneField(args))
      ctx.push(renderContainer(args, name, open, nodes, close))
    }
  }
}

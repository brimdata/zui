import {ContainerElement} from "d3"

declare module "d3" {
  function pointer(event: PointerEvent, el?: ContainerElement): [number, number]
}

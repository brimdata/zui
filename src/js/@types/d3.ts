import {ContainerElement} from "d3"

declare module "d3" {
  function pointer(container: ContainerElement): [number, number]
}

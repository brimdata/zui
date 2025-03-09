import {TypedEmitter} from "src/util/typed-emitter"

type Events = {
  quit: () => void
}

export class AppApi extends TypedEmitter<Events> {}

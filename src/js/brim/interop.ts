import brim, {Ts} from "./"

export default {
  spacePayloadToSpace(space: any) {
    if (space.span) {
      const span = space.span
      const end = brim
        .time(span.ts)
        .addTs(span.dur as Ts)
        .toTs()
      space = {...space, min_time: span.ts, max_time: end}
      delete space.span
    }
    return space
  }
}

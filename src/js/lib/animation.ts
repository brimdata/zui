
import anime from "animejs";

import { whatIs } from "./is";

export default function animation(el: HTMLElement | null, opts: Object | Function) {
  function initialize(): anime {
    if (!opts) return anime({ targets: el, duration: 0 });

    switch (whatIs(opts)) {
      case "Object":
        return anime({ targets: el, ...opts });
      case "Function":
        return opts(anime, el);
      default:
        throw new Error("No animation provided");

    }
  }

  function getTargets(ani) {
    return ani.children.reduce((all, one) => all.concat(getTargets(one)), ani.animatables.map(a => a.target));
  }

  let ani = initialize();
  ani.pause();

  return {
    play() {
      ani.restart();
      ani.play();
      return ani.finished;
    },

    cancel() {
      if (ani) getTargets(ani).map(anime.remove);
      return this;
    },

    reverse() {
      ani.reverse();
      return this;
    },

    seekToEnd() {
      ani.restart();
      ani.seek(ani.duration);
      return this;
    }
  };
}
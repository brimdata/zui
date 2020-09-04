
import { useEffect, useState } from "react";

let pad = 8;
export default function useTipPosition(anchor: HTMLElement | null | undefined, tip: HTMLElement | null | undefined) {
  let [style, setStyle] = useState({});

  useEffect(() => {
    if (!anchor || !tip) return;

    let {
      left,
      top
    } = anchor.getBoundingClientRect();
    let width = tip.clientWidth;
    let height = tip.clientHeight;

    if (top + height > window.innerHeight) {
      // Clamp to the bottom
      let diff = top + height - window.innerHeight;
      top -= diff;
    }

    setStyle({
      transform: `translate3d(${left - width - pad}px, ${top}px, 0)`
    });
  }, [anchor, tip]);

  return style;
}
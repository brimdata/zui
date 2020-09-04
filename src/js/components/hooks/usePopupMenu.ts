
import { useState } from "react";

import { remote } from "electron";

import { $Menu } from "../../electron/menu";

const margin = 8;

type Options = {
  placement?: "right" | "left";
};

type Args = {
  callback: Function;
  x?: number;
  y?: number;
};

export default function usePopupMenu(template: $Menu, opts?: Options = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const callback = () => setIsOpen(false);

  function open(target?: HTMLElement) {
    const menu = remote.Menu.buildFromTemplate(template);
    let args: Args = { callback };

    if (target) {
      const {
        top,
        left,
        height,
        width
      } = target.getBoundingClientRect();

      args.y = Math.round(top + height + margin);
      args.x = opts.placement === "right" ? Math.round(left + width) : Math.round(left);
    }

    menu.popup(args);
    setIsOpen(true);
  }

  function onClick(e: React.SyntheticEvent<HTMLElement>) {
    open(e.currentTarget);
  }

  return {
    open,
    onClick,
    isOpen
  };
}
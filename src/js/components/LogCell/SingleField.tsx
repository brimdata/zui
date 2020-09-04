
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { $Field } from "../../brim";
import { $Menu } from "../../electron/menu";
import { showContextMenu } from "../../lib/System";
import FieldCell from "../FieldCell";
import lib from "../../lib";

type Props = {
  field: $Field;
  menu: $Menu;
};

export default function SingleField({
  field,
  menu
}: Props) {
  const [selected, setSelected] = useState(false);
  const cell = useRef<any>();

  function onClick(e) {
    setSelected(true);
    lib.win.selectText(e.currentTarget);
  }

  function onOutsideClick(e: MouseEvent) {
    if (cell.current && cell.current.contains(e.target)) return;
    setSelected(false);
    lib.off("click", onOutsideClick, false);
  }

  useEffect(() => {
    if (selected) {
      lib.on("click", onOutsideClick, false);
    }
    return () => {
      lib.off("click", onOutsideClick, false);
    };
  }, [selected]);

  return <div ref={cell} className={classNames("cell-value-item", { selected })} onClick={onClick} onContextMenu={() => showContextMenu(menu)}>
      <FieldCell field={field} />
    </div>;
}
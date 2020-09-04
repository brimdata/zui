

import React, { useState } from "react";
import classNames from "classnames";

import { $Field } from "../../brim";
import { RightClickBuilder } from "../../types";
import { getTooltipStyle } from "../../lib/MenuStyler";
import CompoundField from "./CompoundField";
import Log from "../../models/Log";
import SingleField from "./SingleField";
import Tooltip from "../Tooltip";

type Props = {
  field: $Field;
  log: Log;
  style?: Object;
  rightClick: RightClickBuilder;
};

export default function LogCell({
  field,
  style,
  rightClick,
  log
}: Props) {
  let [hover, setHover] = useState(false);
  let [tooltipStyle, setTooltipStyle] = useState({});
  let {
    name,
    type
  } = field;

  function handleMouseEnter(e) {
    setHover(true);
    setTooltipStyle(getTooltipStyle(e.currentTarget));
  }

  function handleMouseLeave() {
    setHover(false);
  }

  return <div className={classNames(`log-cell ${type}`, { hover })} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={style}>
      <FieldSwitch field={field} log={log} menuBuilder={rightClick} />
      {hover && <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>}
    </div>;
}

function FieldSwitch(props) {
  if (props.field.compound()) {
    return <CompoundField {...props} />;
  } else {
    let {
      field,
      log,
      menuBuilder
    } = props;
    let menu = menuBuilder(field, log, false);
    return <SingleField field={field} menu={menu} />;
  }
}


import React from "react";
import classNames from "classnames";

import { $Field } from "../brim";

type Props = {field: $Field;};

export default function FieldCell({
  field
}: Props) {
  return <div className={classNames("field-cell", field.name, field.type, {
    [`${field.stringValue()}-bg-color`]: field.name === "_path",
    null: field.value === null
  })}>
      {field.display()}
    </div>;
}
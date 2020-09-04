
import React from "react";

import { FormFieldConfig } from "../../brim/form";
import InputLabel from "../common/forms/InputLabel";
import SelectInput from "../common/forms/SelectInput";
import brim from "../../brim";

type Props = {config: FormFieldConfig;};

export default function Timezone({
  config
}: Props) {
  let {
    label,
    name,
    defaultValue
  } = config;
  return <div className="setting-panel">
      <InputLabel>{label}</InputLabel>
      <SelectInput name={name} defaultValue={defaultValue}>
        {brim.time.getZoneNames().map(name => <option key={name} value={name}>
            {name}
          </option>)}
      </SelectInput>
    </div>;
}
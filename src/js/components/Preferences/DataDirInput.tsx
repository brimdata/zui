
import React from "react";

import { FormFieldConfig } from "../../brim/form";
import FileInput from "../common/forms/FileInput";
import InputLabel from "../common/forms/InputLabel";

type Props = {
  config: FormFieldConfig;
};

export default function DataDirInput({
  config
}: Props) {
  let {
    name,
    label,
    defaultValue
  } = config;
  return <div className="setting-panel">
      <InputLabel>{label}</InputLabel>
      <FileInput isDirInput {...{ name, defaultValue, placeholder: "default" }} />
    </div>;
}
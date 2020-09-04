
import React from "react";

import { FormFieldConfig } from "../../brim/form";
import { jsonTypeConfigInput } from "../../test/locators";
import FileInput from "../common/forms/FileInput";
import InputLabel from "../common/forms/InputLabel";
import Link from "../common/Link";

type Props = {
  config: FormFieldConfig;
};

export const JSON_TYPE_CONFIG_DOCS = "https://github.com/brimsec/brim/wiki/Zeek-JSON-Import";

export default function JSONTypeConfig({
  config
}: Props) {
  let {
    name,
    label,
    defaultValue
  } = config;
  return <div className="setting-panel">
      <InputLabel>
        {label} <Link href={JSON_TYPE_CONFIG_DOCS}>docs</Link>
      </InputLabel>
      <FileInput {...{ name, defaultValue, placeholder: "default" }} textInputProps={jsonTypeConfigInput.props} />
    </div>;
}
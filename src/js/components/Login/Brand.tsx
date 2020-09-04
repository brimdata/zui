
import React from "react";

import Volcano from "./Volcano";
import { version } from "../../../../package.json";

export default function Brand() {
  return <div className="brand">
      <Volcano />
      <h1>Welcome to Brim</h1>
      <span>Version {version}</span>
    </div>;
}
import React from "react"
import {createView} from "../views/create"
import {View} from "../views/view"
import {clickHandlers, item} from "./item"

export function key(view: View) {
  return (
    <span
      className="zed-key"
      key={view.args.key.toString()}
      {...clickHandlers(view)}
    >
      {typeof view.args.key === "string"
        ? view.args.key
        : item(createView({...view.args, value: view.args.key}), "single")}
      :{" "}
    </span>
  )
}

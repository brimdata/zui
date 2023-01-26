import React from "react"
import {createView} from "../views/create"
import {View} from "../views/view"
import {clickHandlers, item} from "./item"

// The key could be a complext type in the case of a map
export function key(view: View) {
  return (
    <span className="zed-key" key={"key-" + view.id} {...clickHandlers(view)}>
      {typeof view.key === "string"
        ? view.key
        : item(createView({...view.args, value: view.key}), "single")}
      :{" "}
    </span>
  )
}

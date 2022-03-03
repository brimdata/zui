import React from "react"
import {createView} from "../views/create"
import {View} from "../views/view"
import {item} from "./item"

export function key(view: View) {
  return (
    <span className="zed-key" key={view.args.key.toString()}>
      {typeof view.args.key === "string"
        ? view.args.key
        : item(createView({...view.args, value: view.args.key}))}
      :{" "}
    </span>
  )
}

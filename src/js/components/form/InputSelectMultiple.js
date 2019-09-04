/* @flow */
import React, {useState} from "react"

import CheckCircle from "../CheckCircle"
import useInputClassNames from "./useInputClassNames"

type Props = {label: string, options: string[], name: string}

export default function InputSelectMultiple({label, name, options}: Props) {
  let {className, ref} = useInputClassNames("input input-select-multiple")
  let [opts, setOpts] = useState(
    options.map((value) => ({
      selected: true,
      value
    }))
  )

  function setAll(bool) {
    setOpts(
      opts.map((o) => {
        o.selected = bool
        return o
      })
    )
  }

  function toggle(option) {
    let item = opts.find((opt) => opt.value === option.value)
    if (!item) return
    item.selected = !item.selected
    setOpts([...opts])
  }

  return (
    <div className={className}>
      <input
        type="hidden"
        value={opts
          .filter((o) => o.selected)
          .map((o) => o.value)
          .join(";")}
        name={name}
      />
      <label>
        {label}{" "}
        <nav>
          <a onClick={() => setAll(true)}>Select All</a> ·{" "}
          <a onClick={() => setAll(false)}>Select None</a>
        </nav>
      </label>
      <nav />
      <ul ref={ref}>
        {opts.map((o) => (
          <li
            key={o.value}
            data-selected={o.selected}
            onPointerDown={() => toggle(o)}
          >
            <CheckCircle />
            {o.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

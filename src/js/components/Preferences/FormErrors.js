/* @flow */
import {isEmpty} from "lodash"
import React from "react"

import type {FormError} from "../../brim/form"

type Props = {errors: FormError[]}

export default function FormErrors({errors}: Props) {
  if (isEmpty(errors)) return null
  const hasInputFocus = errors.some((err) => err.label && err.input)
  return (
    <div className="errors">
      <h4>Form Errors</h4>
      {hasInputFocus && <p>Click name to focus input.</p>}
      <ul>
        {errors.map(({label, message, input}, i) => (
          <li key={i}>
            <a onClick={() => input.focus()}>{label}</a> {message}
          </li>
        ))}
      </ul>
    </div>
  )
}

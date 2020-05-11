/* @flow */
import {isEmpty} from "lodash"
import React from "react"

import type {FormError} from "../../brim/form"

type Props = {errors: FormError[]}

export default function FormErrors({errors}: Props) {
  if (isEmpty(errors)) return null
  return (
    <div className="errors">
      <h4>Form Errors</h4>
      <p>Click name to focus input.</p>
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

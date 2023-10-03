import React from "react"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import HeadingForm from "./heading-form"
import {HeadingSaved} from "./heading-saved"

export function Heading() {
  const isEditing = useSelector(Layout.getIsEditingTitle)
  if (isEditing) {
    return <HeadingForm />
  } else {
    return <HeadingSaved />
  }
}

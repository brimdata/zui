import React from "react"
import {useSelector} from "react-redux"
import Layout from "src/js/state/Layout"
import {useActiveQuery} from "./context"
import HeadingForm from "./heading-form"
import {HeadingSaved} from "./heading-saved"

export function Heading() {
  const isEditing = useSelector(Layout.getIsEditingTitle)
  const active = useActiveQuery()
  if (isEditing) {
    return <HeadingForm />
  } else if (active.isSaved()) {
    return <HeadingSaved />
  } else {
    return null
  }
}

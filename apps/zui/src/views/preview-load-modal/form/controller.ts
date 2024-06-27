import {FormEvent} from "react"
import {createHandler} from "src/core/handlers"
import LoadDataForm from "src/js/state/LoadDataForm"
import {errorToString} from "src/util/error-to-string"
import {getFormData} from "src/util/get-form-data"
import {LoadFormState} from "./state"
import {LoadFormProps} from "."

const beginLoad = createHandler(async ({invoke, select}, data) => {
  const shaper = select(LoadDataForm.getShaper)
  const files = select(LoadDataForm.getFiles)
  // @ts-ignore
  const windowId = window.windowId
  await invoke("loads.create", {
    ...data,
    files,
    shaper,
    windowId,
  })
})

export class LoadFormController {
  constructor(private props: LoadFormProps, private state: LoadFormState) {}

  onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      beginLoad(getFormData(e))
      this.props.onClose()
    } catch (e) {
      this.state.setError(this.humanizeFormError(e))
    }
  }

  private humanizeFormError(e: unknown) {
    const error = errorToString(e)
    if (/pool already exist/.test(error)) {
      return "A pool with this name already exists."
    }

    return error
  }
}

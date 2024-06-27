import Editor from "src/js/state/Editor"
import {AppDispatch, GetState} from "src/js/state/types"

export class EditorApi {
  constructor(private dispatch: AppDispatch, private getState: GetState) {}

  get value() {
    return Editor.getValue(this.getState())
  }

  set value(next: string) {
    this.dispatch(Editor.setValue(next))
  }

  get pins() {
    return Editor.getPins(this.getState())
  }

  append(value: string) {
    this.value = this.value + value
  }
}

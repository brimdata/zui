export class ZedEditorHandler {
  public monaco
  public editor
  public props

  onMount(editor, monaco) {
    this.editor = editor
    this.monaco = monaco
    if (this.props.autoFocus) editor.focus()
    this.setErrors(this.props.markers)
  }

  focus() {
    if (!this.mounted) return
    setTimeout(() => this.editor.focus())
  }

  setErrors(markers) {
    if (!this.mounted) return
    this.monaco.editor.setModelMarkers(this.editor.getModel(), "zed", markers)
  }

  private get mounted() {
    return !!this.monaco && !!this.editor
  }
}

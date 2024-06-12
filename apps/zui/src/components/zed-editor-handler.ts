export class ZedEditorHandler {
  constructor(public monaco, public editor) {}

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

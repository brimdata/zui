import {FORMAT_OPTIONS} from "./options"

export function FormatSelect(props: any) {
  return (
    <div className="field">
      <label htmlFor="format">Format</label>
      <select name="format" id="format" {...props}>
        {FORMAT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

import forms from "src/components/forms.module.css"

type Props = {
  nameInput?: any
  keyInput?: any
}

export function PoolForm(props: Props) {
  return (
    <>
      <div className="field">
        <label htmlFor="name">Pool Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="my_pool"
          {...props.nameInput}
        />
      </div>

      <div className="field">
        <label htmlFor="key">Pool Key</label>
        <input
          id="key"
          name="key"
          type="text"
          placeholder="id, ts, primary_key "
          {...props.keyInput}
        />
      </div>

      <div className="field">
        <label>Sort Order</label>
        <div className="cluster">
          <div className={forms.radioInput}>
            <input id="ascending" name="order" type="radio" value="asc" />
            <label htmlFor="ascending">Ascending</label>
          </div>
          <div className={forms.radioInput}>
            <input
              id="descending"
              name="order"
              type="radio"
              value="desc"
              defaultChecked
            />
            <label htmlFor="descending">Descending</label>
          </div>
        </div>
      </div>
    </>
  )
}

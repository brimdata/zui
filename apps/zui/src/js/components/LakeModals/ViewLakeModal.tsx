import React, {useState} from "react"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import Pools from "../../state/Pools"
import EditLakeModal from "./EditLakeModal"
import useEnterKey from "../hooks/useEnterKey"
import LakeStatuses from "../../state/LakeStatuses"
import Link from "../common/Link"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"
import removeLake from "../../flows/lake/removeLake"
import {useDispatch} from "src/app/core/state"
import {showMessageBox} from "src/js/lib/System"
import forms from "src/components/forms.module.css"
import modals from "src/components/modals.module.css"
import {H1} from "src/components/h1"
import classNames from "classnames"
import styles from "./lake-modal.module.css"
import {capitalize} from "lodash"

const ViewLake = ({onClose, onEdit}) => {
  const dispatch = useDispatch()
  const lake = useSelector(Current.getLake)
  const lakeId = lake ? lake.id : null
  const poolIds = useSelector(Pools.ids(lakeId))
  const status = useSelector(LakeStatuses.get(lakeId))

  useEnterKey(onClose)

  if (!lake) return null

  const isDefault = lake.id === "localhost:9867"

  const poolCount = poolIds.length
  const {name, host, port, version = "unknown"} = lake

  const onRemove = () => {
    showMessageBox({
      type: "warning",
      title: "Lake Logout",
      message: `Are you sure you want to log out of ${name}?`,
      detail: `All the tabs associated with this lake will be closed.`,
      buttons: ["OK", "Cancel"],
    }).then(({response}) => {
      if (response === 0) {
        onClose()
        try {
          dispatch(removeLake(lake))
        } catch (e) {
          dispatch(Notice.set(ErrorFactory.create(e)))
        }
      }
    })
  }

  return (
    <div className={classNames(forms.form, modals.form)}>
      <H1 className={modals.title}>{name}</H1>

      <section className={forms.fields}>
        <div>
          <label>Lake URL</label>
          <input
            type="text"
            readOnly
            value={port ? [host, port].join(":") : host}
          />
        </div>
        <div>
          <label>Status</label>
          <input type="text" readOnly value={capitalize(status)} />
        </div>
        <div>
          <label>Zed Version</label>
          <input type="text" readOnly value={version} />
        </div>
        <div>
          <label>Pool Count</label>
          <input type="text" readOnly value={poolCount.toString()} />
        </div>
      </section>
      <div className={classNames(forms.submission, modals.submission)}>
        <button type="button" onClick={onClose}>
          OK
        </button>
        <button type="submit" onClick={onEdit}>
          Edit
        </button>
      </div>
      {!isDefault && (
        <div className={styles.logout}>
          <Link onClick={onRemove}>Logout</Link>
        </div>
      )}
    </div>
  )
}

const ViewLakeModal = ({onClose}) => {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return <EditLakeModal onClose={() => setEditing(false)} />
  } else {
    return <ViewLake onClose={onClose} onEdit={() => setEditing(true)} />
  }
}

export default ViewLakeModal

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
import {H1} from "src/components/h1"
import classNames from "classnames"
import styles from "./lake-modal.module.css"
import {capitalize} from "lodash"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"

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
    <div className={classNames(forms.form, "box-s")}>
      <div className="stack-3">
        <H1>{name}</H1>
        <section className="stack-1">
          <div className="field">
            <label>Lake URL</label>
            <input
              type="text"
              readOnly
              value={port ? [host, port].join(":") : host}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <input type="text" readOnly value={capitalize(status)} />
          </div>
          <div className="field">
            <label>Zed Version</label>
            <input type="text" readOnly value={version} />
          </div>
          <div className="field">
            <label>Pool Count</label>
            <input type="text" readOnly value={poolCount.toString()} />
          </div>
        </section>
        <div className={forms.submission}>
          <button type="button" onClick={onClose} className={forms.button}>
            OK
          </button>
          <button type="submit" onClick={onEdit} className={forms.submit}>
            Edit
          </button>
        </div>
        {!isDefault && (
          <div className={styles.logout}>
            <Link onClick={onRemove}>Logout</Link>
          </div>
        )}
      </div>
    </div>
  )
}

const Content = ({onClose}) => {
  const [editing, setEditing] = useState(false)
  if (editing) {
    return <EditLakeModal onClose={() => setEditing(false)} />
  } else {
    return <ViewLake onClose={onClose} onEdit={() => setEditing(true)} />
  }
}

export function ViewLakeModal() {
  const modal = usePopoverModal()
  return (
    <PopoverModal ref={modal.ref} className="max-width:measure">
      <Content onClose={modal.close} />
    </PopoverModal>
  )
}

import React, {useState} from "react"
import {useSelector} from "react-redux"
import Current from "../../state/Current"
import Pools from "../../state/Pools"
import EditLakeModal from "./EditLakeModal"
import useEnterKey from "../hooks/useEnterKey"
import LakeStatuses from "../../state/LakeStatuses"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"
import removeLake from "../../flows/lake/removeLake"
import {useDispatch} from "src/app/core/state"
import {showMessageBox} from "src/js/lib/System"
import styles from "./lake-modal.module.css"
import {capitalize} from "lodash"
import {PopoverModal, usePopoverModal} from "src/components/popover-modal"
import {Link} from "src/components/link"

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
    <form className="box gutter-space-m">
      <h1>{name}</h1>
      <div className="flow region region-space-xl">
        <label>Lake URL</label>
        <input
          type="text"
          readOnly
          value={port ? [host, port].join(":") : host}
        />
        <label>Status</label>
        <input type="text" readOnly value={capitalize(status)} />
        <label>Zed Version</label>
        <input type="text" readOnly value={version} />
        <label>Pool Count</label>
        <input type="text" readOnly value={poolCount.toString()} />
      </div>
      <div className="repel">
        <button type="button" onClick={onClose} className="button">
          OK
        </button>
        <button type="submit" onClick={onEdit} className="button submit">
          Edit
        </button>
        {!isDefault && (
          <div className={styles.logout}>
            <Link onClick={onRemove}>Logout</Link>
          </div>
        )}
      </div>
    </form>
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

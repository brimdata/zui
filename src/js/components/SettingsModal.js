/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Label} from "./Typography"
import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import View from "../state/View"
import brim from "../brim"

export default function SettingsModal() {
  let dispatch = useDispatch()
  let timeZone = useSelector(View.getTimeZone)

  return (
    <ModalBox
      name="settings"
      title="Preferences"
      buttons="Ok"
      {...reactElementProps("settingsModal")}
    >
      <TextContent>
        <div className="settings-form">
          <div className="setting-panel">
            <Label>Timezone:</Label>
            <select
              onChange={(e) => dispatch(View.setTimeZone(e.target.value))}
              value={timeZone}
            >
              {brim.time.getZoneNames().map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </TextContent>
    </ModalBox>
  )
}

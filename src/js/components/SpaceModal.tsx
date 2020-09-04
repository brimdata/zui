
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

import { reactElementProps } from "../test/integration";
import InputField from "./common/forms/InputField";
import InputLabel from "./common/forms/InputLabel";
import InputLabelError from "./common/forms/InputLabelError";
import Modal from "../state/Modal";
import ModalBox from "./ModalBox/ModalBox";
import Spaces from "../state/Spaces";
import TextInput from "./common/forms/TextInput";
import renameSpace from "../flows/renameSpace";

export default function SpaceModal() {
  const args = useSelector(Modal.getArgs) || {};
  const {
    clusterId,
    spaceId
  } = args;
  const space = useSelector(Spaces.get(clusterId, spaceId));
  const {
    name
  } = space || { name: "" };
  const [nameInput, setNameInput] = useState(name);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setNameInput(name);
  }, [name]);

  const onSubmit = () => {
    setError(null);
    dispatch(renameSpace(clusterId, spaceId, nameInput)).then(() => {
      dispatch(Modal.hide());
    }).catch(e => {
      setError(e.error);
    });
  };

  return <ModalBox name="space" title="" buttons={[{ label: "OK", click: onSubmit }]} className="space-modal" {...reactElementProps("spaceModal")}>
      <SpaceModalContents value={nameInput} onChange={setNameInput} error={error} />
    </ModalBox>;
}

const SpaceModalContents = ({
  value,
  onChange,
  error
}) => {
  return <div className="space-modal-contents">
      <InputField>
        <InputLabel>
          New Name
          {error && <InputLabelError> Error: {error}</InputLabelError>}
        </InputLabel>
        <TextInput autoFocus value={value} onChange={e => {
        onChange(e.target.value);
      }} />
      </InputField>
    </div>;
};
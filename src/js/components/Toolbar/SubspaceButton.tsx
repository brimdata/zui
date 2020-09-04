
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import Button from "./Button";
import Current from "../../state/Current";
import ErrorFactory from "../../models/ErrorFactory";
import Label from "./Label";
import Last from "../../state/Last";
import Notice from "../../state/Notice";
import SubspaceIcon from "../../icons/SubspaceIcon";
import Viewer from "../../state/Viewer";
import createSubspace from "../../flows/createSubspace";

export default function SubspaceButton() {
  const dispatch = useDispatch();
  const space = useSelector(Current.mustGetSpace);
  const search = useSelector(Last.getSearch);
  const selection = useSelector(Viewer.getSelection);
  const enabled = space.isArchive() && search && search.target === "index" && !selection.isEmpty();

  function onClick() {
    dispatch(createSubspace()).catch(e => {
      dispatch(Notice.set(ErrorFactory.create(e)));
    });
  }

  return <div title="Create a subspace">
      <Button onClick={onClick} disabled={!enabled} icon={<SubspaceIcon />} />
      <Label>Subspace</Label>
    </div>;
}
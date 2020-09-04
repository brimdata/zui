
import { useDispatch } from "react-redux";
import React from "react";

import InputAction from "./InputAction";
import PinIcon from "../../icons/PinBorderIcon";
import SearchBar from "../../state/SearchBar";

export default function PinAction() {
  const dispatch = useDispatch();
  const onClick = () => dispatch(SearchBar.pinSearchBar());

  return <InputAction onClick={onClick}>
      <PinIcon />
    </InputAction>;
}
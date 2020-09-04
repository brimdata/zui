
import { useSelector } from "react-redux";
import React from "react";

import Current from "../../state/Current";
import LoginPage from "./LoginPage";
import SearchPage from "../SearchPage";

export default function ClusterGate() {
  let cluster = useSelector(Current.getConnection);

  if (!cluster) {
    return <LoginPage />;
  } else {
    return <SearchPage />;
  }
}
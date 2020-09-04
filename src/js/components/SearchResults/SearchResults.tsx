
import { useSelector } from "react-redux";
import React from "react";

import { XResultsTable } from "./ResultsTable";
import { useResizeObserver } from "../hooks/useResizeObserver";
import Last from "../../state/Last";

export default function SearchResults() {
  const {
    ref,
    rect
  } = useResizeObserver();
  const last = useSelector(Last.getSearch);
  return <div className="search-results" ref={ref}>
      <XResultsTable width={rect.width} height={rect.height} multiSelect={last && last.target === "index"} />
    </div>;
}


import { createSelector } from "reselect";

import { RecordData } from "../../types/records";
import { State } from "../types";
import { TabState } from "../Tab/types";
import { ViewerSelection, createSelection } from "./helpers/selection";
import { ViewerSelectionData, ViewerState } from "./types";
import Log from "../../models/Log";
import Tabs from "../Tabs";
import brim from "../../brim";

export const getViewer = createSelector<State, void, ViewerState, TabState>(Tabs.getActiveTab, tab => tab.viewer);

export const getViewerRecords = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.records);

export const isFetching = (state: TabState) => state.viewer.status === "FETCHING";

export const getLogs = createSelector<State, void, Log[], RecordData[]>(getViewerRecords, records => records.map(brim.record).map(brim.interop.recordToLog));

export const getStatus = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.status);

export const getEndStatus = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.endStatus);

export const getColumns = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.columns);

export const getScrollPos = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.scrollPos);

export const getSelectionData = createSelector<State, void, any, ViewerState>(getViewer, viewer => viewer.selection);

export const getSelection = createSelector<State, void, ViewerSelection, ViewerSelectionData>(getSelectionData, data => createSelection(data));

export const getSelectedRecords = createSelector<State, void, RecordData[], ViewerSelection, RecordData[]>(getSelection, getViewerRecords, (selection, records) => selection.getIndices().map(index => records[index]));
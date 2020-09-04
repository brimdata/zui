

import { Store as ReduxStore } from "redux";

import { ClustersState } from "./Clusters/types";
import { ErrorsState } from "./Errors/types";
import { HandlersState } from "./Handlers/types";
import { InvestigationState } from "./Investigation/types";
import { ModalState } from "./Modal/types";
import { NoticeState } from "./Notice/types";
import { PacketsState } from "./Packets/types";
import { PrefsState } from "./Prefs/types";
import { SpacesState } from "./Spaces/types";
import { TabsState } from "./Tabs/types";
import { ViewState } from "./View/types";

export type GetState = () => State;
export type Thunk = (arg0: Dispatch, arg1: GetState, arg2: {zealot: any;createZealot: Function;globalDispatch: Dispatch;}) => any;
export type Dispatch = Function;
export type Action = Object;
export type DispatchProps = {dispatch: Dispatch;};
export type Store = ReduxStore<State, any>;

export type State = {
  handlers: HandlersState;
  clusters: ClustersState;
  errors: ErrorsState;
  spaces: SpacesState;
  view: ViewState;
  investigation: InvestigationState;
  modal: ModalState;
  notice: NoticeState;
  tabs: TabsState;
  packets: PacketsState;
  prefs: PrefsState;
};
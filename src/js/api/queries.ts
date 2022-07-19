import {AppDispatch, State} from "../state/types"

export class QueriesApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}
}

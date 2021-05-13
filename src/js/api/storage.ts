import PluginStorage from "../state/PluginStorage"
import {AppDispatch, State} from "../state/types"

export class StorageApi {
  constructor(private dispatch: AppDispatch, private getState: () => State) {}

  public get(name: string) {
    return PluginStorage.getData(name)(this.getState())
  }

  public set(name: string, data: any) {
    this.dispatch(PluginStorage.set({name, data}))
  }
}

import {Entity} from "bullet"
import {useSelector} from "react-redux"

export class ApplicationEntity extends Entity {
  static useAll() {
    return useSelector(this.selectors.all) as any[]
  }
}

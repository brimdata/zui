import {Entity} from "bullet"
import {useSelector} from "react-redux"

export class ApplicationEntity<T> extends Entity<T> {
  static useSelector = useSelector
}

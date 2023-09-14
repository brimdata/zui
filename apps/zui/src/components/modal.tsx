import styles from "./modals.module.css"
import {Debut, useDebut} from "src/components/debut"
import {Dialog} from "src/components/dialog/dialog"

export function Modal(props: {children: any; onClose: () => any}) {
  const debut = useDebut({afterExit: props.onClose})

  return (
    <Debut {...debut.props} classNames="modal">
      <Dialog
        onClose={() => debut.exit()}
        dialogPoint="center center"
        isOpen={true}
        className={styles.modal}
        modal
      >
        {props.children}
      </Dialog>
    </Debut>
  )
}

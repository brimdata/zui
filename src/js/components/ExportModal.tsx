import React from "react"
import {ButtonGroup, Content, Footer, SmallTitle} from "./ModalDialog/ModalDialog"
import ToolbarButton from "./Toolbar/Button"
import MacSpinner from "./MacSpinner"

const ExportModal = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>Export Search Results</SmallTitle>
        <Footer>
          <ButtonGroup>
            <ToolbarButton
              isPrimary
              text={isSubmitting ? "" : "Save"}
              icon={isSubmitting ? <MacSpinner light /> : null}
              disabled={isSubmitting}
              onClick={onSave}
            />
          </ButtonGroup>
        </Footer

        <ToolbarButton text="Cancel" onClick={onCancel} />
      </StyledFooter>
    </Content>
  )
}

export default ExportModal

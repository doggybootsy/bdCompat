import React, { memo } from "react"
import { getModuleByDisplayName, getModule } from "@vizality/webpack"
import { Messages } from "@vizality/I18n"
import { ErrorBoundary } from "@vizality/components"

const { default:Button } = getModule("ButtonLooks")
const { ModalRoot, ModalSize, ModalContent, ModalFooter, ModalHeader } = getModule("ModalRoot")
const FormTitle = getModuleByDisplayName("FormTitle")

export default memo(({ modalProps, Title, children }) => {
  return (
    <ModalRoot {...modalProps} size={ModalSize.MEDIUM} className="bd-addon-modal">
      <ModalHeader separator={false}>
        <FormTitle tag={"h4"}>{Title}</FormTitle>
      </ModalHeader>
      <ModalContent><ErrorBoundary>{children}</ErrorBoundary></ModalContent>
      <ModalFooter>
        <Button className="bd-button" onClick={modalProps.onClose}>{Messages.DONE}</Button>
      </ModalFooter>
    </ModalRoot>
  )
})

import { ContextMenu as Contextmenu } from "@vizality/components"
import { contextMenu, React, getModule } from "@vizality/webpack"
import SettingsModal from "./PluginSettings.jsx"

const { openModal } = getModule("openModal")
const { ModalRoot, ModalSize } = getModule("ModalRoot")

const { closeContextMenu } = contextMenu

module.exports = class ContextMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.meta.__started})
  }
  render () {
    const name = (this.props.plugin.getName() || this.props.meta.name) ?? "No author"
    return (
      <Contextmenu.Menu navId="vz-addon-context-menu" onClose={closeContextMenu}>
        <Contextmenu.CheckboxItem
          id="Enable"
          label="Enable"
          checked={this.state.enabled}
          action={() => {
            this.setState({enabled: !this.state.enabled})
            this.props.onChange()
          }}
        />
        <Contextmenu.Separator />
        <Contextmenu.Item 
          id="Settings"
          label="Settings"
          disabled={!(typeof this.props.plugin.getSettingsPanel === "function" && this.state.enabled)}
          action={() => openModal((props) => (<ModalRoot size={ModalSize.MEDIUM} {...props}><SettingsModal plugin={this.props.plugin} modalProps={props}/></ModalRoot>))}
        />
        <Contextmenu.Separator />
        <Contextmenu.Item 
          id="Uninstall"
          label={`Uninstall ${name}`}
          color={Contextmenu.Item.Colors.DANGER}
          action={() => BdApi.showConfirmationModal(
            `Uninstall ${name}`,
            [`Are you sure you wan't to uninstall ${name}`],
            {
              danger: true, 
              confirmText: "Uninstall",  
              onConfirm: this.props.onDelete
          })}
        />
      </Contextmenu.Menu>
    )
  }
}
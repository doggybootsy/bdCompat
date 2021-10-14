import { React, contextMenu, getModule } from "@vizality/webpack"
import Cards from "./Card"
import ContextMenu from "./ContextMenu"

module.exports = class Plugin extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.installed ? this.props.meta.__started : false})
  }
  render () {
    const CardOnChange = () => {
      this.setState({enabled: !this.state.enabled})
      this.togglePlugin()
    }
    const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
    const Card = Cards[`${display[0].toUpperCase()}${display.substring(1)}`]

    const handleContextMenu = evt => {
      return contextMenu.openContextMenu(evt, () =>
        <ContextMenu 
          enabled={this.state.enabled} 
          {...this.props}
          onChange={CardOnChange} 
        />
      )
    }

    return (
      <div class="vz-addon-card bd-addon-card" vz-addon-type="plugin" onContextMenu={handleContextMenu}>
        <Card 
          enabled={this.state.enabled} 
          {...this.props}
          onChange={CardOnChange}
        />
      </div>
    )
  }

  togglePlugin () {
    if (this.state.enabled) this.props.onDisable()
    else this.props.onEnable()

    this.forceUpdate()
  }
}
import { React } from "@vizality/webpack"
import { Card, Compact, Cover, List } from "./Card"

module.exports = class Plugin extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({enabled: this.props.meta.__started})
  }
  render () {
    const CardOnChange = () => {
      this.setState({enabled: !this.state.enabled})
      this.togglePlugin()
    }
    const display = vizality.api.settings._fluxProps('addon-manager').getSetting('listDisplay', 'card')
    if (display === "card") return (<Card enabled={this.state.enabled} {...this.props} onChange={CardOnChange}/>)
    if (display === "compact") return (<Compact enabled={this.state.enabled} {...this.props} onChange={CardOnChange}/>)
    if (display === "cover") return (<Cover enabled={this.state.enabled} {...this.props} onChange={CardOnChange}/>)
    if (display === "list") return (<List enabled={this.state.enabled} {...this.props} onChange={CardOnChange}/>)
    else return ("error ")
  }

  togglePlugin () {
    if (this.state.enabled) this.props.onDisable()
    else this.props.onEnable()

    this.forceUpdate()
  }
}
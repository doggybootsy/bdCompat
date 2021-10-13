import { React } from "@vizality/webpack"
import { Button } from "@vizality/components"
import { TextInput } from "@vizality/components/settings"
import { shell as eleShell } from "electron"

const ranNum = () => {
  let num = Math.floor(Math.random() * 10 + 1)
  if (num > 5) num = (num - 5)
  return num
}
const ranNumRes = ranNum()
const Plugin = require("./Plugin.jsx")

module.exports = class PluginList extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      search: "",
    }
  }
  render () {
    const plugins = this.__getPlugins()
    return (
      <div className="vz-addons-list" vz-display={vizality.api.settings._fluxProps('addon-manager').getSetting('listDisplay', 'card')}>
        <div className="vz-sticky-element-wrapper vz-addons-list-sticky-bar-wrapper" style={{top: "42px"}}>
          <div style={{padding: "12px"}}>
            <div className="vizality-entities-manage-header">
              <Button
                onClick={() => eleShell.openPath(window.ContentManager.pluginsFolder)}
                size={Button.Sizes.SMALL}
                color={Button.Colors.PRIMARY}
                look={Button.Looks.OUTLINED}
              >Open Plugins Folder</Button>
            </div>
            <div className="vizality-entities-manage-search" style={{marginTop: "12px"}}>
              <TextInput
                value={this.state.search}
                onChange={(val) => this.setState({ search: val })}
                placeholder="What are you looking for?"
              >Search plugins</TextInput>
            </div>
          </div>
        </div>

        <div className="vz-addons-list-inner">
          <div className="vz-addons-list-items">
            {plugins.map((plugin) =>
              <Plugin
                ranNum={ranNumRes}
                plugin={plugin.plugin}
                meta={plugin}
                onEnable={() => this.props.pluginManager.enablePlugin(plugin.plugin.getName())}
                onDisable={() => this.props.pluginManager.disablePlugin(plugin.plugin.getName())}
                onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  __getPlugins () {
    let plugins = Object.keys(window.bdplugins)
      .map((plugin) => window.bdplugins[plugin])

    if (this.state.search !== "") {
      const search = this.state.search.toLowerCase()

      plugins = plugins.filter(({ plugin }) =>
        plugin.getName().toLowerCase().includes(search) ||
        plugin.getAuthor().toLowerCase().includes(search) ||
        plugin.getDescription().toLowerCase().includes(search)
      )
    }

    return plugins.sort((a, b) => {
      const nameA = a.plugin.getName().toLowerCase()
      const nameB = b.plugin.getName().toLowerCase()

      if (nameA < nameB) return -1
      if (nameA > nameB) return 1

      return 0
    })
  }

  __deletePlugin(pluginName) {
    this.props.pluginManager.delete(pluginName)

    this.forceUpdate()
  }
}
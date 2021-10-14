import React, {memo} from "react"
import { Icon, StickyElement, Popout } from "@vizality/components"
import { shell as eleShell } from "electron"
import { useToggle } from "@vizality/hooks"

import DisplayPopout from "./Popout"
import Plugin from "./Plugin.jsx"

const Displaypopout = memo(({}) => {
  const [ showDisplayPopout, toggleDisplayPopout ] = useToggle(false)

  const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")
  
  return (
    <Popout renderPopout={props => <DisplayPopout {...props} />} position="left" animation="2" shouldShow={showDisplayPopout} onRequestClose={toggleDisplayPopout}>
      {props => (
        <div 
          style={{ marginRight: "4px" }}
        >
          <Icon
            tooltip="Display"
            name={`Layout${display[0].toUpperCase()}${display.substring(1)}`}
            style={{ width: "27px", height: "28px"}}
            onClick={toggleDisplayPopout}
            popoutProps={props}
          />
        </div>
      )}
    </Popout>
  )
})

module.exports = class PluginList extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      search: ""
    }
  }
  render () {
    const plugins = this.__getPlugins()
    let num = 0
    const Search = BdApi.findModuleByDisplayName("Searchbar")
    const Flex = BdApi.findModuleByDisplayName("Flex")
    const display = vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card")

    return (
      <div className="vz-addons-list" vz-display={display}>
        <StickyElement className="vz-sticky-element-wrapper vz-addons-list-sticky-bar-wrapper" style={{top: "40px"}}>
          <Flex>
            <Flex/>
            <div style={{ width: "166px", margin: "auto" }}>
              <Search 
                size={Search.Sizes.SMALL}
                placeholder="Search" 
                query={this.state.search}
                onChange={(val) => this.setState({search: val})}
                onClear={() => this.setState({search: ""})}
              />
            </div>
            <div style={{height: "1.8rem", width: "fit-content", padding: "0 0 0 .8rem", display: "flex"}}>
              <Displaypopout />
              <Icon 
                name="Folder" 
                onClick={() => eleShell.openPath(window.ContentManager.pluginsFolder)}
                tooltip="Open Plugins Folder"
                style={{ width: "24px", height: "28px"}}
              />
            </div>
          </Flex>
        </StickyElement>

        <div className="vz-addons-list-inner">
          <div className="vz-addons-list-items">
            {plugins.map((plugin) => {
              num++
              if(num == 6) num = 1
              return <Plugin
                  ranNum={num}
                  plugin={plugin.plugin}
                  meta={plugin}
                  onEnable={() => this.props.pluginManager.enablePlugin(plugin.plugin.getName())}
                  onDisable={() => this.props.pluginManager.disablePlugin(plugin.plugin.getName())}
                  onDelete={() => this.__deletePlugin(plugin.plugin.getName())}
                />
              }
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
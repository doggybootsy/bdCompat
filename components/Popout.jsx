import { ContextMenu, Icon } from "@vizality/components"
import React, { useState, memo } from "react"

const Items = ["compact","cover","card","list"]

export default memo(({ onClose }) => {
  const [ display, setDisplay ] = useState(vizality.api.settings._fluxProps("addon-manager").getSetting("listDisplay", "card"));

  return (
    <ContextMenu.Menu navId="vz-addons-list-display-menu" onClose={onClose}>
      <ContextMenu.Group label="Layout">
        {Items.map(e => (
          <ContextMenu.RadioItem 
            id={e}
            checked={display == e}
            label={() => (
              <div className="vz-addon-context-menu-label-inner">
                <Icon 
                  name={`Layout${e[0].toUpperCase()}${e.substring(1)}`}
                  size="18" 
                />
                {e[0].toUpperCase()}{e.substring(1)}
              </div>
            )}
            action={() => {
              setDisplay(e);
              vizality.api.settings._fluxProps("addon-manager").updateSetting("listDisplay", e)
            }}
          />
        ))}
      </ContextMenu.Group>
    </ContextMenu.Menu>
  )
})
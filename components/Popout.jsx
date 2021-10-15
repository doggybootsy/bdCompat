import { ContextMenu, Icon } from "@vizality/components"
import React, { memo } from "react"

const Items = ["compact","cover","card","list"]

export default memo(({ display, setDisplay, onClose }) => {
  return (
    <ContextMenu.Menu navId="vz-addons-list-display-menu" onClose={onClose}>
      <ContextMenu.Group label="Layout">
        {Items.map(layout => (
          <ContextMenu.RadioItem 
            id={layout}
            checked={display == layout}
            label={() => (
              <div className="vz-addon-context-menu-label-inner">
                <Icon 
                  name={`Layout${layout[0].toUpperCase()}${layout.substring(1)}`}
                  size="18" 
                />
                {e[0].toUpperCase()}{layout.substring(1)}
              </div>
            )}
            action={() => {
              setDisplay(layout)
              vizality.api.settings._fluxProps("addon-manager").updateSetting("listDisplay", layout)
            }}
          />
        ))}
      </ContextMenu.Group>
    </ContextMenu.Menu>
  )
})
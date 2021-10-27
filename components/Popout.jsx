import { ContextMenu, Icon } from "@vizality/components"
import React, { memo } from "react"

const Layouts = ["compact","cover","card","list"]

export default memo(({ display, setDisplay, onClose }) => {
  return (
    <ContextMenu.Menu navId="vz-addons-list-display-menu" onClose={onClose}>
      <ContextMenu.Group label="Layout">
        {Layouts.map(layout => (
          <ContextMenu.RadioItem 
            id={layout}
            checked={display === layout}
            label={() => (
              <div className="vz-addon-context-menu-label-inner">
                <Icon 
                  name={`Layout${layout[0].toUpperCase()}${layout.substring(1)}`}
                  size="18" 
                />
                {layout[0].toUpperCase()}{layout.substring(1)}
              </div>
            )}
            action={() => setDisplay(layout)}
          />
        ))}
      </ContextMenu.Group>
    </ContextMenu.Menu>
  )
})
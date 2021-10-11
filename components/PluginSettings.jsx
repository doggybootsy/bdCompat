const { React, getModuleByDisplayName, getModule } = require('@vizality/webpack')
const { ModalHeader, ModalContent, ModalCloseButton } = getModule("ModalRoot")
const { resolve } = require('path')

const FormTitle = getModuleByDisplayName('FormTitle', false)

let ErrorBoundary = props => props.children
try {
  ErrorBoundary = vizality.modules.components.ErrorBoundary
} catch (e) {
  console.error('Failed to load vizality\'s ErrorBoundary component!', e)
}

module.exports = class PluginSettings extends React.Component {
  renderPluginSettings() {
    let panel
    try {
      panel = this.props.plugin.getSettingsPanel()
    } catch (e) {
      console.error(e)

      const error = (e.stack || e.toString()).split('\n')
        .filter(l => !l.includes('discordapp.com/assets/') && !l.includes('discord.com/assets/'))
        .join('\n')
        .split(resolve(__dirname, '..', '..')).join('')

      return (
        <div className='vizality-text vizality-settings-error'><div>An error occurred while rendering settings panel.</div><code>{error}</code></div>
      )
    }
    if (panel instanceof Node || typeof panel === 'string')
      return <div ref={el => el ? panel instanceof Node ? el.append(panel) : el.innerHTML = panel : void 0}></div>

    return panel
  }

  render () {
    const { plugin } = this.props
    try {
      return (
        <>
          <ModalHeader separator={false}>
            <FormTitle tag={FormTitle.Tags.H4}>{plugin.getName()} Settings</FormTitle>
            <ModalCloseButton onClick={() => this.props.modalProps.onClose()}/>
          </ModalHeader>
          <ModalContent>
            <div className='plugin-settings' id={`plugin-settings-${plugin.getName()}`}>
              <ErrorBoundary>{this.renderPluginSettings()}</ErrorBoundary>
            </div>
          </ModalContent>
        </>
      )
    } 
    catch (error) {
      return <ModalHeader separator={false}><FormTitle tag={FormTitle.Tags.H4}>Error</FormTitle><ModalCloseButton onClick={() => this.props.modalProps.onClose()}/></ModalHeader>
    }
  }
}
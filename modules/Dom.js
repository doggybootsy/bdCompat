export default class Dom {
  // Add elements
  static initialize() {
    if (document.querySelector("bd-head")) document.querySelector("bd-head").remove()
    if (document.querySelector("bd-body")) document.querySelector("bd-body").remove()
    this["bd-styles"] = this.createElement("<bd-styles></bd-styles>")
    this["bd-themes"] = this.createElement("<bd-themes></bd-themes>")
    this["bd-scripts"] = this.createElement("<bd-scripts></bd-scripts>")
    this["bd-head"] = this.createElement("<bd-head></bd-head>")
    this["bd-head"].append(this["bd-scripts"], this["bd-themes"], this["bd-styles"])
    document.head.append(this["bd-head"])
    this["bd-body"] = this.createElement("<bd-body></bd-body>")
    document.body.append(this["bd-body"])
  }
  // Dom stuff
  static createElement(html) {
    const template = document.createElement("template")
    template.innerHTML = html
    return template.content.firstChild
  }
  static onRemoved(node, callback) {
    const observer = new MutationObserver((mutations) => {
      for (let m = 0; m < mutations.length; m++) {
        const mutation = mutations[m]
        const nodes = Array.from(mutation.removedNodes)
        const directMatch = nodes.indexOf(node) > -1
        const parentMatch = nodes.some(parent => parent.contains(node))
        if (directMatch || parentMatch) {
          observer.disconnect()
          callback()
        }
      }
    })
    observer.observe(document.body, {subtree: true, childList: true})
  }
  // CSS
  static injectCSS(id, css) { this["bd-styles"].appendChild(this.createElement(`<style id="${id}">${css}</style>`)) }
  static clearCSS(id) {
    const styleEle = document.getElementById(id)
    if (styleEle) styleEle.remove()
  }
  // JS
  static linkJS(id, url) { this["bd-scripts"].appendChild(this.createElement(`<script id="${id}" src="${url}"></script>`)) }
  static unlinkJS(id) {
    const scriptEle = document.getElementById(id)
    if (scriptEle) scriptEle.remove()
  }
}
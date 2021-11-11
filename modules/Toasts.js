import { getModule } from "@vizality/webpack"
import { Logger } from "./"
/**
 * yoinked from {@link https://github.com/BetterDiscord/BetterDiscord/blob/c2ff0b251d35c91d265c8ad666a5a8e2daef5ce0/renderer/src/ui/toasts.js} and edited
 */
let toastMount = 0
export default class Toasts {
  static get ChannelsClass() { return getModule("sidebar", "hasNotice").sidebar.split(" ")[0] }
  static get MembersWrapClass() { return getModule("membersWrap").membersWrap.split(" ")[0] }
  static get shouldShowToasts() { return BdApi.isSettingEnabled("settings", "general", "showToasts") }
  static get settings() { return vizality.manager.plugins.get("bd-compat").settings }
  static show(content, options = {}) {
    try {
      const {type = "", icon = true, timeout = 3000, forceShow = false} = options
      if (!this.shouldShowToasts && !forceShow) return
      if (this.settings.get("vizalityApiToast", false)) {
        toastMount++
        let toastIcon = null
        if (icon) {
          if (type === "danger" || type === "error") toastIcon = { name: "CloseCircle", size: "30px" }
          if (type === "warn" || type === "warning") toastIcon = { name: "WarningTriangle", size: "30px" }
          if (type === "info") toastIcon = { name: "InfoFilled", size: "30px" }
          if (type === "success") toastIcon = { name: "CheckmarkCircle", size: "30px" }
        }
        vizality.api.notifications.sendToast({ content, autoClose: true, showCloseButton: false, icon: toastIcon, className: `bd-toast-${type}`, id: `BD_COMPAT_TOAST_${toastMount}_${type}` })
      }
      else {
        this.ensureContainer()
        const toastElem = document.createElement("div")
        toastElem.classList.add("bd-toast")
        if (type) toastElem.classList.add(`toast-${type}`)
        if (type && icon) toastElem.classList.add("icon")
        toastElem.innerText = content
        document.querySelector(".bd-toasts").appendChild(toastElem)
        setTimeout(() => {
          toastElem.classList.add("closing")
          setTimeout(() => {
            toastElem.remove()
            if (!document.querySelectorAll(".bd-toasts .bd-toast").length) document.querySelector(".bd-toasts").remove()
          }, 300)
        }, timeout)
      }
    }
    catch (err) { Logger.stacktrace("Toasts", "Unable to show toast", err) }
  }
  static ensureContainer() {
    if (document.querySelector(".bd-toasts")) return
    const container = document.querySelector(`.${this.ChannelsClass} + div`)
    const memberlist = container ? container.querySelector(`.${this.MembersWrapClass}`) : null
    const form = container ? container.querySelector("form") : null
    const left = container ? container.getBoundingClientRect().left : 310
    const right = memberlist ? memberlist.getBoundingClientRect().left : 0
    const width = right ? right - container.getBoundingClientRect().left : container.offsetWidth
    const bottom = form ? form.offsetHeight : 80
    const toastWrapper = document.createElement("div")
    toastWrapper.classList.add("bd-toasts")
    toastWrapper.style.setProperty("left", `${left}px`)
    toastWrapper.style.setProperty("width", `${width}px`)
    toastWrapper.style.setProperty("bottom", `${bottom}px`)
    document.querySelector("bd-body").appendChild(toastWrapper)
  }
}

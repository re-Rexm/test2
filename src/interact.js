// interact.js
AFRAME.registerComponent("click-display-info", {
  init: function () {
    this.el.addEventListener("click", this.onClick.bind(this))
  },

  onClick: function () {
    const window = document.querySelector("#displayWindow")
    const infoDisplay = document.getElementById("display-info-text")
    const currentlyActive = document.querySelector("[isActive]")

    // If clicking the currently active event, hide it
    if (currentlyActive === this.el) {
      this.el.setAttribute("material", "color", this.el.originalColor)
      this.el.removeAttribute("isActive")
      window.object3D.visible = false
      return
    }

    // Deactivate any currently active event
    if (currentlyActive) {
      currentlyActive.setAttribute("material", "color", currentlyActive.originalColor)
      currentlyActive.removeAttribute("isActive")
    }

    // Activate this event
    this.el.setAttribute("material", "color", "white")
    this.el.setAttribute("isActive", "")
    infoDisplay.setAttribute("value", getEventInfoText(this.el.eventData))
    window.object3D.visible = true
  },
})

function getEventInfoText(event) {
  return `Name: ${event.eventName}
    \nBldg: ${event.eventBldg} 
    \nRm:  ${event.eventRm}
    \nTime:  ${event.eventTime.toDate().toLocaleString()}`
}
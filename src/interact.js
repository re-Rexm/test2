AFRAME.registerComponent("click-display-info", {
  init: function () {
    this.el.addEventListener("click", this.onClick.bind(this));
    this.el.addEventListener("gps-entity-place-updated", () => {
      this.el.setAttribute("visible", "true");
    });
  },

  onClick: function () {
    const window = document.querySelector("#displayWindow");
    const infoDisplay = document.getElementById("display-info-text");
    const currentlyActive = document.querySelector("[isActive]");

    // If clicking the currently active event, toggle it off
    if (currentlyActive === this.el) {
      this.el.setAttribute("material", "color", this.el.originalColor);
      this.el.removeAttribute("isActive");
      window.setAttribute("visible", "false");
      return;
    }

    // Deactivate any currently active event
    if (currentlyActive) {
      currentlyActive.setAttribute("material", "color", currentlyActive.originalColor);
      currentlyActive.removeAttribute("isActive");
    }

    // Activate this event
    this.el.setAttribute("material", "color", "white");
    this.el.setAttribute("isActive", "");
    infoDisplay.setAttribute("value", getEventInfoText(this.el.eventData));
    window.setAttribute("visible", "true");
  }
});

function getEventInfoText(event) {
  return `Name: ${event.eventName}
    \nBldg: ${event.eventBldg} 
    \nRm:  ${event.eventRm}
    \nTime:  ${event.eventTime.toDate().toLocaleString()}`;
}
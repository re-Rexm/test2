// interact.js
AFRAME.registerComponent("click-display-info", {
  init: function () {
    this.el.addEventListener("click", this.onClick.bind(this));
    this.originalColor = this.el.getAttribute("material").color || "blue";
    console.log(`The ${this.el.id} entity is clickable.`);
  },

  onClick: function () {
    const window = document.querySelector("#displayWindow");
    const infoDisplay = document.querySelector("#display-info-text");
    const currentColor = this.el.getAttribute("material").color;

    if (currentColor !== "white") {
      // Show this event
      this.el.setAttribute("material", "color", "white");
      
      // Update display window with this event's info
      infoDisplay.setAttribute(
        "value",
        `Name: ${this.el.dataset.eventName}
        \nBldg: ${this.el.dataset.eventBldg} 
        \nRm:  ${this.el.dataset.eventRm}
        \nTime:  ${this.el.dataset.eventTime}`
      );
      
      // Make window visible
      window.object3D.visible = true;
      
      // Update arrow and distance to point to this event
      const arrow = document.querySelector("#arrow");
      const arrowTxt = document.querySelector("#arrowTxt");
      
      if (arrow && arrowTxt) {
        arrow.setAttribute('arrow-pointer', 'targetEl', `#${this.el.id}`);
        arrowTxt.setAttribute('distance-calc', 'targetEl', `#${this.el.id}`);
      }
    } else {
      // Hide this event
      this.el.setAttribute("material", "color", this.originalColor);
      window.object3D.visible = false;
    }
  }
});
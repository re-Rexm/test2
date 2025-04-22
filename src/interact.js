// interact.js
AFRAME.registerComponent("click-display-info", {
  schema: {
    eventIndex: { type: 'number', default: 0 }
  },
  
  init: function () {
    this.el.addEventListener("click", this.onClick.bind(this));
    this.originalColor = this.el.getAttribute("material").color;
  },

  onClick: function () {
    const eventBoxes = document.querySelectorAll(".event-box");
    const window = document.querySelector("#displayWindow");
    
    // Reset all boxes to original color
    eventBoxes.forEach(box => {
      box.setAttribute("material", "color", box.components["click-display-info"].originalColor);
    });
    
    // Highlight clicked box
    this.el.setAttribute("material", "color", "white");
    
    // Set current event
    const eventData = JSON.parse(this.el.dataset.event);
    setCurrentEvent(eventData);
    
    // Show window
    window.object3D.visible = true;
  }
});
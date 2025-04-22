AFRAME.registerComponent("click-display-info", {
  // ... existing schema and init ...

  onClick: function () {
    // ... existing deselection logic ...

    if (!this.isSelected) {
      this.el.setAttribute("material", "color", "white");
      this.isSelected = true;

      // Dispatch selection event with proper data
      const eventData = this.eventData;
      const eventSelectedEvent = new CustomEvent("event-selected", {
        detail: {
          entity: this.el,
          eventData: eventData
        }
      });
      document.dispatchEvent(eventSelectedEvent);
      
      // Force arrow to update immediately
      const arrow = document.querySelector("[arrow-pointer]");
      if (arrow && arrow.components["arrow-pointer"]) {
        arrow.components["arrow-pointer"].targetEl = this.el;
      }
    }
    // ... rest of the code ...
  }
});
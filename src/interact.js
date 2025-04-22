AFRAME.registerComponent("click-display-info", {
  schema: {
    eventData: { type: 'string', default: '{}' }
  },

  init: function () {
    this.el = this.el;
    this.originalColor = this.el.getAttribute("material").color || "blue";
    this.isSelected = false;

    try {
      this.eventData = JSON.parse(this.data.eventData);
    } catch (e) {
      console.warn("Could not parse event data", e);
      this.eventData = {};
    }

    this.el.addEventListener("click", this.onClick.bind(this));
  },

  onClick: function () {
    // Deselect all other events
    document.querySelectorAll("[click-display-info]").forEach(el => {
      if (el !== this.el) {
        el.setAttribute("material", "color", el.components["click-display-info"].originalColor);
        el.components["click-display-info"].isSelected = false;
      }
    });

    // Toggle selection
    if (!this.isSelected) {
      this.el.setAttribute("material", "color", "white");
      this.isSelected = true;

      // Dispatch selection event
      const event = new CustomEvent("event-selected", {
        detail: {
          entity: this.el,
          eventData: this.eventData
        }
      });
      document.dispatchEvent(event);
    } else {
      this.el.setAttribute("material", "color", this.originalColor);
      this.isSelected = false;
    }
  }
});
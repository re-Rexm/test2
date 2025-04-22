AFRAME.registerComponent("click-display-info", {
  schema: {
    eventData: { type: 'string', default: '{}' }
  },

  init: function () {
    this.originalColor = this.el.getAttribute("material").color || "blue";
    this.isSelected = false;

    try {
      // Parse event data but keep timestamp as string to handle later
      this.eventData = JSON.parse(this.data.eventData);
    } catch (e) {
      console.warn("Could not parse event data", e);
      this.eventData = {};
    }

    this.el.addEventListener("click", this.onClick.bind(this));
  },

  onClick: function () {
    const infoWindow = document.getElementById("displayWindow");
    const infoDisplay = document.getElementById("display-info-text");

    // Deselect all other events
    document.querySelectorAll("[click-display-info]").forEach(el => {
      if (el !== this.el) {
        el.setAttribute("material", "color", el.components["click-display-info"].originalColor);
        el.components["click-display-info"].isSelected = false;
      }
    });

    if (!this.isSelected) {
      // Select this event
      this.el.setAttribute("material", "color", "white");
      this.isSelected = true;
      infoWindow.object3D.visible = true;

      // Format time properly
      let eventTime;
      try {
        if (this.eventData.eventTime && typeof this.eventData.eventTime.toDate === 'function') {
          eventTime = this.eventData.eventTime.toDate().toLocaleString();
        } else if (typeof this.eventData.eventTime === 'string') {
          eventTime = new Date(this.eventData.eventTime).toLocaleString();
        } else {
          eventTime = "Time not specified";
        }
      } catch (e) {
        eventTime = "Time not available";
      }

      infoDisplay.setAttribute("value",
        `Name: ${this.eventData.eventName || "Unknown"}
        \nBldg: ${this.eventData.eventBldg || "N/A"}
        \nRm: ${this.eventData.eventRm || "N/A"}
        \nTime: ${eventTime}`
      );

      // Dispatch selection event
      const event = new CustomEvent("event-selected", {
        detail: {
          entity: this.el,
          eventData: this.eventData
        }
      });
      document.dispatchEvent(event);
    } else {
      // Deselect this event
      this.el.setAttribute("material", "color", this.originalColor);
      this.isSelected = false;
      infoWindow.object3D.visible = false;
    }
  }
});
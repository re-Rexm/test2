// interact.js
// This componenet modifies an entity to do something when the user touches the screen location where the entity is displayed (i.e., user touches event box, box displays event information on screen, user touches again, event info goes away).

AFRAME.registerComponent("click-display-info", {
  init: function () {
    this.el.addEventListener('click', () => {
      const event = this.el.eventData;
      const displayWindow = document.querySelector("#displayWindow");
      const infoDisplay = document.getElementById("display-info-text");
      
      // Highlight this event (make it white) and reset others to their original color
      document.querySelectorAll('[click-display-info]').forEach(entity => {
        const originalColor = entity.getAttribute('data-original-color');
        entity.setAttribute('material', 'color', originalColor);
      });
      
      // Highlight the clicked entity
      const originalColor = this.el.getAttribute('data-original-color');
      this.el.setAttribute('material', 'color', 'white');
      
      // Update display
      infoDisplay.setAttribute(
        'value',
        `Name: ${event.eventName}
        \nBldg: ${event.eventBldg} 
        \nRm:  ${event.eventRm}
        \nTime:  ${event.eventTime.toDate().toLocaleString()}`
      );
      
      displayWindow.object3D.visible = true;
      
      // Update arrow pointers
      document.querySelector("#arrow").components["arrow-pointer"].setTarget(this.el);
      document.querySelector("#arrowTxt").components["distance-calc"].setTarget(this.el);
    });
  }
});
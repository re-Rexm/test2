// interact.js
// This componenet modifies an entity to do something when the user touches the screen location where the entity is displayed (i.e., user touches event box, box displays event information on screen, user touches again, event info goes away).

AFRAME.registerComponent("click-display-info", {
  init: function () {
    var el = this.el
    var currColor = this.el.getAttribute("color")
    this.el.addEventListener("click", this.onClick.bind(this)) // Bind click event to element
    console.log(`The ${el.id} entity is clickable.`)
  },

  // On click change color of event entity and display information text
  onClick: function () {
    var window = document.querySelector("#displayWindow") // window entity to toggle

    console.log(`The ${this.el.id} entity was clicked.`)

    if (this.el.currColor != "white") {
      this.el.setAttribute("material", "color: white")
      this.el.currColor = "white"
      console.log(this.el.currColor)

      // Toggle window entity to true
      window.object3D.visible = true
      console.log(window.object3D.visible)
    } else {
      this.el.setAttribute("material", "color: blue")
      this.el.currColor = "blue"
      console.log(this.el.currColor)

      // Toggle window entity to false
      window.object3D.visible = false
      console.log(window.object3D.visible)
    }
  },
})

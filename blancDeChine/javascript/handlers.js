"use strict";

function eventHandler(scene) {

  const self = this;

  // Private variables
  var canvas = scene.canvas;

  // Remember the current state of events
  var start_of_mouse_drag = null;
  var previous_time = Date.now();

  // Control the rate at which animations refresh
  var frame_rate = 33; // 33 milliseconds = 1/30 sec

  //-----------------------------------------------------------------------
  self.mouse_drag_started = function (event) {

    // console.log("started mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    start_of_mouse_drag = event;
    event.preventDefault();
  };

  //-----------------------------------------------------------------------
  self.mouse_drag_ended = function (event) {

    // console.log("ended mouse drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    start_of_mouse_drag = null;

    event.preventDefault();
  };

  //-----------------------------------------------------------------------
  /**
   * Process a mouse drag event.
   * @param event A jQuery event object
   */
  self.mouse_dragged = function (event) {
    var delta_x, delta_y;

    // console.log("drag event x,y = " + event.clientX + " " + event.clientY + "  " + event.which);
    if (start_of_mouse_drag) {
      delta_x = event.clientX - start_of_mouse_drag.clientX;
      delta_y = -(event.clientY - start_of_mouse_drag.clientY);
    //   console.log("moved: " + delta_x + " " + delta_y);

      scene.angleX -= delta_y * 0.01;
      scene.angleY += delta_x * 0.01;
      scene.render();

      start_of_mouse_drag = event;
      event.preventDefault();
    }
  };

  //------------------------------------------------------------------------------
  self.createAllEventHandlers = function () {
    canvas.addEventListener('mousedown', self.mouse_drag_started, false);
    canvas.addEventListener('mouseup', self.mouse_drag_ended, false);
    canvas.addEventListener('mousemove', self.mouse_dragged, false);
  };

  //------------------------------------------------------------------------------------------
  self.animate = function () {

    var now, elapsed_time;

    now = Date.now();
    elapsed_time = now - previous_time;

    if (elapsed_time >= frame_rate) {
        scene.angleX -= 0.5 * 0.01;
        scene.angleY += 1 * 0.01;
        scene.render();
        previous_time = now;
    }

    requestAnimationFrame(self.animate);
  };

  // initiate handlers
  self.createAllEventHandlers();

}




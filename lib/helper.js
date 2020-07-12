"use strict";

// Gets the canvas on the html 
function getCanvas(canvas_id) {

    const canvas = document.getElementById(canvas_id);
    if (!canvas || canvas.nodeName !== "CANVAS") {
      console.log('Fatal error: Canvas "' + canvas_id + '" could not be found');
    }

    return canvas;
  }

// Gets the current webGL context for the canvas passed in.
function getWebglContext(canvas) {
    const context = canvas.getContext('webgl');
    if (!context) {
      console.log("No WebGL context could be found.");
    }
    return context;
}

// Return a promise that loads a given file containing text
const loadTextResource = async function (url) {
  return new Promise(function(resolve, reject){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            // codes in 200 are okay
            // 300s deal with something have been moved
            // 400-500 are error codes
            reject('Error: HTTP Status ' + request.status + "on resource " + url);
        } else {
            resolve(request.responseText);
        }
    };
    request.send();
  });
};

const loadImage = function (url, callback) {
  let image = new image();
  image.onload = function () {
      callback(null, image);
  };
  image.src = url;
};

// Return json object file reading a file containing text
const loadJSONResource = async function (url) {
  let dataText = await loadTextResource(url);
  return JSON.parse(dataText);
};
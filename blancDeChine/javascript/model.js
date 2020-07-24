"use strict";

// Model "Object"
window.simpleModel = function (name) {
    const self = this;
    self.name = name;
    self.indices = [];
	self.vertices = [];
	self.normals = [];
	// self.uvCoord = uv;

};

// Model Object in Scene
window.createModel = function (modelObj) {
    const model = new simpleModel("flowerPot");
    model.indices = [].concat.apply([], modelObj.meshes[0].faces);
    // Vertex data
    model.vertices = modelObj.meshes[0].vertices;
    // White for Blanc de Chine
	model.color = new Float32Array( [0.95, 0.96, 0.92, 1.0]); 
	model.normals = modelObj.meshes[0].normals;
    
    return model;
  };

  // Light Model "Object"
  window.lightModel = function (name, lightDirection, lightColor, ambientColor, ambientPercentage, lightShininess) {
      const self = this;
      self.name = name;
      self.direction = lightDirection;
      self.color = lightColor;
      self.ambientColor = ambientColor;
      self.ambientPercentage = ambientPercentage;
      self.shininess = lightShininess;
  }

  // Create light model for scene
  window.createLight = function () {
    const lightDirection = new Float32Array([0.0, 1.8, 1.8]);
    const lightColor = new Float32Array([1.0, 1.0, 1.0]);
    const ambientColor = new Float32Array([0.5, 0.2, 0.7]);
    const ambientPercentage = 0.15;
    const lightShininess = 100.0;
    const model = new lightModel("light", lightDirection, lightColor, ambientColor, ambientPercentage, lightShininess);

    return model;
  }
"use strict";

window.simpleModel = function (name) {
    const self = this;
    self.name = name;
    self.indices = [];
	self.vertices = [];
	self.normals = [];
	// self.uvCoord = uv;

};

window.createModel = function (modelObj) {

    
    const model = new simpleModel("flowerPot");
    model.indices = [].concat.apply([], modelObj.meshes[0].faces);
    // Vertex data
    model.vertices = modelObj.meshes[0].vertices;
    // White for Blanc de Chine
	model.color = new Float32Array( [0.95, 0.96, 0.80, 1.0]); 
	model.normals = modelObj.meshes[0].normals;
    
    return model;
  };
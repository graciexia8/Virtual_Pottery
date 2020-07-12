
window.InitDemo = async function() {
	try {
		const vertexShader = await loadTextResource("../../blancDeChine/Shaders/shader.vs.glsl");
		const fragmentShader = await loadTextResource("../../blancDeChine/Shaders/shader.fs.glsl");
		const modelData = await loadJSONResource("../../models/json_models/blancDeChine.json");
		runDemo(vertexShader, fragmentShader, modelData);
	}
	catch(e){
		alert(e);
	}
};

window.runDemo = function (vertShadertext, fragShadertext, modelText) {
	const scene = new renderScene(vertShadertext, fragShadertext, modelText);
};

var renderScene = function(vertShadertext, fragShadertext, modelText) {
	const self = this;

	// Intermediate matrices that calculate rotation
	let xRotationMatrix = mat4.create();
	let yRotationMatrix = mat4.create();
	let rotationMatrix = mat4.create();
	 
	// vm matrix to manipulate diffuse lighting in fragment shader
	const vmMatrix = mat4.create();
	// pvm matrix to set the vertices in of object in correct position
	const pvmMatrix = mat4.create();

	// Initialize empty array
	const modelMatrix = mat4.create();
	const viewMatrix = mat4.create();
	const projMatrix = mat4.create();

	const identityMatrix = mat4.create();
	mat4.identity(identityMatrix);

	//create a scale matrix
	let scaleMatrix = mat4.create();
	mat4.scale(scaleMatrix, identityMatrix, [1.7,1.7,1.7]);

	// Public variables that will possibly be used or changed by event handlers.
	self.angleX = 0.0;
	self.angleY = 0.0;

	//get vertex and fragment shader from html file
    //I've also written these in a separate file, but since js can't access locally with a webserver, this is the alt solution.
    const vertShaderSource = vertShadertext;
	const fragShaderSource = fragShadertext;

	// Get the canvas and get the webGL context object
	self.canvas = document.getElementById('game-surface');
	var gl = self.canvas.getContext('webgl');

	//-----------------------------------------------------------------------
	self.render = function () {
		// Clear the color buffer and depth buffer so program can do hidden surface removal
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
		 // Set the model, view, projection matrices
		 mat4.identity(modelMatrix);
		 mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
		 mat4.perspective(projMatrix, glMatrix.toRadian(45), self.canvas.clientWidth / self.canvas.clientHeight, 0.1, 1000.0);
		 
 
		 // The final pre-processing step is to get the location of the variable in your shader program that will access the texture map.
		 // const u_Sampler = gl.getUniformLocation(program, "u_Sampler");

		 mat4.rotate(xRotationMatrix, identityMatrix, self.angleX, [1.0, 0, 0]);
		 mat4.rotate(yRotationMatrix, identityMatrix, self.angleY, [0, 1.0, 0]);
		 mat4.mul(rotationMatrix, yRotationMatrix, xRotationMatrix);

		 // mat4.scale(scaleMatrix, [2, 2, 2]);
		 mat4.mul(modelMatrix,scaleMatrix, rotationMatrix);

		 mat4.multiply(vmMatrix, viewMatrix, modelMatrix);
		 mat4.multiply(pvmMatrix, projMatrix, vmMatrix);
		 
		 objectsInScene.render(gl, program, model, pvmMatrix, vmMatrix);

	}
	

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = self.canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	// Clear the color buffer and depth buffer so program can do hidden surface removal
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST); // Enable hidden surface removel
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// Determine how many texture units there are
	console.log(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	// Set the source of the shaders, in html file
	gl.shaderSource(vertexShader, vertShaderSource);
	gl.shaderSource(fragmentShader, fragShaderSource);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	// create the current webGL Program, attach vertex and fragment shader to program
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program); // Link the program

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	// Create a model with ll buffer objects available.
	const model = createModel(modelText);
	const objectsInScene = new Render(gl, program, model, self.canvas);

	const events = new eventHandler(self);
	events.animate();
	
}

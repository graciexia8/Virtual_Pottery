"use strict";

window.Render = function(gl, program, model, canvas, lightModel){
    const self = this;

    function _createBufferObject(gl, data) {
        // Create a buffer object
        const buffer_id = gl.createBuffer();

        if (!buffer_id) {
          out.displayError('Failed to create the buffer object for ' + model.name);
          return null;
        }
    
        // Make the buffer object the active buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
    
        // Upload the data for this buffer object to the GPU.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    
        return buffer_id;
    }
    
    self.render = function (gl, program, model, pvmMatrix, vmMatrix, light) {
        // Get uniform locations of things
        const u_Color_location  = gl.getUniformLocation(program, 'u_Color');
        
        // Get Light Model locations of things
        const u_light_direction = gl.getUniformLocation(program, 'u_light_Direction');
        const u_light_colour = gl.getUniformLocation(program, 'u_light_Color');
        const u_ambient_Color = gl.getUniformLocation(program, 'u_ambient_Color');
        const u_ambient_Percentage = gl.getUniformLocation(program, 'u_ambient_Percentage');
        const u_shininess = gl.getUniformLocation(program, 'u_shininess');

        // Get the attribute locations of the vertices and texture coordinates from shaders
        const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        const texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        const normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');

        // Set the indices buffer attribute
        let  boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);


        // Set the vertex buffer attribute to 
        const boxVertexBufferObject = _createBufferObject(gl, model.vertices);
        
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            0,// Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        // Enable attributes
        gl.enableVertexAttribArray(positionAttribLocation);

        // Set the vertex normal buffer attribute
        const vertexNormalBufferObject = _createBufferObject(gl, model.normals);

        // Normal
        gl.vertexAttribPointer(
            normalAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            0,
            0 // Offset from the beginning of a single vertex to this attribute
        );

        gl.enableVertexAttribArray(normalAttribLocation);

        // Tell OpenGL state machine which program should be active.
        gl.useProgram(program);

        // Get the locations of the model, view, projection matrices
        let pvmUniformLocation = gl.getUniformLocation(program, 'matrix');
        // Get the locations of the model, view, projection matrices
        let vmUniformLocation = gl.getUniformLocation(program, 'vm_matrix');

        // Set the color for all of the triangle faces
        gl.uniform4fv(u_Color_location, model.color);

        // Set Lighting Model information
        gl.uniform3fv(u_light_direction, light.direction);
        gl.uniform3fv(u_light_colour, light.color);
        gl.uniform3fv(u_ambient_Color, light.ambientColor);
        gl.uniform1f(u_ambient_Percentage, light.ambientPercentage);
        gl.uniform1f(u_shininess, light.shininess);

        // set the new pvm and vm matrices since our model matrix changes
        gl.uniformMatrix4fv(pvmUniformLocation, false, pvmMatrix);
        gl.uniformMatrix4fv(vmUniformLocation, false, vmMatrix);

        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

    }
   
};
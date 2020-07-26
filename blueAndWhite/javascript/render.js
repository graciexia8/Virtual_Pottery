"use strict";

window.Render = function(gl, program, model, canvas, lightModel){
    const self = this;

    // Get uniform locations of things
    let u_Color_location;
        
    // Get Light Model locations of things
    let u_light_direction;
    let u_light_colour;
    let u_ambient_Color;
    let u_ambient_Percentage;
    let u_shininess;

    // Get the attribute locations of the vertices and texture coordinates from shaders
    let positionAttribLocation;
    let texCoordAttribLocation;
    let normalAttribLocation;

    // Buffer locations
    let  boxIndexBufferObject;
    let boxVertexBufferObject;
    let uvBufferObject;
    let vertexNormalBufferObject;

    // Texture mapping variables
    let img;
    let boxTexture;

    // USmapler
    let u_Sampler;

    // Matrix Locations
    let vmUniformLocation;
    let pvmUniformLocation;



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

    function _createTextureObject(imageTexture) {

        let UVtexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, UVtexture);
        // Properties of the texture object
        // gl.CLAMP_TO_EDGE: This clamps all values greater than 1.0 to 1.0 and all values less than 0.0 to 0.0. 
        // Therefore the colors at the image’s borders are repeatedly used if the texture coordinates go outside the range 0.0 to 1.0. 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // When s coordinate reaches boundary (0-1), use pixel at border for beyond
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // When t coordinate reaches boundary, use pixel at border
        // Minificatio and magnification to fit alter dimensions of image to fit on the face of a cube
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); 
        // gl.Linear, calculates a weighted average of the four pixels that surround a location, to set color for (s,t) coordinate
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Set the image of the texture object
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            imageTexture
        );
        // Unbind texture from texture unit.
        gl.bindTexture(gl.TEXTURE_2D, null);

        return UVtexture;

    }

    self.setScene = function (gl, program, model, light){
            // Get uniform locations of things
            u_Color_location  = gl.getUniformLocation(program, 'u_Color');
        
            // Get Light Model locations of things
            u_light_direction = gl.getUniformLocation(program, 'u_light_Direction');
            u_light_colour = gl.getUniformLocation(program, 'u_light_Color');
            u_ambient_Color = gl.getUniformLocation(program, 'u_ambient_Color');
            u_ambient_Percentage = gl.getUniformLocation(program, 'u_ambient_Percentage');
            u_shininess = gl.getUniformLocation(program, 'u_shininess');
        
            // Get the attribute locations of the vertices and texture coordinates from shaders
            positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
            texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
            normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');

            // Set the indices buffer attribute
            boxIndexBufferObject = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

            // Set the vertex buffer attribute to 
            boxVertexBufferObject = _createBufferObject(gl, model.vertices);
        
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

            // // Set the vertex buffer attribute to 
            uvBufferObject = _createBufferObject(gl, model.textureCoords);

            // // TEXTURE COORDINATES, THIS GUY USED
            gl.vertexAttribPointer(
                texCoordAttribLocation, // Attribute location
                2, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                0, // Size of an individual vertex
                0 // Offset from the beginning of a single vertex to this attribute
            );

            gl.enableVertexAttribArray(texCoordAttribLocation);

            // NORMAL BUFFER OBJECT MUST BE DECLARED AFTER VERTEX POSITION ATTRIBUTE HAS BEEN ENABLED, DUE TO SINGLE GL.ARRAY_BUFFER BINDING POINT.
            // IF YOU DO IT RIGHT AFTER gl.vertexAttribPointer for the texture coordinates, it rebinds gl.ARRAY_BUFFER to the normals and uses that for 
            //vertices instead agh.

            // Set the vertex normal buffer attribute
            vertexNormalBufferObject = _createBufferObject(gl, model.normals);

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

            //
            // Create texture
            //
            img = document.getElementById('textureImage');
            boxTexture = _createTextureObject(img);
            

            // Tell OpenGL state machine which program should be active.
            gl.useProgram(program);

            // Get the locations of the model, view, projection matrices
            pvmUniformLocation = gl.getUniformLocation(program, 'matrix');
            // Get the locations of the model, view, projection matrices
            vmUniformLocation = gl.getUniformLocation(program, 'vm_matrix');

            // The final pre-processing step is to get the location of the variable in your shader program that will access the texture map.
            u_Sampler = gl.getUniformLocation(program, "u_Sampler");

            // Set the color for all of the triangle faces
            gl.uniform4fv(u_Color_location, model.color);

            // Set Lighting Model information
            gl.uniform3fv(u_light_direction, light.direction);
            gl.uniform3fv(u_light_colour, light.color);
            gl.uniform3fv(u_ambient_Color, light.ambientColor);
            gl.uniform1f(u_ambient_Percentage, light.ambientPercentage);
            gl.uniform1f(u_shininess, light.shininess);
    }

    self.render = function (gl, program, model, pvmMatrix, vmMatrix) {

        // set the new pvm and vm matrices since our model matrix changes
        gl.uniformMatrix4fv(pvmUniformLocation, false, pvmMatrix);
        gl.uniformMatrix4fv(vmUniformLocation, false, vmMatrix);

        // // Make the "texture unit" 0 be the active texture unit.
        gl.activeTexture(gl.TEXTURE0);
        // Make the texture_object be the active texture. This binds the
        // texture_object to "texture unit" 0.
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        // Tell the shader program to use "texture unit" 0
        gl.uniform1i(program.u_Sampler, 0);

        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

    }

    this.setScene(gl, program, model, lightModel);
   
};
window.Render = function(gl, program, model, canvas){
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

    function _createTextureObject(imageTexture) {

        let boxTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
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

        return boxTexture;

    }

    self.render = function (gl, program, model, pvmMatrix, vmMatrix) {
        // Get uniform locations of things
        const u_Color_location  = gl.getUniformLocation(program, 'u_Color');

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

        // // Set the vertex buffer attribute to 
        // const uvBufferObject = _createBufferObject(gl, model.uvCoord);

        // // TEXTURE COORDINATES, THIS GUY USED
        // gl.vertexAttribPointer(
        //     texCoordAttribLocation, // Attribute location
        //     2, // Number of elements per attribute
        //     gl.FLOAT, // Type of elements
        //     gl.FALSE,
        //     0, // Size of an individual vertex
        //     0 // Offset from the beginning of a single vertex to this attribute
        // );

        // gl.enableVertexAttribArray(texCoordAttribLocation);

        // NORMAL BUFFER OBJECT MUST BE DECLARED AFTER VERTEX POSITION ATTRIBUTE HAS BEEN ENABLED, DUE TO SINGLE GL.ARRAY_BUFFER BINDING POINT.
        // IF YOU DO IT RIGHT AFTER gl.vertexAttribPointer for the texture coordinates, it rebinds gl.ARRAY_BUFFER to the normals and uses that for 
        //vertices instead agh.

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

        //
        // Create texture
        //
        // const img = document.getElementById('textureImage');
        // let boxTexture = _createTextureObject(img);

        // Tell OpenGL state machine which program should be active.
        gl.useProgram(program);

        // Get the locations of the model, view, projection matrices
        let pvmUniformLocation = gl.getUniformLocation(program, 'matrix');
        // Get the locations of the model, view, projection matrices
        let vmUniformLocation = gl.getUniformLocation(program, 'vm_matrix');

        // The final pre-processing step is to get the location of the variable in your shader program that will access the texture map.
        // const u_Sampler = gl.getUniformLocation(program, "u_Sampler");

        // Set the color for all of the triangle faces
        gl.uniform4fv(u_Color_location, model.color);

        // set the new pvm and vm matrices since our model matrix changes
        gl.uniformMatrix4fv(pvmUniformLocation, false, pvmMatrix);
        gl.uniformMatrix4fv(vmUniformLocation, false, vmMatrix);

        // // Make the "texture unit" 0 be the active texture unit.
        // gl.activeTexture(gl.TEXTURE0);
        // // Make the texture_object be the active texture. This binds the
        // // texture_object to "texture unit" 0.
        // gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        // // Tell the shader program to use "texture unit" 0
        // gl.uniform1i(program.u_Sampler, 0);

        gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);

    }
   
};
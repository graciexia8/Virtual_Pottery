      precision mediump float;

      uniform vec4 u_Color;

      attribute vec3 vertPosition;
      attribute vec2 vertTexCoord;
      attribute vec3 vertNormal;

      // Data (to be interpolated) that is passed on to the fragment shader
      varying vec3 v_Vertex;
      varying vec3 v_Normal;
      varying vec2 fragTexCoord;
      
      uniform mat4 vm_matrix;
      uniform mat4 matrix;
      
      void main()
      {
        // Perform the model and view transformations on the vertex and pass this
        // location to the fragment shader.
        v_Vertex = vec3( vm_matrix * vec4(vertPosition, 1.0) );
      
        // Perform the model and view transformations on the vertex's normal vector
        // and pass this normal vector to the fragment shader.
        v_Normal = vec3( vm_matrix * vec4(vertNormal, 0.0) );

        fragTexCoord = vertTexCoord;
        gl_Position = matrix * vec4(vertPosition, 1.0);
    
    }
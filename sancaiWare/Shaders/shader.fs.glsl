      // Fragment shader program
      precision mediump float;
    
      uniform sampler2D u_sampler;
      uniform vec4 u_Color;
      uniform vec3 u_light_Direction;
      uniform vec3 u_light_Color;
      uniform vec3 u_ambient_Color;
      uniform float u_ambient_Percentage;
      uniform float u_shininess;

      // Data (to be interpolated) that is passed on to the fragment shader
      varying vec3 v_Vertex;
      varying vec3 v_Normal;
      varying vec2 fragTexCoord;
      
      void main()
      {
        vec3 to_light;
        vec3 vertex_normal;
        vec3 reflection;
        vec3 to_camera;
        float cos_angle;

        vec3 ambient_color;
        vec3 diffuse_color;
        vec3 specular_color;
        vec3 color;

        vec4 texel = texture2D(u_sampler, fragTexCoord);

        ambient_color = (u_ambient_Percentage * u_ambient_Color) * texel.rgb;

        // Calculate a vector from the fragment location to the light source
        to_light = normalize(u_light_Direction) - v_Vertex;
        to_light = normalize( to_light );
      
        // The vertex's normal vector is being interpolated across the primitive
        // which can make it un-normalized. So normalize the vertex's normal vector.
        vertex_normal = normalize( v_Normal );

        // Calculate the cosine of the angle between the vertex's normal vector
        // and the vector going to the light.
        cos_angle = dot(vertex_normal, to_light);
        cos_angle = clamp(cos_angle, 0.35, 0.8);

        diffuse_color =  texel.rgb * cos_angle;
      
        // Calculate the reflection vector
        reflection = 2.0 * dot(vertex_normal, to_light) * vertex_normal - to_light;
      
        // Calculate a vector from the fragment location to the camera.
        // The camera is at the origin, so negating the vertex location gives the vector
        to_camera = -1.0 * v_Vertex;

        // Calculate the cosine of the angle between the reflection vector
        // and the vector going to the camera.
        reflection = normalize( reflection );
        to_camera = normalize( to_camera );
        cos_angle = dot(reflection, to_camera);
        cos_angle = clamp(cos_angle, 0.5, .995);
        cos_angle = pow(cos_angle, u_shininess);

        // The specular color is from the light source, not the object
        if (cos_angle > 0.0) {
          specular_color = u_light_Color * cos_angle ;
          diffuse_color = diffuse_color * (1.0 - cos_angle);
        } else {
          specular_color = vec3(0.0, 0.0, 0.0);
        }

        color = ambient_color + diffuse_color + specular_color;

        gl_FragColor = vec4(color,  texel.a);
      }
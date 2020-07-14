      // Fragment shader program
      precision mediump float;
      
      const vec3 lightDirection = normalize(vec3(0.0, 1.8, 1.8));
      const vec3 lightColor = vec3(1.0, 1.0, 1.0);
      const vec3 ambientColor = vec3(0.5, 0.2, 0.7);
      const float ambientPecentage = 0.25;
    
      const float shininess = 4.5;
      // uniform sampler2D u_sampler;

      uniform vec4 u_Color;


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

        // vec4 texel = texture2D(u_sampler, fragTexCoord);

        ambient_color = (ambientPecentage * ambientColor) * u_Color.xyz;

        // Calculate a vector from the fragment location to the light source
        to_light = lightDirection - v_Vertex;
        to_light = normalize( to_light );
      
        // The vertex's normal vector is being interpolated across the primitive
        // which can make it un-normalized. So normalize the vertex's normal vector.
        vertex_normal = normalize( v_Normal );

        // Calculate the cosine of the angle between the vertex's normal vector
        // and the vector going to the light.
        cos_angle = dot(vertex_normal, to_light);
        cos_angle = clamp(cos_angle, 0.5, 0.8);

        diffuse_color =  u_Color.xyz * cos_angle;
      
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
        cos_angle = clamp(cos_angle, 0.0, 0.8);
        cos_angle = pow(cos_angle, shininess);

        // The specular color is from the light source, not the object
        if (cos_angle > 0.0) {
          specular_color = lightColor * cos_angle;
          diffuse_color = diffuse_color * (1.0 - cos_angle);
        } else {
          specular_color = vec3(0.0, 0.0, 0.0);
        }

        color = ambient_color + diffuse_color + specular_color;

        gl_FragColor = vec4(color,  u_Color.a);
      }
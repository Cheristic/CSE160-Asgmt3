// ColoredPoint.js (c) 2012 matsuda
// Taken by Ethan Heffan 2024

// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;
  uniform float u_UVMult;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  uniform mat4 u_NormalMatrix;
  attribute vec4 a_Normal;
  varying vec3 v_Normal;
  varying vec4 v_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotationMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
    v_TexCoord = a_TexCoord * u_UVMult;
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Position = u_ModelMatrix * a_Position;
    v_Color = a_Color;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec3 u_PointLightPosition;
  uniform vec3 u_SpotLightPosition;
  uniform vec3 u_LightColor;
  varying vec3 v_Normal;
  uniform vec3 u_CameraPos;
  varying vec4 v_Position;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_textureSelector;
  varying vec2 v_TexCoord;
  varying vec4 v_Color;
  uniform bool u_lit;

  uniform bool u_LightsOn;
  uniform bool u_ShowNormals;
  
  void main() {
    vec4 color;
    float specMult = 1.0;
    float specExp = 15.0;

    if (u_textureSelector == -3) {
      color = v_Color;
    }
    else if (u_textureSelector == -2) {
      color = u_FragColor;
    } 
    else if (u_textureSelector == -1) {
      color = vec4(v_TexCoord, 1.0, 1.0);
    }
    else if (u_textureSelector == 0) {
      color = texture2D(u_Sampler0, v_TexCoord);
      specMult = 0.5;
      specExp = 2.0;
    }
    else if (u_textureSelector == 1) {
      color = texture2D(u_Sampler1, v_TexCoord);
      specMult = 0.1;
    } 
    else if (u_textureSelector == 2) {
      color = texture2D(u_Sampler2, v_TexCoord);
    }
    else {
      color = vec4(1, .2, .2, 1);
    }

    if (u_ShowNormals) {
      color = vec4((v_Normal + 1.0)/2.0, color.a);
    }
    else if (u_lit && u_LightsOn) {
      // point light
      vec3 pointLightVector = u_PointLightPosition - vec3(v_Position);
      float r = length(pointLightVector);

      vec3 N, L, R, E, H;
      N = normalize(v_Normal);
      L = normalize(pointLightVector);
      R = reflect(-L, N);
      E = normalize(u_CameraPos - vec3(v_Position));
      float nDotL = max(dot(N, L), 0.0);
      vec3 diffuse = u_LightColor * color.rgb * nDotL * 40.0 / (r*r);
      vec3 specular = (pow(max(dot(E, R), 0.0), specExp)) * vec3(1.0) * specMult;;
      vec3 ambient = color.rgb * 0.23;


      // spot light
      vec3 spotLightVector = normalize(u_SpotLightPosition - vec3(v_Position));
      float spotDot = max(dot(spotLightVector, vec3(0.0, 1.0, 0.0)), 0.0);
      float limitRange = .98 - .9;
      float lFallOff = clamp((spotDot - .9)/limitRange, 0.0, 1.0);
      float l = lFallOff * dot(N, spotLightVector);
      vec3 spot = vec3(l, l, l) * u_LightColor * .25;
      
      color = vec4(ambient + specular + diffuse + spot, color.a);
      //color = vec4(spot, color.a);
    }

    gl_FragColor = color;
    
  }`

let canvas;
let gl;
let hud;
// vertex shader variables
let a_Position;
let a_TexCoord;
let u_UVMult;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let a_Color;

let a_Normal;
let u_NormalMatrix;
// fragment shader variables
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_textureSelector;

let u_PointLightPosition;
let u_SpotLightPosition;
let u_LightColor;
let u_lit;
let u_CameraPos;
let u_LightsOn;
let u_ShowNormals;

// ## WEBGL SETUP START ##
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');


  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  hud = document.getElementById('2d');
  hud.addEventListener("click", async () => {
    await canvas.requestPointerLock({
      unadjustedMovement: true
    });
  }, false);
  hud = hud.getContext('2d')

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of vertex shader variables
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return;
  }

  u_UVMult = gl.getUniformLocation(gl.program, 'u_UVMult');
  if (!u_UVMult) {
    console.log('Failed to get the storage location of u_UVMult');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
  if (!u_GlobalRotationMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotationMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }


  // Get the storage location of fragment shader variables
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_textureSelector = gl.getUniformLocation(gl.program, 'u_textureSelector');
  if (!u_textureSelector) {
    console.log('Failed to get the storage location of u_textureSelector');
    return;
  }
  
  u_PointLightPosition = gl.getUniformLocation(gl.program, 'u_PointLightPosition');
  if (!u_PointLightPosition) {
    console.log('Failed to get the storage location of u_PointLightPosition');
    return;
  }

  u_SpotLightPosition = gl.getUniformLocation(gl.program, 'u_SpotLightPosition');
  if (!u_SpotLightPosition) {
    console.log('Failed to get the storage location of u_SpotLightPosition');
    return;
  }


  u_lit = gl.getUniformLocation(gl.program, 'u_lit');
  if (!u_lit) {
    console.log('Failed to get the storage location of u_lit');
    return;
  }

  u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');
  if (!u_CameraPos) {
    console.log('Failed to get the storage location of u_CameraPos');
    return;
  }
  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  if (!u_LightColor) {
    console.log('Failed to get the storage location of u_LightColor');
    return;
  }

  u_ShowNormals = gl.getUniformLocation(gl.program, 'u_ShowNormals');
  if (!u_ShowNormals) {
    console.log('Failed to get the storage location of u_ShowNormals');
    return;
  }

  u_LightsOn = gl.getUniformLocation(gl.program, 'u_LightsOn');
  if (!u_LightsOn) {
    console.log('Failed to get the storage location of u_LightsOn');
    return;
  }


}

function initTextures() {

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1 || !image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ sendImageToTexture2D(u_Sampler0, image0, 0); };
  image1.onload = function(){ sendImageToTexture2D(u_Sampler1, image1, 1); };
  image2.onload = function(){ sendImageToTexture2D(u_Sampler2, image2, 2); };
  // Tell the browser to load an Image
  image0.src = 'resources/floor.jpg';
  image1.src = 'resources/hedgewall.jpg';
  image2.src = 'resources/crate.jpg';

  return true;
}

function sendImageToTexture2D(sampler, image, texUnit) {
  // Create a texture object
  var texture = gl.createTexture(); 
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else if (texUnit == 1) {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  } else if (texUnit == 2) {
    gl.activeTexture(gl.TEXTURE2);
    g_texUnit2 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);   

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  gl.uniform1i(sampler, texUnit);   // Pass the texure unit to u_Sampler
}
// ## WEBGL SETUP END ##

// Page Globals
let g_fps;

// Scene Globals
let g_Scene;
let g_lightsOn = true;
let g_PointLight = {
  position: [0, 0, 0],
  mov: [0, 0, 0],
  obj: null
}
let g_toggleNormals = false;
let g_lightColor = [1, 1, 1];


//  ## HELPER FUNCTIONS START ##
function addActionsForHtmlUI() {

  g_fps = document.getElementById("fps");
  document.getElementById("lightSlideX").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_PointLight.mov[0] = this.value/100;}})
  document.getElementById("lightSlideY").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_PointLight.mov[1] = this.value/100;}})
  document.getElementById("lightSlideZ").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_PointLight.mov[2] = this.value/100;}})

  document.getElementById("lightColorR").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_lightColor[0] = this.value/255;}})
  document.getElementById("lightColorG").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_lightColor[1] = this.value/255;}})
  document.getElementById("lightColorB").addEventListener("mousemove", function(ev) {if (ev.buttons == 1) {g_lightColor[2] = this.value/255;}})

  document.getElementById("lightToggle").addEventListener("click", function() {g_lightsOn = !g_lightsOn;})
  document.getElementById("normalToggle").addEventListener("click", function() {g_toggleNormals = !g_toggleNormals;})

  
}

//  ## HELPER FUNCTIONS END ##


// ## CORE SECTION START ##
function main() {

  setupWebGL();
  connectVariablesToGLSL();
  initTextures();

  addActionsForHtmlUI();

  g_Scene = new Scene();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 0.0);

  requestAnimationFrame(update);
}

let dt = 0;
let lastTimeStamp = 0;
let frameTrackTime = 0;
function update(timestamp) {
  // used reference https://github.com/llopisdon/webgl-pong/blob/master/main.js
  const t = timestamp / 1000;
  dt = t - lastTimeStamp;
  lastTimeStamp = t;

  // calculate fps
  if (t > frameTrackTime + 1) {
    g_fps.innerHTML = (1 / (dt)).toFixed(1);
    frameTrackTime = t;
  }

  handleRender(dt);

  requestAnimationFrame(update);
}

function handleRender(dt) {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  hud.clearRect(0, 0, canvas.width, canvas.height);
 
  g_Scene.renderScene(dt);
}
// ## CORE SECTION END ##

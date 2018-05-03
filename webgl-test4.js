var cubeRotation = 0.0;
main();


function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  //provjera postojanja webGL

  if (!gl) {
    alert('Vaš Preglednik ne podržava webGL');
    return;
  }

  //definiranje izvora vertexshadera i fragmentshader

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  //inicijalizacija programa
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };


  const buffers = initBuffers(gl);
  const texture = loadTexture(gl, 'shell.jpg');
  
  
 
  // ponavljanje scene
  var time = 0;

  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - time;
    time = now;

    drawScene(gl, programInfo, buffers,texture, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//punjenje buffera
function initBuffers(gl) {

  

  const positionBuffer = gl.createBuffer();

  

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  

  const positions = [
     // Front face
     0.0,  1.0,  0.0,
     -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     // Right face
     0.0,  1.0,  0.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
     // Back face
     0.0,  1.0,  0.0,
     1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
     // Left face
     0.0,  1.0,  0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
      
    -1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
	  
    -1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
     1.0, -1.0, -1.0,
  
  
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	
  const textureCoordinates = [
    // Front
    0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0, 
	
	0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0,
	
	0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0,
	
	0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0,
	
	0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0,
	
	0.0,  0.0,
    0.5,  1.0,
    1.0,  0.0,
    
  ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,1,2,         // front
    3,4,5,
	6,7,8,
	9,10,11,
	12,13,14,
	15,16,17
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}
// textura funkcija
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);
if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function drawScene(gl, programInfo, buffers,texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clearDepth(1.0);                 
  gl.enable(gl.DEPTH_TEST);           
  gl.depthFunc(gl.LEQUAL);            
  
 

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // kut gledanja

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.3;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  
  const modelViewMatrix = mat4.create();

  

  mat4.translate(modelViewMatrix,     
                 modelViewMatrix,     
                 [-0.0, 0.0, -6.0]);  

//animacija
 
	
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * .7, [0.7, 0.6, 0.2]);

  //kako analizirati i uzimati vektore
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  
 {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }

  
  gl.useProgram(programInfo.program);

 

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = 18;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  
  cubeRotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

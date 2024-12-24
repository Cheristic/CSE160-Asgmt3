class Cube extends Shape3D {
  constructor(position, color, texNum, uvMult = 1, isLit = true) {
    super(position, color);
    this.type='cube';
    this.texNum = texNum;
    this.uvMult = uvMult;
    this.width = .3;
    this.isLit = isLit;
  }

  static VERTICES = [
    -.5, -.5, .5,   0, 0,     0.0, 0.0, 1.0, // back
    .5, -.5, .5,    1.0, 0,       0, 0, 1.0,
    -.5, .5, .5,    0, 1.0,   0, 0, 1.0,
    .5, -.5, .5,    1.0, 0,       0, 0, 1.0,
    -.5, .5, .5,    0, 1.0,   0, 0, 1.0,
    .5, .5, .5,     1.0, 1.0,     0, 0, 1.0,

    .5, -.5, .5,    1.0, 0,       -1.0, 0, 0,
    .5, -.5, -.5,   0, 0,     -1.0, 0, 0,  // left
    .5, .5, .5,     1.0, 1.0,     -1.0, 0, 0,
    .5, -.5, -.5,   0, 0,     -1.0, 0, 0,  
    .5, .5, .5,     1.0, 1.0,     -1.0, 0, 0,
    .5, .5, -.5,   0, 1.0,     -1.0, 0, 0,  
    
    .5, .5, -.5,    0, 1.0,   0, 0, -1.0, // front
    .5, -.5, -.5,   0, 0,       0, 0, -1.0, 
    -.5, -.5, -.5,  1.0, 0,     0, 0, -1.0, 
    .5, .5, -.5,    0, 1.0,   0, 0, -1.0,
    -.5, .5, -.5,    1.0, 1.0,     0, 0, -1.0,
    -.5, -.5, -.5,  1.0, 0,     0, 0, -1.0,

    -.5, .5, -.5,   1.0, 1.0,   1.0, 0, 0,  // right
    -.5, -.5, -.5,  1.0, 0,     1.0, 0, 0,  
    -.5, -.5, .5,   0, 0,     1.0, 0, 0,  
    -.5, .5, -.5,   1.0, 1.0,     1.0, 0, 0,
    -.5, .5, .5,    0, 1.0,   1.0, 0, 0,
    -.5, -.5, .5,   0, 0,     1.0, 0, 0,  
    
    
    .5, -.5, -.5,   0, 0,     0, -1.0, 0, // bottom
    -.5, -.5, .5,   1.0, 1.0,     0, -1.0, 0,
    .5, -.5, .5,    0, 1.0,   0, -1.0, 0,
    .5, -.5, -.5,   0, 0,     0, -1.0, 0,
    -.5, -.5, .5,   1.0, 1.0,     0, -1.0, 0,
    -.5, -.5, -.5,    1.0, 0,   0, -1.0, 0,
    
    -.5, .5, -.5,   1.0, 0,     0, 1.0, 0, // top
    .5, .5, -.5,    0, 0,   0, 1.0, 0,
    .5, .5, .5,    0, 1.0,   0, 1.0, 0,
    .5, .5, .5,    0, 1.0,   0, 1.0, 0,
    -.5, .5, -.5,   1.0, 0,     0, 1.0, 0,
    -.5, .5, .5,    1.0, 1.0,   0, 1.0, 0,
  ];
  static vertices = null;

  render(dt) {
    this.prepareModelMatrix();
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrixBuffer.elements);
    

    var rgba = this.color;  
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1i(u_textureSelector, this.texNum);
    gl.uniform1i(u_lit, this.isLit);
    gl.uniform1f(u_UVMult, this.uvMult);

    // set up vertex buffer
    if (this.vertexBuffer == null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
          console.log("Failed to create the vertex buffer object");
          return -1;
      }
    } 

    if (Cube.vertices == null) {
      Cube.vertices = new Float32Array(Cube.VERTICES);
    }
  
    var FSIZE = Cube.vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Cube.vertices, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
    gl.enableVertexAttribArray(a_TexCoord);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
    gl.enableVertexAttribArray(a_Normal);

    // now draw the shape
    gl.drawArrays(gl.TRIANGLES, 0, Cube.vertices.length / 8);  

  }
}

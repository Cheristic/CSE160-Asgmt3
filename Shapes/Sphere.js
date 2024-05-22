class Sphere extends Shape3D {
    constructor(position, color, radius, splits, texNum, lit, uvMult = 1) {
      super(position, color);
      this.type='sphere';
      this.radius = radius;
      this.splits = splits;
      this.texNum = texNum;
      this.color = color;
      this.lit = lit;
      this.uvMult = uvMult;
  
      this.generateSurfaces();
    }
  
    generateSurfaces() {
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;

      let col = this.color;
      var vertices = [], indices = [], normals = [];
      for (j = 0; j <= this.splits; j++) {
        aj = j * Math.PI / this.splits;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= this.splits; i++) {
          ai = i * 2 * Math.PI / this.splits;
          si = Math.sin(ai);
          ci = Math.cos(ai);

          vertices.push(si * sj); // X
          vertices.push(cj);      // Y
          vertices.push(ci * sj); // Z

          normals.push(si * sj);
          normals.push(cj);
          normals.push(ci * sj);

          vertices.push(col[0]);
          vertices.push(col[1]);
          vertices.push(col[2]);

        }
      }

      for (j = 0; j < this.splits; j++) {
        for (i = 0; i < this.splits; i++) {
          p1 = j * (this.splits + 1) + i;
          p2 = p1 + (this.splits+1);

          indices.push(p1);
          indices.push(p2);
          indices.push(p1 + 1);

          indices.push(p1 + 1);
          indices.push(p2);
          indices.push(p2 + 1);
        }
      }


      this.surfaces.push(new Sphere3DSurface(this.position, 
        new Float32Array(vertices), new Uint8Array(indices), new Float32Array(normals), this.texNum, this.lit, this.color, this.uvMult));
      
    }
  
    render(dt) {
      this.prepareModelMatrix();

      this.normalMatrix.setInverseOf(this.matrixBuffer);
      this.normalMatrix.transpose();
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrixBuffer.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
      for (let i = 0; i < this.surfaces.length; i++) {
          this.surfaces[i].render();
      }
    }
}

class Sphere3DSurface {
  constructor(position, vertices, indices, normals, texNum, isLit, color, uvMult) {
    this.position = position;
    this.vertices = vertices;
    this.indices = indices;
    this.normals = normals;
    this.textureNum = texNum;
    this.uvMult = uvMult;

    this.vertexColorBuffer = null;
    this.indexBuffer = null;
    this.normalBuffer = null;
    this.isLit = isLit;
    this.color = color;
  }

  render() {
    gl.uniform1i(u_textureSelector, this.textureNum);
    gl.uniform1i(u_lit, this.isLit);
    var rgba = this.color;  
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_UVMult, this.uvMult);

    // set up vertex buffer
    if (this.vertexColorBuffer == null) {
      this.vertexColorBuffer = gl.createBuffer();
      if (!this.vertexColorBuffer) {
          console.log("Failed to create the vertex buffer object");
          return -1;
      }
    } 
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        

    var FSIZE = this.vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    // set up index buffer
    if (this.indexBuffer == null) {
      this.indexBuffer = gl.createBuffer();
      if (!this.indexBuffer) {
          console.log("Failed to create the index buffer object");
          return -1;
      }
    } 
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

    // set up normal buffer
    if (this.normalBuffer == null) {
      this.normalBuffer = gl.createBuffer();
      if (!this.normalBuffer) {
          console.log("Failed to create the normal buffer object");
          return -1;
      }
    } 

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);



    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);  
  }
}
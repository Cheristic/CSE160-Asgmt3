class Sphere extends Shape3D {
    constructor(position, color, radius, splits, texNum) {
      super(position, color);
      this.type='sphere';
      this.radius = radius;
      this.splits = splits;
      this.texNum = texNum;
      this.color = color;
  
      this.generateSurfaces();
    }
  
    generateSurfaces() {
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;

      let col = this.color;
      var vertices = [], indices = [];
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

          // colors
          if ((ci*sj) < 0) {
            col = [col[0]+.015, col[1]+.015, col[2]+.015]
          } 
          else {
            col = [col[0]-.015, col[1]-.015, col[2]-.015]
          }

          if ((si*sj) < 0) {
            col = [col[0]/.98, col[1]/.98, col[2]/.98]
          } 
          else {
            col = [col[0]*.98, col[1]*.98, col[2]*.98]
          }

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
        new Float32Array(vertices), new Uint8Array(indices)));
      
    }
  
    render(dt) {
      super.render(dt);
    }
}

class Sphere3DSurface extends Shape3DSurface {
  constructor(position, vertices, indices) {
    super(position, null, vertices, null, -3, indices)

    this.vertexColorBuffer = null;
    this.indexBuffer = null;
  }

  render() {
    gl.uniform1i(u_textureSelector, this.textureNum);

    // set up vertex buffer
    if (this.vertexColorBuffer == null) {
      this.vertexColorBuffer = gl.createBuffer();
      if (!this.vertexColorBuffer) {
          console.log("Failed to create the vertex buffer object");
          return -1;
      }
    } 

    // set up index buffer
    if (this.indexBuffer == null) {
      this.indexBuffer = gl.createBuffer();
      if (!this.indexBuffer) {
          console.log("Failed to create the index buffer object");
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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_BYTE, 0);  
  }
}
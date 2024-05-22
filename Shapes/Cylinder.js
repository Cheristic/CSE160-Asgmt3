class Cylinder extends Shape3D {
  constructor(position, color, innerRadius, outerRadius, height, segments, half, texNum, uvMult = 1) {
    super(position, color);
    this.type='cylinder';
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.height = height;
    this.segments = segments;
    this.half = half;
    this.texNum = texNum;
    this.uvMult = uvMult;

    this.generateSurfaces();
  }

  generateSurfaces() {
    let h = this.height/200;
    let xyz = this.position;
    let col = this.color;
    let sRad = this.outerRadius / 200;
    let bRad = this.innerRadius / 200;

    let angleStep = 360 / this.segments;
    for (var angle = 0; angle < 360; angle = angle + angleStep) {

      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [
        Math.cos((angle1 * Math.PI) / 180) * sRad,
        Math.sin((angle1 * Math.PI) / 180) * sRad,
      ];
      let vec2 = [
        Math.cos((angle2 * Math.PI) / 180) * sRad,
        Math.sin((angle2 * Math.PI) / 180) * sRad,
      ];
      let vec3 = [
        Math.cos((angle1 * Math.PI) / 180) * bRad,
        Math.sin((angle1 * Math.PI) / 180) * bRad,
      ];
      let vec4 = [
        Math.cos((angle2 * Math.PI) / 180) * bRad,
        Math.sin((angle2 * Math.PI) / 180) * bRad,
      ];
      let pt1 = [xyz[0] + vec1[0], xyz[2] + vec1[1]];
      let pt2 = [xyz[0] + vec2[0], xyz[2] + vec2[1]];
      let pt3 = [xyz[0] + vec3[0], xyz[2] + vec3[1]];
      let pt4 = [xyz[0] + vec4[0], xyz[2] + vec4[1]];

      // top
      this.surfaces.push(new Cylinder3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],   0, 1, 0,
                         pt1[0], xyz[1]+h/2, pt1[1],    0, 1, 0,
                         pt2[0], xyz[1]+h/2, pt2[1],    0, 1, 0
      ]), this.uvMult));
      // top side panel
      this.surfaces.push(new Cylinder3DSurface(this.position, col, 
        new Float32Array([pt1[0], xyz[1]+h/2, pt1[1],   pt1[0], xyz[1]+h/2, pt1[1],
                         pt2[0], xyz[1]+h/2, pt2[1],    pt2[0], xyz[1]+h/2, pt2[1],
                         pt3[0], xyz[1], pt3[1],        pt3[0], xyz[1], pt3[1],  
                         pt4[0], xyz[1], pt4[1],        pt4[0], xyz[1], pt4[1], 
        ]), this.uvMult));

      if (!this.half) {
        // bottom side panel
        this.surfaces.push(new Cylinder3DSurface(this.position, col, 
          new Float32Array([pt3[0], xyz[1], pt3[1],  pt3[0], xyz[1], pt3[1],
                          pt4[0], xyz[1], pt4[1],    pt4[0], xyz[1], pt4[1],
                          pt1[0], xyz[1]-h/2, pt1[1],   pt1[0], xyz[1]-h/2, pt1[1],
                          pt2[0], xyz[1]-h/2, pt2[1] ,  pt2[0], xyz[1]-h/2, pt2[1]  
         
          
          
          
            ]), this.uvMult)); // bottom
        this.surfaces.push(new Cylinder3DSurface(this.position, col, 
          new Float32Array(
            [xyz[0], xyz[1]-h/2, xyz[2],    0, -1, 0,
            pt1[0], xyz[1]-h/2, pt1[1],   0, -1, 0,
            pt2[0], xyz[1]-h/2, pt2[1],   0, -1, 0  
        ]), this.uvMult));
      } else {
        this.surfaces.push(new Cylinder3DSurface(this.position, col, 
          new Float32Array([xyz[0], xyz[1], xyz[2],     0, -1, 0,
                          pt3[0], xyz[1], pt3[1],       0, -1, 0,
                          pt4[0], xyz[1], pt4[1],       0, -1, 0  
        ]), this.uvMult));
      }
          
    }
  }

  render() {
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

class Cylinder3DSurface {
  constructor(position, color, vertices, uvMult, texNum = -2) {
    this.position = position;
    this.color = color;
    this.vertexBuffer = null;
    this.uvBuffer = null;
    this.vertices = vertices;
    this.uvMult = uvMult;
    this.textureNum = texNum;

  }

  render() {
    var rgba = this.color;  
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1i(u_textureSelector, this.textureNum);
    gl.uniform1i(u_lit, true);
    gl.uniform1f(u_UVMult, this.uvMult);

    // set up vertex buffer
    if (this.vertexBuffer == null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
          console.log("Failed to create the vertex buffer object");
          return -1;
      }
    } 
  
    var FSIZE = this.vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Normal);

    // now draw the shape
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 6);  

  }
}


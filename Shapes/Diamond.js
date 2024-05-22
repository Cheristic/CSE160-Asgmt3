class Diamond extends Shape3D {
    constructor(position, color, width, length, height, texNum, uvMult) {
      super(position, color);
      this.type='diamond';
      this.width = width/200;
      this.length = length/200;
      this.height = height/200;
      this.texNum = texNum;
      this.uvMult = uvMult;
  
      this.generateSurfaces();
    }
  
    generateSurfaces() {
      let w = this.width;
      let l = this.length;
      let h = this.height;
      let xyz = this.position;
      let col = this.color;
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    xyz[0], xyz[1]+h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,                 xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,               xyz[0]-w/3, xyz[1], xyz[2]-l/3
      ]), this.uvMult));  
     
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    xyz[0], xyz[1]+h/2, xyz[2],
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,                 xyz[0]+w/3, xyz[1], xyz[2]-l/3, 
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,                xyz[0]+w/3, xyz[1], xyz[2]+l/3
      ]), this.uvMult)); 
      
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],     xyz[0], xyz[1]-h/2, xyz[2],   
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,                 xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,                 xyz[0]-w/3, xyz[1], xyz[2]-l/3
      ]), this.uvMult));  

      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],     xyz[0], xyz[1]+h/2, xyz[2],  
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,                 xyz[0]-w/3, xyz[1], xyz[2]-l/3, 
          xyz[0]-w/3, xyz[1], xyz[2]+l/3,                  xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ]), this.uvMult));  
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],     xyz[0], xyz[1]-h/2, xyz[2], 
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,                 xyz[0]+w/3, xyz[1], xyz[2]-l/3, 
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,                 xyz[0]+w/3, xyz[1], xyz[2]+l/3  
      ]), this.uvMult));

      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],     xyz[0], xyz[1]+h/2, xyz[2],  
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,                 xyz[0]+w/3, xyz[1], xyz[2]+l/3, 
          xyz[0]-w/3, xyz[1], xyz[2]+l/3,                xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ]), this.uvMult));  

      
  
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],     xyz[0], xyz[1]-h/2, xyz[2], 
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,                 xyz[0]-w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3,                xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ]), this.uvMult));  
      this.surfaces.push(new Diamond3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],    xyz[0], xyz[1]-h/2, xyz[2],   
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,                 xyz[0]+w/3, xyz[1], xyz[2]+l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3,               xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ]), this.uvMult));   
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

  class Diamond3DSurface {
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
  
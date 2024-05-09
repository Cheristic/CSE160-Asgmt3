class Diamond extends Shape3D {
    constructor(position, color, width, length, height, texNum) {
      super(position, color);
      this.type='diamond';
      this.width = width/200;
      this.length = length/200;
      this.height = height/200;
      this.texNum = texNum;
  
      this.generateSurfaces();
    }
  
    generateSurfaces() {
      let w = this.width;
      let l = this.length;
      let h = this.height;
      let xyz = this.position;
      let col = this.color;
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]-l/3
      ])));  
      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]+w/3, xyz[1], xyz[2]+l/3
      ]))); 
      
      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]-l/3
      ])));  

      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ])));  
      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]+w/3, xyz[1], xyz[2]+l/3
      ])));

      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ])));  

      
  
      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],    
          xyz[0]-w/3, xyz[1], xyz[2]-l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ])));  
      col = [col[0]-.015, col[1]-.015, col[2]-.015, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]-h/2, xyz[2],    
          xyz[0]+w/3, xyz[1], xyz[2]+l/3,  
          xyz[0]-w/3, xyz[1], xyz[2]+l/3
      ]))); 

      
    }
  
    render(dt) {
      super.render(dt);
    }
  }
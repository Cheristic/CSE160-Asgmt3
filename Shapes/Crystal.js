class Crystal extends Shape3D {
    constructor(position, color, width, length, height, texNum) {
      super(position, color);
      this.type='crystal';
      this.width = width/200;
      this.length = length/200;
      this.height = height/200;
      this.texNum = texNum;

      this.floatSpeed = 2;
      this.floatDistance = .04;
      this.rotationSpeed = 55;
      this.time = 0;

      this.collected = false;
      this.collectedAnimTime = 0;
  
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
      this.dynamicMatrix.setTranslate(0, Math.sin(this.time * this.floatSpeed) * this.floatDistance, 0);
      this.dynamicMatrix.rotate(this.time * this.rotationSpeed, 0, 1, 0);

      if (this.collected && this.collectedAnimTime < 1.5) {
        this.dynamicMatrix.scale(1+this.collectedAnimTime*1.5, 1+this.collectedAnimTime*1.5, 1+this.collectedAnimTime*1.5)
        for (let i = 0; i < this.surfaces.length; i++) {
          this.surfaces[i].color[3] -= .02;
        }
        this.dynamicMatrix.translate(0, this.collectedAnimTime/8, 0)
        this.collectedAnimTime += dt;
      }

      this.time += dt;
      super.render(dt);
    }

    collect() {
      this.collected = true;
    }
  }
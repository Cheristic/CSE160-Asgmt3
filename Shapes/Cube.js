class Cube extends Shape3D {
  constructor(position, color, width, length, height, texNum, uvMult = 1) {
    super(position, color);
    this.type='cube';
    this.width = width/200;
    this.length = length/200;
    this.height = height/200;
    this.texNum = texNum;

    this.generateSurfaces(uvMult);
  }

  generateSurfaces(uvMult) {
    let w = this.width;
    let l = this.length;
    let h = this.height;
    let xyz = this.position;
    let col = this.color;
    this.uvs = new Float32Array([0, 1.0,
      1.0, 1.0,
      0, 0,
      1.0, 0,
      1.0, 1.0,
      0, 0,
      0, 1.0,
      1.0, 0,
      1.0, 1.0,
      0, 0,
      0, 1.0,
      1.0, 1.0,
      0, 0,
      1.0, 0]);
    for (let i = 0; i < this.uvs.length; i++) {
      this.uvs[i] *= uvMult;
    }
    
    this.surfaces.push(new Shape3DSurface(this.position, this.color, 
      new Float32Array([xyz[0]-w/2, xyz[1]+h/2, xyz[2]-l/2,    // front
        xyz[0]+w/2, xyz[1]+h/2, xyz[2]-l/2,  
        xyz[0]-w/2, xyz[1]-h/2, xyz[2]-l/2,
        xyz[0]+w/2, xyz[1]-h/2, xyz[2]-l/2,

        xyz[0]+w/2, xyz[1]-h/2, xyz[2]+l/2,
        xyz[0]+w/2, xyz[1]+h/2, xyz[2]-l/2,
        xyz[0]+w/2, xyz[1]+h/2, xyz[2]+l/2,

        xyz[0]-w/2, xyz[1]+h/2, xyz[2]-l/2,
        xyz[0]-w/2, xyz[1]+h/2, xyz[2]+l/2,

        xyz[0]-w/2, xyz[1]-h/2, xyz[2]-l/2,
        xyz[0]-w/2, xyz[1]-h/2, xyz[2]+l/2,
        xyz[0]+w/2, xyz[1]-h/2, xyz[2]+l/2,
        xyz[0]-w/2, xyz[1]+h/2, xyz[2]+l/2,
        xyz[0]+w/2, xyz[1]+h/2, xyz[2]+l/2
    ]), this.uvs,      
      this.texNum));
  }

  render(dt) {
    super.render(dt);
  }
}
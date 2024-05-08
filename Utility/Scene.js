class Scene {
    constructor() {
        this.cam = new Camera();

        this.g_globalRotationMatrix = new Matrix4();
        this.globalRotationY = 90;

        // Rendering Globals
        this.g_shapesList = [];
        this.g_hudElements = [];

        // Map variables
        this.g_mapLayout = [];
        this.g_mapFilledCoordinates = [];
        this.layoutInfo = {
            rows: 100,
            cols: 100
        };
        this.placedReady = false;

        this.g_enemies = [];
        this.g_crystals = [];
        this.g_crystalsRender = [];

        this.buildHUD();
       

        this.buildScene();
    }

    buildHUD() {
        // keep track of progress
        this.crystalsCollected = 0;
        hud.font = "bold 40px serif";
        hud.textBaseLine = "middle";
        hud.strokeStyle = "#EFEFEF";

        hud.lineWidth = 5
        hud.stroke();
        hud.fillStyle = "#ffa0dd"

        this.drawCrystalIcon = false;
        this.crystalsIcon = new Image();
        this.crystalsIcon.src = 'resources/crystal.png';
        this.crystalsIcon.onload = function() {
            g_Scene.drawCrystalIcon = true;
        }
    }

    async buildScene() {
        let sky = new Cube([0, -50, 0], [.09, .07, .12, 1.0], 50000, 50000, 50000, -2)
        this.g_shapesList.push(sky);

        // Base cube
        let c = new Cube([0, 0, 0], [0.9, 0.45, 0.25, 1.0], 5000, 5000, 1, 0, 80)
        c.setLocalMatrix([3, 0, 3], [.8, 1.0, .8], [0, 0, 0, 1], [0, 0, 0]);
        this.g_shapesList.push(c);

        let enemy1 = new Enemy(this, 60, 51);
        this.g_enemies.push(enemy1);

        let enemy2 = new Enemy(this, 34, 57);
        this.g_enemies.push(enemy2);

        let enemy3 = new Enemy(this, 43, 36);
        this.g_enemies.push(enemy3);

        let enemy4 = new Enemy(this, 64, 71);
        this.g_enemies.push(enemy4);

        let enemy5 = new Enemy(this, 34, 75);
        this.g_enemies.push(enemy5);

        let enemy6 = new Enemy(this, 74, 36);
        this.g_enemies.push(enemy6);

        let enemy7 = new Enemy(this, 72, 72);
        this.g_enemies.push(enemy7);

        let enemy8 = new Enemy(this, 42, 54);
        this.g_enemies.push(enemy8);
        
        let crystal1 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2)
        crystal1.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [.5, .35, 0]);
        this.g_crystals.push(crystal1);
        this.g_crystalsRender.push(crystal1);

        let crystal2 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2)
        crystal2.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [.5, .35, .4]);
        this.g_crystals.push(crystal2);
        this.g_crystalsRender.push(crystal2);

        // https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
        this.placeMapLayout(await this.retriveMapLayout());
    }

    retriveMapLayout() {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "map0.txt", true);
            xmlhttp.onload = function() {
                if (this.status >= 200 && this.status< 300) {
                    resolve(xmlhttp.responseText)
                } else {
                    reject({
                        status: this.status,
                        statusText: xmlhttp.statusText
                    });
                }
            };
            xmlhttp.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xmlhttp.statusText
                });
            };
            xmlhttp.send();
        });  
    }

    placeMapLayout(locations) {
        if (locations == null) return;

        for (var c = 0; c < this.layoutInfo.cols; c++) {
            let col = [];
            this.g_mapLayout.push(col);
            for (var r = 0; r < this.layoutInfo.rows; r++) {
                col.push([]);
            }
        }

        let positions = locations.split(/[\r\n]/)
        for (var i = 0; i < positions.length; i++ ) {
            if (positions[i] == '') continue;
            let pos = positions[i].split(' ');
            let x = parseFloat(pos[0]); let y = parseFloat(pos[1]); let z = parseFloat(pos[2]);
            let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 80,80,80, 1)
            box.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(x-49)/2.5, y/2.5+.001, (z-49)/2.5]);
            this.g_shapesList.push(box);
            if (y <= 0) {
                this.g_mapLayout[x][z].push(box);
                this.g_mapFilledCoordinates.push(box);
            }    
        }

        for (var t = 0; t < 50; t++) {
            let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 80,80,80, 1)
            box.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(t-49+30)/2.5, 0, (100-49-20)/2.5]);
            this.g_shapesList.push(box);
            this.g_mapLayout[t+30][80].push(box);
            this.g_mapFilledCoordinates.push(box);

            let box2 = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 80,80,80, 1)
            box2.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(t-49+30)/2.5, 0, (-49+30)/2.5]);
            this.g_shapesList.push(box2);
            this.g_mapLayout[t+30][30].push(box);
            this.g_mapFilledCoordinates.push(box2);
        }

        for (var t = 0; t < 51; t++) {
            let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 80,80,80, 1)
            box.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(100-49-20)/2.5, 0, (t-49+30)/2.5]);
            this.g_shapesList.push(box);
            this.g_mapLayout[80][t+30].push(box);
            this.g_mapFilledCoordinates.push(box);

            let box2 = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 80,80,80, 1)
            box2.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(-49+30)/2.5, 0, (t-49+30)/2.5]);
            this.g_shapesList.push(box2);
            this.g_mapLayout[30][t+30].push(box);
            this.g_mapFilledCoordinates.push(box2);
        }
        this.placedReady = true;
    }

    navigationEdges(x, z) {
        let neighboring_spaces = []

        //add_if_valid_cell(x-1, z-1, this.layoutInfo, this);
        add_if_valid_cell(x, z-1, this.layoutInfo, this);
        //add_if_valid_cell(x+1, z-1, this.layoutInfo, this);
        add_if_valid_cell(x-1, z, this.layoutInfo, this);
        add_if_valid_cell(x+1, z, this.layoutInfo, this);
        //add_if_valid_cell(x-1, z+1, this.layoutInfo, this);
        add_if_valid_cell(x, z+1, this.layoutInfo, this);
        //add_if_valid_cell(x+1, z+1, this.layoutInfo, this);

        
        function add_if_valid_cell(_x, _z, layout, scene) {
            if (!scene.placedReady) return;
            if (_x >= 0 && _x < layout.cols && _z >= 0 && _z < layout.rows) {
                if (scene.g_mapLayout[_z][_x].length <= 0) {neighboring_spaces.push([_z, _x]);}
            }
        }

        return neighboring_spaces;
    }

    checkForMapCollision(d) {
        let lvec= new Vector3(g_Scene.cam.g_eyePos.elements);
        let eye = g_Scene.cam.g_eyePos.elements;
        lvec.add(d);
        let l = lvec.elements;
        for (let i = 0; i < this.g_mapFilledCoordinates.length; i++) {
            var size = this.g_mapFilledCoordinates[i].width * .7;
            var pos = [this.g_mapFilledCoordinates[i].localMatrix.elements[14], -this.g_mapFilledCoordinates[i].localMatrix.elements[12]]
            if (l[0] >= (pos[0] - size) && l[0] <= (pos[0] + size) &&
                l[2] >= (pos[1] - size) && l[2] <= (pos[1] + size)) {
                    // find point of intersection
                    let Dx = g_Scene.cam.g_eyePos.elements[0] - pos[0];
                    let Dz = g_Scene.cam.g_eyePos.elements[2] - pos[1];
                    let poi = [Math.max(0, Math.min(size, Math.abs(Dx))) * Math.sign(Dx) + pos[0], Math.max(0, Math.min(size, Math.abs(Dz))) * Math.sign(Dz) +pos[1]]
                    if (eye[0] < poi[0] && l[0] > poi[0]) {d.elements[0] = eye[0] - poi[0];}
                    else if (eye[0] > poi[0] && l[0] < poi[0]) {d.elements[0] = eye[0] - poi[0];}
                    if (eye[2] < poi[1] && l[2] > poi[1]) {d.elements[2] = eye[2] - poi[1];}
                    else if (eye[2] > poi[1] && l[2] < poi[1]) {d.elements[2] = eye[2] - poi[1];}
                    return d;
                }
            
        }
        return d;

    }

    renderScene(dt) {
        
        // for debug
        this.g_globalRotationMatrix.setIdentity();
        this.g_globalRotationMatrix.rotate(this.globalRotationY, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, this.g_globalRotationMatrix.elements);
    

        for(var i = 0; i < this.g_enemies.length; i++) {  
            this.g_enemies[i].update(dt);
          }

        for(var i = 0; i < this.g_shapesList.length; i++) {  
          this.g_shapesList[i].render(dt);
        }

        for(var i = 0; i < this.g_crystalsRender.length; i++) {  
            this.g_crystalsRender[i].render(dt);
        }

        this.cam.update(dt);
     
        hud.strokeText("x " + this.crystalsCollected.toString(), 100, 65);
        hud.fillText("x " + this.crystalsCollected.toString(), 100, 65);

        if (this.drawCrystalIcon) {
            hud.drawImage(this.crystalsIcon, 0, 5);
        }
    }
}
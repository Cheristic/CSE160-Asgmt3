class Scene {
    constructor() {
        this.cam = new Camera();

        this.g_globalRotationMatrix = new Matrix4();
        this.globalRotationY = 90;

        // Rendering Globals
        this.g_shapesList = [];

        // Map variables
        this.g_mapLayout = [];
        this.g_mapFilledCoordinates = [];
        this.layoutInfo = {
            rows: 100,
            cols: 100
        };
        this.placedReady = false;

        this.g_enemies = [];

        this.buildScene();
    }

    async buildScene() {
        let sky = new Cube([0, -50, 0], [.09, .07, .12, 1.0], 50000, 50000, 50000, -2)
        this.g_shapesList.push(sky);

        // Base cube
        let c = new Cube([0, 0, 0], [0.3, 0.45, 0.25, 1.0], 10000, 10000, 1, 0, 80)
        this.g_shapesList.push(c);

        let enemy = new Enemy(this, 53, 52);
        this.g_enemies.push(enemy);

        // https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
        this.placeMapLayout(await this.retriveMapLayout());
    }

    retriveMapLayout() {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "map0.txt", true);
            xmlhttp.onload = function() {
                if (this.status >= 200 && this.status< 300) {
                    resolve(xmlhttp.responseText);
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
            box.setLocalMatrix([0, .2, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(x-49)/2.5, y, (z-49)/2.5]);
            this.g_shapesList.push(box);
            this.g_mapLayout[x][z].push(box);
            this.g_mapFilledCoordinates.push(box);
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
    
        this.cam.update(dt);

        for(var i = 0; i < this.g_enemies.length; i++) {  
            this.g_enemies[i].update(dt);
          }

        for(var i = 0; i < this.g_shapesList.length; i++) {  
          this.g_shapesList[i].render();
        }
    }
}
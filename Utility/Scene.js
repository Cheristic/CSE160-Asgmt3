class Scene {
    constructor() {

        this.g_globalRotationMatrix = new Matrix4();
        this.globalRotationY = 90;

        // Rendering Globals
        this.g_shapesList = [];
        this.g_hudElements = [];
        this.lights = [];

        this.cam = new Camera(this);

        // Map variables
        this.g_mapLayout = [];
        this.g_crates = [];
        this.g_mapFilledCoordinates = [];
        this.layoutInfo = {
            rows: 100,
            cols: 100
        };
        this.placedReady = false;

        this.g_enemies = [];
        this.g_crystals = [];
        this.g_crystalsRender = [];

        document.addEventListener('click', () => {g_Scene.onHitCrowbar();})
        this.crowbarAnimTime = 2;

        this.buildHUD();
       

        this.buildScene();
    }

    buildHUD() {
        // keep track of progress
        this.crystalsCollected = 0;
        hud.font = "bold 40px serif";
        hud.textAlign = "center";
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

        this.crowbar = new Image();
        this.crowbar.src = 'resources/crowbar.png';
        this.drawCrowbar = false;
        this.crowbar.onload = () => {
            g_Scene.drawCrowbar = true;
        }

    }

    async buildScene() {

        let sky = new Cube([0, 0, 0], [.09, .07, .12, 1.0], -2, 1, false)
        sky.setLocalMatrix([0,0, 0], [100, 100, 100], [0, 0, 0, 1], [.5, .35, 0]);
        this.g_shapesList.push(sky);

        g_PointLight.obj = new Cube([0, 0, 0], [2, 2, 1, 1.0], -2, 1, false);
        g_PointLight.obj.setLocalMatrix([0, 0, 0], [2, .2, 2], [0, 0, 0, 1], [6, 6, .5]);
        g_PointLight.position = [6, 6, .5];
        this.lights.push(g_PointLight);
        gl.uniform3f(u_SpotLightPosition, .1, 5, 0);

        // Base cube
        this.ground = new Cube([0, 0, 0], [0.9, 0.45, 0.25, 1.0], 0, 8);
        this.ground.setLocalMatrix([0, 0, 0], [22, -.1, 22], [0, 0, 0, 1], [3, -.05, 3]);
        this.g_shapesList.push(this.ground);

        let enemy1 = new Enemy(this, 60, 51, "pawn");
        this.g_enemies.push(enemy1);

        let enemy2 = new Enemy(this, 34, 57, "pawn");
        this.g_enemies.push(enemy2);

        let enemy3 = new Enemy(this, 40, 33, "pawn");
        this.g_enemies.push(enemy3);

        let enemy4 = new Enemy(this, 64, 71, "pawn");
        this.g_enemies.push(enemy4);

        let enemy5 = new Enemy(this, 34, 75, "pawn");
        this.g_enemies.push(enemy5);

        let enemy6 = new Enemy(this, 74, 36, "pawn");
        this.g_enemies.push(enemy6);

        let enemy7 = new Enemy(this, 72, 72, "pawn");
        this.g_enemies.push(enemy7);

        let enemy8 = new Enemy(this, 42, 54, "pawn");
        this.g_enemies.push(enemy8);

        let enemy9 = new Enemy(this, 60, 78, "pawn");
        this.g_enemies.push(enemy9);
        
        let crystal1 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal1.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [.5, .35, 0]);
        this.g_crystals.push(crystal1);
        this.g_crystalsRender.push(crystal1);

        let crystal2 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal2.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [10, .35, -5.5]);
        this.g_crystals.push(crystal2);
        this.g_crystalsRender.push(crystal2);

        let crystal3 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal3.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [-7, .35, 2.5]);
        this.g_crystals.push(crystal3);
        this.g_crystalsRender.push(crystal3);

        let crystal4 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal4.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [-3, .35, -5]);
        this.g_crystals.push(crystal4);
        this.g_crystalsRender.push(crystal4);

        let crystal5 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal5.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [4.5, .35, 7.5]);
        this.g_crystals.push(crystal5);
        this.g_crystalsRender.push(crystal5);

        let crystal6 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal6.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [7.5, .35, 2]);
        this.g_crystals.push(crystal6);
        this.g_crystalsRender.push(crystal6);

        let crystal7 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal7.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [11, .35, 8]);
        this.g_crystals.push(crystal7);
        this.g_crystalsRender.push(crystal7);

        let crystal8 = new Crystal([0, 0, 0], [0.85, 0.45, 0.75, 1.0], 50, 50, 50, -2, this)
        crystal8.setLocalMatrix([0, -.125, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [-5.6, .35, 8.4]);
        this.g_crystals.push(crystal8);
        this.g_crystalsRender.push(crystal8);

        document.addEventListener("death", () => {
            for (let i = 0; i < g_Scene.g_enemies.length; i++) {
                g_Scene.g_enemies[i].restart();
            }
            g_Scene.placedReady = true;
        });

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
            let col2 = [];
            this.g_crates.push(col2);
            for (var r = 0; r < this.layoutInfo.rows; r++) {
                col.push([]);
                col2.push([]);
            }
        }

        let positions = locations.split(/[\r\n]/)
        for (var i = 0; i < positions.length; i++ ) {
            if (positions[i] == '') continue;
            let pos = positions[i].split(' ');
            let x = parseFloat(pos[0]); let y = parseFloat(pos[1]); let z = parseFloat(pos[2]);
            if (x == 9) continue;

        
            if (y >= 0) { // hedge on ground level
                let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
                let scale = .39;
                let scaleY = .39;
                let pivotY = 0;
                let rot = Math.random()*4-2;
                if (y >= 1) scaleY == .39;
                else if ((i % 6 == 0 || i % 13 == 0) || (z <= 31 && z < 80 && x >= 31 && x < 43)) {
                    // scale
                    scaleY *= 2;
                    pivotY = .2;
                }
                box.setLocalMatrix([0, 0, 0], [scale, scaleY, -scale], [rot, 0, 1, 0], [(x-49)/2.5, y/2.5+.201+pivotY, (z-49)/2.5]);  

                this.g_shapesList.push(box);
                if (y <= 0) {
                    this.g_mapLayout[x][z].push(box);
                    this.g_mapFilledCoordinates.push(box);
                }
            } else if (y == -1) { // place breakable
                let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 2)
                box.setLocalMatrix([0, 0, 0], [.39,.39,-.39], [0, 0, 1, 0], [(x-49)/2.5, 0/2.5+.201, (z-49)/2.5]);
                this.g_shapesList.push(box);
                this.g_crates[x][z].push(box);
                this.g_mapLayout[x][z].push(box);
                this.g_mapFilledCoordinates.push(box);
            }
        }

        // build ceiling area
        for (let z = 31; z < 80; z++) {
            for (let x = 31; x < 43; x++) {
                let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
                box.setLocalMatrix([0, .2, 0], [.4, .4, .4], [0, 0, 0, 1], [(x-49)/2.5, 2/2.5+.201, (z-49)/2.5]);
                this.g_shapesList.push(box);
            }
        }
        

        for (var t = 0; t < 50; t++) {
            let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
            box.setLocalMatrix([0, 0, 0], [.39, .68, .39], [0, 0, 0, 1], [(t-49+30)/2.5, .401, (100-49-20)/2.5]);
            this.g_shapesList.push(box);
            this.g_mapLayout[t+30][80].push(box);
            this.g_mapFilledCoordinates.push(box);

            let box2 = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
            box2.setLocalMatrix([0, 0, 0], [.39, .68, .39], [0, 0, 0, 1], [(t-49+30)/2.5, .401, (-49+30)/2.5]);
            this.g_shapesList.push(box2);
            this.g_mapLayout[t+30][30].push(box2);
            this.g_mapFilledCoordinates.push(box2);
        }

        for (var t = 0; t < 51; t++) {
            let box = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
            box.setLocalMatrix([0, 0, 0], [.39, .68, .39], [0, 0, 0, 1], [(100-49-20)/2.5, .401, (t-49+30)/2.5]);
            this.g_shapesList.push(box);
            this.g_mapLayout[80][t+30].push(box);
            this.g_mapFilledCoordinates.push(box);

            let box2 = new Cube([0, 0, 0], [0.65, 0.40, 0.02, 1.0], 1)
            box2.setLocalMatrix([0, 0, 0], [.39, .68, .39], [0, 0, 0, 1], [(-49+30)/2.5, .401, (t-49+30)/2.5]);
            this.g_shapesList.push(box2);
            this.g_mapLayout[30][t+30].push(box2);
            this.g_mapFilledCoordinates.push(box2);
        }
        this.placedReady = true;
    }

    navigationEdges(x, z) {
        let neighboring_spaces = []

        //add_if_valid_cell(x-1, z-1, this.layoutInfo, this);
        add_if_valid_cell(x, z-1, this.layoutInfo, this, this.g_enemies);
        //add_if_valid_cell(x+1, z-1, this.layoutInfo, this);
        add_if_valid_cell(x-1, z, this.layoutInfo, this, this.g_enemies);
        add_if_valid_cell(x+1, z, this.layoutInfo, this, this.g_enemies);
        //add_if_valid_cell(x-1, z+1, this.layoutInfo, this);
        add_if_valid_cell(x, z+1, this.layoutInfo, this, this.g_enemies);
        //add_if_valid_cell(x+1, z+1, this.layoutInfo, this);

        
        function add_if_valid_cell(_x, _z, layout, scene, enemies) {
            if (!g_Scene.placedReady) return;

            if (_x >= 0 && _x < layout.cols && _z >= 0 && _z < layout.rows) {
                if (scene.g_mapLayout[_z][_x].length <= 0) {
                    for (let i = 0; i < enemies.length; i++) {
                        if (enemies[i].moveToPosition[0] == _z && enemies[i].moveToPosition[1] == _x) {
                            return;
                        }
                    }
                    neighboring_spaces.push([_z, _x]);
                }
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
        gl.uniform1i(u_LightsOn, g_lightsOn);
        gl.uniform1i(u_ShowNormals, g_toggleNormals);


        // for debug
        this.g_globalRotationMatrix.setIdentity();
        this.g_globalRotationMatrix.rotate(this.globalRotationY, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, this.g_globalRotationMatrix.elements);

        // set point light
        let l = this.lights[0];
        l.obj.dynamicMatrix.setIdentity();
        l.obj.dynamicMatrix.translate(l.mov[0], l.mov[1], l.mov[2]+Math.sin(lastTimeStamp*.5)*2)
        l.obj.color[0] = g_lightColor[0]; l.obj.color[1] = g_lightColor[1]; l.obj.color[2] = g_lightColor[2];
        gl.uniform3f(u_PointLightPosition, l.position[0]+l.mov[0], l.position[1]+l.mov[1], l.position[2]+l.mov[2])
        gl.uniform3f(u_LightColor, l.obj.color[0], l.obj.color[1], l.obj.color[2])
        l.obj.render(dt);

        for(var i = 0; i < this.g_enemies.length; i++) {  
            this.g_enemies[i].update(dt);
        }
        for(var i = 0; i < this.g_crystalsRender.length; i++) {  
            this.g_crystalsRender[i].render(dt);
        }

        for(var i = 0; i < this.g_shapesList.length; i++) {  
          this.g_shapesList[i].render(dt);
        }
        

        this.cam.update(dt);
     
        hud.font = "bold 40px serif";
        hud.strokeText("x " + this.crystalsCollected.toString(), 130, 65);
        hud.fillText("x " + this.crystalsCollected.toString(), 130, 65);
        
        if (this.drawCrowbar) {
            if (this.crowbarAnimTime >= Math.PI/2) {this.crowbarAnimTime = Math.PI/2;}
            else {this.crowbarAnimTime += dt*4;}
            let rot = Math.sin(this.crowbarAnimTime * 2) * -20;

            hud.save();
            hud.translate(canvas.width - 150, canvas.height - 100);
            hud.rotate(rot* Math.PI/180);
            hud.drawImage(this.crowbar, -50, -120)
            hud.restore();
        }

        if (this.drawCrystalIcon) {
            hud.drawImage(this.crystalsIcon, 0, 5);
            if (this.crystalsCollected >= 8) {
                hud.strokeText(`You Beat`, 320, canvas.height/2);
                hud.fillText("You Beat", 320, canvas.height/2);
                hud.strokeText(`Chess 2!`, 320, canvas.height/2 + 50);
                hud.fillText("Chess 2!", 320, canvas.height/2 + 50);
                hud.font = "bold 15px serif";
                hud.strokeText(`you can accomplish anything you put your mind to!`, 320, canvas.height/2 + 80);
                hud.fillText("you can accomplish anything you put your mind to!", 320, canvas.height/2 + 80);
            }
        }

        gl.uniform3f(u_CameraPos, -this.cam.g_eyePos.elements[2], this.cam.g_eyePos.elements[1], this.cam.g_eyePos.elements[0]);     
    
    }

    onHitCrowbar() {
        this.crowbarAnimTime = 0;

        let eye = g_Scene.cam.g_eyePos;
        let look = g_Scene.cam.g_lookAt;
        let coord = new Vector3(look.elements);
        coord.sub(eye);
        coord.normalize();
        coord.elements[0] = Math.round(coord.elements[0]);
        coord.elements[1] = 0;
        coord.elements[2] = -Math.round(coord.elements[2]);
        let pos = [this.layoutInfo.rows-(Math.round(eye.elements[2]*2.5)+51)+coord.elements[2], (Math.round(eye.elements[0]*2.5)+49)+coord.elements[0]]

        if (this.g_crates[pos[0]][pos[1]].length > 0) {
            let crate = this.g_crates[pos[0]][pos[1]][0];
            this.g_crates[pos[0]][pos[1]] = [];
            this.g_mapLayout[pos[0]][pos[1]] = [];
            let index = this.g_mapFilledCoordinates.indexOf(crate);
            this.g_mapFilledCoordinates.splice(index, 1);
            index = this.g_shapesList.indexOf(crate);
            this.g_shapesList.splice(index, 1);
        }
    }
}
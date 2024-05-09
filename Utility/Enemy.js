class Enemy {
    constructor(scene, col, row, type) {
        this.scene = scene;
        this.cam = scene.cam.g_eyePos;
        this.path = [[]];
        this.originalPosition = [col, row];
        this.previousPosition = [col, row];
        this.moveToPosition = [col, row];

        this.animatedParts = []

        this.movementAmountTotal = 1;
        this.movementAmountv = 1;
        this.movementAmount = new Vector3();
        this.movementVector = new Vector3();
        
        this.chasePlayer = true;
        this.waitForPlayerToBeInBounds = false;
        this.boundsTimer = 0;
        this.bounds = 15;
        if (type == "pawn") {
            this.createPawn();
        }    
        this.rotationDirection = 0;

        document.addEventListener("death", () => this.restart());
    }

    // ASSEMBLE PIECES
    createPawn() {
        this.movementSpeed = .08;
        
        this.base = new Cylinder([0, 0, 0], [0.902, 0.831, 0.447, 1.0], 25, 25, 15, 15, true)
        this.base.setLocalMatrix([0, 0, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(this.previousPosition[0]-49)/2.5, 0, (this.previousPosition[1]-49)/2.5]);
        this.scene.g_shapesList.push(this.base);
        this.base.keyframes = [
            [[0, 0, 0], [0, 1, 0, 0]],
            [[0, .015, 0], [8, 1, 0, 0]],
            [[0, .0475, 0], [2, 1, 0, 0]],
            [[0, .05, 0], [-6, 1, 0, 0]],
            [[0, .045, 0], [-8, 1, 0, 0]],
            [[0, 0, 0], [0, 1, 0, 0]]
        ]
        this.animatedParts.push(this.base);

        this.base2 = new Cylinder([0, 0, 0], [0.902, 0.831, 0.447, 1.0], 25, 7, 35, 15, true)
        this.base2.setLocalMatrix([0, 0, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [0, .0375, 0]);
        this.scene.g_shapesList.push(this.base2);
        this.base.children.push(this.base2)



        this.base3 = new Cylinder([0, 0, 0], [0.902, 0.831, 0.447, 1.0], 20, 7, 20, 15, true)
        this.base3.setLocalMatrix([0, 0, 0], [1.0, 1.0, 1.0], [0, 1, 0, 0], [0, .0875, 0]);
        this.scene.g_shapesList.push(this.base3);
        this.base2.children.push(this.base3)
        this.base3.keyframes = [
            [[0, 0, 0], [0, 1, 0, 0]],
            [[0, 0, 0], [-1, 1, 0, 0]],
            [[0, 0, 0], [-2, 1, 0, 0]],
            [[0, 0, 0], [-3, 1, 0, 0]],
            [[0, 0, 0], [-4, 1, 0, 0]],
            [[0, 0, 0], [-5, 1, 0, 0]],
            [[0, 0, 0], [-8, 1, 0, 0]],
            [[0, 0, 0], [-10, 1, 0, 0]],
            [[0, 0, 0], [-12, 1, 0, 0]],
            [[0, 0, 0], [-7, 1, 0, 0]],
            [[0, 0, 0], [-2, 1, 0, 0]]
        ]
        this.animatedParts.push(this.base3);
        
        this.base4 = new Cylinder([0, 0, 0], [0.902, 0.831, 0.447, 1.0], 20, 20, 5, 15, true)
        this.base4.setLocalMatrix([0, 0, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [0, -.012, 0]);
        this.scene.g_shapesList.push(this.base4);
        this.base3.children.push(this.base4)

        this.head = new Sphere([0, 0, 0], [0.902, 0.831, 0.447, 1.0], .1, 12, -2);
        this.head.setLocalMatrix([0, 0, 0], [.09, .09, .09], [180, 0, 1, 0], [0, .13, 0]);
        this.scene.g_shapesList.push(this.head);
        this.base3.children.push(this.head)
    }
    

    shortestPath() {
        let frontier = new Queue();
        frontier.enqueue(this.moveToPosition);
        let came_from = {};
        came_from[this.moveToPosition] = "";
        let discovered = new Map();
        discovered.set(this.moveToPosition[0], [this.moveToPosition[1]]);

        let current = "";
        let camPos = this.getCurrentCamPosition();
        while (frontier.length > 0) {
            current = frontier.dequeue();
            if (current[0] == camPos[0] && current[1] == camPos[1]) {
                break;
            }

            let neighbors = this.scene.navigationEdges(current[1], current[0]);

            for (let i = 0; i < neighbors.length; i++) {
                let n = neighbors[i];

                let v = discovered.get(n[0]);
                if (v != undefined) {
                    if (v.includes(n[1])) {
                        continue;
                    }
                }

                // not discovered
                if (n[0] > this.moveToPosition[0] - this.bounds && n[0] <= this.moveToPosition[0] + this.bounds &&
                    n[1] > this.moveToPosition[1] - this.bounds && n[1] <= this.moveToPosition[1] + this.bounds
                ) {
                    let v = discovered.get(n[0]);
                    if (v != undefined) {
                        v.push(n[1]);
                    } else {
                        discovered.set(n[0], [n[1]]);
                    }
                    frontier.enqueue(n);
                    came_from[n] = current;
                }
            }            
        }

        let path_list = []
        if (frontier.length <= 0 && (current[0] != camPos[0] || current[1] != camPos[1])) {return null;}
        
        while (current != "") {
            path_list.unshift(current);
            current = came_from[current];
        }

        return path_list;
    
    }

    getCurrentCamPosition() {
        return [this.scene.layoutInfo.rows-(Math.round(this.cam.elements[2]*2.5)+51), (Math.round(this.cam.elements[0]*2.5)+49)]
    }

    update(dt) {
        if (this.waitForPlayerToBeInBounds) {
            this.boundsTimer += dt;
            if (this.boundsTimer >= 1) {
                this.waitForPlayerToBeInBounds = false;
            } else {
                return;
            }
        }

        if (Math.abs(this.movementAmountv) >= this.movementAmountTotal && this.scene.placedReady) {
            this.path = this.shortestPath();
            if (this.path != null) {
                if (this.path.length > 1) {
                    this.chasePlayer = true;
                    this.previousPosition = this.moveToPosition.slice();
                    this.moveToPosition = this.path[1].slice();

                    this.movementVector.set([this.moveToPosition[0], 0, this.moveToPosition[1]]);
                    this.movementVector.subv([this.previousPosition[0], 0, this.previousPosition[1]]);

                    this.movementVector.normalize()
                    this.rotationDirection = Math.acos(this.movementVector.elements[2]) * 180/Math.PI;
                    let s = Math.sign(Math.asin(this.movementVector.elements[0]) * 180/Math.PI);
                    if (s != 0) this.rotationDirection *= s;
                    this.base.frameMatrix2.setRotate(this.rotationDirection, 0, 1, 0);

                    this.movementVector.mul(this.movementSpeed * dt / 2.5);
                    this.movementAmount.clear();
                    this.movementAmountv += -1 * Math.sign(this.movementAmountv);
                }  else {
                    // reached player
                    this.chasePlayer = false;
                    this.waitForPlayerToBeInBounds = true;
                    this.boundsTimer = 0;
                    this.base.dynamicMatrix.setIdentity();
                    this.base.frameMatrix.setIdentity();
                    this.base.frameMatrix2.setIdentity();
                }
            } else {
                // no path available aka out of range
                this.chasePlayer = false;
                this.waitForPlayerToBeInBounds = true;
                this.boundsTimer = 0;
                this.base.dynamicMatrix.setIdentity();
                this.base.frameMatrix.setIdentity();
                this.base.frameMatrix2.setIdentity();
            }    
        }

        if (this.chasePlayer) {
            this.movementAmount.add(this.movementVector);
            this.movementAmountv += (this.movementAmount.elements[0] + this.movementAmount.elements[2]) * 2.5;
            this.base.dynamicMatrix.setIdentity();
            this.base.frameMatrix.translate(this.movementAmount.elements[0], 0, this.movementAmount.elements[2]);
            let animProgress = Math.abs(this.movementAmountv) >= this.movementAmountTotal ? this.movementAmountTotal : Math.abs(this.movementAmountv);

            if (animProgress == this.movementAmountTotal) {
                for (let i = 0; i < this.animatedParts.length; i++) {
                    let obj = this.animatedParts[i];
                    obj.animMatrix.setTranslate(obj.keyframes[obj.keyframes.length-1][0][0],
                        obj.keyframes[obj.keyframes.length-1][0][1],
                        obj.keyframes[obj.keyframes.length-1][0][2],
                    );

                }
            } else {
                for (let i = 0; i < this.animatedParts.length; i++) {
                    let obj = this.animatedParts[i];
                    let pFrame = Math.floor((obj.keyframes.length-1) * animProgress) // previous frame
                    let nFrame = pFrame+1; // next frame
                    if (pFrame < 0 || nFrame >= obj.keyframes.length) continue;
                    let lerpFrameAmount = (animProgress - pFrame/(obj.keyframes.length-1))/(nFrame/(obj.keyframes.length-1) - pFrame/(obj.keyframes.length-1));
                    obj.dynamicMatrix.setIdentity();
                    obj.animMatrix.setIdentity();
                    obj.animMatrix.rotate(obj.keyframes[pFrame][1][0]+(obj.keyframes[nFrame][1][0]-obj.keyframes[pFrame][1][0])*lerpFrameAmount,
                        obj.keyframes[pFrame][1][1]+(obj.keyframes[nFrame][1][1]-obj.keyframes[pFrame][1][1])*lerpFrameAmount,
                        obj.keyframes[pFrame][1][2]+(obj.keyframes[nFrame][1][2]-obj.keyframes[pFrame][1][2])*lerpFrameAmount,
                        obj.keyframes[pFrame][1][3]+(obj.keyframes[nFrame][1][3]-obj.keyframes[pFrame][1][3])*lerpFrameAmount);
                    obj.animMatrix.translate(obj.keyframes[pFrame][0][0]+(obj.keyframes[nFrame][0][0]-obj.keyframes[pFrame][0][0])*lerpFrameAmount,
                        obj.keyframes[pFrame][0][1]+(obj.keyframes[nFrame][0][1]-obj.keyframes[pFrame][0][1])*lerpFrameAmount,
                        obj.keyframes[pFrame][0][2]+(obj.keyframes[nFrame][0][2]-obj.keyframes[pFrame][0][2])*lerpFrameAmount);
                    
                }
            }
            

        }
    }

    restart() {
        this.movementAmountv = 1;
        this.previousPosition = [this.originalPosition[0], this.originalPosition[1]];
        this.moveToPosition = [this.originalPosition[0], this.originalPosition[1]];
        this.base.dynamicMatrix.setIdentity();
        this.base.frameMatrix.setIdentity();
        this.movementAmount.clear();
        this.movementVector = new Vector3();
        this.path = [[]];
        this.chasePlayer = true;
        this.waitForPlayerToBeInBounds = false;
    }
        
}
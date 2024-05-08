class Enemy {
    constructor(scene, col, row) {
        this.scene = scene;
        this.cam = scene.cam.g_eyePos.elements;
        this.path = [[]];
        this.previousPosition = [col, row];
        this.moveToPosition = [col, row];

        this.movementAmountTotal = 1;
        this.movementAmountv = 1;
        this.movementAmount = new Vector3();
        this.movementVector = new Vector3();
        this.movementSpeed = .06;
        this.chasePlayer = true;
        this.waitForPlayerToBeInBounds = false;
        this.boundsTimer = 0;
        this.bounds = 15;

        this.body = new Cube([0, 0, 0], [0.3, 0.45, 0.25, 1.0], 50, 50, 100, 2)
        this.body.setLocalMatrix([0, .25, 0], [1.0, 1.0, 1.0], [0, 0, 0, 1], [(col-49)/2.5, 0, (row-49)/2.5]);
        scene.g_shapesList.push(this.body);

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
        return [this.scene.layoutInfo.rows-(Math.round(this.cam[2]*2.5)+51), (Math.round(this.cam[0]*2.5)+49)]
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

                    this.movementVector.mul(this.movementSpeed * dt / 2.5);
                    this.movementAmount.clear();
                    this.movementAmountv += -1 * Math.sign(this.movementAmountv);
                }  else {
                    // reached player
                    //console.log("reached player");
                    this.chasePlayer = false;
                    this.waitForPlayerToBeInBounds = true;
                    this.boundsTimer = 0;
                    this.body.frameMatrix.setIdentity();
                }
            } else {
                // no path available aka out of range
                this.chasePlayer = false;
                this.waitForPlayerToBeInBounds = true;
                this.boundsTimer = 0;
                this.body.frameMatrix.setIdentity();
            }    
        }

        if (this.chasePlayer) {
            this.movementAmount.add(this.movementVector);
            this.movementAmountv += (this.movementAmount.elements[0] + this.movementAmount.elements[2]) * 2.5;
            this.body.frameMatrix.setTranslate(this.movementAmount.elements[0], 0, this.movementAmount.elements[2]);
            //console.log(this.movementVector.elements);
        }
    }
        
}
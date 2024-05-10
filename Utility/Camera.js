var keysHeldState = {};
class Camera {
    constructor(scene) {

        this.movementSpeed = 0.02;
        this.rotationSpeed = 0.008;
        this.rotationSpeedKey = 0.06;
        this.gravity = -5;
        this.jumpForce = 1.5;
        this.isJumping = false;
        this.velocityY = 0;
        this.groundedY = .3;

        // Camera Globals
        this.g_eyePos = new Vector3([0, this.groundedY, -1]);
        this.g_lookAt = new Vector3([0, this.groundedY, 0]);
        this.g_lookAtOrient = new Vector3(this.g_lookAt.elements);
        this.g_upVector = new Vector3([0, 1, 0]);

        this.g_viewMatrix = new Matrix4();
        this.g_projectionMatrix = new Matrix4();

        document.addEventListener("keydown", function(ev) {keysHeldState[ev.keyCode || ev.which] = true;}, true);
        document.addEventListener("keyup", function(ev) {keysHeldState[ev.keyCode || ev.which] = false;}, true);

        document.addEventListener("mousemove", this.mouseInput, true);
        this.mousePosDelta = [0, 0];

        this.restartEvent = new Event("death");
        document.addEventListener("death", () => this.restart());
        this.isRestarting = false;
    }

    checkForCollision(d) {
        d = g_Scene.checkForMapCollision(d)
        this.g_eyePos.add(d);
        this.g_lookAt.add(d);
        this.g_lookAtOrient.add(d);
    }
    keyboardInput() {
        if (keysHeldState[65] || keysHeldState[68] || keysHeldState[83] || keysHeldState[87]) { // WASD
            let de = new Vector3(g_Scene.cam.g_lookAtOrient.elements);
            de.sub(g_Scene.cam.g_eyePos)

            let final_d = new Vector3();

            if (keysHeldState[87]) {
                let d = new Vector3(de.elements);
                d.normalize();
                d.mul(g_Scene.cam.movementSpeed);
                final_d.add(d);
            } if (keysHeldState[83]) {
                let d = new Vector3(de.elements);
                d.normalize();
                d.mul(-g_Scene.cam.movementSpeed);
                final_d.add(d);
            } if (keysHeldState[68]) {
                let d = new Vector3(de.elements);
                d.cross(g_Scene.cam.g_upVector);
                d.normalize();
                d.mul(-g_Scene.cam.movementSpeed);
                final_d.add(d);
            } if (keysHeldState[65]) {
                let d = new Vector3(de.elements);
                d.cross(g_Scene.cam.g_upVector);
                d.normalize();
                d.mul(g_Scene.cam.movementSpeed);
                final_d.add(d);
                
            } 

            final_d.normalize();
            final_d.mul(g_Scene.cam.movementSpeed);
            g_Scene.cam.checkForCollision(final_d);

            

        } if (keysHeldState[81] || keysHeldState[69]) { // rotate QE
            let d = new Vector3(g_Scene.cam.g_lookAt.elements);
            d.sub(g_Scene.cam.g_eyePos)
            let de = d.elements;
            let hor_radius = Math.sqrt(Math.pow(de[0], 2) + Math.pow(de[2], 2))
            let hor_theta = Math.atan2(de[2], de[0]);
            let ver_radius = Math.sqrt(Math.pow(de[0], 2) + Math.pow(de[1], 2))
            let ver_theta = Math.atan2(de[1], de[0]);

            if (keysHeldState[81]) hor_theta -= g_Scene.cam.rotationSpeedKey;
            else hor_theta += g_Scene.cam.rotationSpeedKey;
            

            de[0] = hor_radius*Math.cos(hor_theta) + g_Scene.cam.g_eyePos.elements[0];
            de[1] = ver_radius*Math.sin(ver_theta) + g_Scene.cam.g_eyePos.elements[1];
            de[2] = hor_radius*Math.sin(hor_theta) + g_Scene.cam.g_eyePos.elements[2];

            let dv = new Vector3();
            dv.elements[0] = de[0];
            dv.elements[1] = g_Scene.cam.g_eyePos.elements[1];
            dv.elements[2] = de[2];

            g_Scene.cam.g_lookAt = d;
            g_Scene.cam.g_lookAtOrient = dv;
        } 
        if (keysHeldState[82]) {
            g_Scene.cam.g_lookAt = new Vector3(g_Scene.cam.g_lookAtOrient.elements);
        }

        if (keysHeldState[16]) this.movementSpeed = .032;
        else this.movementSpeed = .017;

        if (keysHeldState[32]) { // Jump = Space 
            if (!g_Scene.cam.isJumping) {
                g_Scene.cam.isJumping = true;
                g_Scene.cam.velocityY = g_Scene.cam.jumpForce;
            }
        }
    }

    mouseInput(ev) {
        let d = new Vector3(g_Scene.cam.g_lookAt.elements);
        d.sub(g_Scene.cam.g_eyePos)
        let de = d.elements;
        let hor_radius = Math.sqrt(Math.pow(de[0], 2) + Math.pow(de[2], 2))
        let ver_radius = Math.sqrt(Math.pow(hor_radius, 2) + Math.pow(de[1], 2))
        let hor_theta = Math.atan2(de[2], de[0]);
        let ver_theta = Math.atan2(de[1], hor_radius);

        hor_theta += (ev.pageX - g_Scene.cam.mousePosDelta[0]) * g_Scene.cam.rotationSpeed;
        ver_theta -= (ev.pageY - g_Scene.cam.mousePosDelta[1]) * g_Scene.cam.rotationSpeed;
        g_Scene.cam.mousePosDelta[0] = ev.pageX;
        g_Scene.cam.mousePosDelta[1] = ev.pageY;

        de[0] = hor_radius*Math.cos(hor_theta) + g_Scene.cam.g_eyePos.elements[0];
        de[1] = ver_radius*Math.sin(ver_theta) + g_Scene.cam.g_eyePos.elements[1];
        de[2] = hor_radius*Math.sin(hor_theta) + g_Scene.cam.g_eyePos.elements[2];

        let dv = new Vector3();
        dv.elements[0] = de[0];
        dv.elements[1] = g_Scene.cam.g_eyePos.elements[1];
        dv.elements[2] = de[2];

        g_Scene.cam.g_lookAt = d;
        g_Scene.cam.g_lookAtOrient = dv;
    }

    update(dt) {
        this.keyboardInput();

        // check for collision with enemy
        for (var i = 0; i < g_Scene.g_enemies.length; i++) {
            var e = g_Scene.g_enemies[i];
            var pos = [e.base.matrixBuffer.elements[12], e.base.matrixBuffer.elements[13], e.base.matrixBuffer.elements[14]]
            if (Math.abs(-this.g_eyePos.elements[2] - pos[0]) <= .25 && Math.abs(this.g_eyePos.elements[0] - pos[2]) <= .25 ) {
                if (!this.isRestarting) {
                    document.dispatchEvent(this.restartEvent);
                    g_Scene.placedReady = false;
                    this.isRestarting = true;
                }

            }
        } 

        g_Scene.placedReady = true;
        this.isRestarting = false;

        // check for collision with crystal
        for (var i = 0; i < g_Scene.g_crystals.length; i++) {
            var c = g_Scene.g_crystals[i];
            var pos = [c.matrixBuffer.elements[12], c.matrixBuffer.elements[13], c.matrixBuffer.elements[14]]
            if (Math.abs(-this.g_eyePos.elements[2] - pos[0]) <= .1 && Math.abs(this.g_eyePos.elements[0] - pos[2]) <= .1 ) {
                let beg = [];
                let end = [];
                if (i > 0) beg = g_Scene.g_crystals.slice(0, i);
                if (i < g_Scene.g_crystals.length-1) end = g_Scene.g_crystals.slice(i+1, g_Scene.g_crystals.length);
                g_Scene.g_crystals = beg.concat(end);
                g_Scene.crystalsCollected++;
                c.collect();
            }
        } 
        
        // handle jump
        if (this.isJumping) {
            let Dy = this.velocityY * dt;
            if (Dy + this.g_eyePos.elements[1] <= this.groundedY) {
                this.g_lookAt.elements[1] -= this.g_eyePos.elements[1] - this.groundedY;
                this.g_eyePos.elements[1] = this.groundedY;
                this.g_lookAtOrient.elements[1] = this.groundedY;
                this.isJumping = false;
            } else {
                this.g_eyePos.elements[1] += Dy;
                this.g_lookAt.elements[1] += Dy;
                this.g_lookAtOrient.elements[1] += Dy;
                this.velocityY += this.gravity * dt;
            }
        }

        this.g_viewMatrix.setLookAt(this.g_eyePos.elements[0], this.g_eyePos.elements[1], this.g_eyePos.elements[2],
            this.g_lookAt.elements[0], this.g_lookAt.elements[1], this.g_lookAt.elements[2], 
            this.g_upVector.elements[0], this.g_upVector.elements[1], this.g_upVector.elements[2]);
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.g_viewMatrix.elements);

        this.g_projectionMatrix.setPerspective(80, canvas.width/canvas.height, .01, 500);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.g_projectionMatrix.elements);

    }

    restart() {
        this.g_eyePos.set([0, this.groundedY, -1]);
        this.g_lookAt.set([0, this.groundedY, 0]);
        this.g_lookAtOrient.set(this.g_lookAt.elements);
        this.isJumping = false;
        this.velocityY = 0;
    }
}
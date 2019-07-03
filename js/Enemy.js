function Enemy(I) {
    I.position = new Array(487, 550);
    I.size = new Array(100, 100);

    //I.frameSize = new Array(50, 50);

    I.frames = new Array(4, 4);
    I.currFrame = new Array(0, 0);

    I.img = new Image();
    I.alpha = 1;

    I.moveTimer = 0;
    I.moveStart = 0;

    I.speed = 0;
    I.direction = 0;
    
    I.hit = false;
    I.alive = true;

    I.animationTime = 0;

    //set enemy asset and stats
    I.Initialize = function (img, speed, position, direction, moveStart) {
        I.img = img;//set image source
        I.speed = speed;//set speed
        I.position = position;//set position
        I.direction = direction;//set direction enemy is running toward
        I.moveStart = moveStart;//set when enemy begins to move

        I.currFrame[1] = I.direction - 1;//set frame based on direction facing
    };

    //method to update enemy location and frames
    I.Update = function () {
        //update frame and cycle around when last frame is reached
        if (I.animationTime >= 8) {
            I.currFrame[0]++;
            if (I.currFrame[0] >= I.frames[0]) {
                I.currFrame[0] = 0;

                if (I.hit) {
                    I.alive = false;
                }
            }

            I.animationTime = 0;
        }

        if (!I.hit && gameState != 3) {
            //move enemy once timer is ready
            if (I.direction == 1 && I.moveTimer >= I.moveStart) {
                I.position[0] += I.speed;//move from left of screen to right
            } else if (I.direction == 2 && I.moveTimer >= I.moveStart) {
                I.position[0] -= I.speed;//move from right of screen to left
            } else if (I.direction == 3 && I.moveTimer >= I.moveStart) {
                I.position[1] += I.speed;//move from top of screen down
                I.position[0] -= I.speed * 0.1;
            }
        } else if (!I.hit && gameState == 3) {
            I.SetUnactive();
        }

        if (I.moveTimer < I.moveStart)
            I.moveTimer++;//increment timer

        I.animationTime++;
    };

    //method to draw enemy on screen
    I.Draw = function () {
        //buffer.fillRect(I.position[0], I.position[1], I.size[0], I.size[1]);
        //buffer.drawImage(I.img, I.position[0], I.position[1], I.size[0], I.size[1]);
        buffer.drawImage(I.img, (I.currFrame[0] * I.size[0]), (I.currFrame[1] * I.size[1]), I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
    };

    //method to check if enemy is alive
    I.Active = function () {
        return I.alive;
    };

    I.Hit = function () {
        return I.hit;
    };

    //method to set enemy hit to true
    I.SetUnactive = function () {
        I.hit = true;

        I.currFrame[0] = 0;
        I.currFrame[1] = 3;
    };

    return I;
}
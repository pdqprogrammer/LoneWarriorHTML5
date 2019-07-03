function Clouds(I) {
    I.position = new Array(487, 550);
    I.size = new Array(200, 100);

    I.img = new Image();
    I.alpha = 1;

    I.speed = 0;

    I.animationTime = 0;

    //set enemy asset and stats
    I.Initialize = function (img, speed, position) {
        I.img = img;//set image source
        I.speed = speed;//set speed
        I.position = position;//set position
    };

    //method to update enemy location and frames
    I.Update = function () {
        //update frame and cycle around when last frame is reached
        if (gameState != 2) {
            I.position[0] -= I.speed;
            if (I.position[0] < -200)
                I.position[0] = 3500;
        }
    };

    //method to draw enemy on screen
    I.Draw = function () {
        //buffer.fillRect(I.position[0], I.position[1], I.size[0], I.size[1]);
        //buffer.drawImage(I.img, I.position[0], I.position[1], I.size[0], I.size[1]);
        buffer.drawImage(I.img, 0, 0, I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
    };

    return I;
}
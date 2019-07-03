function PlayerAttack(I) {
    I.position = new Array(0, 0);
    I.size = new Array(0, 0);

    I.img = new Image();
    I.attackDirection = 0;

    I.active = false;
    
    I.Initialize = function (img) {
        I.img = img;
    };

    //set attack position and size based on attack direction
    I.SetAttack = function (direction) {
        if (direction == 0) {//not attacking
            I.position = new Array((_buffer.width * 0.5), 580);
            I.size = new Array(5, 5);
            I.attackDirection = direction;
        } else if (direction == 1) {//attacking to right
            I.position = new Array((_buffer.width * 0.5) + 50, 575);
            I.size = new Array(100, 100);
            I.attackDirection = direction;
        } else if (direction == 2) {//attacking to left
            I.position = new Array((_buffer.width * 0.5) - 155, 590);
            I.size = new Array(100, 100);
            I.attackDirection = direction;
        } else if (direction == 3) {//attacking to above
            I.position = new Array((_buffer.width * 0.5) - 20, 475);
            I.size = new Array(100, 100);
            I.attackDirection = direction;
        } else if (direction == 4) {//special
            I.position = new Array(0, 0);
            I.size = new Array(1024, 768);
            I.attackDirection = direction;
        }
    };

    I.Collide = function (obj) {
        if (I.position[0] < obj.position[0] + obj.size[0] - 25 && I.position[0] + I.size[0] > obj.position[0] + 25 && I.position[1] < obj.position[1] + obj.size[1] - 20 && I.position[1] + I.size[1] > obj.position[1]) {
            return true;//if collides with object then return true
        } else {
            return false;//no collision detected then return false
        }
    };

    I.Draw = function () {

        if (I.attackDirection == 1) {//attacking to right
            buffer.drawImage(I.img, 0, 0, I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
        } else if (I.attackDirection == 2) {//attacking to left
            buffer.drawImage(I.img, 200, 0, I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
        } else if (I.attackDirection == 3) {//attacking to above
            buffer.drawImage(I.img, 100, 0, I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
        }
    };

    I.Active = function () {
        return I.active;
    };

    I.SetActive = function () {
        I.active = true;
        I.alpha = 0.5;
    };

    I.SetUnactive = function () {
        I.active = false;
    }

    return I;
}
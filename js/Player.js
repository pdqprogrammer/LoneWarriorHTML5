function Player(I) {
    I.position = new Array((_buffer.width * 0.5) - 50, 575);
    I.size = new Array(100, 100);

    //I.frameSize = new Array(50, 50);

    I.frames = new Array(4, 4);
    I.currFrame = new Array(0, 0);

    I.img = new Image();
    I.alpha = 1;

    I.attacking = false;
    I.attackDirection = 0;//1-right, 2-left, 3-up, 4-special, 0 - not attacking

    I.specialAttack = 0;
    I.mouseDown = false;
    I.mouseLocation = new Array(0, 0);

    I.speed = 0;

    I.restartGame = false;
    I.mainMenu = false;

    I.animationTime = 0;

    I.attackSnd = new Audio("./sound/sword.wav");
    I.specialSnd = new Audio("./sound/clank.wav");

    I.Initialize = function (img) {
        I.img = img;
        I.attackSnd.volume *= 0.1;
        I.specialSnd.volume *= 0.15;
    };

    //update player and frames
    I.Update = function () {
        //update frames based on if attacking or not
        if (!I.attacking) {

            if (I.animationTime >= 6) {
                I.currFrame[0]++;

                if (I.currFrame[0] >= I.frames[0]) {
                    if (gameState == 3) {
                        I.currFrame[0] = I.frames[0] - 1;
                    }
                    else
                        I.currFrame[0] = 0;
                }

                I.animationTime = 0;
            }
        } else if (I.attacking) {
            if (I.animationTime >= 3) {
                I.currFrame[0]++;
                I.animationTime = 0;

                if (I.currFrame[0] >= I.frames[0]) {
                    I.currFrame[0] = 0;//set to first frame
                    I.currFrame[1] = 0;//set y frame back to standing frames
                    I.attacking = false;//stop attacking
                    I.attackSnd.pause();
                    I.attackSnd.currentTime = 1;
                }
            }
        }

        //call to input method
        I.Input();

        I.animationTime++;
    };

    //input method that checks for keyboard and touch interaction
    I.Input = function () {
        document.onkeyup = function (event) {
            event = event || window.event;

            //check if enter is pressed
            if (event.keyCode == 13) {
                if (gameState == 1)
                    gameState = 2;//pause game if enter is pressed
                else if (gameState == 2)
                    gameState = 1;//unpause if enter is pressed
                else if (gameState == 3)
                    I.restartGame = true;
            }

            if (event.keyCode == 8) {
                if (gameState == 2 || gameState == 3)
                    I.mainMenu = true;
            }

            //check if player is not attacking and game state is in game
            if (!I.attacking && gameState == 1) {
                if (event.keyCode == 39){
                    I.attacking = true;//set attacking to true
                    I.attackDirection = 1;//attack direction right
                    I.currFrame[0] = 0;//set current x frame to 0
                    I.currFrame[1] = 1;//set current y frame to 1
                    I.animationTime = 0;
                    I.attackSnd.currentTime = I.attackSnd.duration * 0;
                    I.attackSnd.play();
                } else if (event.keyCode == 37){
                    I.attacking = true;//set attacking to true
                    I.attackDirection = 2;//attack direction left
                    I.currFrame[0] = 0;//set current x frame to 0
                    I.currFrame[1] = 2;//set current y frame to 1
                    I.animationTime = 0;
                    I.attackSnd.currentTime = I.attackSnd.duration * 0.2;
                    I.attackSnd.play();
                } else if (event.keyCode == 38){
                    I.attacking = true;//set attacking to true
                    I.attackDirection = 3;//attack direction up
                    I.currFrame[0] = 0;//set current x frame to 0
                    I.currFrame[1] = 3;//set current y frame to 2
                    I.animationTime = 0;
                    I.attackSnd.currentTime = I.attackSnd.duration * 0.2;
                    I.attackSnd.play();
                } else if (event.keyCode == 40 && I.specialAttack == 15){
                    I.attacking = true;//set attacking to true
                    I.attackDirection = 4;//special attack
                    I.specialAttack = 0;//reset special attack
                    I.currFrame[0] = 0;//set current x frame to 0
                    I.currFrame[1] = 4;//set current y frame to 3
                    I.animationTime = 0;
                    //I.specialSnd.currentTime = I.attackSnd.duration * 0.2;
                    I.specialSnd.play();
                }
            }

            if (gameState == 3) {
                //I.DefeatAnimation();
            }
        };

        //mouse/touch input controls
        document.onmousedown = function (event) {
            I.mouseDown = true;

            I.mouseLocation[0] = event.x;
            I.mouseLocation[1] = event.y;
        };

        document.onmouseup = function (event) {
            if (I.mouseDown) {
                if (gameState == 1) {
                    //check if right of player pressed
                    if (I.mouseLocation[0] > (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.1) && I.mouseLocation[1] > document.body.clientHeight - (document.body.clientHeight * 0.25)) {
                        I.attacking = true;//set attacking to true
                        I.attackDirection = 1;//attack direction right
                        I.currFrame[0] = 0;//set current x frame to 0
                        I.currFrame[1] = 1;//set current y frame to 1
                        I.animationTime = 0;
                        I.attackSnd.currentTime = I.attackSnd.duration * 0.2;
                        I.attackSnd.play();
                    }

                    //check if left of player clicked
                    if (I.mouseLocation[0] < (document.body.clientWidth * 0.5) - (document.body.clientWidth * 0.1) && I.mouseLocation[1] > document.body.clientHeight - (document.body.clientHeight * 0.25)) {
                        I.attacking = true;//set attacking to true
                        I.attackDirection = 2;//attack direction left
                        I.currFrame[0] = 0;//set current x frame to 0
                        I.currFrame[1] = 2;//set current y frame to 1
                        I.animationTime = 0;
                        I.attackSnd.currentTime = I.attackSnd.duration * 0.2;
                        I.attackSnd.play();
                    }

                    //check if above player clicked
                    if (I.mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * 0.095) && I.mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.1) && I.mouseLocation[1] < document.body.clientHeight - (document.body.clientHeight * 0.25)) {
                        I.attacking = true;//set attacking to true
                        I.attackDirection = 3;//attack direction up
                        I.currFrame[0] = 0;//set current x frame to 0
                        I.currFrame[1] = 3;//set current y frame to 2
                        I.animationTime = 0;
                        I.attackSnd.currentTime = I.attackSnd.duration * 0.2;
                        I.attackSnd.play();
                    }

                    //check if player clicked
                    if (I.mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * 0.095) && I.mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.1) && I.mouseLocation[1] > document.body.clientHeight - (document.body.clientHeight * 0.25) && I.specialAttack == 15) {
                        I.attacking = true;//set attacking to true
                        I.attackDirection = 4;//special attack
                        I.specialAttack = 0;//reset special attack
                        I.currFrame[0] = 0;//set current x frame to 0
                        I.currFrame[1] = 4;//set current y frame to 3
                        I.animationTime = 0;
                        I.specialSnd.play();
                    }

                    //check if pause button pressed
                    if (I.mouseLocation[0] > document.body.clientWidth - (document.body.clientWidth / 7) && I.mouseLocation[1] < (document.body.clientHeight * 0.2)) {
                        gameState = 2;//pause game if enter is pressed
                    }
                } else if (gameState == 2) {
                    if (I.mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * .075) && I.mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.1)) {
                        if (I.mouseLocation[1] > (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.083) && I.mouseLocation[1] < (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.039)) {
                            gameState = 1;//unpause game if enter is pressed
                        } else if (I.mouseLocation[1] > (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.029) && I.mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.015)) {
                            I.mainMenu = true;
                        }
                    }
                } else if (gameState == 3) {
                    if (I.mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * .075) && I.mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.1)) {
                        if (I.mouseLocation[1] > (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.083) && I.mouseLocation[1] < (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.039)) {
                            I.restartGame = true;//restart game if enter is pressed
                        } else if (I.mouseLocation[1] > (document.body.clientHeight * 0.5) - (document.body.clientHeight * 0.029) && I.mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.015)) {
                            I.mainMenu = true;
                        }
                    }
                }

                I.mouseDown = false;
                I.mouseLocation = new Array(0, 0);
            }
        };
    };


    //method to draw player onto the screen
    I.Draw = function () {
        //buffer.fillRect(I.position[0], I.position[1], I.size[0], I.size[1]);
        //buffer.drawImage(I.img, I.position[0], I.position[1], I.size[0], I.size[1]);
        buffer.drawImage(I.img, (I.currFrame[0] * I.size[0]), (I.currFrame[1] * I.size[1]), I.size[0], I.size[1], I.position[0], I.position[1], I.size[0], I.size[1]);
    };

    //compare player with object for collision
    I.Collide = function (obj) {
        if (I.position[0] + 30 < obj.position[0] + obj.size[0] - 5 && I.position[0] - 30 + I.size[0] > obj.position[0] + 5 && I.position[1] + 5 < obj.position[1] + obj.size[1] - 8 && I.position[1] + I.size[1] > obj.position[1]) {
            return true;//set hit to true when colliding
        } else {
            return false;
        }
    };

    //check if player is attacking
    I.Attacking = function () {
        return I.attacking;
    };

    //get direction player is attacking in
    I.Direction = function () {
        return I.attackDirection;//return direction player is attacking in
    };

    I.IncreaseSpecial = function () {
        I.specialAttack++;//increase special attack bard

        if (I.specialAttack > 15)//check if special attack bar at max
            I.specialAttack = 15;//set special attack bar to max
    };

    I.Restart = function () {
        return I.restartGame;
    };

    I.Quit = function () {
        return I.mainMenu;
    };

    I.GetSpecial = function () {
        return I.specialAttack;
    };

    I.DefeatAnimation = function () {
        I.currFrame[0] = 0;
        I.currFrame[1] = 5;
        I.animationTime = 0;
        I.attacking = false;
    };

    return I;
}
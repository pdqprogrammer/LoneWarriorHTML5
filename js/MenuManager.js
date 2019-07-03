function MenuManager() {
    var self = this;
    var active = true;

    var menuState = 0;//0 - company logo, 1 - splash, 2 - main menu, 3 - controls, 4 - scoreboard, 5 - credits

    var uiImages = new Image();
    var controls = new Image();
    var credits = new Image();

    var alpha = 0.0;
    var partAlpha = 0.5;
    var alphaAdjust = 0.03;

    var timePassed = 0;
    var selection = 0;

    var score;
    var wave;
    var defeated;

    var mouseLocation = new Array(0, 0);
    var mouseDown = false;

    var logoSnd = new Audio("./sound/wolfhowl.wav");
    var menuMusic = new Audio("./sound/Pitx_-_Black_Rainbow.mp3");

    //initialize assets
    this.Initialize = function () {
        //set images
        uiImages.src = "./images/sprites/UI.png";
        controls.src = "./images/sprites/Controls.png";
        credits.src = "./images/sprites/Credits.png";

        score = localStorage.getItem("score");
        wave = localStorage.getItem("wave");
        defeated = localStorage.getItem("defeated");

        //logoSnd.volume *= 1.5;
        logoSnd.play();
        
        menuMusic.volume *= 0.2;
    };

    this.Update = function () {
        if (timePassed < 10 && menuState == 1) {
            logoSnd.pause();
        }

        if (timePassed < 50 && timePassed > 10) {
            alpha += 0.03;//increase opacity

            if (alpha > 1) {//check if max alpha
                alpha = 1;//set to max alpha

                timePassed = 50;
                if (menuState >= 1 && menuMusic.currentTime <= 0) {
                    menuMusic.play();
                }
            }

            partAlpha = alpha;
        }

        if (timePassed >= 50 && timePassed <= 60) {
            timePassed = 55;

            self.Input();//get player input

            partAlpha += alphaAdjust;

            if (partAlpha >= 1.0 || partAlpha <= 0.5)
                alphaAdjust *= -1;

            if (menuState == 0) {//check if splash screen is displayed
                timePassed = 61;//set time passed
            }
        }

        if (timePassed > 60) {
            if (menuState > 0) {
                alpha -= 0.03;//reduce opacity
                if (menuState == 2 && menuMusic.volume >= 2)
                    menuMusic.volume -= 2;

                if (alpha <= 0) {
                    alpha = 0;//set alpha to 0
                    timePassed = 0;//reset timer

                    if (menuState == 1) {
                        menuState = 2;//change menu state to splash screen
                    } else if (menuState == 2) {
                        if (selection == 0) {
                            active = false;//set menu manager to not active
                            menuMusic.pause();
                        }

                        menuState += selection;//change menustate based on selection
                        selection = 0;//reset selection
                    } else if (menuState == 3) {
                        menuState = 2;//change menu state to main menu
                    } else if (menuState == 4) {
                        menuState = 2;//change menu state to main menu
                    } else if (menuState == 5) {
                        menuState = 2;//change menu state to main menu
                    }
                }
            } else {
                if (timePassed > 160) {
                    alpha -= 0.03;//reduce opacity

                    if (alpha <= 0) {
                        alpha = 0;//set alpha to 0
                        menuState = 1;//change menu state to splash screen
                        timePassed = 0;//reset timer
                        //logoSnd.pause();
                    }

                    partAlpha = alpha;
                }
            }
        }

        timePassed++;//increment timer

        if (menuMusic.currentTime >= menuMusic.duration) {
            menuMusic.currentTime = 0;
            menuMusic.play();
        }
    };

    this.Input = function () {
        document.onkeyup = function (event) {
            event = event || window.event;

            if (event.keyCode == 13) {
                if (menuState == 2 || menuState == 1) {
                    timePassed = 62;//set timer to 62
                    alphaAdjust = 0.03;
                }

                if (menuState == 4) {
                    localStorage.setItem("score", 0);
                    localStorage.setItem("wave", 1);
                    localStorage.setItem("defeated", 0);

                    score = localStorage.getItem("score");
                    wave = localStorage.getItem("wave");
                    defeated = localStorage.getItem("defeated");
                }
            } else if (event.keyCode == 38) {
                if (menuState == 2) {
                    selection--;//reduce selection

                    if (selection < 0)//check if selection less than 0
                        selection = 3;//wrap around to highest selection
                }
            } else if (event.keyCode == 40) {
                if (menuState == 2) {
                    selection++;//increase selection

                    if (selection > 3)//check if more than max selection
                        selection = 0;//wrap around to first selection
                }
            } else if (event.keyCode == 8) {
                if (menuState > 2) {
                    timePassed = 62;//set timer to 62
                    alphaAdjust = 0.03;
                }
            }
        };

        document.onmousedown = function (event) {
            mouseDown = true;

            mouseLocation[0] = event.x;
            mouseLocation[1] = event.y;
        };

        document.onmouseup = function (event) {
            if (mouseDown) {
                if (menuState == 0) {
                    //timePassed = 150;//set timer to 150
                }else if (menuState == 1) {
                    timePassed = 62;//set timer to 62
                    alphaAdjust = 0.03;
                } else if (menuState == 2) {
                    if (mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * .05) && mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * .09)) {
                        if (mouseLocation[1] > (document.body.clientHeight * 0.5) && mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.06)) {
                            selection = 0;

                            timePassed = 62;//set timer to 62
                            alphaAdjust = 0.03;
                        } else if (mouseLocation[1] > (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.06) && mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.13)) {
                            selection = 1;

                            timePassed = 62;//set timer to 62
                            alphaAdjust = 0.03;
                        } else if (mouseLocation[1] > (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.13) && mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.19)) {
                            selection = 2;

                            timePassed = 62;//set timer to 62
                            alphaAdjust = 0.03;
                        } else if (mouseLocation[1] > (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.19) && mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.25)) {
                            selection = 3;

                            timePassed = 62;//set timer to 62
                            alphaAdjust = 0.03;
                        }
                    }
                } else if (menuState == 3) {
                    timePassed = 62;//set timer to 62
                    alphaAdjust = 0.03;
                } else if (menuState == 4) {
                    if (mouseLocation[1] > (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.20) && mouseLocation[1] < (document.body.clientHeight * 0.5) + (document.body.clientHeight * 0.27) && mouseLocation[0] > (document.body.clientWidth * 0.5) - (document.body.clientWidth * 0.06) && mouseLocation[0] < (document.body.clientWidth * 0.5) + (document.body.clientWidth * 0.06)) {
                        //reset scores
                        localStorage.setItem("score", 0);
                        localStorage.setItem("wave", 1);
                        localStorage.setItem("defeated", 0);

                        score = localStorage.getItem("score");
                        wave = localStorage.getItem("wave");
                        defeated = localStorage.getItem("defeated");
                    } else {
                        timePassed = 62;//set timer to 62
                        alphaAdjust = 0.03;
                    }
                } else if (menuState == 5) {
                    timePassed = 62;//set timer to 62
                    alphaAdjust = 0.03;
                }

                mouseDown = false;
                mouseLocation = new Array(0, 0);
            }
        };
    };

    this.Draw = function () {
        buffer.clearRect(0, 0, _buffer.width, _buffer.height);//clear buffer
        canvas.clearRect(0, 0, _canvas.width, _canvas.height);//clear screen

        buffer.fillStyle = "#000";//set fill color to black
        buffer.globalAlpha = 1;//set alpha to 1
        buffer.fillRect(0, 0, _buffer.width, _buffer.height);//create rectangle size of screen for background

        buffer.globalAlpha = alpha;//set alpha
        buffer.fillStyle = "#fff";//fill to white

        if (menuState == 0) {
            //draw company logo
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);

            buffer.fillStyle = "#000";
            buffer.drawImage(uiImages, 600, 0, 424, 250, (_buffer.width * 0.5) - 212, (_buffer.height * 0.5) - 125, 424, 250);
        } else if (menuState == 1) {
            //draw splash screen
            buffer.fillStyle = "#000";//fill to black
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);//create background

            buffer.fillStyle = "#fff";
            buffer.drawImage(uiImages, 100, 700, 350, 50, (_buffer.width * 0.5) - 210, (_buffer.height * 0.5) + 250, 350, 50);
            buffer.drawImage(uiImages, 0, 0, 600, 300, (_buffer.width * 0.5) - 300, (_buffer.height * 0.5) - 300, 600, 300);
            buffer.drawImage(uiImages, 0, 400, 100, 150, (_buffer.width * 0.5) - 80, (_buffer.height * 0.5) + 30, 100, 200);
        } else if (menuState == 2) {
            //draw main menu
            buffer.fillStyle = "#000";//fill to black
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);

            buffer.drawImage(uiImages, 100, 400, 300, 100, (_buffer.width * 0.5) - 150, (_buffer.height * 0.5) - 200, 300, 100);

            buffer.fillStyle = "#fff";//fill to black
            buffer.drawImage(uiImages, 100, 750, 140, 50, _buffer.width * 0.5 - 50, (_buffer.height * 0.5), 140, 50);
            buffer.drawImage(uiImages, 100, 800, 115, 50, _buffer.width * 0.5 - 50, (_buffer.height * 0.5) + 50, 115, 50);
            buffer.drawImage(uiImages, 100, 850, 75, 50, _buffer.width * 0.5 - 50, (_buffer.height * 0.5) + 100, 75, 50);
            buffer.drawImage(uiImages, 200, 850, 95, 50, _buffer.width * 0.5 - 50, (_buffer.height * 0.5) + 150, 95, 50);

            //draw selection pointer
            buffer.drawImage(uiImages, 0, 550, 100, 50, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) + 11 + (selection * 50), 50, 25);
        } else if (menuState == 3) {
            //draw controls
            buffer.fillStyle = "#000";
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);

            buffer.fillStyle = "#fff";
            buffer.drawImage(controls, 0, 0, _buffer.width, _buffer.height);
        } else if (menuState == 4) {
            //draw scoreboard
            buffer.fillStyle = "#000";
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);
            buffer.drawImage(uiImages, 100, 500, 200, 100, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) - 200, 200, 100);
            
            buffer.fillStyle = "#fff";
            buffer.fillText(score, (_buffer.width * 0.5) + 100, (_buffer.height * 0.5));
            buffer.fillText(wave, (_buffer.width * 0.5) + 100, (_buffer.height * 0.5) + 50);
            buffer.fillText(defeated, (_buffer.width * 0.5) + 100, (_buffer.height * 0.5) + 100);

            buffer.drawImage(uiImages, 800, 760, 110, 30, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) - 25, 110, 30);
            buffer.drawImage(uiImages, 800, 810, 125, 30, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) + 25, 125, 30);
            buffer.drawImage(uiImages, 800, 860, 180, 30, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) + 75, 180, 30);

            buffer.drawImage(uiImages, 650, 300, 200, 100, (_buffer.width * 0.5) - 60, (_buffer.height * 0.5) + 150, 120, 60);
        } else if (menuState == 5) {
            //draw credits
            buffer.fillStyle = "#000";
            buffer.fillRect(0, 0, _buffer.width, _buffer.height);

            buffer.fillStyle = "#fff";
            buffer.drawImage(credits, _buffer.width * 0.5 - 450, _buffer.height * 0.5 - 250, 900, 500);
        }

        canvas.drawImage(_buffer, 0, 0);//display buffer onto screen
    };

    //return if Menu Manager is active
    this.Active = function () {
        return active;
    }
}
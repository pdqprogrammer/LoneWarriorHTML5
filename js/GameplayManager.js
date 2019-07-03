function GameplayManager() {
    var self = this;
    var active = true;

    var currentWave = 1;
    var waveCount = 15;
    var waveKills = 0;
    var spawnTime = 90;

    var player = new Player({});
    var playerAttack = new PlayerAttack({});
    var enemies = [];
    var clouds = [];

    //in game textures
    var sky = new Image();
    var ground = new Image();
    var playerTexture = new Image();
    var attackTexture = new Image();
    var enemyTexture = new Image();
    var cloudTexture = new Image();

    var uiImages = new Image();

    var score = 0;
    var defeated = 0;
    var timer = 0;

    var newRecord = false;

    var alpha = 1.0;
    var gameMusic = new Audio("./sound/Kirkoid_-_Leviathan.mp3");

    //setup game, player, and enemies
    this.Initialize = function () {
        playerTexture.src = "./images/sprites/Player.png";
        attackTexture.src = "./images/sprites/PlayerAttack.png";
        enemyTexture.src = "./images/sprites/Enemy.png";
        sky.src = "./images/sprites/Sky.png";
        ground.src = "./images/sprites/Ground.png";
        cloudTexture.src = "./images/sprites/Cloud.png";

        uiImages.src = "./images/sprites/UI.png";

        player.Initialize(playerTexture);//intialize player
        playerAttack.Initialize(attackTexture);
        self.CreateFirstWave();//call method to create initial enemy wave

        gameMusic.volume *= 0.1;
    };

    this.Update = function () {
        var enemyCount = enemies.length;

        //check game state to update accordinginly
        if (gameState == 1) {//in game
            player.Update();//call player to update

            //check if player is attacking
            if (player.Attacking()) {
                if (!playerAttack.Active()) {//check if attack is no active
                    playerAttack.SetActive();//set attack to active

                    playerAttack.SetAttack(player.Direction());//set up attack based on attack direction
                }
            } else {
                if (playerAttack.Active()) {//check if attack is active
                    playerAttack.SetUnactive();//set attack to not active
                    playerAttack.SetAttack(0);//set up attack to no be displayed
                }
            }

            for (var i = 0; i < enemyCount; i++) {
                enemies[i].Update();//call enemy to update

                //check if player collides with any enemies
                if (player.Collide(enemies[i])) {
                    gameState = 3;//set game state to game over
                    player.DefeatAnimation();

                    //check for new high scores
                    if (localStorage.getItem("score") < score) {
                        localStorage.setItem("score", score);
                        newRecord = true;
                    }
                    if (localStorage.getItem("wave") < currentWave) {
                        localStorage.setItem("wave", currentWave);
                        newRecord = true;
                    }
                    if (localStorage.getItem("defeated") < defeated) {
                        localStorage.setItem("defeated", defeated);
                        newRecord = true;
                    }
                }

                if (playerAttack.Collide(enemies[i])) {
                    if (enemies[i].Active() && !enemies[i].Hit()) {
                        score += 5 + (5 * currentWave);//increment score based on wave
                        defeated++;//increment enemies defeated
                        player.IncreaseSpecial();//

                        enemies[i].SetUnactive();//set enemy to not be active
                    }
                }
            }

            //filter out not active enemies
            enemies = enemies.filter(function (enemy) {
                return enemy.Active();
            });

            //check if all enemies have been defeated
            if (enemies.length <= 0) {
                currentWave++;//increment wave
                self.CreateWave();//create next wave of enemies
            }
        } else if (gameState == 2) {//game paused
            player.Input();//call to player input
        } else if (gameState == 3) {//game over
            player.Update();

            if (enemyCount > 0) {
                for (var i = 0; i < enemyCount; i++) {
                    enemies[i].Update();//call enemy to update
                }

                enemies = enemies.filter(function (enemy) {
                    return enemy.Active();
                });
            }

            if (player.Restart()) {
                self.Restart();
            }
        } else if (gameState == 4) {//game starting
            player.Update();

            alpha -= 0.02;//increase opacity

            if (alpha < 0) {
                alpha = 0;
            }

            timer++;//increment start game timer

            if (timer >= 65) {
                gameState = 1;//change game state to in game
                timer = 0;//reset timer
                gameMusic.play();
            }
        }

        if (player.Quit()) {
            active = false;
            gameMusic.pause();
        };

        if (gameMusic.currentTime >= gameMusic.duration) {
            gameMusic.currentTime = 0;
            gameMusic.play();
        }
    };
    
    this.Draw = function () {
        buffer.clearRect(0, 0, _buffer.width, _buffer.height);//clear buffer
        canvas.clearRect(0, 0, _canvas.width, _canvas.height);//clear canvas

        buffer.globalAlpha = 1;
        buffer.drawImage(sky, 0, 0, _buffer.width, _buffer.height);
        buffer.drawImage(ground, 0, 57, 1280, 93, (_buffer.width * 0.5) - 640, 675, 1280, 93);

        player.Draw();//draw player

        var enemyCount = enemies.length;
        for (var i = 0; i < enemyCount; i++) {
            enemies[i].Draw();//draw enemy
        }

        buffer.drawImage(ground, 0, 0, 1280, 57, (_buffer.width * 0.5) - 640, 618, 1280, 57);

        if (playerAttack.Active() && gameState != 3)//check if player attack is active
            playerAttack.Draw();//draw player attack

        //draw ui
        buffer.fillStyle = "#fff";
        buffer.textAlign = "left";
 
        buffer.drawImage(uiImages, 100, 850, 75, 50, 15, 5, 75, 50);
        buffer.fillText(score, 95, 42);

        buffer.drawImage(uiImages, 300, 750, 50, 50, 15, 55, 50, 50);
        buffer.fillText(currentWave, 95, 94);

        //buffer.fillText("Special: " + player.GetSpecial(), 25, 50);

        if (gameState == 2) {
            buffer.drawImage(uiImages, 400, 500, 200, 100, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) - 165, 200, 100);

            buffer.drawImage(uiImages, 500, 950, 200, 60, (_buffer.width * 0.5) - 75, (_buffer.height * 0.5) - 85, 150, 45);
            buffer.drawImage(uiImages, 500, 810, 200, 60, (_buffer.width * 0.5) - 75, (_buffer.height * 0.5) - 30, 150, 45);
        }

        if (gameState == 3) {
            buffer.drawImage(uiImages, 100, 900, 350, 100, (_buffer.width * 0.5) - 175, (_buffer.height * 0.5) - 165, 350, 100);

            if (newRecord)
                buffer.drawImage(uiImages, 800, 900, 150, 30, (_buffer.width * 0.5) - 175, (_buffer.height * 0.5) - 180, 150, 25);

            buffer.drawImage(uiImages, 500, 880, 200, 60, (_buffer.width * 0.5) - 75, (_buffer.height * 0.5) - 85, 150, 45);
            buffer.drawImage(uiImages, 500, 810, 200, 60, (_buffer.width * 0.5) - 75, (_buffer.height * 0.5) - 30, 150, 45);
        }

        if (gameState == 4) {
            //buffer.fillText("READY", _buffer.width / 2, _buffer.height / 2);
            buffer.drawImage(uiImages, 400, 400, 200, 100, (_buffer.width * 0.5) - 100, (_buffer.height * 0.5) - 165, 200, 100);

            buffer.globalAlpha = alpha;

            buffer.fillStyle = "#000";
            buffer.fillRect(0,0,1024,768);

            buffer.globalAlpha = 1.0;
        }

        if (player.GetSpecial() < 15)
            buffer.drawImage(uiImages, 500, 750, 200, 20, (_buffer.width) - 290, 54, (11.5) * player.GetSpecial(), 20);
        else
            buffer.drawImage(uiImages, 500, 780, 200, 20, (_buffer.width) - 290, 54, 173, 20);

        buffer.drawImage(uiImages, 500, 600, 345, 135, (_buffer.width) - 300, 15, 300, 100);

        //draw buffer onto canvas
        canvas.drawImage(_buffer, 0, 0);
    };

    //method to create wave of enemies
    this.CreateWave = function () {
        var enemyCount = (Math.round(Math.random() * 6) * currentWave) + 20;//randomly set number of enemies with minimum 20
        var enemyDirection = 0;//variable for enemy direction

        for (var i = 0; i < enemyCount; i++) {
            enemies.push(new Enemy({}));//push to enemy to enemies array
            enemyDirection = Math.floor(Math.random() * 3) + 1;//set to a spawn in a random direction

            var enemySpeed = 0;
            var enemyStart = 0;

            if (currentWave <= 4) {
                if (enemyDirection <= 1)
                    enemies[enemies.length - 1].Initialize(enemyTexture, 3 + (currentWave), new Array(1075, 575), 2, i * (75 - (currentWave * 5)));//spawn to right
                else if (enemyDirection <= 2)
                    enemies[enemies.length - 1].Initialize(enemyTexture, 3 + (currentWave), new Array(-100, 575), 1, i * (75 - (currentWave * 5)));//spawn to left
                else
                    enemies[enemies.length - 1].Initialize(enemyTexture, 3 + (currentWave), new Array(550, -100), 3, i * (75 - (currentWave * 5)));//spawn above
            } else {
                enemySpeed = Math.floor(Math.random() * 2) + 3 + (currentWave);

                if (enemySpeed <= 4 + (currentWave)) {
                    enemyStart = (70 - (currentWave * 5));
                    if (enemyStart < 10)
                        enemyStart = 10;
                }
                else {
                    enemyStart = (75 - (currentWave * 5));
                    if (enemyStart < 5)
                        enemyStart = 5;
                }

                if (enemyDirection <= 1)
                    enemies[enemies.length - 1].Initialize(enemyTexture, enemySpeed, new Array(1075, 575), 2, i * (enemyStart));//spawn to right
                else if (enemyDirection <= 2)
                    enemies[enemies.length - 1].Initialize(enemyTexture, enemySpeed, new Array(-100, 575), 1, i * (enemyStart));//spawn to left
                else
                    enemies[enemies.length - 1].Initialize(enemyTexture, enemySpeed, new Array(550, -100), 3, i * (enemyStart));//spawn above
            }
        }
    };

    //method to create first wave of enemies
    this.CreateFirstWave = function () {
        var enemyCount = 15;//set enemy count to 20
        var enemyDirection = 0;//set direction to spawn for first enemy to the right

        for (var i = 0; i < enemyCount; i++) {
            enemies.push(new Enemy({}));

            if (enemyDirection <= 1)
                enemies[enemies.length - 1].Initialize(enemyTexture, 4, new Array(1075, 575), 2, i * 80);//spawn to right
            else if (enemyDirection <= 2)
                enemies[enemies.length - 1].Initialize(enemyTexture, 4, new Array(-100, 575), 1, i * 80);//spawn to left
            else
                enemies[enemies.length - 1].Initialize(enemyTexture, 4, new Array(550, -100), 3, i * 80);//spawn above

            enemyDirection = Math.floor(Math.random() * 3) + 1;//set direction to spawn from for next enemy
        }
    };

    this.Restart = function () {
        currentWave = 1;

        player = new Player({});
        playerAttack = new PlayerAttack({});
        enemies = [];

        score = 0;
        defeated = 0;
        timer = 0;

        newRecord = false;

        player.Initialize(playerTexture);//intialize player
        playerAttack.Initialize(attackTexture);
        self.CreateFirstWave();//call method to create initial enemy wave

        gameState = 4;
    };
    
    this.Active = function () {
        return active;//return if gameplay manager is active
    };

    this.HighScores = function () {

    };
}
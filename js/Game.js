var _canvas = null;
var _buffer = null;
var canvas = null;
var buffer = null;

var gameState = 0;//0 - Main Menu, 1 - In Game, 2 - Paused, 3 - GameOver, 4 - LoadScreen

function Game() {
    this.gameLoop = null;
    var self = this;

    var FPS = 60;//set frames per second

    var gameplayManager = null;
    var menuManager = null;

    this.Initialize = function () {
        // initialize all game variables
        _canvas = document.getElementById('canvas');//set canvas

        //set context for the canvas and buffer
        if (_canvas && _canvas.getContext) {
            canvas = _canvas.getContext('2d');

            _buffer = document.createElement('canvas');
            _buffer.width = _canvas.width;
            _buffer.height = _canvas.height;
            buffer = _buffer.getContext('2d');

            buffer.strokeStyle = "rgb(255, 255, 255)";
            buffer.fillStyle = "#000";
            buffer.font = "normal 28px Courier New";
        }

        //gameplayManager = new GameplayManager();
        //gameplayManager.Initialize();

        menuManager = new MenuManager();
        menuManager.Initialize();

        if (localStorage.getItem("score") == null)
            localStorage.setItem("score", 0);
        if (localStorage.getItem("wave") == null)
            localStorage.setItem("wave", 1);
        if (localStorage.getItem("defeated") == null)
            localStorage.setItem("defeated", 0);
    };

    this.Run = function () {
        if (canvas != null) {
            self.gameLoop = setInterval(self.RunGameLoop, 1000 / FPS);// Calls RunGameLoop method every ‘draw interval’
        }
    };

    this.RunGameLoop = function () {
        self.Update();
        self.Draw();
    };

    this.Update = function () {
        //check game state to update either menus or gameplay
        if (gameState == 0) {
            //update menus
            menuManager.Update();

            if (!menuManager.Active()) {
                gameplayManager = new GameplayManager();//set gameplay manager
                gameplayManager.Initialize();//initialize gameplay manager

                gameState = 4;

                menuManager = null;
            }
        } else if (gameState >= 1) {
            gameplayManager.Update();//update gameplay

            if (!gameplayManager.Active()) {
                menuManager = new MenuManager();//set menu manager
                menuManager.Initialize();//initialize menu manager

                gameState = 0;

                gameplayManager = null;
            }
        }
    };

    this.Draw = function () {
        //draw to canvas based on game state
        if (gameState == 0) {
            menuManager.Draw();//draw menus
        } else if (gameState >= 1) {
            gameplayManager.Draw();//draw gameplay
        }
    };
}
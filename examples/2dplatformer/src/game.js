import Player from './player';

var game;
var gameOptions = {
    // width of the game, in pixels
    gameWidth: 640,
    // height of the game, in pixels
    gameHeight: 480,
    // background color
    bgColor: 0x444444
}
window.onload = function () {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}


var playGame = function (game) { }
playGame.prototype = {
    preload: function () {
        game.stage.backgroundColor = gameOptions.bgColor;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;

        // loading level tilemap
        game.load.tilemap("level", '/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image("tile", "/tile.png");
        game.load.image("hero", "/hero.png");
    },
    create: function () {

        // starting ARCADE physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // creatin of "level" tilemap
        this.map = game.add.tilemap("level");

        // adding tiles (actually one tile) to tilemap
        this.map.addTilesetImage("tileset01", "tile");

        // tile 1 (the black tile) has the collision enabled
        this.map.setCollision(1);

        // which layer should we render? That's right, "layer01"
        this.layer = this.map.createLayer("layer01");


        this.hero = new Player(game, this.layer, game.width / 2, 440, "hero")
    },
    update: function () {
        this.hero.update()
    }

}

var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    //backgroundColor: 'black',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
        }
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);
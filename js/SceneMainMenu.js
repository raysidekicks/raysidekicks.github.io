class SceneMainMenu extends Phaser.Scene{
    constructor(){
        super({key: 'SceneMainMenu'});
    }

    preload(){
        this.load.image('sprBg0', 'content/Backgrounds/sprBg0.png');
        this.load.image('sprBg1', 'content/Backgrounds/sprBg1.png');
        this.load.image('sprBtnPlay', 'content/Buttons/sprBtnPlay.png');
        this.load.image('sprBtnPlayDown', 'content/Buttons/sprBtnPlayDown.png');
        this.load.image('sprBtnPlayHover', 'content/Buttons/sprBtnPlayHover.png');
        this.load.image('sprBtnRestart', 'content/Buttons/sprBtnRestart.png');
        this.load.image('sprBtnRestartDown', 'content/Buttons/sprBtnRestartDown.png');
        this.load.image('sprBtnRestartHover', 'content/Buttons/sprBtnRestartHover.png');

        this.load.audio('sndBtnDown', 'content/sfx/sndBtnDown.wav');
        this.load.audio('sndBtnOver', 'content/sfx/sndBtnOver.wav');
    }

    create(){
        this.sfx = {
            btnDown: this.sound.add('sndBtnDown'),
            btnOver: this.sound.add('sndBtnOver')
        };

        this.btnPlay = this.add.sprite(this.game.config.width*0.5, this.game.config.height*0.5, 'sprBtnPlay');
        this.btnPlay.setInteractive();

        this.btnPlay.on('pointerover', function(){
            this.btnPlay.setTexture('sprBtnPlayHover');
            this.sfx.btnOver.play();
        }, this);

        this.btnPlay.on('pointerout', function(){
            this.btnPlay.setTexture('sprBtnPlayDown');
            this.sfx.btnDown.play();
        }, this);

        this.btnPlay.on('pointerup', function(){
            this.btnPlay.setTexture('sprBtnPlay');
            this.scene.start('SceneMain');
        }, this);

        //title
        this.title = this.add.text(this.game.config.width*0.5, 128, 'SPACE DEBRIS CHALLENGE', {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        this.title.setOrigin(0.5);

        //Background
        this.backgrounds = [];
        for(var i=0; i<5; i++){
            var keys = ['sprBg0', 'sprBg1'];
            var key = keys[Phaser.Math.Between(0, keys.length-1)];
            var bg = new ScrollingBackground(this, key, i*10);
            this.backgrounds.push(bg);
        }
    }

    update(){
        for(var i=0; i<this.backgrounds.length; i++){
            this.backgrounds[i].update();
        }
    }
}
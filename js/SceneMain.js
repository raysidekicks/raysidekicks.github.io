class SceneMain extends Phaser.Scene{
    constructor(){
        super({key: 'SceneMain'});
        
    }
    
    preload(){
        this.load.image('sprBg0', 'content/Backgrounds/sprBg0.png');
        this.load.image('sprBg1', 'content/Backgrounds/sprBg1.png');
        this.load.image('earth', 'content/Backgrounds/earth2.png');

        this.load.spritesheet('sprPlayer', 'content/Shooter/sprPlayer_rotated.png', {
            frameWidth: 16, 
            frameHeight: 16
        });

        this.load.image('bullet', 'content/Lasers/laserBlue07.png');
        this.load.image('iss', 'content/Rockets/spaceStation_018.png');
        this.load.image('debris', 'content/bomb.png');
        //this.load.image('sprLaserPlayer', 'content/Lasers/sprLaserPlayer.png');
        this.load.image('battery', 'content/Power-ups/powerupGreen_bolt.png');
        this.load.image('power', 'content/Power-ups/powerupBlue_star.png');
        this.load.image('crosshair', 'content/crosshair_red.png');

        this.load.spritesheet('sprExplosion', 'content/sprExplosion.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        //audio
        this.load.audio('sndExplode0', 'content/sfx/sndExplode0.wav');
        this.load.audio('sndExplode1', 'content/sfx/sndExplode1.wav');
        this.load.audio('sndLaser', 'content/sfx/sndLaser.wav');
        this.load.audio('alert', 'content/sfx/pickup.wav');
        this.load.audio('playerLaser', 'content/sfx/shotgun.wav');

    }

    create(){
        this.add.image(540, 500, 'earth');
        //this.add.image(this.game.config.width*0.5, this.game.config.height*0.5, 'earth');

        this.anims.create({
            key: 'sprPlayer',
            frames: this.anims.generateFrameNumbers('sprPlayer'),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'sprExplosion',
            frames: this.anims.generateFrameNumbers('sprExplosion'),
            frameRate: 20,
            repeat: 0
        });

        this.sfx = {
            explosions: [
                this.sound.add('sndExplode0'),
                this.sound.add('sndExplode1')
            ],
            laser: this.sound.add('sndLaser'),
            alert: this.sound.add('alert'),
            playerLaser: this.sound.add('playerLaser')
        };

        this.player = new Player(
            this, 
            this.game.config.width*0.5,
            600,
            'sprPlayer'
        );
        this.player.setScale(2.8);
        //this.cameras.main.startFollow(this.player);

        //Background
        this.backgrounds = [];
        for(var i=0; i<5; i++){
            var bg = new ScrollingBackground(this, 'sprBg0', i*10);
            this.backgrounds.push(bg);
        }

        //keyboard input
        //this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        //this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        //this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //this.keySpace.enabled = disabled;
        

        //reticle
        //this.reticle = this.physics.add.sprite(128, 128, 'recticle');
        this.reticle = new Reticle(this, this.game.config.width*0.5, 700);
        this.reticle.setScale(1.2);
        this.reticle.setDepth(10);
        //this.reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);

        //Pointer lock
        game.canvas.addEventListener('mousedown', function(){
            game.input.mouse.requestPointerLock();
        });

        this.directionPlayer = 0;
        this.input.on('pointermove', function(pointer){
            if(this.input.mouse.locked){
                this.reticle.x += pointer.movementX;
                this.reticle.y += pointer.movementY;
                /*this.directionPlayer = Math.atan((this.reticle.y - this.player.y) / (this.reticle.x - this.player.x));
                if(this.reticle.x < this.player.x){
                    this.player.body.velocity.x += -0.01*(Math.cos*(this.directionPlayer));
                    this.player.body.velocity.y += -0.01*(Math.sin*(this.directionPlayer));
                }else{
                    this.player.body.velocity.x += -0.01*(Math.cos(this.directionPlayer));
                    this.player.body.velocity.y += -0.01*(Math.sin(this.directionPlayer));
                }*/
                //this.player.x += this.reticle.x;
                //this.player.y += this.reticle.y;
                this.physics.moveTo(this.player, this.reticle.x, this.reticle.y, 60, 350);
                
            }
        }, this);

        //Player Laser
        this.playerLasers = this.add.group();

        //SpaceStation
        this.spaceStation = new SpaceStation(this, this.game.config.width*0.5, this.game.config.height*0.5, 'iss');
        this.spaceStation.setScale(0.6);
        this.spaceStation.body.immovable = true;

        //Circle boundary
        this.graphicsCircle = this.add.graphics({ lineStyle: {width: 2, color: 0x8C8C8C}, fillStyle: {color: 0xff0000}});
        this.circle = new Phaser.Geom.Circle(this.game.config.width*0.5, this.game.config.height*0.5, 200);
        
        //Debris with a timer
        //this.debris = new Debris(this, Phaser.Math.Between(0, this.game.config.width), Phaser.Math.Between(0, this.game.config.height));
        this.debrisGroup = this.add.group();
        var debrisSpeedRatio = 0.1;
        var timer = this.time.addEvent({
            delay: 1000,
            callback: function(){
                var randomX = Phaser.Math.Between(0, 10) < 5 ? 0 : this.game.config.width;
                var randomY = Phaser.Math.Between(0, 10) < 5 ? 0 : this.game.config.height;

                var debris = new Debris(this, randomX, randomY);

                if(debris!=null){
                    debris.setScale(Phaser.Math.Between(15, 20)*0.1);
                    debris.update();
                    this.debrisGroup.add(debris);

                    if(debris.x == 0 && debris.y == 0){
                        debris.body.velocity.x = Phaser.Math.Between(0, this.game.config.width*debrisSpeedRatio);
                        debris.body.velocity.y = Phaser.Math.Between(0, this.game.config.height*debrisSpeedRatio);
                    }else if(debris.x == this.game.config.width && debris.y == 0){
                        debris.body.velocity.x = (-Phaser.Math.Between(0, this.game.config.width*debrisSpeedRatio));
                        debris.body.velocity.y = Phaser.Math.Between(0, this.game.config.height*debrisSpeedRatio);
                    }else if(debris.x == 0 && debris.y == this.game.config.height){
                        debris.body.velocity.x = Phaser.Math.Between(0, this.game.config.width*debrisSpeedRatio);
                        debris.body.velocity.y = (-Phaser.Math.Between(0, this.game.config.height*debrisSpeedRatio));
                    }else if(debris.x == this.game.config.width && debris.y == this.game.config.height){
                        debris.body.velocity.x = (-Phaser.Math.Between(0, this.game.config.width*debrisSpeedRatio));
                        debris.body.velocity.y = (-Phaser.Math.Between(0, this.game.config.height*debrisSpeedRatio));
                    }
                }
            },
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 60000,
            callback: function(){
                if(timer.delay > 0){
                    timer.delay -= 5;
                    if(debrisSpeedRatio <= 1){
                        debrisSpeedRatio += 0.2;
                    }else{
                        debrisSpeedRatio = 1;
                    }
                    
                }else{
                    timer.delay = 1000;
                }
            }
        })


        //Scores and Health
        var health = 100;
        var destroyed = 0;
        var collected = 0;
        var highScoreCollected = 0;
        var highScoreDestroyed = 0;
        var highScoreCollectedText = this.add.text(this.game.config.width*0.5 - 80, 20, "High score for collected: "+localStorage.getItem('highScoreCollected'), {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
        });
        var highScoreDestroyedText = this.add.text(this.game.config.width*0.5 - 80, 0, "High score for destroyed: "+localStorage.getItem('highScoreDestroyed'), {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
        })
        var healthText = this.add.text(5, 5, "Health: 100", {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
        });
        var destroyedText = this.add.text(this.game.config.width-163, 5, "Destroyed: 0", {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
        });
        var collectedText = this.add.text(this.game.config.width-163, 25, "Collected: 0", {
            fontFamily: 'monospace',
            fontSize: 18,
            fontStyle: 'bold',
            color: '#ffffff',
        });

        //Adding random batteries for Space station health
        //var randomTime = Phaser.Math.Between(1000, 10000);
        this.batteries = this.add.group();
        var batteryTimer = this.time.addEvent({
            delay: 10000,
            callback: function(){
                var randomPosX = Phaser.Math.Between(0, this.game.config.width);
                var randomPosY = Phaser.Math.Between(0, this.game.config.height);
                if(randomPosX <= (this.game.config.width*0.5)+200){
                    randomPosX = 200;
                }
                if(randomPosY <= (this.game.config.height*0.5)+200){
                    randomPosY = 200;
                }
                var battery = new Battery(this, randomPosX, randomPosY);
                
                if(battery!=null){
                    battery.setScale(1.2);
                    this.batteries.add(battery);
                }
            },
            callbackScope: this,
            loop: true
        });
        batteryTimer.delay += 5000;

        //Collision detection
        this.physics.add.collider(this.player, this.spaceStation, function(player, station){
            if(health > 0){
                station.playSound();
                health -= 5;
                healthText.setText('Health: '+health);
            }else if(health <= 0){
                //localStorage.setItem("destroyed", destroyed);
                //localStorage.setItem("collected", collected);
                player.explode(false);
                player.onDestroy();
                station.explode(true);
            }            
        });

        this.physics.add.collider(this.debrisGroup, this.spaceStation, function(debris, station){
            if(health > 0){
                station.playSound();
                health -= 1;
                debris.explode(true);
                healthText.setText('Health: '+health);
            }else{
                //localStorage.setItem("destroyed", destroyed);
                debris.explode(true);
                station.explode(false);
                station.onDestroy2();

            }
        });

        this.physics.add.overlap(this.player, this.debrisGroup, function(player, debris){
            collected += 1;
            localStorage.setItem("collected", collected);
            collectedText.setText("Collected: "+collected);
            highScoreDestroyedText.setText("High score for destroyed: "+localStorage.getItem("highScoreDestroyed"));
            highScoreCollectedText.setText("High score for collected: "+localStorage.getItem("highScoreCollected"));
            debris.explodeNoAnim(true);
            {
                if(collected >= localStorage.getItem("collected")){
                    localStorage.setItem("highScoreCollected", collected);
                }
                if(destroyed >= localStorage.getItem("destroyed")){
                    localStorage.setItem("highScoreDestroyed", destroyed);
                }
            }

        });

        this.physics.add.collider(this.playerLasers, this.debrisGroup, function(playerLaser, debris){
            if(debris){
                if(debris.onDestroy !== undefined){
                    debris.onDestroy();
                }
                debris.explode(true);
                playerLaser.destroy();
                destroyed += 1;
                destroyedText.setText('Destroyed: '+destroyed);
                localStorage.setItem("destroyed", destroyed);
                highScoreDestroyedText.setText("High score for destroyed: "+localStorage.getItem("destroyed"));
                highScoreCollectedText.setText("High score for collected: "+localStorage.getItem("collected"));
                {
                    if(collected >= localStorage.getItem("collected")){
                        localStorage.setItem("highScoreCollected", collected);
                    }
                    if(destroyed >= localStorage.getItem("destroyed")){
                        localStorage.setItem("highScoreDestroyed", destroyed);
                    }
                }
            }
        });

        //Decreasing health due to small debris
        this.time.addEvent({
            delay: 5000,
            callback: function(){
                health -= 1;
                healthText.setText('Health: '+health);
            },
            callbackScope: this,
            loop: true
        });

        var batteryCount = 0;
        localStorage.setItem("batteryCount", batteryCount);
        
        var flashMessage = this.add.text(this.game.config.width*0.5-400, this.game.config.height*0.5, " ", {
            fontFamily: 'monospace',
            fontSize: 48,
            fontStyle: 'bold',
            color: '#ffffff',
        });

        this.physics.add.collider(this.batteries, this.player, function(battery, player){
            battery.explodeNoAnim(true);
            localStorage.setItem("batteryCount", parseInt(localStorage.getItem("batteryCount"), 10)+1);

            if(health<90){
                health += 10;
                healthText.setText('Health: '+health);
            }else{
                health = 100;
                healthText.setText('Health: '+health);
            }
        });  
    }

    update(){

        //Circle boundary
        this.graphicsCircle.strokeCircleShape(this.circle);

        if(!this.player.getData('isDead')){
            this.player.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.reticle.x, this.reticle.y);
            this.reticle.constrainReticle(this.reticle, this.player);
            this.reticle.body.velocity.x = this.player.body.velocity.x;
            this.reticle.body.velocity.y = this.player.body.velocity.y;
            this.player.update();
            this.reticle.update();

            /*if(this.keyW.isDown){
                this.player.moveUp();
            }else if(this.keyS.isDown){
                this.player.moveDown();
            }
    
            if(this.keyA.isDown){
                this.player.moveLeft();
            }else if(this.keyD.isDown){
                this.player.moveRight();
            }*/

            var flashMessage = this.add.text(this.game.config.width*0.5-400, this.game.config.height*0.5, " ", {
                fontFamily: 'monospace',
                fontSize: 48,
                fontStyle: 'bold',
                color: '#ffffff',
            });

            if(this.keyS.isDown){
                this.player.setData('isShooting', true);
                if(localStorage.getItem("batteryCount") >= 2){
                    flashMessage.setText("Press SPACE to unleash power");
                    setTimeout(function(){
                        flashMessage.setText(" ");
                    }, 3000);
                }
            }else{
                this.player.setData('timerShootTick', this.player.getData('timerShootDelay')-1);
                this.player.setData('isShooting', false);
            }
            
            
            if(this.keySpace.isDown){
                if(localStorage.getItem("batteryCount") >= 2){
                    for(var i=0; i<this.debrisGroup.getChildren().length; i++){
                        var rocks = this.debrisGroup.getChildren()[i];
                        rocks.attract();
                    }
                    localStorage.setItem("batteryCount", parseInt('0', 10));
                }
                
            }
            
            /*if(this.input.mousePointer.isDown){
                this.player.setData('isShooting', true);
                if(localStorage.getItem("batteryCount") >= 2){
                    flashMessage.setText("Press SPACE to unleash power");
                    setTimeout(function(){
                        flashMessage.setText(" ");
                    }, 3000);
                }
            }else{
                this.player.setData('timerShootTick', this.player.getData('timerShootDelay')-1);
                this.player.setData('isShooting', false);
            }*/
        }

        for(var i=0; i<this.playerLasers.getChildren().length; i++){
            var laser = this.playerLasers.getChildren()[i];
            laser.update();

            if(laser.x < -laser.displayWidth ||
                laser.x > this.game.config.width + laser.displayWidth ||
                laser.y < -laser.displayHeight*4 ||
                laser.y > this.game.config.height + laser.displayHeight){
                    if(laser){
                        laser.destroy();
                    }
                }
        }

        for(var i=0; i<this.debrisGroup.getChildren().length; i++){
            var enemy = this.debrisGroup.getChildren()[i];
            enemy.update();

            if(enemy.x < -enemy.displayWidth ||
                enemy.x > this.game.config.width + enemy.displayWidth ||
                enemy.y < -enemy.displayHeight * 4 ||
                enemy.y > this.game.config.height + enemy.displayHeight){
                    if(enemy){
                        if(enemy.onDestroy !== undefined){
                            enemy.onDestroy();
                        }
                        enemy.destroy();
                    }
                }
        }

        for(var i=0; i<this.backgrounds.length; i++){
            this.backgrounds[i].update();
        }

    }
}

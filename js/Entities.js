class Entity extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, key, type){
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData('type', type);
        this.setData('isDead', false);
    }

    explode(canDestroy){
        if(!this.getData('isDead')){
            this.setTexture('sprExplosion');
            this.play('sprExplosion');
            this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length-1)].play();

            if(this.shootTimer !== undefined){
                if(this.shootTimer){
                    this.shootTimer.remove(false);
                }
            }
            this.setAngle(0);
            this.body.setVelocity(0,0);
            this.on('animationcomplete', function(){
                if(canDestroy){
                    this.destroy();
                }else{
                    this.setVisible(false);
                }
            }, this);
            this.setData('isDead', true);
        }
    }

    explodeNoAnim(canDestroy){
        if(!this.getData('isDead')){
            if(this.shootTimer !== undefined){
                if(this.shootTimer){
                    this.shootTimer.remove(false);
                }
            }
            this.setAngle(0);
            this.body.setVelocity(0,0);
            if(canDestroy){
                this.destroy();
            }else{
                this.setVisible(false);
            }
            this.setData('isDead', true);
        }
    }

}

class Player extends Entity{
    constructor(scene, x, y, key){
        super(scene, x, y, key, 'Player');
        this.setData('speed', 400);
        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timerShootDelay')-1);
        this.play('sprPlayer');
    }

    moveUp(){
        this.body.velocity.y = -this.getData('speed');
    }

    moveDown(){
        this.body.velocity.y = this.getData('speed');
    }

    moveLeft(){
        this.body.velocity.x = -this.getData('speed');
    }

    moveRight(){
        this.body.velocity.x = this.getData('speed');
    }

    update(){
        this.body.setVelocity(0,0);
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

        //shooting logic
        //var player_ = this.scene.player;
        var reticle_ = this.scene.reticle;
        if(this.getData('isShooting')){
            if(this.getData('timerShootTick') < this.getData('timerShootDelay')){
                this.setData('timerShootTick', this.getData('timerShootTick')+1);
            }else{
                
                if(localStorage.getItem("collected") < 50){
                    var laser = new PlayerLaser(this.scene, this.x, this.y, this.scene.reticle.x, this.scene.reticle.y);

                    this.scene.playerLasers.add(laser);

                    this.scene.sfx.laser.play();
                    this.setData('timerShootTick', 0);

                }else if(localStorage.getItem("collected") >= 50 && localStorage.getItem("collected") < 120){
                    var deltaX = 5;
                    var deltaY = 5;

                    if(this.angle < 0 && this.angle >= -90){
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)-deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y+deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)+deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle < -90 && this.angle >= -180){
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y+deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)+deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)-deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle > 0 && this.angle <= 90){
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y+deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)+deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)-deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle > 90 && this.angle <= 180){
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)-deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y+deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)+deltaY);
                        laser2.setScale(0.8);
                    }

                    this.scene.playerLasers.add(laser1);
                    this.scene.playerLasers.add(laser2);
                    this.scene.sfx.laser.play();
                    this.setData('timerShootTick', 0);

                }else if(localStorage.getItem("collected") >= 120){
                    var deltaX = 10;
                    var deltaY = 10;
                    if(this.angle < 0 && this.angle >= -90){
                        var laser0 = new PlayerLaser(this.scene, this.x, this.y, this.scene.reticle.x, this.scene.reticle.y);
                        laser0.setScale(0.8);
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)-deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y+deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)+deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle < -90 && this.angle >= -180){
                        var laser0 = new PlayerLaser(this.scene, this.x, this.y, this.scene.reticle.x, this.scene.reticle.y);
                        laser0.setScale(0.8);
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y+deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)+deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y-deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)-deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle > 0 && this.angle <= 90){
                        var laser0 = new PlayerLaser(this.scene, this.x, this.y, this.scene.reticle.x, this.scene.reticle.y);
                        laser0.setScale(0.8);
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y+deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)+deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y-deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)-deltaY);
                        laser2.setScale(0.8);
                    }else if(this.angle > 90 && this.angle <= 180){
                        var laser0 = new PlayerLaser(this.scene, this.x, this.y, this.scene.reticle.x, this.scene.reticle.y);
                        laser0.setScale(0.8);
                        var laser1 = new PlayerLaser(this.scene, this.x-deltaX, this.y-deltaY, (this.scene.reticle.x)-deltaX, (this.scene.reticle.y)-deltaY);
                        laser1.setScale(0.8);
                        var laser2 = new PlayerLaser(this.scene, this.x+deltaX, this.y+deltaY, (this.scene.reticle.x)+deltaX, (this.scene.reticle.y)+deltaY);
                        laser2.setScale(0.8);
                    }
                    
                    this.scene.playerLasers.add(laser0);
                    this.scene.playerLasers.add(laser1);
                    this.scene.playerLasers.add(laser2);
                    this.scene.sfx.laser.play();
                    this.setData('timerShootTick', 0);
                }
                
            }
        }       
    }

    onDestroy(){
        this.scene.time.addEvent({
            delay: 1000,
            callback: function(){
                game.input.mouse.releasePointerLock();
                this.scene.scene.start('SceneGameOver');
            },
            callbackScope: this, 
            loop: false
        });
    }

    playSound(){
        this.scene.sfx.laser.play();
    }
}

class PlayerLaser extends Entity{
    constructor(scene, x, y, reticleX, reticleY){
        super(scene, x, y, 'bullet');
        this.angle = this.scene.player.angle - 90;
        
        this.direction = Math.atan( (reticleY - y) / (reticleX - x));
        this.speedRatio = 800;
        if(reticleX <= x){
            this.body.velocity.x = -this.speedRatio*(Math.cos(this.direction));
            this.body.velocity.y = -this.speedRatio*(Math.sin(this.direction));
        }else{
            this.body.velocity.x = this.speedRatio*(Math.cos(this.direction));
            this.body.velocity.y = this.speedRatio*(Math.sin(this.direction));
        }
    }
}

class Reticle extends Entity{
    constructor(scene, x, y, key){
        super(scene, x, y, 'crosshair', 'Crosshair');
        
    }

    update(){
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
        
    }

    constrainReticle(reticle, player){
        var distX = reticle.x - player.x;
        var distY = reticle.y - player.y;

        if(distX > this.scene.game.config.width){
            reticle.x = player.x + this.scene.game.config.width;
        }else if(distX < -this.scene.game.config.width){
            reticle.x = player.x - this.scene.game.config.width;
        }

        if(distY > this.scene.game.config.height){
            reticle.y = player.y + this.scene.game.config.height;
        }else if(distY < -this.scene.game.config.height){
            reticle.y = player.y - this.scene.game.config.height;
        }
    }
}

class SpaceStation extends Entity{
    constructor(scene, x, y, key){
        super(scene, x, y, key, 'SpaceStation');
    }

    playSound(){
        this.scene.sfx.laser.play();
    }

    onDestroy2(){
        this.scene.time.addEvent({
            delay: 1000,
            callback: function(){
                game.input.mouse.releasePointerLock();
                this.scene.scene.start('SceneGameOver');
            },
            callbackScope: this, 
            loop: false
        });
    }
}

class ScrollingBackground{
    constructor(scene, key, velocityX){
        this.scene = scene;
        this.key = key;
        this.velocityX = velocityX;

        this.layers = this.scene.add.group();
        this.createLayers();
    }

    createLayers(){
        for(var i=0; i<10; i++){
            var layer = this.scene.add.sprite(0, this.scene.game.config.height*0.5, this.key);
            var flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            var flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
            layer.setScale(flipX*2, flipY*2);
            layer.setDepth(0.2);
            this.scene.physics.world.enableBody(layer, 0);
            layer.body.velocity.x = this.velocityX;

            this.layers.add(layer);
        }
    }

    update(){
        if(this.layers.getChildren()[0].x > 0){
            for(var i=0; i<this.layers.getChildren().length; i++){
                var layer = this.layers.getChildren()[i];
                layer.x = (-layer.displayWidth) + (layer.displayWidth*i);
            }
        }
    }
}

class Debris extends Entity{
    constructor(scene, x, y, key){
        super(scene, x, y, 'debris', 'Debris');
        this.states = {
            MOVE : 'MOVE',
            CHASE : 'CHASE'
        };
        this.state = this.states.MOVE;
    };

    attract(){
        this.state = this.states.CHASE;
        if(this.state == this.states.CHASE){
            var dx = this.scene.player.x - this.x;
            var dy = this.scene.player.y - this.y;

            var angle = Math.atan2(dy, dx);
            var speed = 1000;
            this.body.setVelocity(Math.cos(angle)*speed, Math.sin(angle)*speed);

            this.angle -= 5;
        }
    }

    update(){
        if(!this.getData('isDead') && this.scene.player){
            if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.circle.x, this.scene.circle.y) < 200){
                this.scene.graphicsCircle.lineStyle(2, 0xFF0000, 1);
            }
        }
    }
}

class Battery extends Entity{
    constructor(scene, x, y){
        super(scene, x, y, 'battery', 'Battery');
    }
}


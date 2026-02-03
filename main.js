let score = 0;
let scoreText;
let player;
let enemy;
let cursors;
let energy;

//////////////////// START SCENE ////////////////////

class StartScene extends Phaser.Scene {

    constructor(){
        super('StartScene');
    }

    create(){

        this.cameras.main.setBackgroundColor('#000');

        this.add.text(180,150,'CYBER HEIST',{
            fontSize:'64px',
            fill:'#00ffcc'
        });

        this.add.text(120,260,
            'A rogue AI controls the network.\n' +
            'You are the last hacker.\n' +
            'Collect energy cores.\nAvoid security drones.',
            {
                fontSize:'22px',
                fill:'#ffffff',
                align:'center'
            }
        );

        this.add.text(230,450,'Press ENTER to Start',{
            fontSize:'28px',
            fill:'#ffff00'
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });

    }
}

//////////////////// GAME SCENE ////////////////////

class GameScene extends Phaser.Scene {

    constructor(){
        super('GameScene');
    }

    preload(){

        this.load.image('player','https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.image('enemy','assets/enemy.png');
        this.load.image('background','assets/floor.jpg');
        this.load.image('energy','assets/energy.png');
        this.load.audio('collect','assets/audio/collect.mp3');
        this.load.audio('gameover','assets/audio/gameover.mp3');
        this.load.audio('win','assets/audio/win.mp3');


    }

    create(){

        // RESET SCORE
        score = 0;

        let bg = this.add.image(400,300,'background');
        bg.displayWidth = this.sys.game.config.width;
        bg.displayHeight = this.sys.game.config.height;
        bg.setDepth(-1);

        player = this.physics.add.sprite(400,300,'player');
        player.setCollideWorldBounds(true);

        this.physics.world.setBounds(0,0,800,600);

        cursors = this.input.keyboard.createCursorKeys();

        // ENEMY
        enemy = this.physics.add.sprite(100,100,'enemy');
        enemy.setVelocity(120,120);
        enemy.setBounce(1,1);
        enemy.setCollideWorldBounds(true);

        this.physics.add.collider(player, enemy, hitEnemy, null, this);

        // ENERGY
        energy = this.physics.add.sprite(600,400,'energy');
        energy.setCollideWorldBounds(true);

        this.physics.add.overlap(player, energy, collectEnergy, null, this);

        // SCORE UI
        scoreText = this.add.text(16,16,'Score: 0',{
            fontSize:'32px',
            fill:'#ffffff'
        });
        this.collectSound = this.sound.add('collect');
        this.gameoverSound = this.sound.add('gameover');
        this.winSound = this.sound.add('win');


    }

    update(){

        player.setVelocity(0);

        if (cursors.left.isDown){
            player.setVelocityX(-200);
        }
        else if (cursors.right.isDown){
            player.setVelocityX(200);
        }

        if (cursors.up.isDown){
            player.setVelocityY(-200);
        }
        else if (cursors.down.isDown){
            player.setVelocityY(200);
        }

    }

}

//////////////////// GAME FUNCTIONS ////////////////////

function collectEnergy(player, energy){
    this.collectSound.play();

    energy.disableBody(true,true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if(score >= 100){
        winGame.call(this);
        return;
    }

    setTimeout(() => {

        energy.enableBody(
            true,
            Math.random()*700+50,
            Math.random()*500+50,
            true,
            true
        );

    },1000);
}

function winGame(){
    this.winSound.play();

    this.physics.pause();

    player.setTint(0x00ff00);

    scoreText.setText("YOU WIN! 🎉");

    this.add.text(
        this.cameras.main.width/2 - 160,
        this.cameras.main.height/2 + 60,
        'Click to Restart',
        {
            fontSize:'28px',
            fill:'#ffffff'
        }
    );

    this.input.once('pointerdown', () => {
        this.scene.restart();
    });

}

function hitEnemy(){
    this.cameras.main.shake(500, 0.02);

    this.gameoverSound.play();

    this.physics.pause();

    player.setTint(0xff0000);

    this.add.text(
        this.cameras.main.width/2 - 180,
        this.cameras.main.height/2,
        'GAME OVER',
        {
            fontSize:'64px',
            fill:'#ff0000'
        }
    );

    this.add.text(
        this.cameras.main.width/2 - 160,
        this.cameras.main.height/2 + 80,
        'Click anywhere to restart',
        {
            fontSize:'24px',
            fill:'#ffffff'
        }
    );

    this.input.once('pointerdown', () => {
        this.scene.restart();
    });

}

//////////////////// GAME CONFIG ////////////////////

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#0a0a0a",
    physics: {
        default: 'arcade',
        arcade: { debug:false }
    },
    scene: [StartScene, GameScene]
};

new Phaser.Game(config);

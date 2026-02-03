let enemySpeed = 120;
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

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000');

        this.add.text(width/2, height*0.25,'CYBER HEIST',{
            fontSize:'64px',
            fill:'#00ffcc'
        }).setOrigin(0.5);

        this.add.text(width/2, height*0.45,
            'A rogue AI controls the network.\n' +
            'You are the last hacker.\n' +
            'Collect energy cores.\nAvoid security drones.',
            {
                fontSize:'22px',
                fill:'#ffffff',
                align:'center'
            }
        ).setOrigin(0.5);

        this.add.text(width/2, height*0.75,'Press ENTER to Start',{
            fontSize:'28px',
            fill:'#ffff00'
        }).setOrigin(0.5);

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

        const { width, height } = this.scale;

        // RESET VALUES
        score = 0;
        enemySpeed = 120;

        // BACKGROUND
        let bg = this.add.image(width/2, height/2,'background');
        bg.setDisplaySize(width, height);
        bg.setDepth(-1);

        // WORLD BOUNDS (responsive)
        this.physics.world.setBounds(0,0,width,height);

        // PLAYER
        player = this.physics.add.sprite(width/2, height/2,'player');

        player.setCollideWorldBounds(true);
        player.setScale(0.5); // adjust if needed

        cursors = this.input.keyboard.createCursorKeys();

        // ENEMY
        enemy = this.physics.add.sprite(100,100,'enemy');

        setEnemyVelocity();

        enemy.setBounce(1,1);
        enemy.setCollideWorldBounds(true);

        this.physics.add.collider(player, enemy, hitEnemy, null, this);

        // ENERGY
        energy = this.physics.add.sprite(width*0.75, height*0.7,'energy');
        energy.setCollideWorldBounds(true);

        this.physics.add.overlap(player, energy, collectEnergy, null, this);

        // SCORE
        scoreText = this.add.text(20,20,'Score: 0',{
            fontSize:'32px',
            fill:'#ffffff'
        });

        // SOUNDS
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

//////////////////// HELPER ////////////////////

function setEnemyVelocity(){

    let xSpeed = Phaser.Math.Between(enemySpeed * -1, enemySpeed);
    let ySpeed = Phaser.Math.Between(enemySpeed * -1, enemySpeed);

    // prevent enemy from barely moving
    if(Math.abs(xSpeed) < 40) xSpeed = enemySpeed;
    if(Math.abs(ySpeed) < 40) ySpeed = enemySpeed;

    enemy.setVelocity(xSpeed, ySpeed);
}

//////////////////// GAME FUNCTIONS ////////////////////

function collectEnergy(player, energy){

    this.collectSound.play();

    energy.disableBody(true,true);

    score += 10;
    scoreText.setText('Score: ' + score);

    // INCREASE DIFFICULTY
    enemySpeed += 12;
    setEnemyVelocity();

    if(score >= 100){
        winGame.call(this);
        return;
    }

    const { width, height } = this.scale;

    setTimeout(() => {

        energy.enableBody(
            true,
            Phaser.Math.Between(50, width-50),
            Phaser.Math.Between(50, height-50),
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

    const { width, height } = this.scale;

    this.add.text(width/2, height/2 + 60,
        'Click to Restart',
        {
            fontSize:'28px',
            fill:'#ffffff'
        }
    ).setOrigin(0.5);

    this.input.once('pointerdown', () => {
        this.scene.restart();
    });
}

function hitEnemy(){

    this.cameras.main.shake(500, 0.02);

    this.gameoverSound.play();

    this.physics.pause();

    player.setTint(0xff0000);

    const { width, height } = this.scale;

    this.add.text(width/2, height/2,
        'GAME OVER',
        {
            fontSize:'64px',
            fill:'#ff0000'
        }
    ).setOrigin(0.5);

    this.add.text(width/2, height/2 + 80,
        'Click anywhere to restart',
        {
            fontSize:'24px',
            fill:'#ffffff'
        }
    ).setOrigin(0.5);

    this.input.once('pointerdown', () => {
        this.scene.restart();
    });
}

//////////////////// GAME CONFIG ////////////////////

const config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },

    physics: {
        default: 'arcade',
        arcade: { debug:false }
    },

    scene: [StartScene, GameScene]
};

new Phaser.Game(config);

let score = 0;
let scoreText;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#0a0a0a",
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player;
let enemy;
let cursors;
let energy;

function preload() {

    this.load.image(
        'player',
        'https://labs.phaser.io/assets/sprites/phaser-dude.png'
    );
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/floor.jpg');
    this.load.image('energy', 'assets/energy.png');



}

function create() {
    let bg = this.add.image(400, 300, 'background');

    bg.displayWidth = this.sys.game.config.width;
    bg.displayHeight = this.sys.game.config.height;




    player = this.physics.add.sprite(400, 300, 'player');

    player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 800, 600);


    cursors = this.input.keyboard.createCursorKeys();
    enemy = this.physics.add.sprite(100, 100, 'enemy');

    enemy.setVelocity(120, 120);
    enemy.setBounce(1, 1);
    enemy.setCollideWorldBounds(true);
    energy = this.physics.add.sprite(600, 400, 'energy');
    energy.setCollideWorldBounds(true);
    this.physics.add.overlap(player, energy, collectEnergy, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#ffffff'
});


}

function update() {

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
function collectEnergy(player, energy){

    energy.disableBody(true, true);

    score += 10;

    scoreText.setText('Score: ' + score);

    setTimeout(() => {

        energy.enableBody(
            true,
            Math.random() * 700 + 50,
            Math.random() * 500 + 50,
            true,
            true
        );

    }, 1000);
    if(score >= 100){
    winGame.call(this);
}


}
function winGame(){

    this.physics.pause();

    player.setTint(0x00ff00);

    scoreText.setText("YOU WIN! 🎉");

}



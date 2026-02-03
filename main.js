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
let cursors;

function preload() {

    this.load.image(
        'player',
        'https://labs.phaser.io/assets/sprites/phaser-dude.png'
    );

}

function create() {

    player = this.physics.add.sprite(400, 300, 'player');

    cursors = this.input.keyboard.createCursorKeys();

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

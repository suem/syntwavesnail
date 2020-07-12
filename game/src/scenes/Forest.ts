import Phaser from 'phaser';

import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Sprite = Phaser.Physics.Arcade.Sprite;
import Image = Phaser.Physics.Arcade.Image;
import Rectangle = Phaser.GameObjects.Rectangle;
import BaseSound = Phaser.Sound.BaseSound;

const SONG = 'song';
const BLANK = 'blank';
const GROUND = 'ground';
const SUN = 'sun';
const SUN_SHIFTED_1 = 'sun_shifted_1';
const SUN_SHIFTED_2 = 'sun_shifted_2';
const SKY = 'sky';
const SNAIL = 'snail';
const SNAIL_MOVE = 'snail_move';

export default class Forest extends Phaser.Scene {

    snail?: Sprite;
    snailMove?: Phaser.Animations.Animation;
    ground?: Image;
    sunShifted1?: Image;
    sunShifted2?: Image;
    cursor?: CursorKeys;
    song?: BaseSound;

    constructor() {
        super('game-scene');
    }

    preload() {
        this.load.audio(SONG, 'assets/sound.mp3')
        this.load.image(SKY, 'assets/Sky.png');
        this.load.image(SUN, 'assets/Sun.png');
        this.load.image(SUN_SHIFTED_1, 'assets/Sun_shifted.png');
        this.load.image(SUN_SHIFTED_2, 'assets/Sun_shifted2.png');
        this.load.image(BLANK, 'assets/Blank.png');
        this.load.image(GROUND, 'assets/Ground.png');

        this.load.spritesheet(SNAIL, 'assets/Snail.png', { frameWidth: 104, frameHeight: 54 });
    }

    create() {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.add.image(0, 0, SKY).setOrigin(0, 0);
        this.sunShifted1 = this.physics.add.image(500, 50, SUN_SHIFTED_1).setOrigin(0, 0);
        this.sunShifted2 = this.physics.add.image(500, 50, SUN_SHIFTED_2).setOrigin(0, 0);

        this.createGround();
        this.createSnail();
        this.physics.add.collider(this.ground!, this.snail!)
        this.physics.add.collider(this.ground!, this.sunShifted1!)
        this.physics.add.collider(this.ground!, this.sunShifted2!)
        this.sunShifted1.setBounce(0.1)
        this.sunShifted2.setBounce(0.3)

        this.song = this.sound.add(SONG);
    }

    createGround() {
        this.ground = this.physics.add.staticImage(0, 670, BLANK).setOrigin(0, 0).setScale(2000).refreshBody();
        this.add.rectangle(0, 650, 1024, 50, 0x000).setOrigin(0, 0);
    }

    createSnail() {
        this.snail = this.physics.add.sprite(100, 500, SNAIL);
        this.snail.setCollideWorldBounds(true);

        const snailFrames = this.anims.generateFrameNumbers(SNAIL, { start: 0, end: 2 });

        const move = this.anims.create({
            key: SNAIL_MOVE,
            frameRate: 5,
            repeat: -1,
            frames: snailFrames
        });

        if (move) {
            this.snailMove = move;
        }

    }

    playSound(sound: BaseSound) {
        if (sound.isPaused) {
            sound.resume();
        } else if (!sound.isPlaying) {
            sound.play();
        }
    }

    pauseSound(sound: BaseSound) {
        if (sound.isPlaying) {
            sound.pause();
        }
    }

    update() {
        if (this.cursor == null ||
            this.song == null ||
            this.sunShifted1 == null ||
            this.sunShifted2 == null ||
            this.snail == null ||
            this.snailMove == null) {
            throw new Error("invalid game state");
        }

        if (this.cursor.right?.isDown) {
            this.snail.anims.play(SNAIL_MOVE, true);
            this.snailMove.resume();
            this.snail.flipX = false;
            this.snail.setVelocityX(20);
            this.sunShifted1.setVelocityX(-10);
            this.sunShifted2.setVelocityX(-8);
            this.playSound(this.song)
        } else if (this.cursor?.left?.isDown) {
            this.snail.anims.play(SNAIL_MOVE, true);
            this.snailMove.resume();
            this.snail.flipX = true;
            this.snail.setVelocityX(-20);
            this.sunShifted1.setVelocityX(10);
            this.sunShifted2.setVelocityX(8);

            this.playSound(this.song)
        } else {
            this.snailMove.pause();
            this.snail.setVelocityX(0);
            this.sunShifted1.setVelocityX(0);
            this.sunShifted2.setVelocityX(0);
            // this.pauseSound(this.song);
        }

    }

}
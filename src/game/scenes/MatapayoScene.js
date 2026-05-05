import { Input, Math as PhaserMath, Scene } from "phaser";

export class MatapayoScene extends Scene {
  constructor() {
    super("MatapayoScene");
  }

  preload() {
    this.load.setPath("assets");

    this.load.image("FONDO", "FONDO.png");
    this.load.image("PROTA_D", "PROTA D.png");
    this.load.image("PROTA_I", "PROTA I.png");
    this.load.image("PROTA_MEDIO", "PROTA MEDIO.png");
    this.load.image("PROTA_ATK", "PROTA ATK.png");
  }

  create() {
    const bg = this.add.image(0, 0, "FONDO").setOrigin(0);
    bg.setDisplaySize(this.scale.width, this.scale.height);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.sKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.S);

    this.player = this.add.sprite(100, 400, "PROTA_D");
    this.player.setScale(3);

    this.playerGroundX = 100;
    this.playerGroundY = 400;
    this.playerZ = 0;
    this.playerZVelocity = 0;
    this.isAttacking = false;

    this.anims.create({
      key: "walk",
      frames: [{ key: "PROTA_D" }, { key: "PROTA_I" }],
      frameRate: 6,
      repeat: -1,
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    const gravity = 600;
    const speed = 300;
    const airVerticalSpeed = 90;
    let moving = false;

    const isAirborne = this.playerZ > 0 || this.playerZVelocity > 0;
    const verticalSpeed = isAirborne ? airVerticalSpeed : speed;

    if (this.cursors.left.isDown) {
      this.playerGroundX -= speed * dt;
      this.player.setFlipX(true);
      moving = true;
    } else if (this.cursors.right.isDown) {
      this.playerGroundX += speed * dt;
      this.player.setFlipX(false);
      moving = true;
    }

    if (this.cursors.up.isDown) {
      this.playerGroundY -= verticalSpeed * dt;
      moving = true;
    } else if (this.cursors.down.isDown) {
      this.playerGroundY += verticalSpeed * dt;
      moving = true;
    }

    const halfWidth = (this.player.width * this.player.scaleX) / 2;
    const halfHeight = (this.player.height * this.player.scaleY) / 2;

    this.playerGroundX = PhaserMath.Clamp(
      this.playerGroundX,
      halfWidth,
      this.scale.width - halfWidth,
    );

    const minY = this.scale.height / 2 + halfHeight;
    const maxY = this.scale.height - halfHeight;

    this.playerGroundY = PhaserMath.Clamp(this.playerGroundY, minY, maxY);

    if (Input.Keyboard.JustDown(this.spaceKey) && this.playerZ === 0) {
      this.playerZVelocity = 400;
    }

    if (this.playerZ > 0 || this.playerZVelocity > 0) {
      this.playerZ += this.playerZVelocity * dt;
      this.playerZVelocity -= gravity * dt;

      if (this.playerZ <= 0) {
        this.playerZ = 0;
        this.playerZVelocity = 0;
      }
    }

    if (Input.Keyboard.JustDown(this.sKey) && !this.isAttacking) {
      this.isAttacking = true;
      this.player.stop();
      this.player.setTexture("PROTA_ATK");

      this.time.delayedCall(200, () => {
        this.isAttacking = false;
      });
    }

    this.player.x = this.playerGroundX;
    this.player.y = this.playerGroundY - this.playerZ;

    if (this.isAttacking) {
      return;
    }

    if (moving && this.playerZ === 0) {
      this.player.play("walk", true);
    } else {
      this.player.stop();
      this.player.setTexture("PROTA_D");
    }
  }
}

export default MatapayoScene;

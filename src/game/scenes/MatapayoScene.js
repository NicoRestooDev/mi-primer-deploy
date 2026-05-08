import { Input, Math as PhaserMath, Scene, Utils } from "phaser";

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

    this.load.image("CASA 1", "CASA 1.png");
    this.load.image("CASA 2", "CASA 2.png");
    this.load.image("CASA 3", "CASA 3.png");
    this.load.image("CASA 4", "CASA 4.png");
    this.load.image("CASA 5", "CASA 5.png");
  }

  createHouseStream() {
    this.houseKeys = ["CASA 1", "CASA 2", "CASA 3", "CASA 4", "CASA 5"];
    this.houses = [];
    this.lastHouseKey = null;
    this.houseY = 480;
    this.houseBaseSpeed = 30;
    this.houseSpeed = 5;
    this.houseGapMin = 1;
    this.houseGapMax = 3;

    let nextHouseX = 0;

    while (nextHouseX < this.scale.width + 80) {
      nextHouseX = this.spawnHouse(nextHouseX);
    }
  }

  getRandomHouseKey() {
    let nextKey = Utils.Array.GetRandom(this.houseKeys);

    while (this.houseKeys.length > 1 && nextKey === this.lastHouseKey) {
      nextKey = Utils.Array.GetRandom(this.houseKeys);
    }

    this.lastHouseKey = nextKey;

    return nextKey;
  }

  spawnHouse(x) {
    const key = this.getRandomHouseKey();
    const house = this.add.image(x, this.houseY, key).setOrigin(0, 1);
    house.setScale(3);
    house.setDepth(1);
    this.houses.push(house);

    return x + house.displayWidth + PhaserMath.Between(this.houseGapMin, this.houseGapMax);
  }

  spawnHouseFromLeft(rightEdge) {
    const key = this.getRandomHouseKey();
    const house = this.add.image(0, this.houseY, key).setOrigin(0, 1);
    house.setScale(3);
    house.setDepth(1);
    house.x = rightEdge - house.displayWidth;
    this.houses.unshift(house);
  }

  getHouseVelocityX(horizontalInput) {
    return -this.houseBaseSpeed + -horizontalInput * this.houseSpeed;
  }

  getPlayerScaleForDepth() {
    const depthRange = this.playerDepthBottomY - this.playerDepthTopY || 1;
    const depthRatio = PhaserMath.Clamp(
      (this.playerGroundY - this.playerDepthTopY) / depthRange,
      0,
      1,
    );
    const baseScale = PhaserMath.Linear(
      this.playerFarScale,
      this.playerBaseScale,
      depthRatio,
    );

    return this.isAttacking ? baseScale * this.attackScaleMultiplier : baseScale;
  }

  updateHouseStream(dt, horizontalInput) {
    const velocityX = this.getHouseVelocityX(horizontalInput);

    if (velocityX === 0) {
      return;
    }

    const worldDirection = velocityX < 0 ? -1 : 1;

    for (let i = this.houses.length - 1; i >= 0; i -= 1) {
      const house = this.houses[i];
      house.x += velocityX * dt;

      const isOffLeft = house.x + house.displayWidth < 0;
      const isOffRight = house.x > this.scale.width;

      if (isOffLeft || isOffRight) {
        house.destroy();
        this.houses.splice(i, 1);
      }
    }

    if (this.houses.length === 0) {
      if (worldDirection < 0) {
        this.spawnHouse(this.scale.width);
      } else {
        this.spawnHouseFromLeft(0);
      }
      return;
    }

    if (worldDirection < 0) {
      const lastHouse = this.houses[this.houses.length - 1];
      const lastHouseRightEdge = lastHouse.x + lastHouse.displayWidth;

      if (lastHouseRightEdge < this.scale.width + 20) {
        const nextHouseX =
          lastHouseRightEdge + PhaserMath.Between(this.houseGapMin, this.houseGapMax);

        this.spawnHouse(nextHouseX);
      }
    } else {
      const firstHouse = this.houses[0];

      if (firstHouse.x > -20) {
        const nextHouseRightEdge =
          firstHouse.x - PhaserMath.Between(this.houseGapMin, this.houseGapMax);

        this.spawnHouseFromLeft(nextHouseRightEdge);
      }
    }
  }

  create() {
    const bg = this.add.image(0, 0, "FONDO").setOrigin(0);
    bg.setDisplaySize(this.scale.width, this.scale.height);
    bg.setDepth(0);

    this.createHouseStream();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.sKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.S);

    this.player = this.add.sprite(100, 400, "PROTA_D");
    this.playerBaseScale = 3;
    this.playerFarScale = 2.3;
    this.attackScaleMultiplier = 0.9;
    this.player.setScale(this.playerBaseScale);

    this.playerGroundX = 100;
    this.playerGroundY = 400;
    this.playerZ = 0;
    this.playerZVelocity = 0;
    this.isAttacking = false;
    this.playerDepthTopY = this.scale.height / 2 + (this.player.height * this.playerBaseScale) / 2;
    this.playerDepthBottomY = this.scale.height - (this.player.height * this.playerBaseScale) / 2;

    this.shadow = this.add.ellipse(100,400,40,10,0x000000,0.25).setOrigin(-0.10, -0.10);
    this.shadow.setDepth(2);
    this.player.setDepth(3);

    this.hasBounced = false;
    this.landingBounceVelocity = 500;

    this.anims.create({
      key: "walk",
      frames: [{ key: "PROTA_D" }, { key: "PROTA_I" }],
      frameRate: 6,
      repeat: -1,
    });
  }

  update(_, delta) {
    const dt = delta / 1000;
    const gravity = 5000;
    const speed = 300;
    const airVerticalSpeed = 90;
    let moving = false;
    let horizontalInput = 0;

    const isAirborne = this.playerZ > 0 || this.playerZVelocity > 0;
    const verticalSpeed = isAirborne ? airVerticalSpeed : speed;

    if (this.cursors.left.isDown) {
      this.playerGroundX -= speed * dt;
      this.player.setFlipX(true);
      moving = true;
      horizontalInput = -1;
    } else if (this.cursors.right.isDown) {
      this.playerGroundX += speed * dt;
      this.player.setFlipX(false);
      moving = true;
      horizontalInput = 1;
    }

    if (this.cursors.up.isDown) {
      this.playerGroundY -= verticalSpeed * dt;
      moving = true;
    } else if (this.cursors.down.isDown) {
      this.playerGroundY += verticalSpeed * dt;
      moving = true;
    }

    if (horizontalInput === 0) {
      this.playerGroundX += this.getHouseVelocityX(0) * dt;
    }

    this.updateHouseStream(dt, horizontalInput);

    let playerScale = this.getPlayerScaleForDepth();
    let halfWidth = (this.player.width * playerScale) / 2;
    let halfHeight = (this.player.height * playerScale) / 2;

    this.playerGroundX = PhaserMath.Clamp(
      this.playerGroundX,
      halfWidth,
      this.scale.width - halfWidth,
    );

    const minY = this.scale.height / 1.8 + halfHeight;
    const maxY = this.scale.height - halfHeight;

    this.playerGroundY = PhaserMath.Clamp(this.playerGroundY, minY, maxY);
    playerScale = this.getPlayerScaleForDepth();
    halfWidth = (this.player.width * playerScale) / 2;
    halfHeight = (this.player.height * playerScale) / 2;
    this.playerGroundX = PhaserMath.Clamp(
      this.playerGroundX,
      halfWidth,
      this.scale.width - halfWidth,
    );
    this.player.setScale(playerScale);
    
    this.shadow.x = this.playerGroundX;
    this.shadow.y = this.playerGroundY+70;

    const jumpRatio = PhaserMath.Clamp(this.playerZ / 180,0,1);
    this.shadow.setScale (1+jumpRatio);
    this.shadow.setAlpha(0.7-jumpRatio*0.8);

    if (Input.Keyboard.JustDown(this.spaceKey) && this.playerZ === 0) {
      this.playerZVelocity = 1300;
      this.hasBounced = false;
    }

    if (this.playerZ > 0 || this.playerZVelocity > 0) {
      this.playerZ += this.playerZVelocity * dt * 0.7;
      this.playerZVelocity -= gravity * dt;

      if (this.playerZ <= 0) {
        this.playerZ = 0;
        this.playerZVelocity = 0;

        if (this.playerZ <= 0) {
          this.playerZ = 0;

          if (!this.hasBounced) {
            this.playerZVelocity = this.landingBounceVelocity;
            this.hasBounced = true;
          } else {
            this.playerZVelocity = 0;
            this.hasBounced = false;
        }
}

      }
    }

    if (Input.Keyboard.JustDown(this.sKey) && !this.isAttacking) {
      this.isAttacking = true;
      this.player.stop();
      this.player.setTexture("PROTA_ATK");
      this.player.setScale(this.getPlayerScaleForDepth());

      this.time.delayedCall(90, () => {
        this.isAttacking = false;
        this.player.setScale(this.getPlayerScaleForDepth());
      });
    }

    this.player.x = this.playerGroundX;
    this.player.y = this.playerGroundY - this.playerZ;

    const footOffsetY = (this.player.height * this.player.scaleY) / 2 - 6;
    const footOffsetX = this.player.flipX ? -35 : -15;

    this.shadow.setPosition(
      this.player.x + footOffsetX,
      this.playerGroundY + footOffsetY
    );

    if (this.isAttacking) {
      return;
    }

    if (moving && this.playerZ === 0) {
      this.player.play("walk", true);
    } else {
      this.player.stop();
      this.player.setTexture("PROTA_MEDIO");
    }
  }
}

export default MatapayoScene;

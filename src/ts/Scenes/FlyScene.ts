import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import MainSettings from "./MainSettings";

export default class FlyScene extends Phaser.Scene {
	music: Phaser.Sound.BaseSound;
	alreadyPlayignMusic = false
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainMenu";

	
	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");
		
		const isCellPhone = false

		if(!isCellPhone){
			document.querySelector("canvas").style.cursor = "none";
		}
		// 
		const allFlys = [];
		let finger: Phaser.GameObjects.Image = undefined;		 

		const checkIfAllFlysAreGone = () => {
			if(allFlys.length === 0) {
				this.scene.start(FlyScene.Name)
			}
		}

		const createSprite = () => {
			const middle = {
				x: this.cameras.main.centerX,
				y: this.cameras.main.centerY
			}
			
			const randomPointBetween = (a,b) => Phaser.Math.Between(a, b)
			const possibleFlies = ["fly1","fly2"]
			const randomFly = possibleFlies[Phaser.Math.Between(0, possibleFlies.length - 1)]
			const sprite = this.physics.add.sprite(
				randomPointBetween(0, middle.x * 2),
				randomPointBetween(0, middle.y * 2),
				randomFly, 0);
			sprite.setScale(Number("0.0" + randomPointBetween(2,8)))
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			sprite.isFly = true
			sprite.body.setVelocity(
				randomPointBetween(-200, 200),
				randomPointBetween(-200, 200)
			)
			sprite.body.setBounce(1,1)
			sprite.body.setCollideWorldBounds(true)
			sprite.body.checkWorldBounds()
			sprite.body.onWorldBounds = true

			// create bigger hit area
			const newHitArea = new Phaser.Geom.Rectangle(0, 0, sprite.width * 3, sprite.height * 3)
			sprite.setInteractive(newHitArea, Phaser.Geom.Rectangle.Contains)
			sprite.on("pointerdown", () => {
				sprite.destroy()
				// remove sprite from allFlys
				if(isCellPhone) {
					finger.setAlpha(0)
					finger.x = sprite.x
					finger.y = sprite.y
					this.tweens.add({
						targets: finger,
						alpha: 1,
						duration: 200,
						yoyo: true,
						repeat: 0
					})
				}
				allFlys.splice(allFlys.indexOf(sprite), 1)
				checkIfAllFlysAreGone()
			})

			allFlys.push(sprite)
		}

		for (let index = 0; index < 15; index++) {
			createSprite()
		}
		
		this.physics.world.on('worldbounds', (collision) => {
			const sprite = collision.gameObject
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if(sprite && sprite.isFly) {
				const newAngle = (new Phaser.Math.Vector2(sprite.body.velocity)).angle();
				sprite.setRotation(Phaser.Math.Angle.Reverse(newAngle));
			} 
		});

		const createFinger = () => {
			const finger = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "finger");
			finger.setScale(1.5)
			finger.setOrigin(0.5, 0)
			if(isCellPhone) finger.setAlpha(0)
			else {
				this.tweens.add({
					targets: finger,
					scale: 0.6,
					duration: 1500,
					yoyo: true,
					repeat: -1
				})
			}
			if(!isCellPhone) {
				this.input.on('pointermove', (pointer) => {
					finger.x = pointer.x
					finger.y = pointer.y
				})
			}
			return finger
		}
		finger = createFinger()		
	}

	public update(): void {

		// Update logic, as needed.
	}
}

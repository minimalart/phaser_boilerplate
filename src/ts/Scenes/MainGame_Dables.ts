import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import MainSettings from "./MainSettings";

export default class MainMenu extends Phaser.Scene {
	music: Phaser.Sound.BaseSound;
	alreadyPlayignMusic = false
	mainCard: Phaser.GameObjects.Container;
	nextArrow: Phaser.GameObjects.Sprite;
	prevArrow: Phaser.GameObjects.Sprite;
	canRotate = true;

	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainGame";
	
	public preload(): void {
		// Preload as needed.
	}

	public createArrows () {
		this.nextArrow = this.add.sprite(this.cameras.main.centerX + 170,this.cameras.main.height - 70, "animated_arrow", 0).setOrigin(0.5).setScale(3)
		this.nextArrow.setInteractive()
		this.nextArrow.on("pointerdown", () => {
			if(this.canRotate && this.mainCard) {
				this.canRotate = false;
				this.tweens.add({
					targets: this.mainCard,
					props: { angle: this.mainCard.angle + 60 },
					ease: 'Bounce',
					duration: 300,
					repeat: 0,
					yoyo: false,
					onComplete: () => {
						this.canRotate = true;
					}
				});
			}
		});

		this.prevArrow = this.add.sprite(this.cameras.main.centerX - 170,this.cameras.main.height - 70, "animated_arrow", 0).setOrigin(0.5).setRotation(Math.PI).setScale(3)
		this.prevArrow.setInteractive()
		this.prevArrow.on("pointerdown", () => {
			if(this.canRotate && this.mainCard) {
				this.canRotate = false;
				this.tweens.add({
					targets: this.mainCard,
					props: { angle: this.mainCard.angle - 60 },
					ease: 'Bounce',
					duration: 300,
					repeat: 0,
					yoyo: false,
					onComplete: () => {
						this.canRotate = true;
					}
				});
			}
		});

		this.anims.create({
			key: 'arrow',
			frames: this.anims.generateFrameNumbers('animated_arrow', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.nextArrow.play('arrow');
		this.prevArrow.play('arrow');

	}

	public createCard() {
		const MainCard = this.add.container(
			this.cameras.main.centerX,
			this.cameras.main.height + 400
		)
		const card = this.add.image(0,0, "dables_card", 0).setScale(0.6).setOrigin(0.5)
		MainCard.add(card)

		const sprite = this.add.image(0,-100, "diamonds", 0).setScale(2).setOrigin(0.5);
		MainCard.add(sprite)

		const tween = this.tweens.add({
			targets: MainCard,
			y: this.cameras.main.height,
			ease: 'Bounce',
			duration: 600,
			repeat: 0,
			yoyo: false
		});

		return MainCard;
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");
		
		this.mainCard = this.createCard();
		this.createArrows();
		// const sprite = this.add.image(this.cameras.main.centerX,this.cameras.main.centerY, "diamonds", 0);
		// sprite.setScale(2)

		// const possibilities = [1,2,3,4,5,6,7,8,9,10,11,12]
		// const cards = []
		// const card = [1,6,2,12]
		// cards.push(card)

		// for (let index = 1; index < 8; index++) {
		// 	const preCard = cards[index - 1]
		// 	const p = Phaser.Math.Between(0, preCard.length - 1);

		// 	// get 3 more from possibilities array
		// 	const randoms = []
		// 	for (let k = 0; k < 3; k++) {
		// 		const p = Phaser.Math.Between(0, possibilities.length - 1);
		// 		randoms.push(possibilities[p])
		// 		// possibilities.splice(random, 1)
		// 	}

		// 	cards.push([preCard[p],...randoms])
		// }
		// console.log("cards",cards)
	}

	public update(): void {

		// Update logic, as needed.
	}
}

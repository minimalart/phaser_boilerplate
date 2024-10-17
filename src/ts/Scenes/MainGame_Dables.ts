import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import MainSettings from "./MainSettings";

export default class MainMenu extends Phaser.Scene {
	music: Phaser.Sound.BaseSound;
	alreadyPlayignMusic = false
	mainCard: Phaser.GameObjects.Container;
	baseCard: Phaser.GameObjects.Container;
	nextArrow: Phaser.GameObjects.Sprite;
	prevArrow: Phaser.GameObjects.Sprite;
	canRotate = true;
	allPossibilities = [0,1,2,3,4,5,6,7,8,9,10,11]

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

	public handleClick(element,card: Phaser.GameObjects.Container){
		const possibilities = this.grabPossibilities(this.baseCard);
		const exist = possibilities.filter(o => o.frame == element.frame.name).length;
		if(exist) {
			this.tweens.add({
				targets: card,
				x: this.baseCard.x,
				y: this.baseCard.y,
				ease: 'Bounce',
				duration: 300,
				repeat: 0,
				yoyo: false,
				onComplete: () => {
					this.baseCard = card;
					card.list.map((o: Phaser.GameObjects.Sprite) => o.disableInteractive())
					this.mainCard = this.createCard(true);
				}
			});
			
		}
		

	}

	public randomRotation(sprite) {
		const randomAngle = Phaser.Math.Between(0, 360);
		sprite.angle = randomAngle;
	}

	public changeScale(options) {
		const max = 0.5
		const min = 0.2
		options.map(o => {
			const randomScale = Phaser.Math.FloatBetween(min, max)
			o.setScale(randomScale)
		})

	}

	public createCard(isplayable = false) {
		const MainCard = this.add.container(
			this.cameras.main.centerX,
			isplayable? this.cameras.main.height + 400 : this.cameras.main.centerY
		)
		const card = this.add.image(0,0, "dables_card", 0).setScale(0.6).setOrigin(0.5)
		MainCard.add(card)

		const spriteA = this.add.image(0,-80, "dables_images", 0).setScale(0.5).setOrigin(0.5);
		const spriteB = this.add.image(0,80, "dables_images", 1).setScale(0.5).setOrigin(0.5);
		const spriteC = this.add.image(80,0, "dables_images", 2).setScale(0.5).setOrigin(0.5);
		const spriteD = this.add.image(-80,0, "dables_images", 3).setScale(0.5).setOrigin(0.5);
		
		MainCard.add([spriteA,spriteB,spriteC,spriteD])

		if(isplayable) {
			const tween = this.tweens.add({
				targets: MainCard,
				y: this.cameras.main.height,
				ease: 'Bounce',
				duration: 600,
				repeat: 0,
				yoyo: false
			});
			const options = [spriteA,spriteB,spriteC,spriteD]
			this.changeScale(options)
			for (let index = 0; index < options.length; index++) {
				const element = options[index];
				element.setInteractive()
				element.on("pointerdown", () => {
					this.handleClick(element, MainCard)
				})
				this.randomRotation(element)
			}

			this.randomRotation(MainCard)


			if(this.baseCard){
				const possibilities = this.grabPossibilities(this.baseCard);
				const newPosibilities = [...this.allPossibilities];
				//remove all possibilities that are in the base card
				
				possibilities.map(o => {
					const index = newPosibilities.indexOf(parseInt(o.frame))
					if(index !== -1) newPosibilities.splice(index, 1)
				})

				// select only one random
				const random = Phaser.Math.Between(0, possibilities.length -1);
				for (let index = 1; index < MainCard.list.length; index++) {
					if(index == 1) {
						(MainCard.list[index] as Phaser.GameObjects.Sprite).setFrame(possibilities[random].frame)
					} else if (index > 1) {
						const random2 = Phaser.Math.Between(0, newPosibilities.length - 1);
						(MainCard.list[index] as Phaser.GameObjects.Sprite).setFrame(newPosibilities[random2])
						//REMOVE USED POSSIBILITIE FROM NEWPOSSIBILITIES
						newPosibilities.splice(random2, 1)
					}

				}
			}
			
		}

		return MainCard;
	}

	public grabPossibilities(card) {
		const possibilities = card.list.map((o: Phaser.GameObjects.Image) => ({ key: o.texture.key, frame: o.frame.name })).filter(o => o.key === "dables_images")
		return possibilities;
	}

	public grabItemsInCard(card) {
		const possibilities = [...card.list].filter(o => o.texture.key === "dables_images")
		return possibilities;
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");
		
		this.baseCard = this.createCard();
		this.mainCard = this.createCard(true);


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

import Utilities from "../Utilities";
import MainGame from "./MainGame_Memo";
import MainSettings from "./MainSettings";

export default class MainMenu extends Phaser.Scene {
	music: Phaser.Sound.BaseSound;
	alreadyPlayignMusic = false
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainMenu";

	public init(){
		this.game.config.audio.disableWebAudio = true;
		this.game.config.audio.disableWebAudio = false;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.game.soundManager = Phaser.Sound.SoundManagerCreator.create(this.game)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		this.music = this.game.soundManager;
		this.game.sound.mute = false;
	}

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");
		
		if(!this.alreadyPlayignMusic) {
			this.alreadyPlayignMusic = true;
			this.music.play("music",{
				volume: 0.1,
				loop: true
			});
		}

		const background = this.add.image(this.cameras.main.centerX,0, "background");
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height
		if((this.cameras.main.width / background.width) > baseScale) baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale)

		const soundBtn = this.add.image(35, 55, "sound_on").setScale(0.5);
		soundBtn.setOrigin(0.5, 0.5);
		soundBtn.setInteractive();
		soundBtn.on("pointerdown", () => {
			const newMuteValue = !this.game.sound.mute;
			this.game.sound.mute = newMuteValue
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			this.music.setMute(newMuteValue)
			soundBtn.setTexture(newMuteValue ? "sound_off" : "sound_on");
		}, this);


		const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "logo").setScale(0);
		logo.setOrigin(0.5, 0);

		const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 1.2, "play").setScale(0).setTint(0x555555);

		this.tweens.add({
			targets: logo,
			scale: 1,
			delay:0,
			duration: 600,
			ease: "Bounce.easeOut"
		});

		this.tweens.add({
			targets: playButton,
			scale: 1,
			delay:200,
			duration: 600,
			ease: "Bounce.easeOut"
		});
		

		playButton.setOrigin(0.5, 0.5);
		playButton.setInteractive();
		playButton.on("pointerover", () => { playButton.setTint(0x55AA55); }, this);
		playButton.on("pointerout", () => { playButton.setTint(0x555555); }, this);
		playButton.on("pointerdown", () => { this.scene.start(MainGame.Name); }, this);

		const powerBy = this.add.image(this.cameras.main.centerX * 2, (this.cameras.main.centerY * 2), "powerBySvg");
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		powerBy.setOrigin(1, 1);


		// Test Logic
		const numberPerCard = 4;
		const baseCards = 3;
		const cards = [];
		let lastNumber = 0;
		
		for (let i = 0; i < baseCards; i++) {
			const card = [];
			for (let k = 0; k < numberPerCard; k++) {
				let plus = 1;
				if(i > 0) plus = plus - i
				const number = (k + plus) + (i*numberPerCard)
				card.push(number)
				if(lastNumber < number ) lastNumber = number;
				const isLastNumberOnLastCard = i === baseCards - 1 && k === numberPerCard - 1;
				if(isLastNumberOnLastCard) card[card.length - 1] = 1
			}
			cards.push(card)
		}
		
		const newNumber = lastNumber;
		for (let i = 0; i < numberPerCard -2 ; i++) {
			const card = [];
			
			for (let k = 0; k < baseCards; k++) {
				card.push(cards[k][i+1])
			}
			card.push(newNumber)
			for (let k = (baseCards); k < numberPerCard - 1 ; k++) {
				lastNumber++;
				card.push(lastNumber)
			}
			cards.push(card)
		}

		const newCard = [newNumber]
		for (let i = 0; i < baseCards; i++) {
			newCard.push(cards[i][0])
		}
		while(newCard.length < numberPerCard){
			lastNumber++;
			newCard.push(lastNumber)
		}
		cards.push(newCard)

		if(numberPerCard > baseCards * 2){
			const tempCards = [...cards].map(_ => _.reverse())
			for (let i = 0; i < numberPerCard -2 ; i++) {
				const card = [];
				
				for (let k = 0; k < baseCards; k++) {
					card.push(tempCards[k][i+1])
				}
				card.push(newNumber)
				while(card.length < numberPerCard){
					lastNumber++;
					card.push(lastNumber)
				}
				cards.push(card)
			}
		}
		// const sharedNumbers = []
		// for (let i = 0; i < numberPerCard; i++) {
		// 	const numbers = []
		// 	for (let k = 0; k < cards.length; k++) {
		// 		const number = cards[k][i]
		// 		if(numbers.indexOf(number) === -1) numbers.push(number)
		// 	}
		// 	sharedNumbers.push(numbers)
		// }
		// console.log("sharedNumbers",sharedNumbers)

		console.log("cards",cards)


	}

	public update(): void {
		// Update logic, as needed.
	}
}

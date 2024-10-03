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

	
	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainMenu", "create");
		
		const sprite = this.add.image(this.cameras.main.centerX,this.cameras.main.centerY, "diamonds", 0);
		sprite.setScale(2)

		const possibilities = [1,2,3,4,5,6,7,8,9,10,11,12]
		const cards = []
		const card = [1,6,2,12]
		cards.push(card)

		for (let index = 1; index < 8; index++) {
			const preCard = cards[index - 1]
			const p = Phaser.Math.Between(0, preCard.length - 1);

			// get 3 more from possibilities array
			const randoms = []
			for (let k = 0; k < 3; k++) {
				const p = Phaser.Math.Between(0, possibilities.length - 1);
				randoms.push(possibilities[p])
				// possibilities.splice(random, 1)
			}

			cards.push([preCard[p],...randoms])
		}
		console.log("cards",cards)
	}

	public update(): void {

		// Update logic, as needed.
	}
}

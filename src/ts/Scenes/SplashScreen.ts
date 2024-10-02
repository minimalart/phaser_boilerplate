import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "SplashScreen";

	public preload(): void {
		this.load.path = "assets/";
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("SplashScreen", "create");

		// const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY * 0.5, "ChocoJewel")
		// 	.setOrigin(0.5, 0)
		// 	.setFontFamily("monospace").setFontSize(26).setFill("#fff");

		// const poweredByText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 25, "Powered By");
		// poweredByText.setOrigin(0.5, 0.5);
		// poweredByText.setFontFamily("monospace").setFontSize(20).setFill("#fff");
		// this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "phaser_pixel_medium_flat");

		// this.input.setDefaultCursor("pointer");
		// this.input.on("pointerdown", this.loadMainMenu, this);

		const background = this.add.image(this.cameras.main.centerX,0, "background");
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height
		if((this.cameras.main.width / background.width) > baseScale) baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale)

		const powerBy = this.add.image(this.cameras.main.centerX * 2, (this.cameras.main.centerY * 2), "powerBySvg");
		
		powerBy.setOrigin(1, 1);
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		this.time.addEvent({
			// Run after three seconds.
			delay: 1000,
			callback: this.loadMainMenu,
			callbackScope: this,
			loop: false
		});
	}

	/**
	 * Load the next scene, the main menu.
	 */
	private loadMainMenu(): void {
		this.scene.start(MainMenu.Name);
	}
}

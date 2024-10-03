import SplashScreen from "./SplashScreen";
import Utilities from "../Utilities";

export default class Preloader extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "Preloader";

	public preload(): void {
		this.addProgressBar();

		this.load.path = "assets/";
		this.load.spritesheet('diamonds', 'diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });

		this.load.spritesheet("cards", "spritesheet_cards_2x_new.png", { frameWidth: 58 * 2, frameHeight: 58 * 2 });

		this.load.image("progress_frame", "progress_bar_frame.png");
		
		this.load.image("progress_bar", "progress_bar_full.png");
		this.load.image("powerBy", "powerBy_3x.png");
		this.load.svg("powerBySvg", "powerBy400x30.svg", {width:400, height:30, scale: 1});

		this.load.image("phaser_pixel_medium_flat");
		this.load.image("background", "background.png");
		
		this.load.image("sound_off", "sound_off.png");
		this.load.image("sound_on", "sound_on.png");
		
		this.load.image("score", "frame-score.png");

		this.load.image("logo", "logo-home.png");	
		this.load.image("play", "play.png");	
		this.load.image("reset", "reset_2x.png");	
		this.load.image("Phaser-Logo-Small");

		this.load.audio("music", "music.mp3");
		this.load.audio("coinsplash", "coinsplash.mp3");
		this.load.audio("cardFlip", "cardFlip.wav");
		

		// You should remove this logic; this is only included here to show off the progress bar.

	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Preloader", "create");

		this.scene.start(SplashScreen.Name);

		const background = this.add.image(this.cameras.main.centerX,0, "background");
		background.setOrigin(0.5, 0);
		background.setScale(this.cameras.main.width / background.width);
		let baseScale = this.cameras.main.height / background.height
		if((this.cameras.main.width / background.width) > baseScale) baseScale = this.cameras.main.width / background.width;
		background.setScale(baseScale)

		const powerBy = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY * 2, "powerBy");
		powerBy.setInteractive();
		powerBy.on("pointerdown", () => {
			if(window) window.open("https://minimalart.co/", "_blank");
		});
		powerBy.setOrigin(0.5, 1).setScale(1.15 / 3);
	}

	public update(): void {
		// preload handles updates to the progress bar, so nothing should be needed here.
	}

	/**
	 * Adds a progress bar to the display, showing the percentage of assets loaded and their name.
	 */
	private addProgressBar(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		/** Customizable. This text color will be used around the progress bar. */
		const outerTextColor = '#ffffff';

		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x009FAF, 0.8);
		progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
		
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: "Cargando",
			style: {
				font: "20px montserrat",
				color: "#E2D64B"
			}
		});
		loadingText.setOrigin(0.5, 0.5);

		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: "0%",
			style: {
				font: "18px montserrat",
				color: "#E2D64B"
			}
		});
		percentText.setOrigin(0.5, 0.5);

		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 50,
			text: "",
			style: {
				font: "18px monospace",
				color: outerTextColor
			}
		});

		assetText.setOrigin(0.5, 0.5);

		this.load.on("progress", (value: number) => {
			percentText.setText(parseInt(value * 100 + "", 10) + "%");
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect((width / 4) + 10, (height / 2) - 30 + 10, (width / 2 - 10 - 10) * value, 30);
		});

		// this.load.on("fileprogress", (file: Phaser.Loader.File) => {
		// 	assetText.setText("Loading asset: " + file.key);
		// });

		this.load.on("complete", () => {
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();
			percentText.destroy();
			assetText.destroy();
		});
	}
}

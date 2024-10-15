import 'phaser';
import Boot from "./Scenes/Boot";
import Preloader from "./Scenes/Preloader";
import MainMenu from "./Scenes/MainMenu";
import MainGameDables from "./Scenes/MainGame_Dables";
import SplashScreen from "./Scenes/SplashScreen";
import Utilities from "./Utilities";
import MainGameJewel from "./Scenes/MainGame_Jewel";
import MainGameMemo from "./Scenes/MainGame_Memo";
import MainSettings from "./Scenes/MainSettings";

const gameConfig: Phaser.Types.Core.GameConfig = {
	width: 460 > window.innerWidth ? window.innerWidth : 460,
	height: window.innerHeight,
	type: Phaser.AUTO,
	transparent: true,
	parent: "content",
	title: "Juego de Memotest para Saphirus"
};

export default class Game extends Phaser.Game {
	constructor(config: Phaser.Types.Core.GameConfig) {
		Utilities.LogSceneMethodEntry("Game", "constructor");

		super(config);

		// this.scene.add(Boot.Name, Boot);
		this.scene.add(Preloader.Name, Preloader);
		this.scene.add(SplashScreen.Name, SplashScreen);
		this.scene.add(MainMenu.Name, MainMenu);
		
		// this.scene.add(MainGameJewel.Name, MainGameJewel);
		// this.scene.add(MainGameMemo.Name, MainGameMemo);
		this.scene.add(MainGameDables.Name, MainGameDables);

		this.scene.add(MainSettings.Name, MainSettings);
		this.scene.start(Preloader.Name);
		
	}
}

/**
 * Workaround for inability to scale in Phaser 3.
 * From http://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
 */

function resize(game: Game): void {
	// const canvas = document.querySelector("canvas");
	// canvas.style.width = width + "px";
	// canvas.style.height = height + "px";
	// setTimeout(() => {
		
	// },1000)

	let width = 460;
	if (width > window.innerWidth) {
		width = window.innerWidth;
	}
	const height = window.innerHeight;

	if(game) {
		game.scale.resize(width, height);
		game.renderer.resize(width, height);
		game.renderer.resize(width, height);
		game.scene.scenes.forEach((scene) => {	
			if(scene.cameras.main && scene.scene.isActive()) {
				// console.log("scene", scene.scene.key, scene.scene.isActive());
				scene.cameras.main.setViewport(0, 0, width, height);
				scene.cameras.main.setZoom(1);
				game.scale.refresh();
				scene.cameras.main.flash(1000);
				scene.scene.stop();
				scene.scene.start();
			}
		});
	}

	// const wratio = width / height;
	// const ratio = Number(gameConfig.width) / Number(gameConfig.height);
	// if (wratio < ratio) {
	// 	canvas.style.width = width + "px";
	// 	canvas.style.height = (width / ratio) + "px";
	// } else {
	// 	canvas.style.width = (height * ratio) + "px";
	// 	canvas.style.height = height + "px";
	// }
}

window.onload = (): void => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const game = new Game(gameConfig);
	// Uncomment the following two lines if you want the game to scale to fill the entire page, but keep the game ratio.
	resize(game);
	window.addEventListener("resize", () => resize(game), true);
	
};

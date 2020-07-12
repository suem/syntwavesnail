import Phaser from 'phaser'

import Forest from './scenes/Forest'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1023,
	height: 700,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Forest]
}

export default new Phaser.Game(config)

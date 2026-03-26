/**
 * Precipitation.js - Procedural rain and snow effects
 * @module objects/weather/Precipitation
 */
'use strict'

class Precipitation {
    /**
     * Create Precipitation instance
     * @param {Phaser.Game} game - Phaser game instance
     */
    constructor(game) {
        this.game = game

        this.rainSprite = null
        this.snowSprite = null
        this.currentType = 0 // 0=none, 2=rain, 4=snow

        this.precipGroup = game.add.group()
        this.precipGroup.fixedToCamera = true
    }

    /**
     * Initialize textures if they don't exist
     */
    _ensureTextures() {
        if (!this.game.cache.checkImageKey('precip_rain')) {
            const bmd = this.game.make.bitmapData(32, 32)
            bmd.context.fillStyle = 'rgba(200, 200, 255, 0.6)'
            // Draw some rain drops
            for (let i = 0; i < 10; i++) {
                bmd.context.fillRect(Math.random() * 32, Math.random() * 32, 1, 4)
            }
            this.game.cache.addSpriteSheet('precip_rain', null, bmd.canvas, 32, 32)
        }

        if (!this.game.cache.checkImageKey('precip_snow')) {
            const bmd = this.game.make.bitmapData(64, 64)
            bmd.context.fillStyle = 'rgba(255, 255, 255, 0.8)'
            // Draw some snow flakes
            for (let i = 0; i < 15; i++) {
                bmd.context.fillRect(Math.random() * 64, Math.random() * 64, 2, 2)
            }
            this.game.cache.addSpriteSheet('precip_snow', null, bmd.canvas, 64, 64)
        }
    }

    /**
     * Update precipitation state based on weather type
     * @param {number} weatherType - Current weather (1=clear, 2=cloudy/rain, 3=windy, 4=storm/snow)
     */
    update(weatherType) {
        this._ensureTextures()

        // Map weather types to precipitation
        // 1=Overwegend zonnig (Clear) -> None
        // 2=Wisselend bewolkt (Cloudy/Rain) -> Rain
        // 3=Stormachtig (Windy) -> None/Wind
        // 4=Sneeuw (Snow) -> Snow

        let type = 0
        if (weatherType === 2) type = 2
        if (weatherType === 4) type = 4

        if (this.currentType !== type) {
            this._transitionTo(type)
        }

        this._animate()
    }

    _transitionTo(type) {
        console.log('[Precipitation] Transition to type', type)
        this.currentType = type

        if (this.rainSprite) this.rainSprite.visible = (type === 2)
        if (this.snowSprite) this.snowSprite.visible = (type === 4)

        if (type === 2 && !this.rainSprite) {
            this.rainSprite = this.game.add.tileSprite(0, 0, 640, 480, 'precip_rain', null, this.precipGroup)
            this.rainSprite.alpha = 0
            this.game.add.tween(this.rainSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true)
        }

        if (type === 4 && !this.snowSprite) {
            this.snowSprite = this.game.add.tileSprite(0, 0, 640, 480, 'precip_snow', null, this.precipGroup)
            this.snowSprite.alpha = 0
            this.game.add.tween(this.snowSprite).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true)
        }
    }

    _animate() {
        if (this.currentType === 2 && this.rainSprite) {
            this.rainSprite.tilePosition.y += 10
            this.rainSprite.tilePosition.x -= 2
        }
        if (this.currentType === 4 && this.snowSprite) {
            this.snowSprite.tilePosition.y += 2
            this.snowSprite.tilePosition.x += Math.sin(this.game.time.now / 500) * 1
        }
    }

    /**
     * Kill precipitation effects
     */
    kill() {
        if (this.precipGroup) {
            this.precipGroup.destroy()
        }
        this.rainSprite = null
        this.snowSprite = null
    }
}

export default Precipitation

var Sounds = {
    Game: null,

    setGame: function (game) {
        this.Game = game;
    },

    winSound: function () {
        if (!this.Game.config.sounds.win.node) {
            this.Game.config.sounds.win.node = new Audio();
            this.Game.config.sounds.win.node.src = this.Game.config.sounds.win.src;
        }
        this.Game.config.sounds.win.node.play();
    },
    winSoundStop: function () {
        if (this.Game.config.sounds.win.node) {
            this.Game.config.sounds.win.node.pause();
            this.Game.config.sounds.win.node.currentTime = 0;
        }
    },
    columnStopSound: function () {
        if (!this.Game.config.sounds.column.node) {
            this.Game.config.sounds.column.node = new Audio();
            this.Game.config.sounds.column.node.src = this.Game.config.sounds.column.src;
        }
        this.Game.config.sounds.column.node.play();

        return this;
    },
    spinSound: function () {
        if (!this.Game.config.sounds.spin.node) {
            this.Game.config.sounds.spin.node = new Audio();
            this.Game.config.sounds.spin.node.src = this.Game.config.sounds.spin.src;
        }
        this.Game.config.sounds.spin.node.play();

        return this;
    },
    spinStopSound: function () {
        if (this.Game.config.sounds.spin.node) {
            this.Game.config.sounds.spin.node.pause();
            this.Game.config.sounds.spin.node.currentTime = 0;
        }
    },
}

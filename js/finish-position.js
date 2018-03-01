var FinishPosition = {
    finishSprite: [],
    Game: null,
    lastCombinations: null,

    setGame: function (game) {
        this.Game = game;
    },
    stagePosition: function (column) {
        for (var i = 0; i <= 2; i++) {
            this.Game.stageColumns[column].container.removeChild(this.Game.stageColumns[column].sprites[i + 1]);
            this.Game.stageColumns[column].sprites[i + 1] = this.finishSprite[column][i];
            this.Game.stageColumns[column].container.addChild(this.Game.stageColumns[column].sprites[i + 1]);

        }

        //Set anchor for rotate position
        for (var i = 0; i < 5; i++) {
            this.Game.stageColumns[column].sprites[i].position.set(this.Game.stageColumns[column].sprites[i].width / 2, this.Game.stageColumns[column].sprites[i].height / 2);
            this.Game.stageColumns[column].sprites[i].anchor.set(.5, .5);
        }

        //Stop sprite position
        this.Game.stageColumns[column].sprites[0].position.y = -this.Game.id['2.png'].frame.height + this.Game.id['2.png'].frame.height /2;
        this.Game.stageColumns[column].sprites[1].position.y = this.Game.id['2.png'].frame.height /2;
        this.Game.stageColumns[column].sprites[2].position.y = this.Game.id['2.png'].frame.height + this.Game.id['2.png'].frame.height /2;
        this.Game.stageColumns[column].sprites[3].position.y = this.Game.id['2.png'].frame.height * 2 + this.Game.id['2.png'].frame.height /2;
        this.Game.stageColumns[column].sprites[4].position.y = this.Game.id['2.png'].frame.height * 3 + this.Game.id['2.png'].frame.height /2;
    },
    generateFinishPositions: function () {
        var combinations;
        do{
            combinations = this.getRandomCombinations(0);
        }
        while (combinations === this.lastCombinations);

        this.lastCombinations= combinations;
        for (var j = 0; j <= 4; j++) {
            if (this.finishSprite[j] === undefined) {
                this.finishSprite[j] = [];
            }
            for (var x = 0; x < 3; x++) {
                var sprite = new this.Game.Sprite(this.Game.id[this.Game.combinations[j][combinations][x] + '.png']);
                this.finishSprite[j][x] = sprite;
            }

        }
    },
    getRandomCombinations: function (i) {
        return Math.floor((Math.random() * (this.Game.combinations[i].length)));
    },
    stopColumns: function (columnId,forceStop,stopColumnIn) {
        this.Game.stageColumns[columnId].spinTimer = setTimeout(function () {
            if (FinishPosition.Game.spinning === false) return;
            FinishPosition.Game.toggleSpin(false, columnId);
            FinishPosition.stagePosition(columnId);
            forceStop !== true ? Sounds.columnStopSound() : null;

            if(columnId === 4) {
                FinishPosition.Game.checkSpin();
                if(FinishPosition.Game.winLineNumb === 0){
                    DisplayMenu.button._texture = FinishPosition.Game.Texture(FinishPosition.Game.id['button.png'].textureCacheIds);
                }
                FinishPosition.Game.spinning = false;
            }
        }, columnId * stopColumnIn);
    },
};
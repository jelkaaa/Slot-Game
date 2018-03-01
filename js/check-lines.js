var CheckLines = {
    Game:null,
    setGame:function (game) {
        this.Game=game;
    },
    lines: function () {

        var lineMatched = [];

        // *****
        checkLine(2,2,2,2,2,0);

        if(BetLines.lineChosen === 1) return lineMatched;

        // *****
        // *****
        // *****
        checkLine(1,1,1,1,1,2);
       // checkLine(2,2,2,2,2,3);
        checkLine(3,3,3,3,3,4);

        if(BetLines.lineChosen === 3) return lineMatched;

        // *   *
        //  * *
        //   *
        checkLine(1,2,3,2,1,5);

        //   *
        //  * *
        // *   *
        checkLine(3,2,1,2,3,6);


        if(BetLines.lineChosen === 5) return lineMatched;
        // **
        //   *
        //    **
        checkLine(1,1,2,3,3,7);

        //    **
        //   *
        // **
        checkLine(3,3,2,1,1,8);

        if(BetLines.lineChosen === 7) return lineMatched;
        //  ***
        // *   *
        checkLine(2,1,1,1,2,9);

        // *   *
        //  ***
        checkLine(2,3,3,3,2,10);

        if(BetLines.lineChosen === 10) return lineMatched;

        return lineMatched;

        function checkLine(sprite0,sprite1,sprite2,sprite3,sprite4,linePush) {
            if(
                CheckLines.Game.stageColumns[0].sprites[sprite0]._texture.textureCacheIds === CheckLines.Game.stageColumns[1].sprites[sprite1]._texture.textureCacheIds &&
                CheckLines.Game.stageColumns[1].sprites[sprite1]._texture.textureCacheIds === CheckLines.Game.stageColumns[2].sprites[sprite2]._texture.textureCacheIds &&
                CheckLines.Game.stageColumns[2].sprites[sprite2]._texture.textureCacheIds === CheckLines.Game.stageColumns[3].sprites[sprite3]._texture.textureCacheIds &&
                CheckLines.Game.stageColumns[3].sprites[sprite3]._texture.textureCacheIds === CheckLines.Game.stageColumns[4].sprites[sprite4]._texture.textureCacheIds
            ){
                lineMatched.push(linePush);
            }
        }
    },
    rotate: function(lineId){
        var winLinesCfg = this.Game.config.winLines[lineId];
        for(var i = 0; i < winLinesCfg.length; i++){
            this.Game.stageColumns[i].sprites[winLinesCfg[i]].rotation+= 0.2;
        }
    }
};
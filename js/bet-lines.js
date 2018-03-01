var BetLines = {

    Game: null,
    lineButtonsContainer: null,
    betContainer: null,
    betChosen: 5,
    lineChosen: 1,
    sumBet: this.betChosen * this.lineChosen,


    setGame: function (game) {
        this.Game = game;
    },
    getBet: function () {

        //Create Bet Container
        this.betContainer = new this.Game.Container();
        this.betContainer.position.x = 1060;
        this.betContainer.position.y = 10;
        //Display Bet

        for (var i in this.Game.config.bet_buttons) {

            this.Game.config.bet_buttons[i].node = new this.Game.Sprite(this.Game.Texture(this.betChosen === this.Game.config.bet_buttons[i].id ? this.Game.id[this.Game.config.bet_buttons[i].images.active].textureCacheIds
                : this.Game.id[this.Game.config.bet_buttons[i].images.no_active].textureCacheIds));
            this.Game.config.bet_buttons[i].node.controlId = this.Game.config.bet_buttons[i].id;
            this.Game.config.bet_buttons[i].node.position.set(this.Game.config.bet_buttons[i].position.x, this.Game.config.bet_buttons[i].position.y);
            this.Game.config.bet_buttons[i].node.interactive = true;
            this.Game.config.bet_buttons[i].node.buttonMode = true;

            this.Game.config.bet_buttons[i].node.on('click', changeBet);
            this.betContainer.addChild(this.Game.config.bet_buttons[i].node);

        }

        function changeBet() {

            if (BetLines.Game.spinning === true) {
                return;
            }
            BetLines.Game.config.bet_buttons[BetLines.betChosen].node._texture = BetLines.Game.Texture(BetLines.Game.id[BetLines.Game.config.bet_buttons[BetLines.betChosen].images.no_active].textureCacheIds);

            BetLines.betChosen = this.controlId;
            //SUM PASTE THERE
            DisplayMenu.setSumBet();
            this._texture = BetLines.Game.Texture(BetLines.Game.id[BetLines.Game.config.bet_buttons[BetLines.betChosen].images.active].textureCacheIds);

        }
    },
    getLines: function () {

        //Create linesButtonContainer Container
        this.lineButtonsContainer = new this.Game.Container();
        this.lineButtonsContainer.position.x = 1150;
        this.lineButtonsContainer.position.y = 10;

        //Display  linesButton
        for (var i in this.Game.config.line_buttons) {

            this.Game.config.line_buttons[i].node = new this.Game.Sprite(this.Game.Texture(this.lineChosen === this.Game.config.line_buttons[i].id ? this.Game.id[this.Game.config.line_buttons[i].images.active].textureCacheIds
                : this.Game.id[this.Game.config.line_buttons[i].images.no_active].textureCacheIds));
            this.Game.config.line_buttons[i].node.controlId = this.Game.config.line_buttons[i].id;
            this.Game.config.line_buttons[i].node.position.set(this.Game.config.line_buttons[i].position.x, this.Game.config.line_buttons[i].position.y);
            this.Game.config.line_buttons[i].node.interactive = true;
            this.Game.config.line_buttons[i].node.buttonMode = true;
            this.Game.config.line_buttons[i].node.on('click', changeLineButtons);
            this.lineButtonsContainer.addChild(this.Game.config.line_buttons[i].node);

        }

        function changeLineButtons() {

            if (BetLines.Game.spinning === true) {
                return;
            }
            BetLines.Game.config.line_buttons[BetLines.lineChosen].node._texture = BetLines.Game.Texture(BetLines.Game.id[BetLines.Game.config.line_buttons[BetLines.lineChosen].images.no_active].textureCacheIds);

            BetLines.lineChosen = this.controlId;
            //SUM PASTE THERE
            DisplayMenu.setSumBet();
            this._texture = BetLines.Game.Texture(BetLines.Game.id[BetLines.Game.config.line_buttons[BetLines.lineChosen].images.active].textureCacheIds);

        }
    }

};
var DisplayMenu = {
    Game: null,
    button: null,
    lastWinContainer: null,
    creditContainer: null,

    lastWinNode: null,
    creditNode: null,
    sumBetNode: null,
    startTextNode: null,

    totalBet: null,
    creditDisplay: null,


    setGame: function (game) {
        this.Game = game;
    },
    getMenuButtons: function () {
        for (var i in this.Game.config.menu_buttons) {
            this.Game.config.menu_buttons[i].node = new this.Game.Sprite(this.Game.Texture(this.Game.id[this.Game.config.menu_buttons[i].images.no_active].textureCacheIds));
            this.Game.config.menu_buttons[i].node.position.set(this.Game.config.menu_buttons[i].position.x, this.Game.config.menu_buttons[i].position.y);
            BetLines.lineButtonsContainer.addChild(this.Game.config.menu_buttons[i].node);

        }
    },
    spinButton: function () {
        this.button = new this.Game.Sprite(this.Game.id["button.png"]);
        this.button.position.x = 1160;
        this.button.position.y = 470;
        this.button.on('mouseover', function () {
            this._texture = DisplayMenu.Game.Texture(DisplayMenu.Game.id['button-active.png'].textureCacheIds
            );
        });
        this.button.on('mouseout', function () {
            this._texture = DisplayMenu.Game.Texture(DisplayMenu.Game.id['button.png'].textureCacheIds
            );
        });

        this.button.on('click', function () {
            this._texture = DisplayMenu.Game.Texture(DisplayMenu.Game.id['button-active.png'].textureCacheIds);
            DisplayMenu.Game.spin();
        });
        this.button.interactive = true;
        this.button.buttonMode = true;

    },
    getCreditDisplay: function () {
        // Display Credit
        this.creditDisplay = new this.Game.Sprite(this.Game.id['bet_buttons/credit.png']);
        this.creditDisplay.position.y = 40;


        // Display totalBet
        this.totalBet = new this.Game.Sprite(this.Game.id['bet_buttons/totalBet.png']);
        this.totalBet.position.y = 470;
    },
    setSumBet: function (lines, bet) {
        lines = (lines === undefined ? BetLines.lineChosen : lines);
        bet = (bet === undefined ? BetLines.betChosen : bet);

        BetLines.sumBet = parseInt(lines) * parseInt(bet);

        if (!this.sumBetNode) {
            this.sumBetNode = new PIXI.Text(BetLines.sumBet, this.getStyle(43));
            this.sumBetNode.anchor.set(0.5, 0.5);
            this.sumBetNode.position.set(110, 527);
            this.Game.app.stage.addChild(this.sumBetNode);
        }
        else {
            this.sumBetNode.anchor.set(0.5, 0.5);
            this.sumBetNode.position.set(110, 527);
            this.sumBetNode.text = BetLines.sumBet;
        }
    },
    setCredit: function (credit) {

        credit = parseInt(credit);
        this.creditContainer = new this.Game.Container();
        this.creditContainer.position.set(50, 80);
        this.Game.app.stage.addChild(this.creditContainer);
        if (!this.creditNode) {
            this.creditNode = new PIXI.Text(credit, this.getStyle(50));
            this.creditNode.anchor.set(0.5, 0.5);
            this.creditNode.position.set(65, 30);
            this.creditContainer.addChild(this.creditNode);

        }
        else {
            this.creditNode.text = this.Game.credit = credit;
            this.creditNode.anchor.set(0.5, 0.5);
            this.creditNode.position.set(65, 30);
            this.creditContainer.addChild(this.creditNode);

        }

    },
    // formatCredit: function (credit) {
    //     credit.toString();
    //     if(credit.length > 3 ){
    //         credit = credit.substr(0,credit.length - 3)+ ','+ credit.substr(credit.length - 3,credit.length);
    //     }
    //     return credit;
    // },
    setLastWin: function (lastWIn) {

        if (!this.lastWinNode) {
            this.lastWinContainer = new this.Game.Container();
            this.lastWinContainer.position.set(110, 300);
            this.Game.app.stage.addChild(this.lastWinContainer);

            this.lastWinNode = new PIXI.Text('+' + lastWIn, this.getStyle(70));
            this.lastWinNode.anchor.set(0.5, 0.5);
            this.lastWinNode.position.set(0, 10);
            this.lastWinContainer.addChild(this.lastWinNode);

            setTimeout(function () {
                DisplayMenu.lastWinContainer.removeChild(DisplayMenu.lastWinNode);
            }, 2000);
        }
        else {
            this.lastWinNode.anchor.set(0.5, 0.5);
            this.lastWinNode.position.set(0, 10);
            this.lastWinNode.text = '+' + lastWIn;
            this.lastWinContainer.addChild(this.lastWinNode);

            setTimeout(function () {
                DisplayMenu.lastWinContainer.removeChild(DisplayMenu.lastWinNode);
            }, 2000);
        }

    },
    setStartText: function () {
        this.startTextNode = new PIXI.Text("Press space button to spin!", this.getStyle(30));
        this.startTextNode.anchor.set(0.5, 0.5);
        this.startTextNode.position.set(this.Game.config.windowPanel.width / 2, 23);
        this.Game.app.stage.addChild(this.startTextNode);

        //Credit Text

        var creditText = new PIXI.Text("Credit", this.getStyle(30));
        creditText.anchor.set(0.5, 0.5);
        creditText.position.set(117, 65);
        this.Game.app.stage.addChild(creditText);

        var totalBetText = new PIXI.Text("Total Bet", this.getStyle(25));
        totalBetText.anchor.set(0.5, 0.5);
        totalBetText.position.set(117, 492);
        this.Game.app.stage.addChild(totalBetText);

        var betText = new PIXI.Text("Bet", this.getStyle(20));
        betText.anchor.set(0.5, 0.5);
        betText.position.set(20, 46);
        BetLines.lineButtonsContainer.addChild(betText);

        var linesText = new PIXI.Text("Lines", this.getStyle(20));
        linesText.anchor.set(0.5, 0.5);
        linesText.position.set(110, 46);
        BetLines.lineButtonsContainer.addChild(linesText);


    },
    getStyle: function (size) {
        var style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: size,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#bbff6d'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 2,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440
        });
        return style;
    },
    keyboard: function (keyCode) {


        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }
};
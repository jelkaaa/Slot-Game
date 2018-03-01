window.onload = (function () {
    var Game = {
        loadedFiles: [],
        stageColumns: [],

        numbLoadedFiles: 2,
        slotStageContainer: null,
        frameStageContainer: null,
        config: null,
        combinations: null,

        spinning: false,
        spinTimer: null,
        rows: 3,
        columns: 5,
        winLineNumb: 0,
        credit: 0,

        //Pixi elements set to public
        app: null,
        id: null,
        Texture: null,
        Container: null,
        Sprite: null,

        createXHR: function () {
            if ("undefined" !== typeof XMLHttpRequest) return new XMLHttpRequest;
            if ("undefined" !== typeof ActiveXObject) {
                if ("string" !== typeof arguments.callee.activeXString) {
                    var e, t, n = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
                    for (e = 0, t = n.length; e < t; e++) try {
                        new ActiveXObject(n[e]), arguments.callee.activeXString = n[e];
                        break
                    } catch (e) {
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString)
            }
            throw new Error("No XHR object available.")
        },
        //Loading JSON files
        load: function () {

            xhr = Game.createXHR();
            xhr.open('GET', 'json-files/config.json');
            xhr.onreadystatechange = function () {
                if (4 === this.readyState && 200 === this.status && "" !== this.responseText) {
                    Game.config = JSON.parse(this.responseText);
                    Game.loadedFiles.push(Game.config);
                    Game.pixiElement();
                }
            };
            xhr.send();

            xhr2 = Game.createXHR();
            xhr2.open('GET', 'json-files/combinations.json');
            xhr2.onreadystatechange = function () {
                if (4 === this.readyState && 200 === this.status && "" !== this.responseText) {
                    Game.combinations = JSON.parse(this.responseText);
                    Game.loadedFiles.push(Game.combinations);
                    Game.pixiElement();
                }
            };
            xhr2.send();
        },
        // Adding credit
        prompt: function () {
            while (true) {
                Game.credit = prompt('Enter your credit:');
                if (/^\d+$/.test(Game.credit) === false) {
                    alert('Enter only numbers.');
                    continue;
                } else if (parseInt(Game.credit) > parseInt(Game.config.max)) {
                    alert('The maximum credit is ' + Game.config.max);
                    continue;
                }
                else if (parseInt(Game.credit) < parseInt(Game.config.min)) {
                    alert('The minimum credit is ' + Game.config.min);
                    continue;
                }
                break;
            }
        },
        pixiElement: function () {
            if (Game.loadedFiles.length !== Game.numbLoadedFiles) {
                return;
            }
            Game.prompt();
            // Publish Game class
            FinishPosition.setGame(Game);
            CheckLines.setGame(Game);
            DisplayMenu.setGame(Game);
            BetLines.setGame(Game);
            Sounds.setGame(Game);

            //Aliases
            var Application = PIXI.Application,
                Container = PIXI.Container,
                loader = PIXI.loader,
                resources = PIXI.loader.resources,
                Texture = PIXI.Texture.fromImage,
                Sprite = PIXI.Sprite,
                Rectangle = PIXI.Rectangle;

            //Create a Pixi Application
            Game.app = new Application({
                    width: Game.config.windowPanel.width,
                    height: Game.config.windowPanel.height,
                    antialias: true,
                    transparent: false,
                    resolution: 1,
                    backgroundColor: 0xe3e3e3,
                }
            );

            loader
                .add("spritesheet/spritesheet.json")

                .load(setup);
            var id;
            var backgroundImg;
            var slotFrame;
            var keyObject = DisplayMenu.keyboard(32);

            function setup() {

                document.body.appendChild(Game.app.view);
                id = resources["spritesheet/spritesheet.json"].textures;
                Game.id = id;
                Game.Sprite = Sprite;
                Game.Texture = Texture;
                Game.Container = Container;

                //Space button activate
                keyObject.press = () => {
                    Game.spin();
                    if (Game.spinning === true) {
                        DisplayMenu.button._texture = Game.Texture(Game.id['button-active.png'].textureCacheIds);
                    }

                };

                //Spin Button
                DisplayMenu.spinButton();

                // Display Credit and totalBet
                DisplayMenu.getCreditDisplay();
                // //Display Bet
                BetLines.getBet();

                // //Display  linesButton
                BetLines.getLines();

                //Display menu buttons
                DisplayMenu.getMenuButtons();

                //Set Background image
                backgroundImg = new Sprite(id["slot-background2.png"]);
                slotFrame = new Sprite(id["slot-frame.png"]);

                //SlotFrame Container
                Game.frameStageContainer = new Container();
                Game.frameStageContainer.position.x = 267;
                Game.frameStageContainer.position.y = 42;
                Game.frameStageContainer.addChild(slotFrame);
                // SlotStage Container
                Game.slotStageContainer = new Container();
                Game.slotStageContainer.width = Game.config.windowPanel.width;
                //Game.loadedFiles[0].gameWindow.width;
                Game.slotStageContainer.height = 150;
                Game.slotStageContainer.position.x = 273;
                Game.slotStageContainer.position.y = 40;

                //Add Container

                Game.app.stage.addChild(Game.frameStageContainer);
                Game.app.stage.addChild(Game.slotStageContainer);
                Game.app.stage.addChild(backgroundImg);
                Game.app.stage.addChild(DisplayMenu.button);
                Game.app.stage.addChild(DisplayMenu.creditDisplay);
                Game.app.stage.addChild(DisplayMenu.totalBet);
                Game.app.stage.addChild(BetLines.betContainer);
                Game.app.stage.addChild(BetLines.lineButtonsContainer);

                //Start text
                DisplayMenu.setStartText();

                DisplayMenu.setCredit(Game.credit);
                DisplayMenu.setSumBet(1, 5);
                createStageColumns();

            }
            function createStageColumns() {
                Game.stageColumns = {};
                //Creating Stage Columns
                for (var i = 0; i < Game.columns; i++) {
                    Game.stageColumns[i] = {};
                    Game.stageColumns[i].container = new Container();

                    Game.slotStageContainer.addChild(Game.stageColumns[i].container);
                    Game.stageColumns[i].container.position.x = 167 * i;
                    Game.stageColumns[i].container.height = 0;
                    Game.stageColumns[i].sprites = [];

                    //Creating Sprites
                    for (var j = -1; j < Game.rows + 1; j++) {
                        var frameId = Math.floor((Math.random() * (Game.config.reels[0].length)));
                        var sprite = new Sprite(id[frameId + '.png']);
                        sprite.position.x = 0;
                        sprite.position.y = Game.id['2.png'].frame.height * j;
                        Game.stageColumns[i].sprites.push(sprite);
                        sprite.width = Game.id['2.png'].frame.width;
                        sprite.height = Game.id['2.png'].frame.height;
                        Game.stageColumns[i].container.addChild(sprite);
                    }
                    Game.stageColumns[i].spinning = false;
                }
                //Animate Sprites
                Game.app.ticker.add(function (delta) {
                    for (var x = 0; x < Game.columns; x++) {

                        if (Game.stageColumns[x].spinning === true) {

                            for (var i = 0; i < Game.stageColumns[x].sprites.length; i++) {
                                Game.stageColumns[x].sprites[i].position.y += 50 * delta;
                            }
                            if (Game.stageColumns[x].sprites[Game.stageColumns[x].sprites.length - 1].position.y > Game.config.windowPanel.height) {

                                var frameId = Math.floor((Math.random() * (Game.config.reels[0].length)));
                                var sprite = new Sprite(id[frameId + '.png']);
                                sprite.y = Game.stageColumns[x].sprites[0].y - Game.id['2.png'].frame.height;
                                Game.stageColumns[x].container.addChild(sprite);
                                Game.stageColumns[x].container.removeChild(Game.stageColumns[x].sprites[Game.stageColumns[x].sprites.length - 1]);
                                Game.stageColumns[x].sprites.unshift(sprite);
                                Game.stageColumns[x].sprites.pop();

                            }
                        }
                    }
                });
            }
        },

        spin: function () {
            Game.app.stage.removeChild(DisplayMenu.startTextNode);
            if (!Game.haveMoney()) {
                confirm('You don\'t have money for this bet, try lower bet');
                return;
            }
            if (Game.winLineNumb > 0) {
                return;
            }
            if (Game.spinning === true) {
                Game.clearSpinTimers();
                Game.stopSpin(true);
                return;
            }
            Sounds.winSoundStop();
            Sounds.spinSound();
            Game.toggleSpin(true);
            FinishPosition.generateFinishPositions();
            Game.startTime();
        },
        startTime: function () {
            return Game.spinTimer = setTimeout(Game.stopSpin, 1000);
        },
        clearSpinTimers: function () {
            clearTimeout(Game.spinTimer);
            for (var i = 0; i < 5; i++) {
                clearTimeout(Game.stageColumns[i].spinTimer);

            }
        },
        toggleSpin: function (spinToggle, column) {
            if (column === undefined) {
                for (var i in Game.stageColumns) {
                    Game.stageColumns[i].spinning = spinToggle;
                }
                Game.spinning = spinToggle;
            }
            else {
                Game.stageColumns[column].spinning = spinToggle;
            }
        },
        stopSpin: function (forceStop) {
            var stopColumnIn = 400;
            if (forceStop === true) {
                Sounds.columnStopSound(Game);
                Sounds.spinStopSound(Game);
                stopColumnIn = 1;
            }
            FinishPosition.stopColumns(0, forceStop, stopColumnIn);

            FinishPosition.stopColumns(1, forceStop, stopColumnIn);

            FinishPosition.stopColumns(2, forceStop, stopColumnIn);

            FinishPosition.stopColumns(3, forceStop, stopColumnIn);

            FinishPosition.stopColumns(4, forceStop, stopColumnIn);

        },
        checkSpin: function () {
            var spinResult = CheckLines.lines();
            Game.winLineNumb = spinResult.length;
            if (spinResult.length) {
                var lastWin = 0;
                Sounds.winSound();
                for (var winLine in spinResult) {
                    lastWin += parseInt(BetLines.sumBet);
                    DisplayMenu.setCredit(parseInt(Game.credit) + parseInt(BetLines.sumBet));
                    Game.winProcess(spinResult[winLine], spinResult.length);
                }
                DisplayMenu.setLastWin(lastWin);
            }
            else {
                DisplayMenu.setCredit(parseInt(Game.credit) - parseInt(BetLines.sumBet));
                setTimeout(Game.gameOver, 1000);
            }
        },
        animateSprites: function (winLine, num) {
            Game.app.ticker.add(function () {
                if (num < 62.5) {
                    CheckLines.rotate(winLine);
                    num += 0.4;
                }
                else {
                    this.destroy();
                    Game.winLineNumbFun();
                }
            });
        },
        winProcess: function (winLine, spinResultLength) {
            var num = 0;
            if (winLine === 0) {
                Game.animateSprites(0, num);
            }
            else if (winLine === 2) {
                Game.animateSprites(2, num);
            }
            else if (winLine === 4) {
                Game.animateSprites(4, num);
            }
            else if (winLine === 5) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 2) {
                            setTimeout(function () {
                                CheckLines.rotate(5);
                            }, 3000);
                            num += 0.4;
                        } else {
                            CheckLines.rotate(5);
                            num += 0.4;
                        }
                    } else {
                        this.destroy();
                        if (spinResultLength === 1) {
                            Game.winLineNumbFun();
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 3000);
                        }
                    }
                });
            }
            else if (winLine === 6) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 2) {
                            setTimeout(function () {
                                CheckLines.rotate(6);
                            }, 3000);
                            num += 0.4;

                        } else {
                            CheckLines.rotate(6);
                            num += 0.4;
                        }
                    }
                    else {
                        this.destroy();
                        if (spinResultLength === 1) {
                            Game.winLineNumbFun();
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 3000);
                        }
                    }
                });
            }
            else if (winLine === 7) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 2) {
                            setTimeout(function () {
                                CheckLines.rotate(7);
                            }, 3000);
                            num += 0.4;
                        } else if (spinResultLength === 3 || spinResultLength === 4) {
                            setTimeout(function () {
                                CheckLines.rotate(7);
                            }, 6000);
                            num += 0.4;
                        }
                        else {
                            CheckLines.rotate(7);
                            num += 0.4;
                        }
                    }
                    else {
                        this.destroy();
                        if (spinResultLength === 1) {
                            Game.winLineNumbFun();
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 3000);
                        }else{
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 6000);
                        }
                    }
                });
            }
            else if (winLine === 8) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 2 || spinResultLength === 3 || spinResultLength === 4) {
                            setTimeout(function () {
                                CheckLines.rotate(8);
                            }, 3000);
                            num += 0.4;
                        } else {
                            CheckLines.rotate(8);
                            num += 0.4;
                        }
                    }
                    else {
                        this.destroy();

                        if (spinResultLength === 1) {
                            Game.winLineNumbFun();
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 3000);
                        }
                        else {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 6000);
                        }
                    }
                });
            }
            else if (winLine === 9) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 3 || spinResultLength === 4) {
                            setTimeout(function () {
                                CheckLines.rotate(9);
                            }, 6000);
                            num += 0.4;
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                CheckLines.rotate(9);
                            }, 3000);
                            num += 0.4;
                        }
                        else {
                            CheckLines.rotate(9);
                            num += 0.4;
                        }

                    } else {
                        this.destroy();
                        if (spinResultLength === 1) {
                            Game.winLineNumbFun();
                        } else if (spinResultLength === 2) {
                            setTimeout(function () {
                                Game.winLineNumbFun();
                            }, 3000);
                        }
                    }
                });
            }
            else if (winLine === 10) {
                Game.app.ticker.add(function () {
                    if (num < 62.5) {
                        if (spinResultLength === 2 || spinResultLength === 3 || spinResultLength === 4) {
                            setTimeout(function () {
                                CheckLines.rotate(10);
                            }, 3000);
                            num += 0.4;
                        } else {
                            CheckLines.rotate(10);
                            num += 0.4;
                        }
                    }
                    else {
                        this.destroy();
                        Game.winLineNumbFun();
                    }
                });
            }
        },
        winLineNumbFun: function () {
            Game.winLineNumb--;
            if (Game.winLineNumb === 0) {
                setTimeout(function () {
                    Sounds.winSoundStop();
                    DisplayMenu.button._texture = Game.Texture(Game.id['button.png'].textureCacheIds);
                }, 1200);
            }
        },
        gameOver: function () {
            if (Game.credit < parseInt(Game.config.min)) {
                confirm('You  don\'t have money to continue. Minimum bet is 5 credits. Play again?');
                window.location.reload();
            }
        },
        haveMoney: function () {
            if (parseInt(Game.credit) < parseInt(BetLines.sumBet)) {
                return false;
            }
            return true;
        },
    };
    Game.load();
});


const STATE_NAMES = [
  'kingdom of ',
  'principality of ',
  'realm of ',
  'dominion of ',
  'province of ',
  'palatinate of ',
  'duchy of ',
  'fiefdom of ',
  'protectorate of ',
];
const CSS_COLOR_NAMES = [
  '909',
  '099',
  '990',
  '900',
  '009',
  '090',
  '237',
  '273',
  '723',
  '732',
  '327',
  '771',
  '717',
  '177',
  '504',
  '405',
  '045',
  '450',
  '540',
  '054',
];
const CONSONANTS = 'bcccdddfffghjklmnpqrrssstttvwxz';
const VOWELS = 'aaaeeeiouy';
const C_ARRAY = CONSONANTS.split('');
const V_ARRAY = VOWELS.split('');
let ABJAD: Array<string> = [];
for (let i = 0; i < C_ARRAY.length; i++) {
  for (let j = 0; j < V_ARRAY.length; j++) {
    ABJAD.push(C_ARRAY[i] + V_ARRAY[j]);
  }
}

export class Kingdom {
  startYear: number;
  endYear: number = -1;
  name: string;
  color: string = 'red';

  constructor(start: number, x: number, y: number) {
    this.startYear = start;
    this.name = STATE_NAMES[Math.floor(Math.random() * STATE_NAMES.length)];
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      this.name += ABJAD[Math.floor(Math.random() * ABJAD.length)];
    }
    this.color =
      CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];

    return this;
  }
}

export class Tile {
  x: number;
  y: number;
  i: number;
  land: boolean;
  elevation = 1;
  yearAquired: number = -1;
  kingdomPreHistory: Array<Array<Kingdom>> = [];
  kingdomHistory: Array<Kingdom>;
  settlementType: string = 'none';

  constructor(x: number, y: number, i: number) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.land = Math.random() > 0.45 ? true : false;
    this.kingdomHistory = [];
  }

  collapse() {
    this.kingdomPreHistory.push(this.kingdomHistory);
    this.kingdomHistory = [];
  }

  getCurrentKingdom() {
    return this.kingdomHistory[this.kingdomHistory.length - 1];
  }

  getOpenRange() {
    return this.kingdomHistory.length == 0;
  }

  generateSettlementType() {
    var randTen = Math.floor(Math.random() * 10) + 1;
    if (randTen < 5) {
      this.settlementType = 'fields';
    } else if (randTen == 6) {
      this.settlementType = 'hamlet';
    } else if (randTen == 7) {
      this.settlementType = 'village';
    } else if (randTen == 8) {
      this.settlementType = 'town';
    } else if (randTen == 9) {
      this.settlementType = 'city';
    } else if (randTen == 10) {
      this.settlementType = 'metropolis';
    }
  }
}

export class Atlas {
  sideLength: number;
  tiles: Array<Tile>;
  year: number;
  lastKingdomAddedYear: number = 0;
  lastKingdomFellYear: number = 0;
  kingdoms: Array<Kingdom>;
  deadKingdoms: Array<Kingdom>;

  constructor(side: number) {
    this.year = 0;
    this.sideLength = side;
    this.tiles = [];
    this.kingdoms = [];
    this.deadKingdoms = [];

    //Initialize Tiles
    for (let i = 0; i < side; i++) {
      for (let j = 0; j < side; j++) {
        this.tiles.push(new Tile(j, i, j + i * side));
      }
    }
    this.smooth(5);
    this.elevate(8);
    this.addHeightNoise(1);

    //Three Kingdoms Start at Year Zero
    this.addKingdom();
    this.addKingdom();
    this.addKingdom();

    //Time Marches On...
    this.advanceYear(25);
  }

  advanceYear(repeats: number) {
    for (let i = 0; i < repeats; i++) {
      var incrementYear = 5 + Math.floor(Math.random() * 5);
      this.year += incrementYear;
      if (this.year > this.lastKingdomAddedYear + 100) {
        this.addKingdom();
        this.lastKingdomAddedYear = this.year;
      }
      this.cleanUpDeadKingdoms();
      if (this.year > this.lastKingdomFellYear + 400) {
        this.killRandomKingdom();
        this.lastKingdomFellYear = this.year;
      }
      this.expandKingdoms();
    }
  }

  addKingdom() {
    var tempTile = this.getRandomLandTile();
    var tempKingdom = new Kingdom(this.year, tempTile.x, tempTile.y);
    this.kingdoms.push(tempKingdom);
    tempTile.kingdomHistory.push(tempKingdom);
  }

  addHeightNoise(repeats: number) {
    this.tiles.forEach((tile: Tile) => {
      if (tile.land && tile.elevation >= 2 && tile.elevation < 9) {
        if (Math.random() > 0.5) {
          tile.elevation++;
        } else {
          tile.elevation--;
        }
      }
    });
  }

  cleanUpDeadKingdoms() {
    var tempKingdomMap: Map<Kingdom, boolean> = new Map();
    this.kingdoms.forEach((kingdom: Kingdom) => {
      tempKingdomMap.set(kingdom, false);
    });
    this.tiles.forEach((tile: Tile) => {
      if (tile.getCurrentKingdom()) {
        tempKingdomMap.set(tile.getCurrentKingdom(), true);
      }
    });
    var stillAliveKingdoms: Array<Kingdom> = [];
    var deadKingdoms: Array<Kingdom> = [];
    tempKingdomMap.forEach((bool: boolean, kingdom: Kingdom) => {
      if (bool) {
        stillAliveKingdoms.push(kingdom);
      } else {
        kingdom.endYear = this.year;
        deadKingdoms.push(kingdom);
      }
    });
    this.kingdoms = stillAliveKingdoms;
    this.deadKingdoms.push(...deadKingdoms);
  }

  elevate(repeats: number) {
    for (let i = 0; i < repeats; i++) {
      this.tiles.forEach((tile: Tile) => {
        if (tile.land) {
          var totalHeight = 0;
          var totalSurrounds = 0;
          var surrounds = this.getSurroundingTiles(tile);
          surrounds.forEach((tile: Tile | null) => {
            if (tile) {
              totalHeight += tile.elevation;
              totalSurrounds++;
            }
          });
          tile.elevation = Math.floor(totalHeight / totalSurrounds) + 1;
        }
      });
    }
  }

  expandKingdoms() {
    //find all tiles with a history of being conquered
    var kingdomTiles: Array<Tile> = [];
    this.tiles.forEach((tile: Tile) => {
      if (tile.kingdomHistory.length > 0) kingdomTiles.push(tile);
    });

    //shuffle for fairness
    this.shuffle(kingdomTiles);

    //for each tile, expand if...
    kingdomTiles.forEach((kingdomTile: Tile) => {
      var surrounds = this.getSurroundingTiles(kingdomTile);
      surrounds.forEach((tile: Tile | null) => {
        if (
          tile &&
          tile.land &&
          Math.random() > 0.5 &&
          (tile.getOpenRange() ||
            tile.getCurrentKingdom().name !=
              kingdomTile.getCurrentKingdom().name)
        ) {
          tile.yearAquired = this.year;
          tile.generateSettlementType();
          tile.kingdomHistory.push(kingdomTile.getCurrentKingdom());
        }
      });
    });
  }

  getRandomTile(): Tile {
    return this.tiles[Math.floor(Math.random() * this.tiles.length)];
  }

  getRandomLandTile() {
    while (true) {
      var tempTile = this.getRandomTile();
      if (tempTile.land) {
        return tempTile;
      }
    }
  }

  getTileAtCoordinates(x: number, y: number) {
    var index = x + y * this.sideLength;
    if (this.tiles[index]) {
      return this.tiles[index];
    } else return null;
  }

  getSurroundingTiles(tile: Tile) {
    var surroundingTiles = [];
    //top tile
    surroundingTiles[0] = this.getTileAtCoordinates(tile.x, tile.y - 1);
    //right tile
    surroundingTiles[1] = this.getTileAtCoordinates(tile.x + 1, tile.y);
    //bottom tile
    surroundingTiles[2] = this.getTileAtCoordinates(tile.x, tile.y + 1);
    //left tile
    surroundingTiles[3] = this.getTileAtCoordinates(tile.x - 1, tile.y);
    return surroundingTiles;
  }

  killRandomKingdom() {
    //get a random kingdom
    var dyingKingdom =
      this.kingdoms[Math.floor(Math.random() * this.kingdoms.length)];

    //iterate over and find the empire's tiles
    this.tiles.forEach((tile: Tile) => {
      if (
        tile.getCurrentKingdom() &&
        tile.getCurrentKingdom().name == dyingKingdom.name
      ) {
        tile.collapse();
      }
    });

    //take a random kingdom from this.kingdoms, splice it out, put it into deadKingdoms,
    //iterate over tiles - any tiles that return that kingdom as the active kingdom
    //will have a new NONE kingdom added to the kingdomHistory
  }

  smooth(repeats: number) {
    for (let k = 0; k < repeats; k++) {
      for (let i = 0; i < this.tiles.length; i++) {
        var surrounds = this.getSurroundingTiles(this.tiles[i]);
        let total = 0;
        for (let j = 0; j < surrounds.length; j++) {
          if (surrounds[j] && surrounds[j]?.land) {
            total += 1;
          }
        }
        if (total >= 3) {
          this.tiles[i].land = true;
        } else if (total < 2) {
          this.tiles[i].land = false;
          this.tiles[i].elevation = 0;
        }
      }
    }
  }

  shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

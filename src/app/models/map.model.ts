const CSS_COLOR_NAMES = [
  'AliceBlue',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Bisque',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Crimson',
  'Cyan',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightGray',
  'LightGrey',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSlateGrey',
  'LightSteelBlue',
  'Lime',
  'LimeGreen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'Navy',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Yellow',
  'YellowGreen',
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
  name: string;
  color: string = 'red';

  constructor(start: number, x: number, y: number) {
    this.startYear = start;
    this.name = '';
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
  elevation = 1
  yearAquired: number = -1
  kingdomHistory: Array<Kingdom>;

  constructor(x: number, y: number, i: number) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.land = Math.random() > 0.45 ? true : false;
    this.kingdomHistory = [];
  }

  getCurrentKingdom() {
    return this.kingdomHistory[this.kingdomHistory.length - 1];
  }

  getOpenRange() {
    return this.kingdomHistory.length == 0;
  }
}

export class Map {
  sideLength: number;
  tiles: Array<Tile>;
  year: number;
  lastKingdomAddedYear: number = 0
  kingdoms: Array<Kingdom>;

  constructor(side: number) {
    this.year = 0;
    this.sideLength = side;
    this.tiles = [];
    this.kingdoms = [];

    //Initialize Tiles
    for (let i = 0; i < side; i++) {
      for (let j = 0; j < side; j++) {
        this.tiles.push(new Tile(j, i, j + i * side));
      }
    }
    this.smooth(5);
    this.elevate(8)

    //Three Kingdoms Start at Year Zero
    this.addKingdom();
    this.addKingdom();
    this.addKingdom();

    //Time Marches On...
    this.advanceYear(200);
  }

  advanceYear(repeats: number) {
    for (let i = 0; i < repeats; i++) {
      var incrementYear = 10 + Math.floor(Math.random() * 10);
      this.year += incrementYear;
      if (this.year > this.lastKingdomAddedYear + 200) {
        this.addKingdom()
        this.lastKingdomAddedYear = this.year
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

  elevate(repeats:number) {
    for (let i = 0; i < repeats; i++) {
      this.tiles.forEach((tile: Tile)=> {
        if (tile.land) {
          var totalHeight = 0
          var totalSurrounds = 0
          var surrounds = this.getSurroundingTiles(tile)
          surrounds.forEach((tile: Tile | null)=>{
            if (tile) {
              totalHeight += tile.elevation
              totalSurrounds++
            }
          })
          tile.elevation = Math.floor(totalHeight / totalSurrounds) + 1
        }
      })    
    }
  }

  expandKingdoms() {
    //find all tiles with a history of being conquered
    var kingdomTiles: Array<Tile> = [];
    this.tiles.forEach((tile: Tile) => {
      if (tile.kingdomHistory.length > 0) kingdomTiles.push(tile);
    });

    //shuffle for fairness
    this.shuffle(kingdomTiles)

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
          tile.yearAquired = this.year
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

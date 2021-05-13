import { Injectable } from '@angular/core';
import { Atlas, Tile, Kingdom } from '../models/atlas.model';

const TOTAL = 100;
const PIXELS = 6;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  atlas: Atlas;
  canvas: any;
  context: any;
  advances: number = 0

  constructor() {
    this.atlas = new Atlas(TOTAL);
  }

  initialize(guestCnv: HTMLCanvasElement, guestCtx: CanvasRenderingContext2D) {
    this.canvas = guestCnv;
    this.context = guestCtx;

    this.canvas.width = TOTAL * PIXELS;
    this.canvas.height = TOTAL * PIXELS;

    this.render();

    // setInterval(()=>{
    //   if (this.advances < 100) {
    //     this.advances++;
    //     this.atlas.advanceYear(1)
    //     this.render()
    //   }
    // }, 200)
  }

  getMouseoverTile(x: number, y: number) {
    var newX = Math.floor(x / PIXELS) - 1;
    var newY = Math.floor(y / PIXELS) - 1;

    return this.atlas.getTileAtCoordinates(newX, newY);
  }

  render() {
    this.atlas.tiles.forEach((tile: Tile) => {
      if (tile.kingdomHistory.length > 0) {
        this.context.fillStyle = '#' + tile.getCurrentKingdom().color;
        if (tile.elevation > 3) {
          this.context.fillStyle = this.returnColorForKingdomTile(tile);
        }
      } else {
        if (tile.land) {
          this.context.fillStyle = '#' + tile.elevation.toString().repeat(3);
        } else {
          this.context.fillStyle = 'darkblue';
        }
      }
      this.context.fillRect(tile.x * PIXELS, tile.y * PIXELS, PIXELS, PIXELS);
    });
  }

  returnColorForKingdomTile(tile: Tile): string {
    var arr: Array<any> = tile.getCurrentKingdom().color.split('');
    arr.forEach((char: string, index: number) => {
      arr[index] = Math.min(parseInt(char) + tile.elevation, 9);
    });
    return '#' + arr.join('');
  }
}

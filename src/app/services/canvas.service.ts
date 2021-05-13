import { Injectable } from '@angular/core';
import { Map, Tile, Kingdom } from '../models/map.model'

const TOTAL = 100
const PIXELS = 6

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  map: Map
  canvas: any
  context: any

  constructor() {
    this.map = new Map(TOTAL)
  }

  initialize(guestCnv: HTMLCanvasElement, guestCtx: CanvasRenderingContext2D) {
    this.canvas = guestCnv;
    this.context = guestCtx;

    this.canvas.width = TOTAL * PIXELS;
    this.canvas.height = TOTAL * PIXELS;

    this.render()
  }

  getMouseoverTile(x:number,y:number) {
    var newX = Math.floor(x / PIXELS) - 1
    var newY = Math.floor(y / PIXELS) - 1

    return this.map.getTileAtCoordinates(newX, newY)
  }

  render() {
    this.map.tiles.forEach((tile: Tile)=>{

      if (tile.kingdomHistory.length > 0) {
        this.context.fillStyle = tile.getCurrentKingdom().color
        
      } else {
        if (tile.land) {
          this.context.fillStyle = '#' + tile.elevation.toString().repeat(3)
        } else {
          this.context.fillStyle = 'blue'
        }
      }


      this.context.fillRect(tile.x * PIXELS, tile.y * PIXELS, PIXELS, PIXELS)
    })
  }
}
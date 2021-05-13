import { Component, OnInit } from '@angular/core';
import { Tile } from '../models/atlas.model';
import { CanvasService } from '../services/canvas.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  barGraphChar: string = '|'

  selectedTile!: Tile
  clickedTile!: Tile
  cnv: any;
  ctx: any

  constructor(public canvasService: CanvasService) { }

  ngOnInit(): void {
    var root = <HTMLElement>document.querySelector('app-main')
    this.cnv = <HTMLCanvasElement>root.querySelector('#canvas')
    this.ctx = <CanvasRenderingContext2D>this.cnv.getContext('2d')

    this.canvasService.initialize(this.cnv, this.ctx)
  }

  preview(evt:any) {
    var rect = this.cnv.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left
    var mouseY = evt.clientY - rect.top
    this.selectedTile = <Tile>this.canvasService.getMouseoverTile(mouseX, mouseY)
  }

  canvasClick(evt:any) {
    var rect = this.cnv.getBoundingClientRect();
    var mouseX = evt.clientX - rect.left
    var mouseY = evt.clientY - rect.top
    this.clickedTile = <Tile>this.canvasService.getMouseoverTile(mouseX, mouseY)
    console.log(this.clickedTile)
  }

}

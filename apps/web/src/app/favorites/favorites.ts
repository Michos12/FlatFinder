import { Component } from '@angular/core';
import { DataService } from '../home-page/lands';
import { Land } from '../models/land';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  lands: Land[];

  constructor(private dataService: DataService) {
    this.lands = dataService.lands;
  }
}

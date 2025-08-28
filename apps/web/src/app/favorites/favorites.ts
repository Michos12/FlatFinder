import { Component } from '@angular/core';
import { Land, DataService } from '../home-page/lands';
@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  lands: Land[] = DataService.prototype.lands;
}

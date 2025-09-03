import { Component } from '@angular/core';
import { DataService } from '../home-page/lands';
import { ActivatedRoute } from '@angular/router';
import { Land } from '../models/land';
import { Header } from '../header/header';

@Component({
  selector: 'app-flat-view',
  imports: [Header],
  templateUrl: './flat-view.html',
  styleUrl: './flat-view.css'
})
export class FlatView {
  id: number;
  land: Land;
  constructor(private route: ActivatedRoute, private dataService: DataService) {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      this.land = this.dataService.getElementByIndex(this.id) ? this.dataService.getElementByIndex(this.id)! : (window.alert("Land not found"), {} as Land);
    };
}

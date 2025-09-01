import { Component } from '@angular/core';
import { Land } from '../models/land';
import { DataService } from '../home-page/lands';


// import User 
@Component({
  selector: 'app-my-flats',
  imports: [],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css'
})
export class MyFlats {
  lands: Land[];
  constructor(private dataService: DataService) {
    this.lands = this.dataService.lands;
  }

  // Method to handle adding a new flat
  newFlat() { 
    console.log('New Flat button clicked');
    // Logic to add a new flat goes here
    
  }

  // Method to handle editing a flat
  edit(land: any) {
    console.log('Edit button clicked for land:', land);
    // Logic to edit the flat goes here
  }

  // Method to handle deleting a flat
  delete(land: any) {
    console.log('Delete button clicked for land:', land);
    // Logic to delete the flat goes here
  }
  showNewFlatForm() {
    window.location.href = '/new-flat';
  }
}

import { Component } from '@angular/core';
import { Land } from '../models/land';


// import User 
@Component({
  selector: 'app-my-flats',
  imports: [],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css'
})
export class MyFlats {
  lands: Land[] = [
    {
      city: 'Vancouver',
      streetName: 'Kingsway',
      streetNumber: 2917,
      areaSize: 40,
      ac: true,
      year: 2000,
      price: 2500,
      date: new Date('2025-02-23'),
      description: 'Pacific place in the big street and next to the bus stop, perfect for busy people',
      imageUrl: 'assets/house.jpg',
    },
    {
      city: 'Vancouver',
      streetName: 'Wakefield',
      streetNumber: 3000,
      areaSize: 20,
      ac: false,
      year: 1990,
      price: 2000,
      date: new Date('2026-04-16'),
      description: 'Nearby the beach, perfect for your summer experience and have fun with friends',
      imageUrl: 'assets/house.jpg',

    },
    {
      city: 'Langley',
      streetName: 'Comercial',
      streetNumber: 1000,
      areaSize: 10,
      ac: true,
      year: 2016,
      price: 1900,
      date: new Date('2025-07-20'),
      description: 'Placed nearby a lot of shops and plenty of places to do funny stuff, perfect for families',
      imageUrl: 'assets/house2.jpg'
    }
  ];

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
}

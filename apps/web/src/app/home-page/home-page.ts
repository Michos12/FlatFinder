//Inteface for flat user
import { Component } from '@angular/core';

export interface Land{
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  ac: boolean;
  year: number;
  price: number;
  date: Date;
  description: string;
  imageUrl: string | null;
}

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
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
  // Function to toggle the visibility of the dropdown content
  showContent(element:HTMLDivElement): void {
    element.classList.toggle('show');
  }
  //Will add 'add_to_favourites' function
  addFav(land: Land) {
    // if(user.favourites.includes(land)){
    //   window.alert("This land is already in your favourites");
    // }
    // else{
    //   user.favourites.push(land);
    //   window.alert("Land added to favourites");
    // }
    window.alert(`Adding to favourites`);
}
};

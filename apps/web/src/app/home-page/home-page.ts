import { Component } from '@angular/core';

export interface Land{
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  address: string;
  price: number;
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
      id: 1,
      title: 'Normal Deparment',
      description: 'Normal house with 3 ocuppants, is petfrienly and has a garden',
      imageUrl: 'assets/house.jpg',
      price: 800,
      address: '2917 Kingsway, Vancouver'
    },
    {
      id: 2,
      title: 'Other deparment',
      description: 'Description for Land 2',
      imageUrl: 'assets/house2.jpg',
      price: 1000,
      address: '2952 Kingsway, Vancouver'
    },
    {
      id: 3,
      title: 'Another normal deparment',
      description: 'Description for Land 3',
      imageUrl: 'assets/house3.jpg',
      address: '3000 Kingsway, Vancouver',
      price: 1200,
    }
  ];
}


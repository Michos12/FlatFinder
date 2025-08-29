import { Injectable } from "@angular/core";
import { Land } from "../models/land";

@Injectable({
  providedIn: 'root'
})
export class DataService{
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
        imageUrl: 'assets/houses/house.jpg',
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
        imageUrl: 'assets/houses/house2.jpg',
  
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
        imageUrl: 'assets/houses/house3.jpg'
      },
      {
        city: 'Toronto',
        streetName: 'Queen St',
        streetNumber: 1045,
        areaSize: 55,
        ac: true,
        year: 2015,
        price: 3200,
        date: new Date('2025-01-12'),
        description: 'Modern apartment with skyline views and walking distance to downtown.',
        imageUrl: 'assets/houses/house4.jpg'
      },
      {
        city: 'Calgary',
        streetName: 'Elbow Dr',
        streetNumber: 237,
        areaSize: 70,
        ac: false,
        year: 1998,
        price: 1800,
        date: new Date('2024-11-05'),
        description: 'Cozy family house with a large backyard and nearby schools.',
        imageUrl: 'assets/houses/house5.jpg'
      },
      {
        city: 'Montreal',
        streetName: 'Saint Laurent',
        streetNumber: 809,
        areaSize: 60,
        ac: true,
        year: 2007,
        price: 2400,
        date: new Date('2025-03-14'),
        description: 'Stylish loft in the heart of the city with exposed brick walls.',
        imageUrl: 'assets/houses/house6.jpg'
      },
      {
        city: 'Vancouver',
        streetName: 'Broadway',
        streetNumber: 1330,
        areaSize: 45,
        ac: false,
        year: 1985,
        price: 2100,
        date: new Date('2024-12-21'),
        description: 'Affordable unit close to SkyTrain and shopping centers.',
        imageUrl: 'assets/houses/house7.jpg'
      },
      {
        city: 'Ottawa',
        streetName: 'Bank St',
        streetNumber: 621,
        areaSize: 95,
        ac: true,
        year: 2012,
        price: 3400,
        date: new Date('2025-04-09'),
        description: 'Spacious condo with underground parking and river views.',
        imageUrl: 'assets/houses/house8.jpg'
      },
      {
        city: 'Edmonton',
        streetName: 'Whyte Ave',
        streetNumber: 407,
        areaSize: 58,
        ac: true,
        year: 2001,
        price: 2200,
        date: new Date('2025-02-28'),
        description: 'Trendy apartment near nightlife, cafes, and art galleries.',
        imageUrl: 'assets/houses/house9.jpg'
      },
      {
        city: 'Quebec City',
        streetName: 'Grande Allée',
        streetNumber: 92,
        areaSize: 82,
        ac: false,
        year: 1992,
        price: 2000,
        date: new Date('2024-09-18'),
        description: 'Charming stone house with historic details and garden.',
        imageUrl: 'assets/houses/house10.jpg'
      },
      {
        city: 'Halifax',
        streetName: 'Barrington St',
        streetNumber: 359,
        areaSize: 40,
        ac: true,
        year: 2018,
        price: 1500,
        date: new Date('2025-05-06'),
        description: 'Compact studio ideal for students and young professionals.',
        imageUrl: 'assets/houses/house11.jpg'
      },
      {
        city: 'Winnipeg',
        streetName: 'Portage Ave',
        streetNumber: 812,
        areaSize: 110,
        ac: true,
        year: 2010,
        price: 2800,
        date: new Date('2025-06-01'),
        description: 'Large suburban house with double garage and basement.',
        imageUrl: 'assets/houses/house12.jpg'
      },
      {
        city: 'Victoria',
        streetName: 'Douglas St',
        streetNumber: 145,
        areaSize: 52,
        ac: false,
        year: 1999,
        price: 1900,
        date: new Date('2025-07-11'),
        description: 'Peaceful apartment close to the harbour and ferry terminal.',
        imageUrl: 'assets/houses/house13.jpg'
      },
      {
        city: 'Kelowna',
        streetName: 'Bernard Ave',
        streetNumber: 731,
        areaSize: 76,
        ac: true,
        year: 2006,
        price: 2600,
        date: new Date('2024-10-23'),
        description: 'Bright unit with balcony overlooking the Okanagan Lake.',
        imageUrl: 'assets/houses/house14.jpg'
      },
      {
        city: 'London',
        streetName: 'Richmond St',
        streetNumber: 521,
        areaSize: 88,
        ac: false,
        year: 1995,
        price: 1750,
        date: new Date('2025-01-29'),
        description: 'Spacious townhouse located in a quiet family-friendly area.',
        imageUrl: 'assets/houses/house15.jpg'
      },
      {
        city: 'Saskatoon',
        streetName: '8th St',
        streetNumber: 267,
        areaSize: 66,
        ac: true,
        year: 2013,
        price: 2100,
        date: new Date('2025-02-19'),
        description: 'Modern flat near shopping malls and public transit routes.',
        imageUrl: 'assets/houses/house16.jpg'
      },
      {
        city: 'Regina',
        streetName: 'Albert St',
        streetNumber: 1440,
        areaSize: 72,
        ac: true,
        year: 2008,
        price: 2300,
        date: new Date('2025-03-25'),
        description: 'Comfortable home with renovated kitchen and fenced yard.',
        imageUrl: 'assets/houses/house17.jpg'
      },
      {
        city: 'Hamilton',
        streetName: 'Main St',
        streetNumber: 907,
        areaSize: 64,
        ac: false,
        year: 1980,
        price: 1600,
        date: new Date('2025-04-15'),
        description: 'Affordable basement suite close to downtown Hamilton.',
        imageUrl: 'assets/houses/house18.jpg'
      },
      {
        city: 'Whistler',
        streetName: 'Village Stroll',
        streetNumber: 31,
        areaSize: 49,
        ac: true,
        year: 2019,
        price: 3000,
        date: new Date('2025-05-19'),
        description: 'Ski-in/ski-out condo with mountain views and fireplace.',
        imageUrl: 'assets/houses/house19.jpg'
      },
      {
        city: 'Banff',
        streetName: 'Banff Ave',
        streetNumber: 201,
        areaSize: 53,
        ac: false,
        year: 1997,
        price: 2200,
        date: new Date('2025-06-30'),
        description: 'Rustic cabin-style apartment in the heart of the Rockies.',
        imageUrl: 'assets/houses/house20.jpg'
      },
      {
        city: 'St. John’s',
        streetName: 'Water St',
        streetNumber: 414,
        areaSize: 59,
        ac: true,
        year: 2011,
        price: 1700,
        date: new Date('2024-08-14'),
        description: 'Colourful row house with ocean views and cozy interior.',
        imageUrl: 'assets/houses/house21.jpg'
      },
      {
        city: 'Niagara Falls',
        streetName: 'Clifton Hill',
        streetNumber: 88,
        areaSize: 77,
        ac: true,
        year: 2005,
        price: 2500,
        date: new Date('2025-02-08'),
        description: 'Tourist area apartment with large balcony and bright rooms.',
        imageUrl: 'assets/houses/house22.jpg'
      },
      {
        city: 'Kamloops',
        streetName: 'Victoria St',
        streetNumber: 612,
        areaSize: 68,
        ac: false,
        year: 1994,
        price: 1850,
        date: new Date('2025-07-23'),
        description: 'Quiet home near parks, hiking trails, and shopping areas.',
        imageUrl: 'assets/houses/house23.jpg'
      },
  ];
  
  getElementByIndex(index: number): Land | undefined {
    return this.lands[index];
  }
  editElement(index: number, newLand: Land): void {
    this.lands[index] = { ...this.lands[index], ...newLand };
  }
}
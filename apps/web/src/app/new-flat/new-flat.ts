import { Component } from '@angular/core';
import { Land } from '../models/land';


@Component({
  selector: 'app-new-flat',
  imports: [],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})
export class NewFlat {
  createFlat() {
    // Logic to create a new flat
    const newFlat: Land = {
      city: (document.querySelector('#city') as HTMLInputElement).value,
      streetName: (document.querySelector('#streetName') as HTMLInputElement).value,
      streetNumber: (document.querySelector('#streetNumber') as HTMLInputElement).valueAsNumber,
      areaSize: (document.querySelector('#areaSize') as HTMLInputElement).valueAsNumber,
      ac: (document.querySelector('#ac') as HTMLInputElement).checked,
      year: (document.querySelector('#year') as HTMLInputElement).valueAsNumber,
      price: (document.querySelector('#price') as HTMLInputElement).valueAsNumber,
      date: (document.querySelector('#date') as HTMLInputElement).valueAsDate? new Date((document.querySelector('#date') as HTMLInputElement).value) : new Date(),
      description: (document.querySelector('#description') as HTMLInputElement).value,
      imageUrl: (document.querySelector('#imageUrl') as HTMLInputElement).value
    };
    return newFlat;
  }
  showData(){
    console.log(this.createFlat());
  }
}

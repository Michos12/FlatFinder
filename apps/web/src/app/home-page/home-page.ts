//Inteface for flat user
import { Component } from '@angular/core';
import { Land, DataService } from './lands';
import { UrlService } from './url-service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  lands: Land[] = [];
  constructor(private urlService: UrlService, private dataService: DataService) {
    this.lands = this.dataService.lands;
  }

  
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
  viewDetails(index:number){
    console.log(`Navigating to details of land index: ${index}`);
    this.urlService.navigateToFlatView(index);
  }
}

//Inteface for flat user
import { Component, OnInit } from '@angular/core';
import { DataService } from './lands';
import { UrlService } from './url-service';
import { Land } from '../models/land';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  lands: Land[] = [];
  currentUser: User | null = null;
  constructor(private urlService: UrlService, private dataService: DataService, private router: Router) {
    this.lands = this.dataService.lands;

     
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') { 
      const currentUserString = localStorage.getItem('currentUser');
      if (!currentUserString) {
        this.router.navigate(['/register']);
        return;
      }
      else {
        this.currentUser = JSON.parse(currentUserString) as User;
        console.log(this.currentUser)
      }
    }

    this.lands = this.dataService.lands;
  }

  
  // Function to toggle the visibility of the dropdown content
  showContent(element:HTMLDivElement): void {
    element.classList.toggle('show');
  }
  //Will add 'add_to_favourites' function
  addFav(land: Land): void {
      const currentUserString = localStorage.getItem('currentUser');
      this.currentUser = JSON.parse(currentUserString || '{}') as User;
      if(this.currentUser.favorites) {
        if(this.currentUser.favorites.includes(land)){
          window.alert("This land is already in your favourites");
        }
        else{
          this.currentUser.favorites.push(land);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          window.alert(`Adding to favourites`);
        }
      }
  }
  viewDetails(index:number){
    console.log(`Navigating to details of land index: ${index}`);
    this.urlService.navigateToFlatView(index);
  }
}

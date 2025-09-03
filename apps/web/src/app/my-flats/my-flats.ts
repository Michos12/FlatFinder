import { Component } from '@angular/core';
import { Land } from '../models/land';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-flats',
  templateUrl: './my-flats.html',
  styleUrls: ['./my-flats.css']
})
export class MyFlats {
  lands: Land[];
  currentUser: User | null = null;
  alertMessage: string | null = null;
  deleteLand: Function;
  constructor(private userService: UserService, private router: Router) {
    this.deleteLand = this.userService.deleteLand.bind(this.userService);
    this.currentUser = this.userService.getCurrentUser();
    if(this.currentUser){
      if(this.currentUser.lands){
        this.lands = this.currentUser.lands;
      }
      else{
        this.lands = [];
        this.alertMessage = 'No lands found for the current user.';
      }
    }
    else{
      this.lands = [];
      this.alertMessage = 'Please log in to view your lands.';
    }
  }
  showNewFlatForm() {
    this.router.navigate(['/new-flat']);
  }
}
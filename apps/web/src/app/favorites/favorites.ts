import { Component, OnInit } from '@angular/core';
import { Land } from '../models/land';
import { User } from '../models/user';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit{
  lands: Land[];
  currentUser: User | null = null;

  constructor() {
    const currentUserString = localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : this.currentUser = null;
    if (currentUserString !== null) {
      this.currentUser = JSON.parse(currentUserString) as User;
    }
    this.lands = this.currentUser?.favorites || [];
  }

  ngOnInit(): void {
   if(this.lands.length === 0) {
     const message = document.createElement('h1') as HTMLHeadingElement;
     message.textContent = 'No favorite lands found.';
     document.body.appendChild(message);
   }
  }
}

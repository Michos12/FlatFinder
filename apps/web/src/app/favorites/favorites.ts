import { Component, Inject, PLATFORM_ID } from '@angular/core'; // <-- MODIFIED
import { isPlatformBrowser } from '@angular/common'; // <-- NEW
import { Land } from '../models/land';
import { User } from '../models/user';
import { Header } from '../header/header';
import { UserService } from '../services/userService';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
  imports: [Header]
})
export class Favorites{
  lands: Land[] = []; 
  currentUser: User | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private userService: UserService) { 
    if (isPlatformBrowser(this.platformId)) { 
      const currentUser = this.userService.getCurrentUser();
      if (currentUser) {
        this.currentUser = currentUser;
        this.lands = this.currentUser.favorites || [];
      }
    }
  }
}

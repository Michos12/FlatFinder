import { Component } from '@angular/core';
import { UserService } from '../services/userService';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  user: User | null = null;
  constructor(private userService: UserService, private router: Router) {
    this.user = this.userService.getCurrentUser();
  }
    // Function to toggle the visibility of the dropdown content
    showContent(element:HTMLDivElement): void {
      element.classList.toggle('show');
    }
    logOut():void{
      this.userService.logout();
      this.user = null;
      this.router.navigate(['/login']);
    }
}

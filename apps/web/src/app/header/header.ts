import { Component } from '@angular/core';
import { UserService } from '../services/userService';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  user: User | null = null;
  constructor(private userService: UserService) {
    this.user = this.userService.getCurrentUser();
  }
    // Function to toggle the visibility of the dropdown content
    showContent(element:HTMLDivElement): void {
      element.classList.toggle('show');
    }
    
}

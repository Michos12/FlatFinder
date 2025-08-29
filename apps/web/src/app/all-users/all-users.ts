import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-all-users',
  imports: [CommonModule],
  templateUrl: './all-users.html',
  styleUrl: './all-users.css'
})
export class AllUsers implements OnInit {
    users: any[] = [];

  ngOnInit(): void {
    const usersData = localStorage.getItem('users');
    this.users = usersData ? JSON.parse(usersData) : [];
  }
}

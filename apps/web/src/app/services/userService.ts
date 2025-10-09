import { Injectable, Inject, PLATFORM_ID } from '@angular/core';    
import { isPlatformBrowser } from '@angular/common'; 
import { User } from '../models/user';
import { Land } from '../models/land';
import { FirebaseService } from '../services/firebase/functions'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentKey = 'currentUser';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private firebaseService: FirebaseService) { 
    this.isBrowser = isPlatformBrowser(this.platformId); 
  }

  addUser(user: User): void {
    this.firebaseService.addUser(user);
  }

  findByEmail(email: string): User | undefined {
    let u;
    this.firebaseService.getUsers().then(
      users => u = users.find(u => u.email === email)
    );
    return u;
  }

  login(email: string, password: string): boolean {
    const user = this.firebaseService.getUsers().then(users => users.find(
      u => u.email === email && u.password === password
    ));
    if (user) {
      localStorage.setItem(this.currentKey, JSON.stringify(user));
      return true;
    } else {
      console.log("Login failed: Invalid email or password.");
      return false; 
    }
  }

  getCurrentUser(): User | null {
    if (this.isBrowser) { 
        const data = localStorage.getItem(this.currentKey);
        if (data) {
          return JSON.parse(data);
        }
        else {
          console.log("No current user found in localStorage, please log in.");
          return null; 
        }
    }
    return null; 
  }

  logout(): void {
    if (this.isBrowser) { 
      localStorage.removeItem(this.currentKey);
    }
  }

  addLand(land: Land): void {
    const user = this.getCurrentUser();
    if (user) {
      user.lands = user.lands || [];
      user.lands.push(land);
      localStorage.setItem(this.currentKey, JSON.stringify(user));
      this.firebaseService.addUser(user, true);
    }
  }
  
  deleteLand(land: Land): void {
      const user = this.getCurrentUser();
      if (user) {
        user.lands = user.lands || [];
        user.lands = user.lands.filter(l => l != land);
        localStorage.setItem(this.currentKey, JSON.stringify(user));
        this.firebaseService.addUser(user, true);
      }
  }
}
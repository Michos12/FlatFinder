import { Injectable, Inject, PLATFORM_ID } from '@angular/core';    
import { isPlatformBrowser } from '@angular/common'; 
import { User } from '../models/user';
import { Land } from '../models/land';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';
  public currentKey = 'currentUser';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    this.isBrowser = isPlatformBrowser(this.platformId); 
  }

  getUsers(): User[] {
    if (this.isBrowser) { 
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }
    return []; 
  }

  private saveUsers(users: User[]): void {
    if (this.isBrowser) { 
      localStorage.setItem(this.storageKey, JSON.stringify(users));
    }
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  findByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  login(email: string, password: string): boolean {
    if (this.isBrowser) { 
        const user = this.getUsers().find(
          u => u.email === email && u.password === password
        );
        if (user) {
          localStorage.setItem(this.currentKey, JSON.stringify(user));
          return true;
        }
    }
    return false; 
  }

  getCurrentUser(): User | null {
    if (this.isBrowser) { 
        const data = localStorage.getItem(this.currentKey);
        if (data) {
          return JSON.parse(data);
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
    if (this.isBrowser) { 
        const user = this.getCurrentUser();
        if (user) {
          user.lands = user.lands || [];
          user.lands.push(land);
          const users = this.getUsers();
          const userIndex = users.findIndex(u => u.email === user.email);
          if (userIndex > -1) {
            users[userIndex] = user;
            this.saveUsers(users);
          }
          localStorage.setItem(this.currentKey, JSON.stringify(user));
        }
    }
  }
  deleteLand(land: Land): void {
      const user = this.getCurrentUser();
      if (user) {
        user.lands = user.lands || [];
        user.lands = user.lands.filter(l => l != land);
        localStorage.setItem(this.currentKey, JSON.stringify(user));
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex > -1) {
          this.saveUsers(users);
          users[userIndex] = user;
          this.saveUsers(users);
        }
        localStorage.setItem(this.currentKey, JSON.stringify(user));
      }
  }
}
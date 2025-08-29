
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';
  private currentKey = 'currentUser';

  getUsers(): User[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
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
    const user = this.getUsers().find(
      u => u.email === email && u.password === password
    );
    if (user) {
      localStorage.setItem(this.currentKey, JSON.stringify(user));
      return true;
    }
    return false;
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentKey);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.currentKey);
  }
}

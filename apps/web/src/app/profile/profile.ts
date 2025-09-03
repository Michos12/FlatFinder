import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/userService';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  form!: FormGroup;
  user: User | null = null;
  editing = false;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.user = this.userService.getCurrentUser();
    if(!this.user) {
      this.router.navigate(['/login']);
    }
    else{
      this.user = this.userService.getCurrentUser();
    }
  }

  ngOnInit(): void {
    // Crear el form vacío
    this.form = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
      ]],
    });

    // Rellenar con los datos del usuario
    this.form.patchValue(this.user!);
  }

  toggleEdit() {
    this.editing = !this.editing;

    if (this.editing) {
     
      this.form.patchValue(this.user!);
    }
  }

  saveChanges() {
    if (this.form.valid) {
      const updatedUser = this.form.value;

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex((u: any) => u.email === this.user!.email);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      this.user = updatedUser;
      this.editing = false;
    } else {
      this.form.markAllAsTouched();
    }
  }
}

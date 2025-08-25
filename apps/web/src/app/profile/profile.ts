import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
   form: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {
   
    const user = {
      firstName: 'Rodrigo',
      lastName: 'Ticona',
      email: 'rodrigo@example.com',
      birthDate: '2000-09-23'
    };

    this.form = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [user.email, [Validators.required, Validators.email]],
      birthDate: [user.birthDate, [Validators.required]]
    });

    this.form.disable(); 
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.isEditing ? this.form.enable() : this.form.disable();
  }

  onSave() {
    if (this.form.valid) {
      console.log('Perfil actualizado:', this.form.value);
      this.toggleEdit();
    } else {
      this.form.markAllAsTouched();
    }
  }
}

import { Component } from '@angular/core';
import { Land } from '../models/land';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})
export class NewFlat {
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.form = this.fb.group({
      city: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: [null, Validators.required],
      areaSize: [null, Validators.required],
      ac: [false],
      year: [null, Validators.required],
      price: [null, Validators.required],
      date: [null, Validators.required],
      description: ['Empty description', Validators.required],
      imageUrl: ['assets/houses/house.jpg', Validators.required]
    });
  }

  createFlat() {
    if (this.form.valid) {
      const land: Land = this.form.value;
      this.userService.addLand(land);
      console.log('Flat created:', land);
      this.form.reset();
      this.router.navigate(['/my-flats']);
    } 
    else {
      this.form.markAllAsTouched(); 
      console.log('Form is invalid');
    }
  }
  showData() {
    console.log(this.form.value);
  }
}
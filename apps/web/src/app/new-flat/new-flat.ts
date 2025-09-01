import { Component } from '@angular/core';
import { Land } from '../models/land';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/userService';

@Component({
  selector: 'app-new-flat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-flat.html',
  styleUrl: './new-flat.css'
})
export class NewFlat {
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      city: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: [0, Validators.required],
      areaSize: [0, Validators.required],
      ac: [false, Validators.required],
      year: [0, Validators.required],
      price: [0, Validators.required],
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required]
    });
  }

  createFlat() {
    if(this.form.valid){
      const land: Land = this.form.value;
      this.userService.addLand(land);
      console.log('Flat created:', land);
      console.log(this.userService.getCurrentUser());
     //window.location.href = '/my-flats';
    }
    else{
      this.form.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
  showData(){
    console.log(this.form.value);
    console.log(this.userService.getCurrentUser());
  }
}

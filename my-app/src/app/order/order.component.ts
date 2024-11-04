import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
})
export class OrderComponent {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.orderForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      packageDetails: ['', Validators.required],
      deliveryTime: [''],
      userId: [1, Validators.required], // Assuming you have user ID available
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      // Prepare the data in the required format
      const payload = {
        pickup_location: this.orderForm.value.pickupLocation,
        dropoff_location: this.orderForm.value.dropoffLocation,
        package_details: this.orderForm.value.packageDetails,
        delivery_time: this.orderForm.value.deliveryTime,
        user_id: this.orderForm.value.userId,
      };

      console.log('Form Data:', payload); // Log the payload data

      this.http.post('http://localhost:4300/create-order', payload)
        .subscribe(
          response => {
            console.log('Order created successfully', response);
          },
          error => {
            console.error('Error creating order', error);
          }
        );
    } else {
      console.error('Form is invalid');
    }
  }
}

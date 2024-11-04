import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
})
export class OrderComponent {
  orderForm: FormGroup;
  errorMessage: string | null = null; // Variable to hold error messages

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) { // Inject Router
    this.orderForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      packageDetails: ['', Validators.required],
      deliveryTime: [''],
      userId: [this.authService.getUserId(), Validators.required], // Dynamically get user ID
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
            alert('Order created successfully!'); // Show success alert
            this.router.navigate(['/home']); // Redirect to home page
          },
          error => {
            console.error('Error creating order', error);
            this.errorMessage = error.error.message || 'An error occurred while creating the order.'; // Set error message
          }
        );
    } else {
      console.error('Form is invalid');
      this.errorMessage = 'Please fill in all required fields.'; // Set error message for invalid form
    }
  }

  // Method to navigate to the home page
  goHome() {
    this.router.navigate(['/home']);
  }
}

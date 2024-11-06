import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-user-create-order',
  templateUrl: './user-create-order.component.html',
  styleUrls: ['./user-create-order.component.css']
})
export class UserCreateOrderComponent {

  orderForm: FormGroup;
  errorMessage: string | null = null; // Variable to hold error messages

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) { // Inject Router
    // Set default deliveryTime to current date and time plus 24 hours
    const defaultDeliveryTime = this.getDefaultDeliveryTime();

    this.orderForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      packageDetails: ['', Validators.required],
      deliveryTime: [defaultDeliveryTime],
      userId: [this.authService.getUserId(), Validators.required], // Dynamically get user ID
    });
  }

  // Method to get the default delivery time as current date and time plus 24 hours
  private getDefaultDeliveryTime(): string {
    const date = new Date();
    date.setHours(date.getHours() + 24); // Add 24 hours
    return date.toISOString().slice(0, 16); // Format as "yyyy-MM-ddTHH:mm" for datetime-local
  }

  onSubmit() {
    if (this.orderForm.valid) {
      // Prepare the data in the required format
      const payload = {
        pickup_location: this.orderForm.value.pickupLocation,
        dropoff_location: this.orderForm.value.dropoffLocation,
        package_details: this.orderForm.value.packageDetails,
        delivery_time: this.orderForm.value.deliveryTime || null, // Null if not provided
        user_id: this.orderForm.value.userId,
      };

      console.log('Form Data:', payload); // Log the payload data

      this.http.post('http://localhost:4300/create-order', payload)
        .subscribe(
          response => {
            console.log('Order created successfully', response);
            alert('Order created successfully!'); // Show success alert
            this.router.navigate(['/user-home']); // Redirect to home page
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
    this.router.navigate(['/user-home']);
  }
}

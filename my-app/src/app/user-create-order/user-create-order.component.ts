import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-create-order',
  templateUrl: './user-create-order.component.html',
  styleUrls: ['./user-create-order.component.css']
})
export class UserCreateOrderComponent {

  orderForm: FormGroup;
  errorMessage: string | null = null;
  errorMessages: { pickupLoc?: string; dropoffLoc?: string; details?: string; general?: string } = {};
  successMessage: string = '';
  pickupLocation: any;
  dropoffLocation: any;
  packageDetails: any;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService,) {

    const defaultDeliveryTime = this.getDefaultDeliveryTime();

    this.orderForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      packageDetails: ['', Validators.required],
      deliveryTime: [defaultDeliveryTime],
      userId: [this.authService.getUserId(), Validators.required],
    });
  }


  private getDefaultDeliveryTime(): string {
    const date = new Date();
    date.setHours(date.getHours() + 24); // Add 24 hours
    return date.toISOString().slice(0, 16); // Format as "yyyy-MM-ddTHH:mm" for datetime-local
  }

  onSubmit() {
    this.errorMessages = {};
    this.successMessage = '';
    if (this.orderForm.valid) {
      const payload = {
        pickup_location: this.orderForm.value.pickupLocation,
        dropoff_location: this.orderForm.value.dropoffLocation,
        package_details: this.orderForm.value.packageDetails,
        delivery_time: this.orderForm.value.deliveryTime || null,
        user_id: this.orderForm.value.userId,
      };

      console.log('Form Data:', payload);

      this.userService.createOrder(payload).subscribe(
        response => {
          console.log('Order created successfully', response);
          this.successMessage = 'Order created successfully!';
          setTimeout(() => {
            this.router.navigate(['/user-order-list']);
          }, 1000);
        },
        error => {
          console.error('Error creating order', error);
          this.errorMessages.general = error.error?.error || 'An error occurred while creating the order.';
        }
      );
    } else {
      console.error('Form is invalid');
      this.markFormFieldsTouched();
    }
  }

  private markFormFieldsTouched() {
    Object.keys(this.orderForm.controls).forEach(field => {
      const control = this.orderForm.get(field);
      control?.markAsTouched({onlySelf: true});
    });
  }
}

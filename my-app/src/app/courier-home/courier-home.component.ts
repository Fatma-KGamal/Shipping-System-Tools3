// home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courier-home',
  templateUrl: './courier-home.component.html',
})
export class CourierHomeComponent {
  userId: number | null = null; // Assuming you fetch this value appropriately

  constructor(private router: Router) {}

  // Navigate to Order List
  goToAllOrders() {
    this.router.navigate(['/courier-order-list']);
  }

  // Navigate to Order
  goToMyOrders() {
    this.router.navigate(['/courier-orders']);
  }
}

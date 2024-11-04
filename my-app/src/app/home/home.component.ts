// home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  userId: number | null = null; // Assuming you fetch this value appropriately

  constructor(private router: Router) {}

  // Navigate to Order List
  goToOrderList() {
    this.router.navigate(['/order-list']);
  }

  // Navigate to Order
  goToOrder() {
    this.router.navigate(['/order']);
  }
}

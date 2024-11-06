import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent {

  userId: number | null = null; // Assuming you fetch this value appropriately

  constructor(private router: Router) {}

  // Navigate to Order List
  goToOrderList() {
    this.router.navigate(['/user-order-list']);
  }

  // Navigate to Order
  goToOrder() {
    this.router.navigate(['/user-create-order']);
  }

}

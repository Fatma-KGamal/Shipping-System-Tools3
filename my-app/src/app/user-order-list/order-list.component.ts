import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Import the AuthService
import { Router } from '@angular/router'; // Import Router for navigation

interface Order {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  delivery_time: string;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = []; // Use the Order interface to define the type

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {} // Inject AuthService and Router

  ngOnInit() {
    this.getUserOrders(); // Fetch orders when the component initializes
  }

  getUserOrders() {
    const userId = this.authService.getUserId(); // Get the user ID from AuthService
    if (userId !== null) { // Check if userId is available
      this.http.get<Order[]>(`http://localhost:4300/get-user-orders?user_id=${userId}`)
        .subscribe(
          (data: Order[]) => { // Specify the data type as Order[]
            this.orders = data; // Store the fetched orders
          },
          error => {
            console.error('Error fetching orders', error);
          }
        );
    } else {
      console.error('No user ID found'); // Handle the case when no user ID is available
    }
  }

  viewOrderDetails(orderId: number): void {
    // Redirect to user-order-detail component with the order ID
    this.router.navigate(['/user-order-detail', orderId]);
  }

  deleteOrder(orderId: number) {
    this.http.delete(`http://localhost:4300/delete-order?order_id=${orderId}`)
      .subscribe(
        response => {
          console.log('Order deleted successfully', response);
          // Remove the deleted order from the list
          this.orders = this.orders.filter(order => order.id !== orderId);
        },
        error => {
          console.error('Error deleting order', error);
        }
      );
  }

  // Method to navigate to the home page
  goHome() {
    this.router.navigate(['/user-home']); // Redirect to the home page
  }
}

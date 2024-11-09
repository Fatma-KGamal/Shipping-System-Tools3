import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


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
  selector: 'app-user-order-list',
  templateUrl: './user-order-list.component.html',
  styleUrls: ['./user-order-list.component.css']
})
export class UserOrderListComponent implements OnInit{
  orders: Order[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor( private authService: AuthService, private router: Router,private userService: UserService) {} // Inject AuthService and Router

  ngOnInit() {
    this.getUserOrders();
  }

  getUserOrders() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userService.getUserOrders(userId).subscribe(
        (data: Order[]) => {
          this.orders = data;
        },
        error => {
          console.error('Error fetching orders', error);
        }
      );
    } else {
      console.error('No user ID found');
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/user-order-detail', orderId]);
  }

  deleteOrder(orderId: number) {
    this.userService.deleteOrder(orderId).subscribe(
      response => {
        console.log('Order deleted successfully', response);
        this.successMessage = 'Order deleted successfully';
        this.orders = this.orders.filter(order => order.id !== orderId);
      },
      error => {
        console.error('Error deleting order', error);
        this.errorMessage = 'Error deleting order';
      }
    );
  }

}


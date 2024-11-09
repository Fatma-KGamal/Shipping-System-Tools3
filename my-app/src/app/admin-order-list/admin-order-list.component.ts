import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {AdminService} from '../admin.service';
import {Router} from '@angular/router';

interface Order {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  delivery_time: string;
  user_id: number;
  status: string;
  // CourierStatus: string;
  created_at: string;
  updated_at: string;
  courier_id?: number;
}

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  orders: Order[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private adminService: AdminService, private router: Router) {
  }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    const adminId = this.authService.getUserId();
    if (adminId !== null) {
      this.adminService.getOrders().subscribe(
        (data: Order[]) => {
          this.orders = data;
        },
        error => {
          console.error('Error fetching orders', error);
        }
      );
    } else {
      console.error('No admin ID found');
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/admin-order-detail', orderId]);
  }

  deleteOrder(orderId: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      this.successMessage = '';
      this.errorMessage = '';
      this.adminService.deleteOrder(orderId).subscribe(
        response => {
          console.log('Order deleted successfully', response);
          this.successMessage = 'Order deleted successfully';
          this.orders = this.orders.filter(order => order.id !== orderId);
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
        },
        error => {
          console.error('Error deleting order', error);
          this.errorMessage = 'Error deleting order';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }
      );
    }
  }

  editOrder(orderId: number) {
    this.router.navigate(['/admin-edit-order', orderId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/landingpage']);
  }


}

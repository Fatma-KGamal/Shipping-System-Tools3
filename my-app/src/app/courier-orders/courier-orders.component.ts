import {Component, OnInit} from '@angular/core';
import {CourierService} from "../courier.service";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

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
  courier_id?: number;
}

@Component({
  selector: 'app-courier-orders',
  templateUrl: './courier-orders.component.html',
  styleUrls: ['./courier-orders.component.css']
})
export class CourierOrdersComponent implements OnInit {

  orders: Order[] = [];
  showActions = false;
  courier_id: number = 0;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private courierService: CourierService, private router: Router) {
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.courier_id = userId !== null ? userId : 0;
    this.getAcceptedOrders();
  }

  getAcceptedOrders() {
    this.courierService.getAcceptedOrders(this.courier_id).subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      error => {
        console.error('Error fetching accepted orders', error);
      }
    );
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/courier-order-detail', orderId]);
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.courierService.updateOrderStatus(orderId, status).subscribe(
      () => {
        this.getAcceptedOrders();
        this.successMessage = 'Order status updated successfully';
      },
      (error) => {
        console.error('Update Order Status Error:', error);
        this.errorMessage = 'Could not update order status. Please try again.';
      }
    );
  }

}

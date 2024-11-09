import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CourierService} from "../courier.service";
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
  selector: 'app-courier-order-list',
  templateUrl: './courier-order-list.component.html',
  styleUrls: ['./courier-order-list.component.css']
})
export class CourierOrderListComponent implements OnInit {
  orders: Order[] = [];
  courier_id: number = 0;
  showActions = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private courierService: CourierService, private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    const userId = this.authService.getUserId();
    this.courier_id = userId !== null ? userId : 0;
    this.getAssignedOrders();
  }

  getAssignedOrders() {
    this.courierService.getAssignedOrders(this.courier_id).subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      error => {
        console.error('Error fetching assigned orders', error);
      }
    );
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/courier-order-detail', orderId]);
  }

  acceptOrder(orderId: number) {
    this.courierService.acceptOrder(orderId).subscribe(
      response => {
        console.log('Order Accepted Successfully', response);
        this.successMessage = 'Order Accepted Successfully';
        const order = this.orders.find(o => o.id === orderId);
        this.orders = this.orders.map(order =>
          order.id === orderId ? { ...order, status: 'accepted' } : order
        );
        setTimeout(() => this.successMessage = '', 2000);
        this.getAssignedOrders();
      },
      error => {
        console.error('Error accepting order', error);
        this.errorMessage = 'Error accepting order';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    );
  }

  declineOrder(orderId: number) {
    this.courierService.declineOrder(orderId).subscribe(
      response => {
        console.log('Order Declined Successfully', response);
        this.successMessage = 'Order Declined Successfully';
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = 'declined';
        }
        setTimeout(() => this.successMessage = '', 2000);
        this.getAssignedOrders();
      },
      error => {
        console.error('Error declining order', error);
        this.errorMessage = 'Error declining order';
        setTimeout(() => this.errorMessage = '', 2000);
      }
    );
  }

}

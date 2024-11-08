import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CourierService} from "../courier.service";


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
export class CourierOrderListComponent implements OnInit{
  orders: Order[] = [];

  constructor(private http:HttpClient, private authService: AuthService, private courierService: CourierService, private router: Router) {}

  ngOnInit() {
    this.getAssignedOrders();
  }

  getAssignedOrders() {
    this.courierService.getAssignedOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/courier-order-detail', orderId]);
  }

  acceptOrder(orderId: number) {
    this.courierService.acceptOrder(orderId).subscribe(
      response=> {
        console.log('Order Accepted Successfully',response);
        this.orders = this.orders.filter((order) => order.id !== orderId);
      },
      error => {
        console.error('Error accepting order', error);
      }
    );
  }

  declineOrder(orderId: number) {
    this.courierService.declineOrder(orderId).subscribe(
      response=> {
        console.log('Order Declined Successfully',response);
        this.orders = this.orders.filter((order) => order.id !== orderId);
      },
      error => {
        console.error('Error declining order', error);
      }
    );
  }

}

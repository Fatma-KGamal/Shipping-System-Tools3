import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {CourierService} from "../courier.service";
import {Router} from "@angular/router";

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
export class CourierOrdersComponent implements OnInit{

  orders: Order[] = [];

  constructor(private http:HttpClient, private authService: AuthService, private courierService: CourierService, private router: Router) { }

  ngOnInit(): void {
    this.getAcceptedOrders();
  }

  getAcceptedOrders() {
    this.courierService.getAcceptedOrders().subscribe(
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

}

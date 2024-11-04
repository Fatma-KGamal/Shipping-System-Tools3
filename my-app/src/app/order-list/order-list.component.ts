// src/app/order-list/order-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUserOrders(); // Fetch orders when the component initializes
  }

  getUserOrders() {
    const userId = 1; // Change this to the appropriate user ID
    this.http.get<Order[]>(`http://localhost:4300/get-user-orders?user_id=${userId}`)
      .subscribe(
        (data: Order[]) => { // Specify the data type as Order[]
          this.orders = data; // Store the fetched orders
        },
        error => {
          console.error('Error fetching orders', error);
        }
      );
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})


export class CourierService {

  constructor(private http:HttpClient) { }

  getAssignedOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:4300/get-courier-orders');
  }

  getAcceptedOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:4300/get-accepted-orders');
  }

  getOrderDetails(orderId: number) :Observable<any> {
    return this.http.get(`http://localhost:4300/get-order-details?order_id=${orderId}`);
  }

  acceptOrder(orderId: number): Observable<any> {
    return this.http.put('http://localhost:4300/accept-order', { id: orderId });
  }

  declineOrder(orderId: number): Observable<any> {
    return this.http.put('http://localhost:4300/decline-order', { id: orderId });
  }

}

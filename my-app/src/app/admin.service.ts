import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
export class AdminService {

  constructor(private http:HttpClient) { }

  getOrderDetails(orderId: number) :Observable<any> {
    return this.http.get(`http://localhost:4300/get-order-details?order_id=${orderId}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:4300/get-orders');
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put('http://localhost:4300/update-order-status-admin', { id: orderId, status: status });
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`http://localhost:4300/delete-order-admin?order_id=${orderId}`);
  }

  assignOrder(orderId: number, courierId: number): Observable<any> {
    return this.http.put(`http://localhost:4300/assign-order`, { id: orderId, courier_id: courierId });
  }

  getCouriers(): Observable<Array<{ id: number, username: string }>> {
    return this.http.get<Array<{ id: number, username: string }>>('http://localhost:4300/get-couriers');
  }


}

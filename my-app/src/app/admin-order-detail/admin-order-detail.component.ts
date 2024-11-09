import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../admin.service";

interface Order {
  id: number;
  pickup_location: string;
  dropoff_location: string;
  package_details: string;
  delivery_time: string;
  user_id: number;
  status: string;
  courierStatus: string;
  created_at: string;
  updated_at: string;
  courier_id?: number;
}

@Component({
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-detail.component.html',
  styleUrls: ['./admin-order-detail.component.css']
})
export class AdminOrderDetailComponent implements OnInit{
  orderDetails: Order | null = null;
  errorMessage: string | null = null;
  couriers: Array<{ id: number, username: string }> = [];
  statuses: string[] = ['Pending', 'In Progress', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
  selectedCourierId: number = 0;
  selectedStatus: string = 'Pending';

  constructor(private route: ActivatedRoute, private router: Router, private adminService: AdminService) {
  }

  fetchOrderDetails(orderId: number): void {
    this.adminService.getOrderDetails(orderId).subscribe(
      (response) => {
        console.log('Fetched Order Details:', response);
        this.orderDetails = response;
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.errorMessage = 'Could not fetch order details. Please try again.';
      }
    );
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
    }
  }



}

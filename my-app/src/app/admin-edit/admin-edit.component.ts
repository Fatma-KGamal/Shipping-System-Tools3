import { Component } from '@angular/core';
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
  // courierStatus: string;
  created_at: string;
  updated_at: string;
  courier_id?: number;
}

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent {
  orderDetails: Order | null = null;
  errorMessage: string = '';
  successMessage: string = '';
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

  assignOrder(): void {
    if (this.orderDetails?.id && this.selectedCourierId) {
      this.adminService.assignOrder(this.orderDetails.id, this.selectedCourierId).subscribe(
        () => {
          this.router.navigate(['/admin-order-detail']);
          this.successMessage = 'Order assigned successfully';
        },
        (error) => {
          this.errorMessage = 'Could not assign order. Please try again.';
          console.error('Assign Order Error:', error);
        }
      );
    } else {
      this.errorMessage = 'Order ID or Courier ID is missing';
    }
  }

  updateOrderStatus(): void {
    if (this.orderDetails?.id && this.selectedStatus) {
      this.adminService.updateOrderStatus(this.orderDetails.id, this.selectedStatus).subscribe(
        () => {
          this.router.navigate(['/admin-order-detail']);
          this.successMessage = 'Order status updated successfully';
        },
        (error) => {
          console.error('Update Status Error:', error);
          this.errorMessage = 'Could not update order status. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Order ID or Status is missing';
    }
  }


  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
      this.fetchCouriers();
    }
  }

  fetchCouriers(): void {
    this.adminService.getCouriers().subscribe(
      (response) => {
        this.couriers = response
        console.log('Couriers:', this.couriers);
      },
      (error) => console.error('Error fetching couriers', error)
    );
  }


}

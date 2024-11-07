import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AdminService} from "../admin.service";

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
  selector: 'app-admin-order-detail',
  templateUrl: './admin-order-detail.component.html',
  styleUrls: ['./admin-order-detail.component.css']
})
export class AdminOrderDetailComponent implements OnInit{
  orderDetails: Order | null = null;
  errorMessage: string | null = null;

  constructor(private route:ActivatedRoute, private http: HttpClient, private router: Router, private adminService: AdminService) {}

  fetchOrderDetails(orderId: number): void {
    this.adminService.getOrderDetails(orderId).subscribe(
      (response) => {
        this.orderDetails = response;
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.errorMessage = 'Could not fetch order details. Please try again.';
      }
    );
  }

  // assignOrder(orderId: number, courierId: number): void {
  //   this.adminService.assignOrder(orderId, courierId).subscribe(
  //     (response) => {
  //       this.router.navigate(['/admin/orders']);
  //     },
  //     (error) => {
  //       console.error('Error assigning order', error);
  //       this.errorMessage = 'Could not assign order. Please try again.';
  //     }
  //   );
  // }
  //
  // updateOrderStatus(orderId: number, status: string): void {
  //   this.adminService.updateOrderStatus(orderId, status).subscribe(
  //     (response) => {
  //       this.router.navigate(['/admin/orders']);
  //     },
  //     (error) => {
  //       console.error('Error updating order status', error);
  //       this.errorMessage = 'Could not update order status. Please try again.';
  //     }
  //   );
  // }

  assignOrder(): void {
    if (this.orderDetails && this.orderDetails.id && this.orderDetails.courier_id) {
      this.adminService.assignOrder(this.orderDetails.id, this.orderDetails.courier_id).subscribe(
        () => {
          this.router.navigate(['/admin/orders']);
        },
        (error) => {
          console.error('Error assigning order', error);
          this.errorMessage = 'Could not assign order. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Order ID or Courier ID is missing';
    }
  }

  updateOrderStatus(): void {
    if (this.orderDetails && this.orderDetails.id && this.orderDetails.status) {
      this.adminService.updateOrderStatus(this.orderDetails.id, this.orderDetails.status).subscribe(
        () => {
          this.router.navigate(['/admin/orders']);
        },
        (error) => {
          console.error('Error updating order status', error);
          this.errorMessage = 'Could not update order status. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Order ID or status is missing';
    }
  }


  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
    }
  }


}

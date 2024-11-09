import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { CourierService } from '../courier.service';

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
  selector: 'app-courier-edit',
  templateUrl: './courier-edit.component.html',
  styleUrls: ['./courier-edit.component.css']
})
export class CourierEditComponent implements OnInit{

  orderDetails: Order | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  statuses: string[] = ['Pending', 'In Progress', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
  selectedStatus: string = 'Pending';

  constructor(private route: ActivatedRoute, private router: Router, private courierService: CourierService) {
  }

  fetchOrderDetails(orderId: number): void {
    this.courierService.getOrderDetails(orderId).subscribe(
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

  updateOrderStatus(): void {
    if (this.orderDetails?.id && this.selectedStatus) {
      this.courierService.updateOrderStatus(this.orderDetails.id, this.selectedStatus).subscribe(
        () => {
          this.router.navigate(['/courier-order-detail']);
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
    }
  }

}

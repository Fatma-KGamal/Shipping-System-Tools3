import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  orderDetails: Order| null = null;
  errorMessages: { status?: string; general?: string } = {};
  successMessages: { status?: string; general?: string } = {};
  statuses: string[] = [ 'Accepted', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
  selectedStatus: string = 'Accepted';
  selectedCourierId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private courierService: CourierService,private cdr: ChangeDetectorRef) {
  }

  fetchOrderDetails(orderId: number): void {
    this.courierService.getOrderDetails(orderId).subscribe(
      (response) => {
        console.log('Fetched Order Details:', response);
        this.orderDetails = response;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.errorMessages.general = 'Could not fetch order details. Please try again.';
        this.cdr.detectChanges();
      }
    );
  }

  updateOrderStatus(): void {
    this.clearMessages();
    if (this.orderDetails?.id && this.selectedStatus) {
      this.courierService.updateOrderStatus(this.orderDetails.id, this.selectedStatus).subscribe(
        () => {
          this.router.navigate(['/courier-order-detail']);
          this.successMessages.status = 'Order status updated successfully';
          this.refreshOrderDetails();
        },
        (error) => {
          console.error('Update Status Error:', error);
          this.errorMessages.status = 'Could not update order status. Please try again.';
          this.cdr.detectChanges();
        }
      );
    } else {
      this.errorMessages.general = 'Order ID or Status is missing';
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
    }
  }

  private refreshOrderDetails(): void {
    if (this.orderDetails?.id) {
      this.fetchOrderDetails(this.orderDetails.id);
    }
  }

  private clearMessages(): void {
    this.errorMessages = {};
    this.successMessages = {};
  }

}

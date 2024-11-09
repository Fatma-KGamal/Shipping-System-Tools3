import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute,} from "@angular/router";
import { AdminService } from "../admin.service";

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
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent {
  orderDetails: Order | null = null;
  errorMessages: { assign?: string; status?: string; general?: string } = {};
  successMessages: { assign?: string; status?: string; general?: string } = {};
  couriers: Array<{ id: number, username: string }> = [];
  statuses: string[] = ['Pending', 'Accepted', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'];
  selectedCourierId: number = 0;
  selectedStatus: string = 'Pending';

  constructor(private route: ActivatedRoute, private adminService: AdminService, private cdr: ChangeDetectorRef
  ) {}

  fetchOrderDetails(orderId: number): void {
    this.adminService.getOrderDetails(orderId).subscribe(
      (response) => {
        this.orderDetails = response;
        this.cdr.detectChanges();
      },
      (error) => {
        this.errorMessages.general = 'Could not fetch order details. Please try again.';
        this.cdr.detectChanges();
      }
    );
  }

  assignOrder(): void {
    this.clearMessages();
    if (this.orderDetails?.id && this.selectedCourierId) {
      this.adminService.assignOrder(this.orderDetails.id, this.selectedCourierId).subscribe(
        () => {
          this.successMessages.assign = 'Order assigned successfully';
          this.refreshOrderDetails();
        },
        (error) => {
          this.errorMessages.assign = 'Could not assign order. Please try again.';
          this.cdr.detectChanges();
        }
      );
    } else {
      this.errorMessages.assign = 'Order ID or Courier ID is missing';
      this.cdr.detectChanges();
    }
  }

  updateOrderStatus(): void {
    this.clearMessages();
    if (this.orderDetails?.id && this.selectedStatus) {
      this.adminService.updateOrderStatus(this.orderDetails.id, this.selectedStatus).subscribe(
        () => {
          this.successMessages.status = 'Order status updated successfully';
          this.refreshOrderDetails();
        },
        (error) => {
          this.errorMessages.status = 'Could not update order status. Please try again.';
          this.cdr.detectChanges();
        }
      );
    } else {
      this.errorMessages.status = 'Order ID or Status is missing';
      this.cdr.detectChanges();
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
        this.couriers = response;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching couriers', error);
      }
    );
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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AdminService} from "../admin.service";
import {UserService} from "../user.service";

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
  couriers: Array<{ id: number, username: string }> = [];
  statuses: string[] = ['Pending','In Progress','Picked Up', 'In Transit', 'Delivered','Cancelled'];
  selectedCourierId: number = 0;
  selectedStatus: string = 'Pending';

  constructor(private route:ActivatedRoute, private http: HttpClient, private router: Router, private adminService: AdminService ,private userService:UserService) {}

  fetchOrderDetails(orderId: number): void {
    this.adminService.getOrderDetails(orderId).subscribe(
      (response) => {
        this.orderDetails = response;
        console.log('Order Details:', this.orderDetails);
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.errorMessage = 'Could not fetch order details. Please try again.';
      }
    );
  }

  assignOrder(): void {
    if (this.orderDetails?.id && this.selectedCourierId) {
      console.log('Assign Order Button Clicked');
      // Send the order ID and courier ID separately in the request
      this.adminService.assignOrder(this.orderDetails.id, this.selectedCourierId).subscribe(
        () => {
          this.router.navigate(['/admin-order-list']);
          alert("Courier reassigned successfully");
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
          // Handle success
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
      this.fetchCouriers(); // Ensure this method is called to populate couriers
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

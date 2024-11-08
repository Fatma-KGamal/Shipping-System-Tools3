import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CourierService} from "../courier.service";

@Component({
  selector: 'app-courier-order-detail',
  templateUrl: './courier-order-detail.component.html',
  styleUrls: ['./courier-order-detail.component.css']
})
export class CourierOrderDetailComponent implements OnInit{

  orderDetails: any = null;
  errorMessage: string | null = null;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private courierService:CourierService) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
    }
  }
  fetchOrderDetails(orderId: number): void {
    this.courierService.getOrderDetails(orderId).subscribe(
      (response) => {
        this.orderDetails = response;
      },
      (error) => {
        console.error('Error fetching order details', error);
        this.errorMessage = 'Could not fetch order details. Please try again.';
      }
    );
  }



}

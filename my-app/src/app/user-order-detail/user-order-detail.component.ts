import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-order-detail',
  templateUrl: './user-order-detail.component.html',
  styleUrls: ['./user-order-detail.component.css']
})
export class UserOrderDetailComponent implements OnInit {
  orderDetails: any = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(+orderId);
    }
  }

  fetchOrderDetails(orderId: number): void {
    this.http.get(`http://localhost:4300/get-order-details?order_id=${orderId}`)
      .subscribe(
        (response) => {
          this.orderDetails = response;
        },
        (error) => {
          console.error('Error fetching order details', error);
          this.errorMessage = 'Could not fetch order details. Please try again.';
        }
      );
  }

  goBack(): void {
    this.router.navigate(['/order-list']);
  }
}

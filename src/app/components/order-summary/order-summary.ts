import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.html',
  styleUrls: ['./order-summary.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderSummaryComponent implements OnInit {
  orderSummary: any = null;
  orderItems: any[] = [];

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Get order summary from localStorage
    const savedSummary = localStorage.getItem('order_summary');
    
    if (savedSummary) {
      try {
        this.orderSummary = JSON.parse(savedSummary);
        this.orderItems = this.orderSummary.orderData?.cartItems || [];
      } catch (e) {
        console.error('Error parsing order summary:', e);
        this.goToHome();
      }
    } else {
      this.goToHome();
    }
  }

  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  getItemTotal(item: any): number {
    return (item.price || 0) * (item.quantity || 1);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ', ' + date.toLocaleDateString('en-IN');
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  printReceipt(): void {
    window.print();
  }

  back(): void {
    this.location.back();
  }
}
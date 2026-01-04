// payment.component.ts - SIMPLIFIED WITH ONE BUTTON
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.html',
  styleUrls: ['./payment.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaymentComponent implements OnInit, OnDestroy {
  // Order details
  orderNumber: string = '';
  paymentAmount: number = 0;
  transactionId: string = '';
  restaurantUPI: string = '';
  
  // Timer
  minutes: number = 10;
  seconds: number = 0;
  private timerInterval: any;
  
  // Payment status
  paymentStatus: 'pending' | 'confirmed' | 'failed' = 'pending';
  
  // Order data
  orderData: any = null;
  
  // QR Code image URL
  qrCodeImageUrl: string = '';
  
  // Customer phone
  customerPhone: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    console.log('PaymentComponent initialized');
    this.initializePayment();
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private initializePayment(): void {
    console.log('Initializing payment...');
    
    // Set UPI from environment
    this.restaurantUPI = environment.restaurantUPI || '9402613361@ptaxis';
    
    // Get order data
    this.loadOrderData();
    
    // Set payment details
    this.setPaymentDetails();
    
    // Validate payment amount
    if (!this.paymentAmount || this.paymentAmount <= 0) {
      this.showToast('Unable to determine payment amount. Please restart your order.', 'error');
      setTimeout(() => this.backToOrder(), 2000);
      return;
    }
    
    // Generate QR code image
    this.generateQRCodeImage();
  }

  private loadOrderData(): void {
    // Try to get from router state first
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as any;
    
    if (state?.orderData) {
      this.orderData = state.orderData;
      console.log('Loaded order data from router state');
      this.saveOrderToLocalStorage();
    } else {
      // Fallback to localStorage
      this.loadOrderFromLocalStorage();
    }
  }

  private loadOrderFromLocalStorage(): void {
    try {
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        this.orderData = JSON.parse(savedOrder);
        console.log('Loaded order data from localStorage');
      }
    } catch (e) {
      console.error('Error loading order from localStorage:', e);
    }
  }

  private saveOrderToLocalStorage(): void {
    if (this.orderData) {
      try {
        localStorage.setItem('currentOrder', JSON.stringify(this.orderData));
      } catch (e) {
        console.error('Error saving order to localStorage:', e);
      }
    }
  }

  private setPaymentDetails(): void {
    if (!this.orderData) {
      console.error('No order data found');
      // Fallback to cart service
      const cartTotal = this.cartService.getTotalPrice();
      if (cartTotal > 0) {
        this.paymentAmount = cartTotal;
        this.orderNumber = this.generateOrderId();
        console.log('Using cart total as fallback:', this.paymentAmount);
      }
      return;
    }

    // Extract payment amount
    this.paymentAmount = this.orderData.total || this.orderData.finalTotal || 0;
    
    // Extract order number
    this.orderNumber = this.orderData.orderId || this.generateOrderId();
    
    // Extract customer phone
    this.customerPhone = this.orderData.customerPhone || 
                        this.orderData.formValues?.phone || 
                        '';
    
    console.log('Payment details set:', {
      amount: this.paymentAmount,
      orderNumber: this.orderNumber
    });
  }

  private generateQRCodeImage(): void {
    if (!this.paymentAmount || this.paymentAmount <= 0) return;
    
    try {
      // Create UPI payment string
      const amount = Math.round(this.paymentAmount);
      const cleanOrderNumber = this.orderNumber.replace(/[^a-zA-Z0-9]/g, '-');
      
      const upiString = `upi://pay?pa=${this.restaurantUPI}&pn=Maya%20Korean%20Restaurant&am=${amount}&tn=Order%20${cleanOrderNumber}&cu=INR`;
      const encodedData = encodeURIComponent(upiString);
      
      // Generate QR code using QuickChart (more reliable)
      this.qrCodeImageUrl = `https://quickchart.io/qr?text=${encodedData}&size=250&margin=1&dark=dc2626&light=ffffff`;
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.qrCodeImageUrl = '';
    }
  }

  // Retry QR code if it fails
  retryQRCode(): void {
    console.log('Retrying QR code generation...');
    this.qrCodeImageUrl = ''; // Clear first
    setTimeout(() => {
      this.generateQRCodeImage();
    }, 500);
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        // Timer expired
        this.paymentStatus = 'failed';
        this.handlePaymentTimeout();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // SINGLE BUTTON: Confirm Payment & Send Order
  confirmPaymentAndSendOrder(): void {
    if (!this.validateTransactionId()) {
      return;
    }

    // 1. Send WhatsApp with order details and transaction ID
    this.sendOrderToRestaurantViaWhatsApp();
    
    // 2. Mark as confirmed locally
    this.markPaymentAsConfirmed();
    
    // 3. Show success message
    this.showToast('Order confirmed! Details sent to restaurant via WhatsApp.', 'success');
    
    // 4. Clear cart and redirect after delay
    setTimeout(() => {
      this.navigateToOrderSummary();
    }, 2000);
  }

  // WhatsApp order confirmation with transaction ID
  private sendOrderToRestaurantViaWhatsApp(): void {
    if (!this.orderData || !this.orderData.cartItems) {
      console.error('No order data for WhatsApp');
      return;
    }
    
    try {
      // Format order items
      let itemsText = '';
      let totalItems = 0;
      
      this.orderData.cartItems.forEach((item: any, index: number) => {
        itemsText += `${index + 1}. ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(0)}\n`;
        totalItems += item.quantity;
      });
      
      // Calculate totals
      const subtotal = this.orderData.subtotal || this.paymentAmount;
      const gst = this.orderData.gst || 0;
      const discount = this.orderData.discount || 0;
      const finalTotal = this.paymentAmount;
      
      // Create message - SIMPLE AND CLEAR
      const message = `🆕 *NEW ORDER* 🆕

📋 *Order #${this.orderNumber}*
🔢 *TXN ID: ${this.transactionId}*
💰 *Amount: ₹${finalTotal}*

👤 *Customer:*
• Name: ${this.orderData.formValues?.name || 'Not provided'}
• Phone: ${this.customerPhone || 'Not provided'}
${this.orderData.formValues?.address ? `• Address: ${this.orderData.formValues.address}` : ''}

📦 *Order Items (${this.orderData.cartItems.length} items, ${totalItems} qty):*
${itemsText}

🧾 *Bill Summary:*
• Subtotal: ₹${subtotal}
• GST: ₹${gst}
• Discount: ₹${discount}
• *Total: ₹${finalTotal}*

⏰ *Order Time:* ${new Date().toLocaleTimeString('en-IN')}
📱 *Via:* Website

✅ *To Verify Payment:*
1. Check your UPI app for transaction
2. Transaction ID: ${this.transactionId}
3. Amount: ₹${finalTotal}
4. If confirmed → Prepare order`;

      // Encode and send
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${environment.supportPhone || '+919402613361'}?text=${encodedMessage}`, '_blank');
      
      console.log('Order details sent via WhatsApp');
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  private markPaymentAsConfirmed(): void {
    this.stopTimer();
    this.paymentStatus = 'confirmed';
    
    // Save payment record
    const paymentRecord = {
      orderId: this.orderNumber,
      transactionId: this.transactionId,
      amount: this.paymentAmount,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      orderData: this.orderData
    };
    
    localStorage.setItem('payment_' + this.orderNumber, JSON.stringify(paymentRecord));
    this.cartService.clearCart();
    localStorage.removeItem('currentOrder');
  }

  private navigateToOrderSummary(): void {
    const orderSummary = {
      orderId: this.orderNumber,
      transactionId: this.transactionId,
      amount: this.paymentAmount,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      orderData: this.orderData
    };
    
    localStorage.setItem('order_summary', JSON.stringify(orderSummary));
    
    this.router.navigate(['/order-summary'], {
      state: { orderSummary }
    });
  }

  private validateTransactionId(): boolean {
    if (!this.transactionId || this.transactionId.trim().length < 6) {
      this.showToast('Please enter a valid transaction ID (minimum 6 characters)', 'warning');
      return false;
    }
    
    const txIdPattern = /^[A-Za-z0-9]{6,50}$/;
    if (!txIdPattern.test(this.transactionId.trim())) {
      this.showToast('Transaction ID should contain only letters and numbers (6-50 characters)', 'warning');
      return false;
    }
    
    return true;
  }

  private handlePaymentTimeout(): void {
    this.stopTimer();
    this.paymentStatus = 'failed';
    this.showToast('Payment window expired. Please restart your order.', 'warning');
    
    setTimeout(() => {
      this.backToOrder();
    }, 3000);
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `payment-toast payment-toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 5000);
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
  }

  formatTime(min: number, sec: number): string {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  // UI Methods
  backToOrder(): void {
    this.router.navigate(['/order']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  copyUPIId(): void {
    navigator.clipboard.writeText(this.restaurantUPI)
      .then(() => {
        this.showToast('UPI ID copied!', 'success');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        this.showToast('Failed to copy', 'error');
      });
  }

  openUPIApp(): void {
    if (this.paymentAmount > 0) {
      const upiLink = `upi://pay?pa=${this.restaurantUPI}&am=${Math.round(this.paymentAmount)}&tn=Order${this.orderNumber}`;
      window.location.href = upiLink;
    } else {
      this.showToast('Please wait for QR code to load', 'info');
    }
  }
}
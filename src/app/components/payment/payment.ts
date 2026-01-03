// payment.component.ts - UPDATED
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { 
  PaymentService, 
  UpiPaymentRequest, 
  AutoVerifyRequest 
} from '../../services/payment.service';
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
  orderId: number = 0;
  orderNumber: string = '';
  paymentAmount: number = 0;
  transactionId: string = '';
  restaurantUPI: string = '';
  
  // Timer
  minutes: number = 10;
  seconds: number = 0;
  private timerInterval: any;
  
  // Payment status
  paymentStatus: 'pending' | 'processing' | 'confirmed' | 'failed' = 'pending';
  
  // Order data
  orderData: any = {
    cartItems: [],
    option: '',
    customerName: '',
    customerPhone: '',
    restaurantPhone: '',
    total: 0,
    subtotal: 0,
    gst: 0,
    discount: 0,
    coupon: null,
    formValues: {}
  };
  
  // UPI payment string for QR code
  upiPaymentString: string = '';
  
  // QR Code image URL
  qrCodeImageUrl: string = '';
  
  // Auto verification
  private autoVerifySubscription?: Subscription;
  isAutoVerifying: boolean = false;
  verificationAttempts: number = 0;
  
  // Customer phone
  customerPhone: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cartService: CartService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    console.log('PaymentComponent initialized');
    this.initializePayment();
    this.startTimer();
    this.startAutoVerification();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.autoVerifySubscription) {
      this.autoVerifySubscription.unsubscribe();
    }
  }

  private initializePayment(): void {
    console.log('Initializing payment...');
    
    // Set UPI from environment
    this.restaurantUPI = environment.restaurantUPI || '9402613361@ptaxis';
    
    // 1. Try to get from localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        this.orderData = { ...this.orderData, ...order };
        
        // Extract critical data
        this.paymentAmount = order.total || order.finalTotal || 0;
        this.orderNumber = order.orderId || this.generateOrderId();
        this.orderId = order.id || this.extractOrderNumber(this.orderNumber);
        this.customerPhone = order.customerPhone || order.formValues?.phone || '';
        
        console.log('Loaded from localStorage:', {
          amount: this.paymentAmount,
          orderNumber: this.orderNumber,
          orderId: this.orderId,
          orderData: this.orderData
        });
      } catch (e) {
        console.error('Error parsing localStorage order:', e);
      }
    }
    localStorage.setItem('currentOrder', JSON.stringify(savedOrder));
    // 2. Try route params
    this.route.params.subscribe(params => {
      if (params['amount']) {
        this.paymentAmount = +params['amount'];
      }
      if (params['id']) {
        const id = params['id'];
        this.orderId = parseInt(id, 10) || 0;
        if (!this.orderNumber) {
          this.orderNumber = 'ORD' + id;
        }
      }
    });
    
    // 3. Try router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const stateData = navigation.extras.state as any;
      if (stateData.orderData) {
        this.orderData = { ...this.orderData, ...stateData.orderData };
        
        if (stateData.orderData.total > 0) {
          this.paymentAmount = stateData.orderData.total;
        }
        if (stateData.orderData.orderId) {
          this.orderNumber = stateData.orderData.orderId;
        }
        if (stateData.orderData.id) {
          this.orderId = stateData.orderData.id;
        }
      }
    }
    
    // 4. Get from cart service as last resort
    if (!this.paymentAmount || this.paymentAmount <= 0) {
      const cartTotal = this.cartService.getTotalPrice();
      if (cartTotal > 0) {
        this.paymentAmount = cartTotal;
      }
    }
    
    // Validate payment amount
    if (!this.paymentAmount || this.paymentAmount <= 0) {
      this.showToast('Unable to determine payment amount. Please restart your order.', 'error');
      setTimeout(() => this.backToOrder(), 2000);
      return;
    }
    
    // Generate order number if not set
    if (!this.orderNumber || this.orderNumber === '') {
      this.orderNumber = this.generateOrderId();
    }
    
    // Generate UPI payment string
    this.generateUpiPaymentString();
    
    // Generate QR code image
    this.generateQRCodeImage();
  }

  private startAutoVerification(): void {
    if (!this.orderNumber || this.paymentAmount <= 0) {
      return;
    }

    this.isAutoVerifying = true;
    
    this.autoVerifySubscription = this.paymentService.startAutoVerification(
      this.orderNumber,
      this.paymentAmount,
      this.customerPhone
    ).subscribe({
      next: (response) => {
        this.verificationAttempts++;
        
        if (response.success && response.isPaid) {
          // Payment verified automatically!
          this.handleAutoPaymentSuccess(response.data);
        } else if (this.verificationAttempts % 3 === 0) {
          // Show status update every 3 attempts
          console.log(`Auto-verification attempt ${this.verificationAttempts}: ${response.message}`);
        }
      },
      error: (error) => {
        console.error('Auto-verification error:', error);
      },
      complete: () => {
        this.isAutoVerifying = false;
        if (this.paymentStatus === 'pending') {
          console.log('Auto-verification completed without payment detection');
        }
      }
    });
  }

  private generateUpiPaymentString(): void {
    if (!this.paymentAmount || this.paymentAmount <= 0) return;
    
    const amount = Math.round(this.paymentAmount);
    const cleanOrderNumber = this.orderNumber.replace(/[^a-zA-Z0-9]/g, '-');
    
    const params = new URLSearchParams({
      pa: this.restaurantUPI,
      pn: 'Maya Korean Restaurant',
      am: amount.toString(),
      tn: `Order ${cleanOrderNumber}`,
      cu: 'INR'
    });
    
    this.upiPaymentString = `upi://pay?${params.toString()}`;
  }

  private generateQRCodeImage(): void {
    if (this.upiPaymentString) {
      try {
        const encodedData = encodeURIComponent(this.upiPaymentString);
        this.qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedData}&format=png&margin=1&color=dc2626&bgcolor=ffffff`;
      } catch (error) {
        console.error('Error generating QR code:', error);
        this.qrCodeImageUrl = '';
      }
    }
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
        clearInterval(this.timerInterval);
        this.paymentStatus = 'failed';
        this.handlePaymentTimeout();
      }
    }, 1000);
  }

  // Format time as MM:SS
  formatTime(min: number, sec: number): string {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  // Stop timer when payment is successful
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.autoVerifySubscription) {
      this.autoVerifySubscription.unsubscribe();
    }
  }

  // Handle automatic payment success
  private handleAutoPaymentSuccess(paymentData: any): void {
    this.stopTimer();
    
    // Set transaction ID from auto-verification
    if (paymentData?.transactionId) {
      this.transactionId = paymentData.transactionId;
    } else {
      this.transactionId = `AUTO${Date.now()}`;
    }
    
    this.paymentStatus = 'confirmed';
    
    // Save successful payment
    const paymentRecord = {
      orderId: this.orderNumber,
      transactionId: this.transactionId,
      amount: this.paymentAmount,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      orderData: this.orderData,
      autoVerified: true
    };
    
    localStorage.setItem('payment_' + this.orderNumber, JSON.stringify(paymentRecord));
    
    // Clear cart
    this.cartService.clearCart();
    localStorage.removeItem('currentOrder');
    
    this.showToast('Payment detected automatically! Order confirmed.', 'success');
    
    // Navigate to success page after delay
    setTimeout(() => {
      this.navigateToOrderSummary();
    }, 2000);
  }

  // Manual payment confirmation (keep as fallback)
  confirmPayment(): void {
    if (!this.validateTransactionId()) {
      return;
    }

    this.paymentStatus = 'processing';
    
    const paymentRequest: UpiPaymentRequest = {
      orderNumber: this.orderNumber,
      transactionId: this.transactionId,
      amount: this.paymentAmount,
      upiId: this.restaurantUPI,
      customerPhone: this.customerPhone,
      orderDetails: this.orderData
    };

    this.paymentService.processUpiPayment(paymentRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.handleManualPaymentSuccess();
        } else {
          this.handlePaymentError(response.message || 'Payment verification failed');
        }
      },
      error: (error) => {
        console.error('Payment processing error:', error);
        this.handlePaymentError('Unable to verify payment. Please try again or contact support.');
      }
    });
  }

  private handleManualPaymentSuccess(): void {
    this.stopTimer();
    this.paymentStatus = 'confirmed';
    
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
    
    this.showToast('Payment confirmed! WhatsApp notification sent.', 'success');
    
    setTimeout(() => {
      this.navigateToOrderSummary();
    }, 2000);
  }

  private navigateToOrderSummary(): void {
    const orderSummary = {
      orderId: this.orderNumber,
      transactionId: this.transactionId,
      amount: this.paymentAmount,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      orderData: this.orderData,
      autoVerified: this.paymentStatus === 'confirmed' && !this.transactionId.includes('AUTO')
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

  private handlePaymentError(errorMessage: string): void {
    this.paymentStatus = 'pending';
    this.showToast(`Payment Error: ${errorMessage}`, 'error');
  }

  private handlePaymentTimeout(): void {
    this.showToast('Payment window expired. Please restart your order.', 'warning');
    
    setTimeout(() => {
      this.backToOrder();
    }, 3000);
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // Toast implementation remains the same
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  private extractOrderNumber(orderString: string): number {
    const matches = orderString.match(/\d+/);
    return matches ? parseInt(matches[0], 10) : Date.now();
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ', ' + now.toLocaleDateString('en-IN');
  }

  // UI Methods
  backToOrder(): void {
    this.router.navigate(['/order']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  openWhatsApp(): void {
    const supportNumber = environment.supportPhone;
    const message = encodeURIComponent(
      `Hi, I need help with payment for Order #${this.orderNumber}`
    );
    window.open(`https://wa.me/${supportNumber}?text=${message}`, '_blank');
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
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile && this.upiPaymentString) {
      window.location.href = this.upiPaymentString;
    } else {
      this.showToast('Please scan QR code with UPI app', 'info');
    }
  }
}
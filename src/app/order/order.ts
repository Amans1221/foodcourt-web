// order.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order-options',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {
  options = [
    {
      id: 1,
      title: 'Order for Delivery',
      desc: 'Get your food delivered right to your doorstep. Free delivery on orders above ₹500.',
      icon: '🚚',
      animationType: 'delivery',
      estimatedTime: '30-45 mins'
    },
    {
      id: 2,
      title: 'Order for Pickup',
      desc: 'Pick up from our outlet. Ready in 20 minutes. Perfect for quick takeaway.',
      icon: '🛍️',
      animationType: 'pickup',
      estimatedTime: '15-20 mins'
    },
    {
      id: 3,
      title: 'Dine-in Reservation',
      desc: 'Reserve your table. Experience authentic Korean ambiance with full service.',
      icon: '🍽️',
      animationType: 'dinein',
      estimatedTime: 'Reservation'
    }
  ];

  selectedOptionId: number | null = null;
  selectedOptionTitle = '';
  cartTotal: number = 0;
  cartCount: number = 0;
  paymentMethod: string = 'cash'; // Default to cash on delivery

  // Coupon properties
  couponCode: string = '';
  couponApplied: boolean = false;
  appliedCoupon: any = null;
  couponError: string = '';
  couponSuccess: string = '';
  discountAmount: number = 0;
  finalTotal: number = 0;
  
  // Available coupons
  availableCoupons = [
    {
      code: 'WELCOME10',
      description: '10% off on your first order',
      discountType: 'percentage',
      discountValue: 10,
      minOrder: 0
    },
    {
      code: 'FREEDEL',
      description: 'Free delivery on any order',
      discountType: 'fixed',
      discountValue: 50,
      minOrder: 0
    },
    {
      code: 'SAVE20',
      description: '₹20 off on orders above ₹500',
      discountType: 'fixed',
      discountValue: 20,
      minOrder: 500
    },
    {
      code: 'MAYA25',
      description: '25% off on orders above ₹1000',
      discountType: 'percentage',
      discountValue: 25,
      minOrder: 1000
    }
  ];

  constructor(
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.updateCartSummary();
    
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(() => {
      this.updateCartSummary();
    });
  }

  private updateCartSummary() {
    this.cartCount = this.cartService.getCartCount();
    this.cartTotal = this.cartService.getTotalPrice();
    this.calculateFinalTotal();
    
    // Redirect to menu if cart is empty
    if (this.cartCount === 0) {
      setTimeout(() => {
        this.router.navigate(['/menu']);
      }, 100);
    }
  }

  selectOption(optionId: number) {
    this.selectedOptionId = optionId;
    const option = this.options.find(o => o.id === optionId);
    this.selectedOptionTitle = option ? option.title : '';
  }

  cancelSelection() {
    this.selectedOptionId = null;
    this.selectedOptionTitle = '';
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(0)}`;
  }

  backToMenu() {
    this.router.navigate(['/menu']);
  }

  // Coupon methods
  applyCoupon() {
    this.couponError = '';
    this.couponSuccess = '';
    
    if (!this.couponCode || this.couponCode.trim().length < 3) {
      this.couponError = 'Please enter a valid coupon code';
      return;
    }
    
    const coupon = this.availableCoupons.find(
      c => c.code.toUpperCase() === this.couponCode.trim().toUpperCase()
    );
    
    if (!coupon) {
      this.couponError = 'Invalid coupon code';
      return;
    }
    
    // Check minimum order requirement
    if (this.cartTotal < coupon.minOrder) {
      this.couponError = `Minimum order of ₹${coupon.minOrder} required for this coupon`;
      return;
    }
    
    // Check if coupon already applied
    if (this.couponApplied && this.appliedCoupon?.code === coupon.code) {
      this.couponError = 'This coupon is already applied';
      return;
    }
    
    // Apply coupon
    this.appliedCoupon = coupon;
    this.couponApplied = true;
    this.couponSuccess = `Coupon "${coupon.code}" applied successfully!`;
    this.calculateFinalTotal();
    
    // Clear the input field
    this.couponCode = '';
  }

  removeCoupon() {
    this.couponApplied = false;
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponError = '';
    this.couponSuccess = '';
    this.calculateFinalTotal();
  }

  calculateFinalTotal() {
    const subtotal = this.cartTotal;
    const gst = subtotal * 0.05;
    let totalBeforeDiscount = subtotal + gst;
    
    if (this.couponApplied && this.appliedCoupon) {
      switch (this.appliedCoupon.discountType) {
        case 'percentage':
          this.discountAmount = (totalBeforeDiscount * this.appliedCoupon.discountValue) / 100;
          break;
        case 'fixed':
          this.discountAmount = this.appliedCoupon.discountValue;
          break;
        default:
          this.discountAmount = 0;
      }
      
      // Ensure discount doesn't exceed total
      this.discountAmount = Math.min(this.discountAmount, totalBeforeDiscount);
      this.finalTotal = totalBeforeDiscount - this.discountAmount;
    } else {
      this.discountAmount = 0;
      this.finalTotal = totalBeforeDiscount;
    }
    
    // Round to nearest integer
    this.finalTotal = Math.round(this.finalTotal);
  }

  getFinalTotal(): number {
    return this.finalTotal;
  }

 submitOrder(form: NgForm) {
    if (form.valid && this.selectedOptionId) {
      // Check if cart still has items
      if (this.cartCount === 0) {
        alert('Your cart is empty! Please add items from the menu.');
        this.router.navigate(['/menu']);
        return;
      }

      const orderData = {
        option: this.selectedOptionTitle,
        formValues: form.value,
        cartItems: this.cartService.getCartItems(),
        orderId: this.generateOrderId(),
        subtotal: this.cartTotal,
        gst: this.cartTotal * 0.05,
        discount: this.discountAmount,
        total: this.getFinalTotal(),
        coupon: this.appliedCoupon,
        paymentMethod: this.paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'pending',
        // Add customer details
        customerName: form.value.name || '',
        customerPhone: form.value.phone || '',
        customerEmail: form.value.email || '',
        deliveryAddress: form.value.address || ''
      };

      console.log('Order Data:', orderData);
      
      // Save order data to localStorage with multiple keys for redundancy
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      localStorage.setItem(`order_${orderData.orderId}`, JSON.stringify(orderData));
      
      // Show confirmation based on payment method
      if (this.paymentMethod === 'cash') {
        // For cash on delivery, show confirmation and clear cart
        alert(`✅ Order placed successfully!\nOrder ID: ${orderData.orderId}\nPayment: Cash on Delivery\nTotal: ${this.formatPrice(this.getFinalTotal())}\n\nOur delivery partner will contact you soon.`);
        
        // Clear cart after successful order
        this.cartService.clearCart();
        
        // Navigate to home or order confirmation
        this.router.navigate(['/']);
      } else {
        // For online payment, navigate to payment page WITHOUT amount in URL
        this.router.navigate(['/payment'], { 
          state: { orderData: orderData } 
        });
      }
    } else {
      alert('Please fill all required fields and select an order option.');
    }
  }

  private generateOrderId(): string {
    const prefix = 'MAYA';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}
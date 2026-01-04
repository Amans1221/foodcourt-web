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
  paymentMethod: string = 'cash';

  // Coupon properties
  couponCode: string = '';
  couponApplied: boolean = false;
  appliedCoupon: any = null;
  couponError: string = '';
  couponSuccess: string = '';
  discountAmount: number = 0;
  finalTotal: number = 0;
  
  // WhatsApp properties
  isSendingWhatsApp: boolean = false;
  
  // Toast properties
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'warning' | 'info' = 'info';
  
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

  // Restaurant WhatsApp number
  restaurantWhatsAppNumber = '+918826823830';
  restaurantName = "Maya's Korean Kitchen";

  constructor(
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.updateCartSummary();
    
    this.cartService.cartItems$.subscribe(() => {
      this.updateCartSummary();
    });
  }

  private updateCartSummary() {
    this.cartCount = this.cartService.getCartCount();
    this.cartTotal = this.cartService.getTotalPrice();
    this.calculateFinalTotal();
    
    if (this.cartCount === 0) {
      setTimeout(() => {
        this.router.navigate(['/menu']);
      }, 100);
    }
  }

  // Toast notification methods
  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000) {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

  closeToast() {
    this.showToast = false;
  }

  selectOption(optionId: number) {
    this.selectedOptionId = optionId;
    const option = this.options.find(o => o.id === optionId);
    this.selectedOptionTitle = option ? option.title : '';
    this.showNotification(`Selected: ${this.selectedOptionTitle}`, 'success', 2000);
  }

  cancelSelection() {
    this.selectedOptionId = null;
    this.selectedOptionTitle = '';
    this.showNotification('Selection cancelled. Choose another option.', 'info');
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
      this.showNotification('Please enter a valid coupon code', 'warning');
      return;
    }
    
    const coupon = this.availableCoupons.find(
      c => c.code.toUpperCase() === this.couponCode.trim().toUpperCase()
    );
    
    if (!coupon) {
      this.showNotification('Invalid coupon code', 'error');
      return;
    }
    
    if (this.cartTotal < coupon.minOrder) {
      this.showNotification(`Minimum order of ₹${coupon.minOrder} required for this coupon`, 'warning');
      return;
    }
    
    if (this.couponApplied && this.appliedCoupon?.code === coupon.code) {
      this.showNotification('This coupon is already applied', 'info');
      return;
    }
    
    this.appliedCoupon = coupon;
    this.couponApplied = true;
    this.calculateFinalTotal();
    
    // Show toast instead of inline message
    const discountText = coupon.discountType === 'percentage' 
      ? `${coupon.discountValue}% off` 
      : `₹${coupon.discountValue} off`;
    this.showNotification(`🎉 Coupon "${coupon.code}" applied! ${discountText}`, 'success');
    
    this.couponCode = '';
  }

  removeCoupon() {
    const removedCode = this.appliedCoupon?.code;
    this.couponApplied = false;
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponError = '';
    this.couponSuccess = '';
    this.calculateFinalTotal();
    
    if (removedCode) {
      this.showNotification(`Coupon "${removedCode}" removed`, 'info');
    }
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
      
      this.discountAmount = Math.min(this.discountAmount, totalBeforeDiscount);
      this.finalTotal = totalBeforeDiscount - this.discountAmount;
    } else {
      this.discountAmount = 0;
      this.finalTotal = totalBeforeDiscount;
    }
    
    this.finalTotal = Math.round(this.finalTotal);
  }

  getFinalTotal(): number {
    return this.finalTotal;
  }

  // WhatsApp message formatting
  formatOrderForWhatsApp(orderData: any): string {
    const cartItems = this.cartService.getCartItems();
    
    let message = `🍱 *NEW ORDER - ${orderData.orderId}* 🍱\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${orderData.customerName}\n`;
    message += `Phone: ${orderData.customerPhone}\n`;
    
    if (orderData.deliveryAddress) {
      message += `📍 *Delivery Address:*\n${orderData.deliveryAddress}\n\n`;
    } else if (this.selectedOptionId === 2) {
      message += `📌 *Pickup Order*\n\n`;
    } else if (this.selectedOptionId === 3) {
      message += `🍽️ *Dine-in Reservation*\n`;
      message += `Date: ${orderData.formValues.reservationDate || 'N/A'}\n`;
      message += `Time: ${orderData.formValues.reservationTime || 'N/A'}\n`;
      message += `Guests: ${orderData.formValues.guests || 'N/A'}\n\n`;
    }
    
    message += `📋 *Order Items:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    cartItems.forEach((item: any, index: number) => {
      const itemTotal = item.price * item.quantity;
      message += `${index + 1}. ${item.name} x${item.quantity}\n`;
      message += `   ₹${item.price} × ${item.quantity} = ₹${itemTotal}\n`;
      if (item.customizations && item.customizations.length > 0) {
        message += `   ➕ Add-ons: ${item.customizations.join(', ')}\n`;
      }
      message += '\n';
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Order Summary:*\n`;
    message += `Subtotal (${this.cartCount} items): ₹${this.cartTotal}\n`;
    message += `GST (5%): ₹${Math.round(this.cartTotal * 0.05)}\n`;
    
    if (this.couponApplied) {
      message += `Discount (${this.appliedCoupon?.code}): -₹${this.discountAmount}\n`;
    }
    
    message += `*Total Amount: ₹${this.getFinalTotal()}*\n\n`;
    message += `💵 *Payment Method:* Cash on Delivery\n`;
    
    if (orderData.formValues.instructions) {
      message += `📝 *Special Instructions:*\n${orderData.formValues.instructions}\n\n`;
    }
    
    message += `⏰ *Estimated Time:* ${orderData.formValues.pickupTime || 
      (this.selectedOptionId === 1 ? '30-45 mins' : 
       this.selectedOptionId === 2 ? '15-20 mins' : 'Reservation')}\n\n`;
    
    message += `📱 *Order Source:* Website Order\n`;
    message += `🕒 *Order Time:* ${new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata'
    })}\n`;
    
    return encodeURIComponent(message);
  }

  // Send order to WhatsApp
  sendOrderToWhatsApp(orderData: any) {
    this.isSendingWhatsApp = true;
    
    try {
      const message = this.formatOrderForWhatsApp(orderData);
      const whatsappUrl = `https://wa.me/${this.restaurantWhatsAppNumber}?text=${message}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success toast
      this.showNotification(
        `📱 Order #${orderData.orderId} sent to ${this.restaurantName} via WhatsApp!`,
        'success',
        5000
      );
      
      this.isSendingWhatsApp = false;
      
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      this.showNotification('Failed to send WhatsApp message. Please save order information.', 'error');
      this.isSendingWhatsApp = false;
    }
  }

  // Updated submitOrder function with toast notifications
  async submitOrder(form: NgForm) {
    if (form.valid && this.selectedOptionId) {
      // Check if cart still has items
      if (this.cartCount === 0) {
        this.showNotification('Your cart is empty! Please add items from the menu.', 'warning');
        setTimeout(() => {
          this.router.navigate(['/menu']);
        }, 2000);
        return;
      }

      const orderId = this.generateOrderId();
      const orderData = {
        option: this.selectedOptionTitle,
        formValues: form.value,
        cartItems: this.cartService.getCartItems(),
        orderId: orderId,
        subtotal: this.cartTotal,
        gst: this.cartTotal * 0.05,
        discount: this.discountAmount,
        total: this.getFinalTotal(),
        coupon: this.appliedCoupon,
        paymentMethod: this.paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'pending',
        customerName: form.value.name || '',
        customerPhone: form.value.phone || '',
        customerEmail: form.value.email || '',
        deliveryAddress: form.value.address || ''
      };

      // Save order data
      localStorage.setItem('currentOrder', JSON.stringify(orderData));
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
      
      // Show order processing toast
      this.showNotification(
        `🔄 Processing Order #${orderId}...`,
        'info',
        3000
      );

      // Handle based on payment method
      if (this.paymentMethod === 'cash') {
        // Show WhatsApp sending toast
        setTimeout(() => {
          this.showNotification(
            `📤 Sending order details to ${this.restaurantName} via WhatsApp...`,
            'info',
            2000
          );
        }, 500);

        // Send order to WhatsApp
        setTimeout(() => {
          this.sendOrderToWhatsApp(orderData);
        }, 1000);

        // Clear cart after successful order
        setTimeout(() => {
          this.cartService.clearCart();
          
          // Show final success toast
          this.showNotification(
            `✅ Order #${orderId} Placed Successfully!`,
            'success',
            5000
          );
          
          // Navigate to confirmation page
          setTimeout(() => {
            this.router.navigate(['/order-confirmation'], { 
              state: { 
                orderId: orderId,
                orderType: this.selectedOptionTitle,
                total: this.getFinalTotal(),
                paymentMethod: 'Cash on Delivery',
                customerPhone: form.value.phone
              } 
            });
          }, 2000);
          
        }, 2000);
        
      } else {
        // For online payment
        this.showNotification('Redirecting to secure payment gateway...', 'info', 2000);
        
        setTimeout(() => {
          this.router.navigate(['/payment'], { 
            state: { orderData: orderData } 
          });
        }, 1500);
      }
    } else {
      this.showNotification('Please fill all required fields and select an order option.', 'error');
    }
  }

  private generateOrderId(): string {
    const prefix = 'MAYA';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}
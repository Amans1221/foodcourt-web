// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isCartOpen = false;

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.isCartOpen$.subscribe(isOpen => {
      this.isCartOpen = isOpen;
    });
  }

  closeCart() {
    this.cartService.closeCart();
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  // New method to format price
  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty! Please add items to proceed.');
      return;
    }
    
    // Close the cart first
    this.cartService.closeCart();
    
    // Navigate to order page using Angular Router
    setTimeout(() => {
      this.router.navigate(['/order']);
    }, 300); // Small delay for smooth transition
  }
}
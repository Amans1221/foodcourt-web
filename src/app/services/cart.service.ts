// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'maya_mateul_cart';
  private cartItems: CartItem[] = this.loadCartFromStorage();
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  private isCartOpenSubject = new BehaviorSubject<boolean>(false);

  // Observables for components to subscribe to
  cartItems$ = this.cartItemsSubject.asObservable();
  isCartOpen$ = this.isCartOpenSubject.asObservable();

  constructor() {
    // Initialize cart from localStorage
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const savedCart = localStorage.getItem(this.storageKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  addToCart(item: any) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image
      });
    }
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: number, quantity: number) {
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        this.removeFromCart(itemId);
      } else {
        this.cartItemsSubject.next([...this.cartItems]);
        this.saveCartToStorage();
      }
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  openCart(): void {
    this.isCartOpenSubject.next(true);
  }

  closeCart(): void {
    this.isCartOpenSubject.next(false);
  }

  toggleCart(): void {
    this.isCartOpenSubject.next(!this.isCartOpenSubject.value);
  }

  // New method to get formatted price
  getFormattedPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }
}
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  cartCount: number = 0;

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
    
    // Initial cart count
    this.cartCount = this.cartService.getCartCount();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleCart() {
    this.cartService.toggleCart();
  }

  // Method to handle Order Online click
  onOrderOnlineClick(event: Event) {
    if (this.cartCount === 0) {
      event.preventDefault(); // Prevent navigation
      event.stopPropagation(); // Stop event bubbling
      
      // Show alert or feedback to user
      alert('Please add items to your cart before ordering!');
      
      // Optionally, navigate to menu page
      this.router.navigate(['/menu']);
      this.closeMenu(); // Close mobile menu if open
    } else {
      // If cart has items, proceed with normal navigation
      this.closeMenu(); // Close mobile menu if open
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
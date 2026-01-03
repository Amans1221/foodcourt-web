import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  // Footer links
  quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/order', label: 'Order Online' }
  ];

  menuCategories = [
    { label: 'Appetizers' },
    { label: 'Main Dishes' },
    { label: 'Soups & Stews' },
    { label: 'Noodles & Rice' },
    { label: 'Desserts' }
  ];

  contactInfo = {
    address: 'Ground Floor, PVR Complex, community centre, Shop no , G-1, plot no 10, Block G, Vikaspuri, New Delhi, Delhi 110018',
    phone: '+91 93182 52525',
    email: 'info@mayarestaurant.com',
    hours: {
      weekdays: '11:00 AM - 10:00 PM',
      weekends: '11:00 AM - 11:00 PM'
    }
  };

  socialLinks = [
    { 
      platform: 'Facebook', 
      icon: 'facebook-icon',
      url: 'https://facebook.com/mayarestaurant',
      class: 'facebook'
    },
    { 
      platform: 'Instagram', 
      icon: 'instagram-icon',
      url: 'https://instagram.com/mayarestaurant',
      class: 'instagram'
    },
    { 
      platform: 'Twitter', 
      icon: 'twitter-icon', 
      url: 'https://twitter.com/mayarestaurant',
      class: 'twitter'
    },
    { 
      platform: 'YouTube', 
      icon: 'youtube-icon',
      url: 'https://youtube.com/mayarestaurant',
      class: 'youtube'
    }
  ];

  // Newsletter subscription
  newsletterEmail = '';

  onNewsletterSubmit() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
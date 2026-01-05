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
    { label: 'Starters & Snacks' },
    { label: 'Korean Laphing' },
    { label: 'Rice / Pancakes' },
    { label: 'Kimbap (Korean Sushi)' },
    { label: 'Thukpa' },
    { label: 'Jjigae' },
    { label: 'Bibimbap' },
    { label: 'Maya Special' },
    { label: 'Curries & Noodles' },
    { label: 'Korean Ramen' },
    { label: 'Beverages' },
    { label: 'Mandu (Korean Momos)' },
    { label: 'Combo Offers' }
  ];

  contactInfo = {
    address: 'Ground Floor, PVR Complex, community centre, Shop no , G-1, plot no 10, Block G, Vikaspuri, New Delhi, Delhi 110018',
    phone: '+918826823830',
    email: 'mayasmateul@gmail.com',
    hours: {
      weekdays: '12:00 PM - 1:00 AM',
      weekends: '12:00 PM - 1:00 AM'
    }
  };

  socialLinks = [
    { 
      platform: 'Facebook', 
      icon: 'facebook-icon',
      url: 'https://www.facebook.com/profile.php?id=61585910821144',
      class: 'facebook'
    },
    { 
      platform: 'Instagram', 
      icon: 'instagram-icon',
      url: 'https://www.instagram.com/mayasmateul/',
      class: 'instagram'
    },
    // { 
    //   platform: 'Twitter', 
    //   icon: 'twitter-icon', 
    //   url: 'https://twitter.com/mayarestaurant',
    //   class: 'twitter'
    // },
    { 
      platform: 'YouTube', 
      icon: 'youtube-icon',
      url: 'https://youtube.com/',
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
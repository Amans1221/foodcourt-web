import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contactInfo = {
    address: 'Ground Floor, PVR Complex, community centre, Shop no , G-1, plot no 10, Block G, Vikaspuri, New Delhi, Delhi 110018',
    phone: '+91 93182 52525',
    email: 'info@mayarestaurant.com',
    hours: {
      weekdays: '11:00 AM - 10:00 PM',
      weekends: '11:00 AM - 11:00 PM'
    }
  };

  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  };

  faqs = [
    {
      question: 'Do you take reservations?',
      answer: 'Yes, we accept reservations for parties of 6 or more. For smaller groups, we operate on a first-come, first-served basis.'
    },
    {
      question: 'Is there parking available?',
      answer: 'We have complimentary valet parking available, as well as street parking and a nearby parking garage.'
    },
    {
      question: 'Do you offer catering services?',
      answer: 'Yes! We offer full catering services for events and parties. Contact us for custom menus and pricing.'
    },
    {
      question: 'Are you wheelchair accessible?',
      answer: 'Absolutely. Our restaurant is fully wheelchair accessible with ramp access and spacious seating arrangements.'
    },
    {
      question: 'Do you have vegetarian/vegan options?',
      answer: 'We have several vegetarian and vegan options available. Please inform your server of any dietary restrictions.'
    }
  ];

  expandedFaqIndex: number | null = null;

  toggleFaq(index: number) {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
  }

  onSubmit() {
    // Handle form submission here
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    };
  }
}
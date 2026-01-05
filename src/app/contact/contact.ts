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
    phone: '+918826823830',
    email: 'mayasmateul@gmail.com',
    hours: {
      weekdays: '12:00 PM - 1:00 AM',
      weekends: '12:00 PM - 1:00 AM'
    }
  };

  // Changed variable name to avoid conflict with template reference
  contactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'whatsapp'
  };

  showSuccess = false;
  showError = false;

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
    // Hide any previous messages
    this.showSuccess = false;
    this.showError = false;

    // Basic validation
    if (!this.contactFormData.name || 
        !this.contactFormData.phone || 
        !this.contactFormData.subject || 
        !this.contactFormData.message ||
        !this.contactFormData.preferredContact) {
      this.showError = true;
      return;
    }

    // Send message based on preferred contact method
    if (this.contactFormData.preferredContact === 'whatsapp') {
      this.sendViaWhatsApp();
    } else if (this.contactFormData.preferredContact === 'email') {
      this.sendViaEmail();
    } else {
      // For phone call preference, we'll just show a success message
      this.showSuccessMessage();
    }
  }

  // Method to send via WhatsApp
  sendViaWhatsApp() {
    // Restaurant's WhatsApp number
    const whatsappNumber = '918826823830';
    
    // Create the message
    const message = `*New Message from MAYA'S MATEUL Website*%0A%0A` +
                   `*Name:* ${this.contactFormData.name}%0A` +
                   `*Phone:* ${this.contactFormData.phone}%0A` +
                   (this.contactFormData.email ? `*Email:* ${this.contactFormData.email}%0A` : '') +
                   `*Subject:* ${this.contactFormData.subject}%0A` +
                   `*Message:*%0A${this.contactFormData.message}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form
    this.resetForm();
  }

  // Method to send via Email
  sendViaEmail() {
    // Create email subject
    const subject = `MAYA'S MATEUL Contact: ${this.contactFormData.subject}`;
    
    // Create email body
    const body = `New Message from MAYA'S MATEUL Website%0A%0A` +
                 `Name: ${this.contactFormData.name}%0A` +
                 `Phone: ${this.contactFormData.phone}%0A` +
                 (this.contactFormData.email ? `Email: ${this.contactFormData.email}%0A` : '') +
                 `Subject: ${this.contactFormData.subject}%0A` +
                 `Preferred Contact Method: Email%0A%0A` +
                 `Message:%0A${this.contactFormData.message}`;
    
    // Create mailto URL
    const mailtoUrl = `mailto:${this.contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form
    this.resetForm();
  }

  // Show success message
  showSuccessMessage() {
    this.showSuccess = true;
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      this.showSuccess = false;
    }, 5000);
  }

  // Reset form
  resetForm() {
    this.contactFormData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'whatsapp'
    };
  }
}
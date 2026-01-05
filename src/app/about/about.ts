import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent {
  restaurantInfo = {
    name: 'MAYA S MAT EUL Restaurant',
    tagline: 'Authentic Korean Cuisine Experience',
    description: 'Since 2025, MAYA S MAT EUL Restaurant has been serving authentic Korean dishes made with traditional recipes and the freshest ingredients. Our passion for Korean culinary heritage drives us to deliver an unforgettable dining experience.',
    founded: '2025',
    address: 'Ground Floor, PVR Complex, community centre, Shop no , G-1, plot no 10, Block G, Vikaspuri, New Delhi, Delhi 110018',
    phone: '+918826823830',
    email: 'mayasmateul@gmail.com',
    hours: {
      weekdays: '12:00 PM - 1:00 AM',
      weekends: '12:00 PM - 1:00 AM'
    }
  };

  features = [
    {
      icon: '🌱',
      title: 'Fresh Ingredients',
      description: 'We source the finest ingredients daily to ensure authentic flavors'
    },
    {
      icon: '👨‍🍳',
      title: 'Expert Chefs',
      description: 'Our chefs are trained in traditional Korean cooking techniques'
    },
    {
      icon: '🏮',
      title: 'Authentic Atmosphere',
      description: 'Experience traditional Korean ambiance and hospitality'
    },
    {
      icon: '🥢',
      title: 'Family Recipes',
      description: 'Generations of family recipes passed down and perfected'
    }
  ];

  teamMembers = [
    {
      name: 'Atul Dhull',
      position: 'Owner',
      bio: 'With over 20 years of experience in Korean cuisine, Atul Dhull brings authentic flavors from Seoul to your table.',
      image: '/assets/file.jpg'
    }
  ];

  values = [
    {
      title: 'Our Mission',
      description: 'To share the rich flavors and traditions of Korean cuisine with our community while maintaining authenticity and quality.'
    },
    {
      title: 'Our Vision',
      description: 'To be the premier destination for Korean culinary experiences, bridging cultures through food.'
    },
    {
      title: 'Our Promise',
      description: 'Every dish tells a story of tradition, quality, and passion for authentic Korean flavors.'
    }
  ];
}
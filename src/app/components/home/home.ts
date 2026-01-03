import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeaturedComponent } from '../../featured/featured';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FeaturedComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
   specialOffers = [
  {
    title: '🍚 Maya Special Rice Bowl Combo',
    description: 'Signature rice bowl topped with laphing noodles, vegetables and our special sauce.',
    price: 649,
    originalPrice: 799,
    discount: '19% OFF',
    badge: 'popular',
    image: 'https://product-assets.faasos.io/production/product/image_1671192301086_Kadhai_paneer_rice_bowl.jpg?w=500&auto=format&fit=crop',
    type: 'popular'
  },
  {
    title: '🍜 Maya Special Noodle Bowl (Non-Veg)',
    description: 'Premium noodle bowl with laphing noodles, choice of meat, vegetables and signature toppings.',
    price: 910,
    originalPrice: 1099,
    discount: '17% OFF',
    badge: 'premium',
    image: 'https://images.getrecipekit.com/20220322222559-sriracharamen.jpg?w=500&auto=format&fit=crop',
    type: 'premium'
  },
  {
    title: '🔥 Dak Doritang Special',
    description: 'Traditional Korean spicy braised chicken cooked with vegetables and rich seasoning.',
    price: 649,
    originalPrice: 799,
    discount: 'Save ₹150',
    badge: 'chef-special',
    image: 'https://preview.redd.it/tteokbokki-korean-spicy-rice-cake-v0-894c6uqysna81.jpg?width=640&crop=smart&auto=webp&s=ec4329897ffd1375c4b590dfa4808e9a0b68c707?w=500&auto=format&fit=crop',
    type: 'chef-special'
  },
  {
    title: '🍗 Tongdak Gul Combo',
    description: 'Crispy Korean deep-fried whole chicken seasoned with salt, pepper and special paste.',
    price: 649,
    originalPrice: 799,
    discount: 'Limited Offer',
    badge: 'hot',
    image: 'https://www.maangchi.com/wp-content/uploads/2019/01/koreanfriedchicken.jpg?w=500&auto=format&fit=crop',
    type: 'hot'
  },
  {
    title: '🐟 Saangseon Jun Special',
    description: 'Korean style pan-fried fish with crispy coating and authentic seasoning.',
    price: 910,
    originalPrice: 1099,
    discount: 'Chef Recommended',
    badge: 'premium',
    image: 'https://fatqueencooks.com/wp-content/uploads/hk-fish.jpg?w=500&auto=format&fit=crop',
    type: 'premium'
  },
  {
    title: '🍄 Boe-soet Bok-keum',
    description: 'Classic Korean stir-fried mushrooms packed with umami flavors and sesame aroma.',
    price: 455,
    originalPrice: 549,
    discount: 'Best Seller',
    badge: 'bestseller',
    image: 'https://img.freepik.com/premium-photo/beoseotbokkeum-stirfried-mushrooms-with-various-seasonings-vegetables-korean-side-dish_921026-34788.jpg?w=500&auto=format&fit=crop',
    type: 'bestseller'
  }
];



  quickFeatures = [
    {
      icon: '🚚',
      title: '30-Min Delivery',
      description: 'Free delivery on orders above ₹500 within 30 minutes'
    },
    {
      icon: '👑',
      title: 'Premium Quality',
      description: 'Authentic Korean ingredients and traditional recipes'
    },
    {
      icon: '⭐',
      title: 'Rated 4.8/5',
      description: 'Loved by thousands of customers across the city'
    },
    {
      icon: '🎁',
      title: 'Loyalty Rewards',
      description: 'Earn points with every order and get free meals'
    }
  ];

  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  ngOnInit() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const now = new Date();
    const targetDate = new Date('January 4, 2024 23:59:59');
    const diff = targetDate.getTime() - now.getTime();
    
    this.countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.countdown.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  getFormattedTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
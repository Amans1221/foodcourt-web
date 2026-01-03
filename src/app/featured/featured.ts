import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured.html',
  styleUrls: ['./featured.css']
})
export class FeaturedComponent {
  // Toast properties
  showToast = false;
  toastMessage = '';
  
  // Featured items data - Fixed property names
  featuredItems = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      title: '🔥 Dak Doritang Special',
      description: 'Traditional Korean spicy braised chicken cooked with vegetables and rich seasoning.',
      price: 649,
      originalPrice: 799,
      discount: 'Save ₹150',
      badge: 'chef-special',
      image: 'https://chrisseenplace.com/wp-content/uploads/2022/02/Dakdoritang-731x1024.jpg?width=640&crop=smart&auto=webp&s=ec4329897ffd1375c4b590dfa4808e9a0b68c707?w=500&auto=format&fit=crop',
      type: 'chef-special'
    },
    {
      id: 4,
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
      id: 5,
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
      id: 6,
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

  constructor(private cartService: CartService) {}

  getFormattedPrice(price: number): string {
    return `₹${price}`;
  }

  orderItem(item: any) {
    const cartItem = {
      id: item.id || Date.now(),
      name: item.title, // Using title as name for cart
      price: item.price,
      image: item.image,
      quantity: 1
    };
    
    // Add to cart
    this.cartService.addToCart(cartItem);
    
    // Show toast notification
    this.showToastNotification(`${item.title} added to cart!`);
  }

  // Toast notification method
  showToastNotification(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
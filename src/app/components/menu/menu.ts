// menu.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { MenuItem, Addon } from '../../models/menu-item.model';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class MenuComponent {
  @ViewChild('relatedRow') relatedRow!: ElementRef;

  categories = [
    'Starters & Snacks',
    'Korean Laphing',
    'Rice / Pancakes',
    'Kimbap (Korean Sushi)',
    'Thukpa',
    'Jjigae',
    'Maya Special',
    'Bibimbap',
    'Curries & Noodles',
    'Dak Galbi',
    'Korean Ramen',
    'Beverages'
  ];

  activeCategory = 'Starters & Snacks';
  selectedItemIndex = 0;
  slideDirection: 'left' | 'right' | null = null;
  relatedScrollPosition = 0;
  menuItems: MenuItem[] = [];
  selectedSize: 'half' | 'full' = 'half';
  selectedAddon: Addon | null = null;

  // Toast notification properties
  showToast = false;
  toastMessage = '';
  toastItemName = '';
  toastItemPrice = 0;

  getSafeImage(item: MenuItem): string {
    return item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop';
  }

  get filteredItems(): MenuItem[] {
    return this.menuItems.filter(i => i.category === this.activeCategory);
  }

  get selectedItem(): MenuItem {
    const list = this.filteredItems;
    return list[this.selectedItemIndex] ?? list[0] ?? this.menuItems[0];
  }

  get hasHalfFullPricing(): boolean {
    const item = this.selectedItem;
    return !!(item.halfPrice && item.fullPrice);
  }

  get hasAddons(): boolean {
    return !!(this.selectedItem.addons && this.selectedItem.addons.length > 0);
  }

  setActiveCategory(category: string) {
    if (this.activeCategory === category) return;
    this.activeCategory = category;
    this.selectedItemIndex = 0;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    this.relatedScrollPosition = 0;
    setTimeout(() => {
      if (this.relatedRow) {
        this.relatedRow.nativeElement.scrollLeft = 0;
      }
    }, 100);
  }

  selectItemByIndex(index: number) {
    if (index < 0 || index >= this.filteredItems.length) return;
    this.slideDirection = index > this.selectedItemIndex ? 'left' : 'right';
    this.selectedItemIndex = index;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
  }

  prevItem() {
    if (this.selectedItemIndex <= 0) return;
    this.slideDirection = 'right';
    this.selectedItemIndex--;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
  }

  nextItem() {
    if (this.selectedItemIndex >= this.filteredItems.length - 1) return;
    this.slideDirection = 'left';
    this.selectedItemIndex++;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
  }

  selectAddon(addon: Addon) {
    this.selectedAddon = this.selectedAddon?.name === addon.name ? null : addon;
  }

  getDisplayPrice(item: MenuItem): string {
    if (item.halfPrice && item.fullPrice) {
      return `₹${item.halfPrice} / ₹${item.fullPrice}`;
    } else if (item.price) {
      return `₹${item.price}`;
    }
    return 'Price not available';
  }

  getCurrentAddonPrice(addon: Addon): number {
    if (this.selectedSize === 'half') {
      return addon.halfPrice ?? addon.fullPrice ?? addon.price ?? 0;
    } else {
      return addon.fullPrice ?? addon.halfPrice ?? addon.price ?? 0;
    }
  }

  getCurrentBasePrice(): number {
    const item = this.selectedItem;
    if (this.selectedSize === 'half') {
      return item.halfPrice ?? item.fullPrice ?? item.price ?? 0;
    } else {
      return item.fullPrice ?? item.halfPrice ?? item.price ?? 0;
    }
  }

  getFinalPrice(item: MenuItem): number {
    let basePrice = this.getCurrentBasePrice();
    
    if (this.selectedAddon) {
      basePrice += this.getCurrentAddonPrice(this.selectedAddon);
    }
    
    return basePrice;
  }

  scrollRelatedLeft() {
    if (this.relatedRow) {
      const card = this.relatedRow.nativeElement.querySelector('.related-card');
      if (!card) return;

      const scrollAmount = (card.offsetWidth + 16) * 4;
      this.relatedScrollPosition = Math.max(0, this.relatedScrollPosition - scrollAmount);

      this.relatedRow.nativeElement.scrollTo({
        left: this.relatedScrollPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollRelatedRight() {
    if (this.relatedRow) {
      const card = this.relatedRow.nativeElement.querySelector('.related-card');
      if (!card) return;

      const containerWidth = this.relatedRow.nativeElement.offsetWidth;
      const maxScroll = this.relatedRow.nativeElement.scrollWidth - containerWidth;

      const scrollAmount = (card.offsetWidth + 16) * 4;
      this.relatedScrollPosition = Math.min(maxScroll, this.relatedScrollPosition + scrollAmount);

      this.relatedRow.nativeElement.scrollTo({
        left: this.relatedScrollPosition,
        behavior: 'smooth'
      });
    }
  }

  isRelatedScrollAtEnd(): boolean {
    if (!this.relatedRow) return true;
    const containerWidth = this.relatedRow.nativeElement.offsetWidth;
    const maxScroll = this.relatedRow.nativeElement.scrollWidth - containerWidth;
    return this.relatedScrollPosition >= maxScroll;
  }

  // Toast notification methods
  showToastNotification(itemName: string, price: number, addon?: string, size?: string) {
    this.toastItemName = itemName;
    this.toastItemPrice = price;
    
    let message = `${itemName}`;
    
    if (size) {
      message += ` (${size.charAt(0).toUpperCase() + size.slice(1)})`;
    }
    
    if (addon) {
      message += ` with ${addon}`;
    }
    
    message += ` added to cart!`;
    this.toastMessage = message;
    this.showToast = true;
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast() {
    this.showToast = false;
  }

  constructor(
    private cartService: CartService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuService.getMenuItems().subscribe(items => {
      this.menuItems = items;
      if (items.length > 0) {
        this.categories = Array.from(new Set(items.map(item => item.category)));
        this.activeCategory = this.categories[0] || items[0].category;
      }
      this.selectedItemIndex = 0;
    });
  }

  addToCart(item: MenuItem) {
    const finalPrice = this.getFinalPrice(item);
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: this.getSafeImage(item),
      quantity: 1,
      addon: this.selectedAddon?.name || null,
      size: this.hasHalfFullPricing ? this.selectedSize : null
    };

    this.cartService.addToCart(cartItem);
    
    // Show toast notification
    this.showToastNotification(
      item.name,
      finalPrice,
      this.selectedAddon?.name,
      this.hasHalfFullPricing ? this.selectedSize : undefined
    );
    
    // Reset selection for next item
    this.selectedSize = 'half';
    this.selectedAddon = null;
  }

  getAddonPriceDisplay(addon: Addon): string {
    if (addon.halfPrice !== undefined && addon.fullPrice !== undefined) {
      return `+₹${addon.halfPrice} / +₹${addon.fullPrice}`;
    } else if (addon.price !== undefined) {
      return `+₹${addon.price}`;
    }
    return '';
  }
}
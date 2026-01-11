// menu.component.ts
import { Component, ViewChild, ElementRef, HostListener, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
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
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('relatedRow') relatedRow!: ElementRef;
  @ViewChild('categoryBar') categoryBar!: ElementRef;

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
    'Combo Offers',
    'Mandu (Korean Momos)',
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

  // Category scrolling properties
  showCategoryScrollIndicators = false;
  canScrollCategoryLeft = false;
  canScrollCategoryRight = false;
  isCategoryScrollable = false;
  
  // Mobile detection
  isMobileView = false;

  // Toast notification properties
  showToast = false;
  toastMessage = '';
  toastItemName = '';
  toastItemPrice = 0;

  // Touch/swipe properties for category
  touchStartX = 0;
  touchStartY = 0;
  touchEndX = 0;
  touchEndY = 0;
  swipeThreshold = 30;

  // Carousel properties for mobile
  currentCarouselIndex = 0;
  carouselAutoplayInterval: any;
  isCarouselAutoplayActive = true;
  carouselTouchStartX = 0;
  carouselTouchEndX = 0;

  constructor(
    private cartService: CartService,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.menuService.getMenuItems().subscribe(items => {
      this.menuItems = items;
      if (items.length > 0) {
        // Get unique categories from items
        this.categories = Array.from(new Set(items.map(item => item.category)));
        this.activeCategory = this.categories[0] || items[0].category;
      }
      this.selectedItemIndex = 0;
      this.currentCarouselIndex = 0;
      
      // Check mobile view and scrollability after data loads
      setTimeout(() => {
        this.checkMobileView();
        this.checkCategoryScrollability();
        this.startCarouselAutoplay(); // Start autoplay when data loads
      }, 100);
    });
  }

  ngAfterViewInit() {
    this.checkCategoryScrollability();
    window.addEventListener('resize', () => {
      this.checkMobileView();
      this.checkCategoryScrollability();
    });
  }

  ngOnDestroy() {
    this.stopCarouselAutoplay();
    window.removeEventListener('resize', () => {
      this.checkMobileView();
      this.checkCategoryScrollability();
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobileView();
    this.checkCategoryScrollability();
  }

  checkMobileView() {
    this.isMobileView = window.innerWidth <= 768;
    if (this.isMobileView) {
      this.startCarouselAutoplay();
    } else {
      this.stopCarouselAutoplay();
    }
  }

  checkCategoryScrollability() {
    if (!this.categoryBar?.nativeElement) return;
    
    const element = this.categoryBar.nativeElement;
    this.isCategoryScrollable = element.scrollWidth > element.clientWidth;
    this.showCategoryScrollIndicators = this.isCategoryScrollable && this.isMobileView;
    this.updateCategoryScrollButtons();
  }

  onCategoryScroll() {
    this.updateCategoryScrollButtons();
  }

  updateCategoryScrollButtons() {
    if (!this.categoryBar?.nativeElement) return;
    
    const element = this.categoryBar.nativeElement;
    const scrollLeft = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;
    
    this.canScrollCategoryLeft = scrollLeft > 0;
    this.canScrollCategoryRight = scrollLeft < maxScroll - 1;
  }

  scrollCategoryLeft() {
    if (!this.categoryBar?.nativeElement || !this.canScrollCategoryLeft) return;
    
    const element = this.categoryBar.nativeElement;
    const scrollAmount = Math.min(200, element.scrollLeft);
    
    element.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
    
    setTimeout(() => this.updateCategoryScrollButtons(), 300);
  }

  scrollCategoryRight() {
    if (!this.categoryBar?.nativeElement || !this.canScrollCategoryRight) return;
    
    const element = this.categoryBar.nativeElement;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const scrollAmount = Math.min(200, maxScroll - element.scrollLeft);
    
    element.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    setTimeout(() => this.updateCategoryScrollButtons(), 300);
  }

  getCategoryIndex(): number {
    return this.categories.indexOf(this.activeCategory);
  }

  // Touch swipe handlers for category bar
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    // Only consider horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0 && this.canScrollCategoryLeft) {
        // Swipe right - scroll left
        this.scrollCategoryLeft();
      } else if (deltaX < 0 && this.canScrollCategoryRight) {
        // Swipe left - scroll right
        this.scrollCategoryRight();
      }
    }
  }

  // Carousel Methods for Mobile
  nextCarouselSlide() {
    if (this.filteredItems.length === 0) return;
    
    this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.filteredItems.length;
    this.resetCarouselAutoplay();
  }

  prevCarouselSlide() {
    if (this.filteredItems.length === 0) return;
    
    this.currentCarouselIndex = (this.currentCarouselIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    this.resetCarouselAutoplay();
  }

  goToCarouselSlide(index: number) {
    if (index < 0 || index >= this.filteredItems.length) return;
    
    this.currentCarouselIndex = index;
    this.resetCarouselAutoplay();
  }

  selectItemFromCarousel(index: number) {
    if (index < 0 || index >= this.filteredItems.length) return;
    
    this.selectItemByIndex(index);
    this.currentCarouselIndex = index;
    this.resetCarouselAutoplay();
  }

  startCarouselAutoplay() {
    if (!this.isMobileView || this.filteredItems.length <= 1 || !this.isCarouselAutoplayActive) return;
    
    this.stopCarouselAutoplay();
    
    this.carouselAutoplayInterval = setInterval(() => {
      this.nextCarouselSlide();
    }, 3000); // Change slide every 3 seconds
  }

  stopCarouselAutoplay() {
    if (this.carouselAutoplayInterval) {
      clearInterval(this.carouselAutoplayInterval);
      this.carouselAutoplayInterval = null;
    }
  }

  resetCarouselAutoplay() {
    if (this.isCarouselAutoplayActive) {
      this.stopCarouselAutoplay();
      this.startCarouselAutoplay();
    }
  }

  toggleCarouselAutoplay() {
    this.isCarouselAutoplayActive = !this.isCarouselAutoplayActive;
    
    if (this.isCarouselAutoplayActive) {
      this.startCarouselAutoplay();
    } else {
      this.stopCarouselAutoplay();
    }
  }

  // Touch swipe for carousel
  onCarouselTouchStart(event: TouchEvent) {
    this.carouselTouchStartX = event.touches[0].clientX;
    this.stopCarouselAutoplay();
  }

  onCarouselTouchEnd(event: TouchEvent) {
    this.carouselTouchEndX = event.changedTouches[0].clientX;
    this.handleCarouselSwipe();
    
    if (this.isCarouselAutoplayActive) {
      setTimeout(() => this.startCarouselAutoplay(), 1000);
    }
  }

  handleCarouselSwipe() {
    const swipeThreshold = 50;
    const deltaX = this.carouselTouchEndX - this.carouselTouchStartX;
    
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swipe right - go to previous slide
        this.prevCarouselSlide();
      } else {
        // Swipe left - go to next slide
        this.nextCarouselSlide();
      }
    }
  }

  // Original methods
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
    this.currentCarouselIndex = 0;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    this.relatedScrollPosition = 0;
    
    // Scroll active category into view on mobile
    setTimeout(() => {
      if (this.isMobileView && this.categoryBar?.nativeElement) {
        const activeButton = this.categoryBar.nativeElement.querySelector('button.active');
        if (activeButton) {
          activeButton.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
      }
      
      if (this.relatedRow) {
        this.relatedRow.nativeElement.scrollLeft = 0;
      }
      
      this.updateCategoryScrollButtons();
      this.resetCarouselAutoplay();
    }, 100);
  }

  selectItemByIndex(index: number) {
    if (index < 0 || index >= this.filteredItems.length) return;
    this.slideDirection = index > this.selectedItemIndex ? 'left' : 'right';
    this.selectedItemIndex = index;
    this.currentCarouselIndex = index;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
    this.resetCarouselAutoplay();
  }

  prevItem() {
    if (this.selectedItemIndex <= 0) return;
    this.slideDirection = 'right';
    this.selectedItemIndex--;
    this.currentCarouselIndex = this.selectedItemIndex;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
    this.resetCarouselAutoplay();
  }

  nextItem() {
    if (this.selectedItemIndex >= this.filteredItems.length - 1) return;
    this.slideDirection = 'left';
    this.selectedItemIndex++;
    this.currentCarouselIndex = this.selectedItemIndex;
    this.selectedSize = 'half';
    this.selectedAddon = null;
    setTimeout(() => (this.slideDirection = null), 420);
    this.resetCarouselAutoplay();
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

  addToCart(item: MenuItem) {
    const finalPrice = this.getFinalPrice(item);
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: this.getSafeImage(item),
      quantity: 1,
      addon: this.selectedAddon?.name || null,
      size: this.hasHalfFullPricing ? this.selectedSize : null,
      category: item.category
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
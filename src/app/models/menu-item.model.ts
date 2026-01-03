// models/menu-item.model.ts
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  
  // pricing
  price?: number;        // single price items
  halfPrice?: number;    // half plate
  fullPrice?: number;    // full plate
  
  // UI fields
  description?: string;
  image?: string;
  koreanName?: string;
  ingredients?: string[]; // Add ingredients array
  addons?: Addon[]; 
}
export interface Addon {
  name: string;
  halfPrice?: number;
  fullPrice?: number;
  price?: number;
}


export interface Order {
  id?: number;
  orderNumber: string;
  orderType: string;
  subTotal: number;
  tax: number;
  totalAmount: number;
  status: string;
  orderDate: Date;
  tableNumber?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}


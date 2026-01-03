import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.html',
  styleUrls: ['./offers.css']
})
export class OffersComponent {
  offers = [
    { id:1, title:'Family Combo', img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80' },
    { id:2, title:'Fries + Coke', img:'https://images.unsplash.com/photo-1572449043412-6f9c1a7b3c8f?auto=format&fit=crop&w=800&q=80' },
    { id:3, title:'Kids Meal', img:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { id:4, title:'Desert Blast', img:'https://images.unsplash.com/photo-1551024736-1b2a8d6a5f8d?auto=format&fit=crop&w=800&q=80' }
  ];
}

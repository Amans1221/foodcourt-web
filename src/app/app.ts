import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header'; 
import { FooterComponent } from './footer/footer'; // Add this import
import { CartComponent } from './components/cart/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent ,CartComponent], // Add FooterComponent here
  templateUrl: './app.html'
})
export class AppComponent {
  title = 'maya-mateul';
}
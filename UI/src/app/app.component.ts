import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, FormsModule, HttpClientModule]
})

export class AppComponent {
  constructor(private http: HttpClient) { }

  productName: string = '';
  searchResults: string = '';

  searchProduct() {
    if (this.productName.trim()) {
      this.http.get(`http://localhost:3000/products?name=${encodeURIComponent(this.productName)}`)
        .subscribe({
          next: (response: any) => {
            this.searchResults = response.response;
          },
          error: (error: any) => {
            console.error('Error fetching products:', error);
          }
        });
    }
  }
}
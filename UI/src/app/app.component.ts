import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, FormsModule],
})

export class AppComponent {
  productName: string = '';
  searchResults: any = {};
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  searchProduct() {
    if (this.productName.trim()) {
      this.loading = true;
      this.error = '';
      this.searchResults = {};

      this.http.get(`http://34.235.139.92/products?name=${encodeURIComponent(this.productName)}`).subscribe({
        next: (response: any) => {
          try {
            this.searchResults = JSON.parse(response.response);
          } catch (error) {
            this.error = "Some error occurred. Please try again.";
            this.searchResults = {};
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          this.error = "Some error occurred. Please try again.";
        }
      });
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

}
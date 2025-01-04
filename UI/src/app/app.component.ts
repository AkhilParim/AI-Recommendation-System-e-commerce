import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, FormsModule, HttpClientModule]
})

export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }

  productName: string = '';
  searchResults: any = {};
  loading: boolean = false;

  ngOnInit(): void { 
    // let searchResults = `{"content":"Here are some pants options that match your question:","products":[{"name":"United Colors of Benetton Men Casual Pants","link":"https://www.amazon.in/United-Colors-Benetton-Boyfriend-4CTNS0011I_Blue_36/dp/B08MV7WHDP/ref=sr_1_12777?qid=1679151292&s=apparel&sr=1-12777","image":"https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/81lQx-m+kkL._AC_UL320_.jpg","rating":3.8},{"name":"Peter England Men's Slim Casual Pants","link":"https://www.amazon.in/Peter-England-Casual-PCTFCSSPE92016_Light-Khaki_34/dp/B099X1HGZP/ref=sr_1_15617?qid=1679151458&s=apparel&sr=1-15617","image":"https://m.media-amazon.com/images/I/51ZLqC1qgeL._AC_UL320_.jpg","rating":3.5},{"name":"The Pant Project Luxury PV Stretchable Casual Pants for Men","link":"https://www.amazon.in/Pant-Project-Stretchable-Trousers-Expandable/dp/B0B66WQQMN/ref=sr_1_9217?qid=1679151101&s=apparel&sr=1-9217","image":"https://m.media-amazon.com/images/I/61Qc9HBSo1L._AC_UL320_.jpg","rating":4}]}`
    // this.searchResults = JSON.parse(searchResults);
  }

  searchProduct() {
    if (this.loading) {
      return;
    }
    
    this.loading = true;
    this.searchResults = {};
    if (this.productName.trim()) {
      this.http.get(`http://localhost:3000/products?name=${encodeURIComponent(this.productName)}`)
        .subscribe({
          next: (response: any) => {
            this.searchResults = JSON.parse(response.response);
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error fetching products:', error);
            this.loading = false;
          }
        });
    }
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
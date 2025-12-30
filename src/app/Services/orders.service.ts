import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cake {
  cakeName: string;
  price: number;
}

export interface Order {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  cakes: Cake[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'https://localhost:7196/api/OrderList';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  calculateTotalAmount(cakes: Cake[]): number {
    return cakes.reduce((total, cake) => total + cake.price, 0);
  }
}

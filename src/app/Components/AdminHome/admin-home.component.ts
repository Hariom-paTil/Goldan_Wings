import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSessionService } from '../../Services/admin-session.service';
import { OrdersService, Order } from '../../Services/orders.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {
  currentSection: 'overview' | 'pop-orders' | 'add-cakes' = 'overview';
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private adminSession: AdminSessionService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    // Check if we need to navigate to a specific section based on URL
    const url = this.router.url;
    if (url.includes('pop-orders')) {
      this.currentSection = 'pop-orders';
      this.loadOrders();
    } else if (url.includes('add-cakes')) {
      this.currentSection = 'add-cakes';
    }
  }

  setSection(section: 'overview' | 'pop-orders' | 'add-cakes') {
    this.currentSection = section;
    if (section === 'pop-orders') {
      this.loadOrders();
    }
  }

  loadOrders() {
    this.loading = true;
    this.error = null;
    this.ordersService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateTotal(order: Order): number {
    return this.ordersService.calculateTotalAmount(order.cakes);
  }

  logout() {
    this.adminSession.clear();
    this.router.navigate(['/about/G_W_AdminPanel']);
  }
}


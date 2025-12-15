import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  firstName = '';
  lastName = '';
  address = '';
  email = '';

  placeOrder() {
    // Placeholder behavior: show a confirmation and reset the form
    alert(`Order placed for ${this.firstName} ${this.lastName}. We'll contact you at ${this.email}.`);
    this.firstName = this.lastName = this.address = this.email = '';
  }
}

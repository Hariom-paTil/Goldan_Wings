import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TopchoiceComponent } from '../Topchoice/topchoice.component';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TopchoiceComponent, HttpClientModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  isOrderActive = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Toggle state when route changes so About can hide/show sections when /about/order is active
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.isOrderActive = this.router.url.includes('/about/order');
    });
  }
}


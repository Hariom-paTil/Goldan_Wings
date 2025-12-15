import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TopchoiceComponent } from '../Topchoice/topchoice.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TopchoiceComponent, HttpClientModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {}


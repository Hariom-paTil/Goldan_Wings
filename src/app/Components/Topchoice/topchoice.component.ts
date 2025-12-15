import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CakeService } from '../../Services/cake.service';
import { Cake } from '../../Interfaces/cake.interface';

@Component({
  selector: 'app-top-choice',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './topchoice.component.html',
  styleUrls: ['./topchoice.component.scss'],
})
export class TopchoiceComponent implements OnInit {
  cakes: Cake[] = [];

  constructor(private cakeService: CakeService) {}

  ngOnInit(): void {
    this.cakeService.getCakes(10).subscribe((data) => (this.cakes = data));
  }
}

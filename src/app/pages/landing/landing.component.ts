import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsCarouselComponent } from '../../components/events-carousel/events-carousel.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [EventsCarouselComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToReserve(): void {
    this.router.navigate(['/reservar']);
  }
}

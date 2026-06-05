import { Component, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EVENTS_DATA, Event } from '../../models/data';

@Component({
  selector: 'app-events-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-carousel.component.html',
})
export class EventsCarouselComponent {
  @Input() showHeader = true;
  @Input() minimal = false;
  readonly events: Event[] = EVENTS_DATA;
  currentIndex = signal(0);

  currentEvent = computed(() => this.events[this.currentIndex()]);

  next(): void {
    this.currentIndex.update(i => (i + 1) % this.events.length);
  }

  prev(): void {
    this.currentIndex.update(i => (i - 1 + this.events.length) % this.events.length);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}

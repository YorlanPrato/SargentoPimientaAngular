import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsCarouselComponent } from '../../components/events-carousel/events-carousel.component';
import { SupabaseService } from '../../services/supabase.service';

interface SitioInfo {
  id?: string;
  section: string;
  title?: string;
  subtitle?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  instagram?: string;
  facebook?: string;
  atmosphere?: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, EventsCarouselComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  isLoading = signal(true);
  inicioInfo = signal<SitioInfo>({
    section: 'inicio',
    title: '',
    subtitle: '',
    atmosphere: '',
    address: '',
    hours: '',
    instagram: ''
  });

  async ngOnInit(): Promise<void> {
    await this.loadInformation();
  }

  async loadInformation(): Promise<void> {
    this.isLoading.set(true);

    const { data: inicioData, error: inicioError } = await this.supabase.getSitioInfo('inicio');
    if (inicioData && !inicioError) {
      this.inicioInfo.set(inicioData);
    }

    this.isLoading.set(false);
  }

  goToReserve(): void {
    this.router.navigate(['/reservar']);
  }

  formatPipeSeparated(value: string | undefined): string {
    if (!value) return '';
    return value.replace(/\|/g, '<br>');
  }
}

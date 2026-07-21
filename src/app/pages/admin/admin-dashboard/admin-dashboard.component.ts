import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { ThemeService } from '../../../services/theme.service';
import { Reserva, Menu, Evento } from '../../../models/supabase';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private themeService = inject(ThemeService);

  reservas = signal<Reserva[]>([]);
  menuItems = signal<Menu[]>([]);
  eventos = signal<Evento[]>([]);

  isLoading = signal(true);

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async ngOnInit(): Promise<void> {
    // Check authentication with Supabase
    const { data: { session } } = await this.supabase.getSession();
    if (!session) {
      this.router.navigate(['/admin']);
      return;
    }

    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      const [reservasData, menuData, eventosData] = await Promise.all([
        this.supabase.getReservas(),
        this.supabase.getMenu(),
        this.supabase.getAllEventos()
      ]);

      console.log('=== SUPABASE DATA ===');
      console.log('Reservas:', reservasData);
      console.log('Menu:', menuData);
      console.log('Eventos:', eventosData);
      console.log('Reservas error:', reservasData.error);
      console.log('Menu error:', menuData.error);
      console.log('Eventos error:', eventosData.error);

      if (reservasData.data) this.reservas.set(reservasData.data);
      if (menuData.data) this.menuItems.set(menuData.data);
      if (eventosData.data) this.eventos.set(eventosData.data);
      
      console.log('=== FINAL COUNTS ===');
      console.log('Reservas count:', this.reservas().length);
      console.log('Menu count:', this.menuItems().length);
      console.log('Eventos count:', this.eventos().length);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.supabase.signOut();
    this.router.navigate(['/']);
  }

  navigateTo(section: string): void {
    console.log('Navigating to:', `/admin/${section}`);
    this.router.navigate([`/admin/${section}`]).then(success => {
      console.log('Navigation success:', success);
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}

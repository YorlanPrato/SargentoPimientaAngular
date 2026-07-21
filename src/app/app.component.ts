import { Component, signal, computed, inject, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { ThemeService } from './services/theme.service';
import { filter } from 'rxjs/operators';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  router = inject(Router);
  private themeService = inject(ThemeService);

  mobileMenuOpen = signal(false);
  isScrolled = signal(false);
  currentUrl = signal(this.router.url);
  isAdminRoute = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/admin');
  });

  readonly navItems: NavItem[] = [
    { path: '/',        label: 'Inicio',   icon: 'home' },
    { path: '/carta',   label: 'Carta',    icon: 'utensils-crossed' },
    { path: '/reservar',label: 'Reservar', icon: 'calendar' },
    { path: '/contacto',label: 'Contacto', icon: 'mail' },
  ];

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.url);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  navigateTo(path: string): void {
    this.closeMobileMenu();
    this.router.navigate([path]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }
}

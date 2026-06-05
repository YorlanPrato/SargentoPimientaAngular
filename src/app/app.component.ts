import { Component, signal, computed, inject, HostListener } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';

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

  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  readonly navItems: NavItem[] = [
    { path: '/',        label: 'Inicio',   icon: 'home' },
    { path: '/carta',   label: 'Carta',    icon: 'utensils-crossed' },
    { path: '/reservar',label: 'Reservar', icon: 'calendar' },
    { path: '/contacto',label: 'Contacto', icon: 'mail' },
  ];

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

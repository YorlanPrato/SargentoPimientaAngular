import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSignal = signal<boolean>(true);

  constructor() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDarkModeSignal.set(false);
      document.documentElement.classList.add('light');
    }
  }

  get isDarkMode() {
    return this.isDarkModeSignal.asReadonly();
  }

  toggleTheme(): void {
    const newMode = !this.isDarkModeSignal();
    this.isDarkModeSignal.set(newMode);

    if (newMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }
}

import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private router = inject(Router);
  private toast = inject(ToastService);

  password = signal('');
  isLoading = signal(false);

  async login(): Promise<void> {
    if (!this.password()) {
      this.toast.error('Error', 'Por favor ingrese la contraseña');
      return;
    }

    this.isLoading.set(true);

    // Simple password check (in production, use proper authentication)
    const ADMIN_PASSWORD = 'admin123'; // This should be in environment variables

    if (this.password() === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      this.toast.success('Bienvenido', 'Acceso al panel de administrador');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.toast.error('Error', 'Contraseña incorrecta');
    }

    this.isLoading.set(false);
  }
}

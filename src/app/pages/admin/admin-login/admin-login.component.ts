import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { PasswordResetModalComponent } from '../../../components/password-reset-modal/password-reset-modal.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, PasswordResetModalComponent],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent implements OnInit {
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  showResetModal = signal(false);

  async ngOnInit(): Promise<void> {
    if (this.authService.isAuthenticatedSignal()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async login(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.toast.error('Error', 'Por favor ingrese email y contraseña');
      return;
    }

    this.isLoading.set(true);

    const result = await this.authService.loginWithEmail(this.email(), this.password());

    if (result.success) {
      this.toast.success('Bienvenido', 'Acceso al panel de administrador');
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.toast.error('Error', result.error || 'Error al iniciar sesión');
    }

    this.isLoading.set(false);
  }

  openResetModal(): void {
    this.showResetModal.set(true);
  }

  closeResetModal(): void {
    this.showResetModal.set(false);
  }
}

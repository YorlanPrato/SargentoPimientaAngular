import { Component, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-password-reset-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-reset-modal.component.html',
})
export class PasswordResetModalComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isOpen = input.required<boolean>();
  close = output<void>();

  email = signal('');
  isLoading = signal(false);

  async resetPassword(): Promise<void> {
    if (!this.email()) {
      this.toast.error('Error', 'Por favor ingrese su email');
      return;
    }

    this.isLoading.set(true);

    const result = await this.authService.resetPassword(this.email());

    if (result.success) {
      this.close.emit();
      this.toast.success('Éxito', 'Correo de recuperación enviado');
    } else {
      this.toast.error('Error', result.error || 'Error al enviar correo');
    }

    this.isLoading.set(false);
  }
}

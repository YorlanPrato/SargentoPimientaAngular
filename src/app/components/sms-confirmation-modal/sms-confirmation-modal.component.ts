import { Component, signal, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../models/supabase';

@Component({
  selector: 'app-sms-confirmation-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sms-confirmation-modal.component.html',
})
export class SmsConfirmationModalComponent {
  isOpen = input.required<boolean>();
  pendingReserva = input.required<Reserva | null>();
  close = output<void>();
  requestCode = output<string>();
  confirm = output<string>();

  // Estado del modal: 'summary' (resumen + correo) o 'code' (ingresar código)
  currentStep = signal<'summary' | 'code'>('summary');

  email = signal('');
  verificationCode = signal('');
  isLoading = signal(false);

  onRequestCode(): void {
    if (!this.email()) {
      return;
    }
    this.isLoading.set(true);
    // Simular envío de código (reemplazar con Supabase OTP)
    setTimeout(() => {
      this.isLoading.set(false);
      this.requestCode.emit(this.email());
      this.currentStep.set('code');
    }, 500);
  }

  onConfirm(): void {
    if (!this.verificationCode()) {
      return;
    }
    this.isLoading.set(true);
    // Simular proceso de validación (reemplazar con Supabase OTP)
    setTimeout(() => {
      this.isLoading.set(false);
      this.confirm.emit(this.verificationCode());
    }, 500);
  }

  onCancel(): void {
    this.close.emit();
    // Resetear estado al cerrar
    this.currentStep.set('summary');
    this.email.set('');
    this.verificationCode.set('');
  }
}

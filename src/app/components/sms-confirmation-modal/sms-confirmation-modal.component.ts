import { Component, signal, input, output, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../models/supabase';

@Component({
  selector: 'app-sms-confirmation-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sms-confirmation-modal.component.html',
})
export class SmsConfirmationModalComponent implements AfterViewInit {
  isOpen = input.required<boolean>();
  pendingReserva = input.required<Reserva | null>();
  recaptchaSiteKey = input.required<string>();
  close = output<void>();
  requestCode = output<string>();
  confirm = output<string>();

  // Estado del modal: 'summary' (resumen + correo) o 'code' (ingresar código)
  currentStep = signal<'summary' | 'code'>('summary');

  email = signal('');
  verificationCode = signal('');
  isLoading = signal(false);

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  ngAfterViewInit(): void {
    // Cargar script de reCAPTCHA
    this.loadRecaptchaScript();
  }

  private loadRecaptchaScript(): void {
    if (typeof window !== 'undefined' && !(window as any).grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey()}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  onRequestCode(): void {
    if (!this.email() || !this.isValidEmail(this.email())) {
      return;
    }
    this.isLoading.set(true);
    // Simular envío de código (reemplazar con Supabase OTP)
    setTimeout(() => {
      this.isLoading.set(false);
      this.requestCode.emit(this.email());
      this.currentStep.set('code');
      // Renderizar captcha en el paso 2
      this.renderRecaptcha();
    }, 500);
  }

  private renderRecaptcha(): void {
    setTimeout(() => {
      const container = document.getElementById('recaptcha-modal-container');
      if (container && (window as any).grecaptcha) {
        container.innerHTML = '';
        (window as any).grecaptcha.render(container, {
          sitekey: this.recaptchaSiteKey(),
          theme: 'light'
        });
      }
    }, 100);
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

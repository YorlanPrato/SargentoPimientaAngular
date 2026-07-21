import { Component, signal, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sms-confirmation-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sms-confirmation-modal.component.html',
})
export class SmsConfirmationModalComponent {
  isOpen = input.required<boolean>();
  phoneNumber = input.required<string>();
  close = output<void>();
  confirm = output<string>();

  verificationCode = signal('123456'); // Código fijo para pruebas
  isLoading = signal(false);

  onConfirm(): void {
    if (!this.verificationCode()) {
      return;
    }
    this.isLoading.set(true);
    // Simular proceso de validación
    setTimeout(() => {
      this.isLoading.set(false);
      this.confirm.emit(this.verificationCode());
    }, 500);
  }

  onCancel(): void {
    this.close.emit();
  }
}
